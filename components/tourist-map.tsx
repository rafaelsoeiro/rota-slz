"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { Icon } from "@/components/icons";
import type { Place } from "@/app/mock-data";

type TouristMapProps = {
  places: Place[];
  selectedPlaceId?: number;
  fullScreen?: boolean;
  onSelect: (place: Place) => void;
  onOpenDetails?: (place: Place) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  userLocationAccuracy?: number | null;
  onRequestLocation?: () => void;
  connectPlaces?: boolean;
};

type RouteStatus = "ready" | "error";
type RouteResult = { key: string; status: RouteStatus; positions: [number, number][] };
type OsrmRouteResponse = {
  code: string;
  routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
};

const FOOT_ROUTING_ENDPOINT = process.env.NEXT_PUBLIC_FOOT_ROUTING_ENDPOINT
  ?? "https://routing.openstreetmap.de/routed-foot/route/v1/driving";

function MapViewport({ places, userLocation }: Pick<TouristMapProps, "places" | "userLocation">) {
  const map = useMap();
  const centeredOnUser = useRef(false);
  const previousPlaces = useRef("");

  useEffect(() => {
    const placesKey = places.map((place) => place.id).join(",");

    if (userLocation && !centeredOnUser.current) {
      map.setView([userLocation.latitude, userLocation.longitude], 16, { animate: false });
      centeredOnUser.current = true;
      previousPlaces.current = placesKey;
      return;
    }

    if (placesKey === previousPlaces.current) return;
    previousPlaces.current = placesKey;
    const points: [number, number][] = places.map((place) => [place.coordinates.latitude, place.coordinates.longitude]);
    if (userLocation) points.push([userLocation.latitude, userLocation.longitude]);
    if (points.length === 1) map.setView(points[0], 16, { animate: false });
    if (points.length > 1) map.fitBounds(L.latLngBounds(points).pad(0.22), { animate: false, maxZoom: 16 });
  }, [map, places, userLocation]);

  return null;
}

function MapInstance({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => onReady(map), [map, onReady]);
  return null;
}

function RouteViewport({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 1) map.fitBounds(L.latLngBounds(positions).pad(0.16), { animate: false, maxZoom: 17 });
  }, [map, positions]);

  return null;
}

function UserLocationLayer({
  location, accuracy, onAwayChange,
}: {
  location: NonNullable<TouristMapProps["userLocation"]>;
  accuracy?: number | null;
  onAwayChange: (away: boolean) => void;
}) {
  const reportDistance = useCallback((map: L.Map) => {
    const distance = map.distance(map.getCenter(), [location.latitude, location.longitude]);
    onAwayChange(distance > Math.max(300, (accuracy ?? 0) * 2));
  }, [accuracy, location.latitude, location.longitude, onAwayChange]);
  const map = useMapEvents({ moveend: () => reportDistance(map) });

  useEffect(() => reportDistance(map), [map, reportDistance]);

  return <>
    {accuracy && accuracy > 0 ? <Circle center={[location.latitude, location.longitude]} radius={accuracy} pathOptions={{ color: "#347bd2", fillColor: "#347bd2", fillOpacity: 0.1, weight: 1 }} /> : null}
    <CircleMarker center={[location.latitude, location.longitude]} radius={8} pathOptions={{ color: "#fff", fillColor: "#347bd2", fillOpacity: 1, weight: 3 }}>
      <Popup><b>Você está aqui</b>{accuracy ? <span className="tourist-map__accuracy">Precisão aproximada: {Math.round(accuracy)} m</span> : null}</Popup>
    </CircleMarker>
  </>;
}

