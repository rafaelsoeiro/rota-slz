"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Icon } from "@/components/icons";
import type { Place } from "@/app/mock-data";

type TouristMapProps = {
  places: Place[];
  activePlaceId?: string;
  routePlaceIds?: string[];
  onSelect: (place: Place) => void;
};

function MapViewport({ places }: Pick<TouristMapProps, "places">) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(places.map((place) => [place.coordinates.latitude, place.coordinates.longitude] as [number, number]));
    map.fitBounds(bounds.pad(0.22), { animate: false, maxZoom: 16 });
  }, [map, places]);

  return null;
}

function markerIcon(label: number, isInRoute: boolean, isActive: boolean) {
  const state = isActive ? "is-active" : isInRoute ? "is-in-route" : "";
  return L.divIcon({
    className: "tourist-map__marker-shell",
    html: `<span class="tourist-map__marker ${state}"><i>${label}</i></span>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

export default function TouristMap({ places, activePlaceId, routePlaceIds = [], onSelect }: TouristMapProps) {
  const center: [number, number] = [-2.5294, -44.3055];

  return (
    <section className="tourist-map" aria-labelledby="tourist-map-title">
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
        <MapViewport places={places} />
        {places.map((place, index) => {
          const routeIndex = routePlaceIds.indexOf(place.id);
          const isInRoute = routeIndex >= 0;
          const label = isInRoute ? routeIndex + 1 : index + 1;
          return (
            <Marker
              key={place.id}
              position={[place.coordinates.latitude, place.coordinates.longitude]}
              icon={markerIcon(label, isInRoute, activePlaceId === place.id)}
              eventHandlers={{ click: () => onSelect(place) }}
            >
              <Popup>
                <div className="tourist-map__popup">
                  <b>{place.name}</b>
                  <span>{place.category} · {place.duration}</span>
                  <button onClick={() => onSelect(place)}>Ver detalhes</button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
}