function markerIcon(label: number, isSelected: boolean, isInRoute: boolean) {
  const state = [isSelected ? "is-active" : "", isInRoute ? "is-in-route" : ""].filter(Boolean).join(" ");
  return L.divIcon({
    className: "tourist-map__marker-shell",
    html: `<span class="tourist-map__marker ${state}"><i>${label}</i></span>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

export default function TouristMap({
  places, selectedPlaceId, fullScreen = false, onSelect, onOpenDetails,
  userLocation, userLocationAccuracy, onRequestLocation, connectPlaces = false,
}: TouristMapProps) {
  const center: [number, number] = [-2.5294, -44.3055];
  const waypointPositions: [number, number][] = places.map((place) => [place.coordinates.latitude, place.coordinates.longitude]);
  const routeKey = connectPlaces ? places.map((place) => `${place.coordinates.longitude},${place.coordinates.latitude}`).join(";") : "";
  const [map, setMap] = useState<L.Map | null>(null);
  const [isAwayFromUser, setIsAwayFromUser] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const routeStatus = !connectPlaces || waypointPositions.length < 2 ? "idle"
    : routeResult?.key === routeKey ? routeResult.status : "loading";
  const routePositions = routeResult?.key === routeKey && routeResult.status === "ready" ? routeResult.positions : [];

  useEffect(() => {
    if (!connectPlaces || !routeKey.includes(";")) return;

    const controller = new AbortController();
    const requestRoute = async () => {
      try {
        const response = await fetch(`${FOOT_ROUTING_ENDPOINT}/${routeKey}?overview=full&geometries=geojson&steps=false`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Routing request failed with ${response.status}`);
        const result = await response.json() as OsrmRouteResponse;
        const geometry = result.routes?.[0]?.geometry?.coordinates;
        if (result.code !== "Ok" || !geometry?.length) throw new Error("Routing service returned no geometry");
        setRouteResult({ key: routeKey, status: "ready", positions: geometry.map(([longitude, latitude]) => [latitude, longitude]) });
      } catch (error) {
        if ((error as Error).name !== "AbortError") setRouteResult({ key: routeKey, status: "error", positions: [] });
      }
    };

    void requestRoute();
    return () => controller.abort();
  }, [connectPlaces, routeKey]);

  const handleLocationControl = () => {
    if (!userLocation) {
      onRequestLocation?.();
      return;
    }
    map?.flyTo([userLocation.latitude, userLocation.longitude], Math.max(map.getZoom(), 16), { duration: 0.55 });
  };

  return (
    <section className={`tourist-map ${fullScreen ? "tourist-map--full-screen" : ""}`} aria-labelledby="tourist-map-title">
      <div className="tourist-map__heading">
        <span className="tourist-map__eyebrow"><Icon name="map" /> Mapa dos pontos</span>
        <b id="tourist-map-title">{places.length} lugares para descobrir</b>
      </div>
      <MapContainer className="tourist-map__canvas" center={center} zoom={15} scrollWheelZoom={false} zoomControl={false} aria-label="Mapa interativo dos pontos turísticos catalogados">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <MapInstance onReady={setMap} />
        <MapViewport places={places} userLocation={userLocation} />
        {routeStatus === "ready" ? <RouteViewport positions={routePositions} /> : null}
        {userLocation ? <UserLocationLayer location={userLocation} accuracy={userLocationAccuracy} onAwayChange={setIsAwayFromUser} /> : null}
        {routeStatus === "ready" && routePositions.length > 1 ? <>
          <Polyline positions={routePositions} interactive={false} pathOptions={{ color: "#fffaf0", opacity: 0.95, weight: 10, lineCap: "round", lineJoin: "round" }} />
          <Polyline positions={routePositions} interactive={false} pathOptions={{ color: "#1d5ca7", opacity: 0.96, weight: 5, lineCap: "round", lineJoin: "round" }} />
        </> : null}
        {places.map((place, index) => {
          const label = index + 1;
          return (
            <Marker
              key={place.id}
              position={[place.coordinates.latitude, place.coordinates.longitude]}
              icon={markerIcon(label, selectedPlaceId === place.id, connectPlaces)}
              eventHandlers={{ click: () => onSelect(place) }}
            >
              <Popup>
                <div className="tourist-map__popup">
                  <b>{place.name}</b>
                  <span>{place.category} · {place.duration}</span>
                  <button type="button" onClick={() => onOpenDetails?.(place)}>Ver detalhes</button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {connectPlaces && routeStatus === "loading" ? <div className="tourist-map__route-status" role="status"><span /> Calculando trajeto a pé pelas ruas…</div> : null}
      {connectPlaces && routeStatus === "error" ? <div className="tourist-map__route-status tourist-map__route-status--error" role="alert">Não foi possível calcular o percurso pelas ruas agora.</div> : null}
      {fullScreen && onRequestLocation && <button type="button" className={`tourist-map__location-button ${isAwayFromUser ? "is-away" : ""}`} onClick={handleLocationControl} aria-label={userLocation ? "Recentralizar na minha localização" : "Ativar minha localização"} title={userLocation ? "Minha localização" : "Ativar localização"}><Icon name="locate" /></button>}
    </section>
  );
}
