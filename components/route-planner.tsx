"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties, type FormEvent } from "react";

import { places as demoPlaces, type Place } from "@/app/mock-data";
import { Icon } from "@/components/icons";
import brandLogo from "../assets/logo/logo.png";
import tiles from "../assets/bg_form_yellow.png";

export type PlannedRoute = {
  id: string;
  name: string;
  originId: number | null;
  destinationId: number | null;
  stopIds: number[];
};

export type RoutePlannerState = {
  routes: PlannedRoute[];
  activeRouteId: string | null;
  draft: PlannedRoute | null;
};

export type RouteSummary = {
  places: Place[];
  visitMinutes: number;
  walkingMinutes: number;
  totalMinutes: number;
  distanceKm: number;
};

export type RoutePlannerProps = {
  places?: Place[];
  value?: RoutePlannerState;
  defaultValue?: RoutePlannerState;
  onChange?: (state: RoutePlannerState) => void;
  onSave?: (route: PlannedRoute, summary: RouteSummary) => void;
  onSelectRoute?: (route: PlannedRoute) => void;
  onOpenPlace?: (place: Place) => void;
  onOpenMap?: (route: PlannedRoute, summary: RouteSummary) => void;
  onBack?: () => void;
  className?: string;
};

function initialState(places: Place[]): RoutePlannerState {
  const makeRoute = (index: number): PlannedRoute => {
    const ordered = index === 1 ? places.slice(0, 5) : places.slice(-5).reverse();
    return {
      id: `route-${index}`,
      name: `Rota ${index}`,
      originId: ordered[0]?.id ?? null,
      destinationId: ordered.at(-1)?.id ?? null,
      stopIds: ordered.slice(1, -1).map((place) => place.id),
    };
  };
  return { routes: [makeRoute(1), makeRoute(2)], activeRouteId: "route-1", draft: null };
}

export function summarizeRoute(route: PlannedRoute, places: Place[]): RouteSummary {
  const ids = [route.originId, ...route.stopIds, route.destinationId];
  const ordered = [...new Set(ids)].flatMap((id) => {
    const place = places.find((item) => item.id === id);
    return place ? [place] : [];
  });
  const radians = (degrees: number) => degrees * Math.PI / 180;
  let distanceKm = 0;
  for (let index = 1; index < ordered.length; index++) {
    const first = ordered[index - 1].coordinates;
    const second = ordered[index].coordinates;
    const haversine = Math.sin(radians(second.latitude - first.latitude) / 2) ** 2
      + Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude))
      * Math.sin(radians(second.longitude - first.longitude) / 2) ** 2;
    distanceKm += 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, haversine))));
  }
  const walkingMinutes = Math.ceil(distanceKm / 4 * 60);
  const visitMinutes = ordered.reduce((total, place) => total + place.durationMinutes, 0);
  return { places: ordered, distanceKm, walkingMinutes, visitMinutes, totalMinutes: walkingMinutes + visitMinutes };
}

function idsFromRoute(route: PlannedRoute) {
  return [route.originId, ...route.stopIds, route.destinationId].filter((id): id is number => id !== null);
}

function routeFromIds(route: PlannedRoute, ids: number[]): PlannedRoute {
  return {
    ...route,
    originId: ids[0] ?? null,
    destinationId: ids.length > 1 ? ids.at(-1)! : null,
    stopIds: ids.length > 2 ? ids.slice(1, -1) : [],
  };
}

export function RoutePlanner({
  places = demoPlaces, value, defaultValue, onChange, onSave, onSelectRoute,
  onOpenPlace, onOpenMap, onBack, className = "",
}: RoutePlannerProps) {
  const uid = useId();
  const [localState, setLocalState] = useState<RoutePlannerState>(() => defaultValue ?? initialState(places));
  const [message, setMessage] = useState("");
  const state = value ?? localState;
  const active = state.routes.find((route) => route.id === state.activeRouteId) ?? state.routes[0] ?? null;
  const route = state.draft ?? active;
  const editing = state.draft !== null;
  const selectedIds = state.draft ? idsFromRoute(state.draft) : [];
  const summary = route ? summarizeRoute(route, places) : null;

  function update(next: RoutePlannerState) {
    if (value === undefined) setLocalState(next);
    onChange?.(next);
  }

  function selectRoute(next: PlannedRoute) {
    update({ ...state, activeRouteId: next.id, draft: null });
    setMessage("");
    onSelectRoute?.(next);
  }

  function startDraft(existing?: PlannedRoute) {
    let index = state.routes.length + 1;
    while (state.routes.some((item) => item.id === `route-${index}`)) index++;
    const draft = existing ? { ...existing, stopIds: [...existing.stopIds] } : {
      id: `route-${index}`, name: `Rota ${index}`, originId: null, destinationId: null, stopIds: [],
    };
    update({ ...state, draft });
    setMessage("");
  }

  function togglePlace(id: number) {
    if (!state.draft) return;
    const nextIds = selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id];
    update({ ...state, draft: routeFromIds(state.draft, nextIds) });
    setMessage("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.draft || selectedIds.length < 2 || !state.draft.name.trim()) {
      setMessage("Escolha pelo menos dois locais para formar a rota.");
      return;
    }
    const saved = { ...state.draft, name: state.draft.name.trim() };
    const exists = state.routes.some((item) => item.id === saved.id);
    const routes = exists ? state.routes.map((item) => item.id === saved.id ? saved : item) : [...state.routes, saved];
    update({ routes, activeRouteId: saved.id, draft: null });
    setMessage(`${saved.name} salva nesta sessão!`);
    onSave?.(saved, summarizeRoute(saved, places));
  }

  return <section className={`route-planner route-planner--wireframe ${className}`} aria-labelledby={`${uid}-title`}
    style={{ "--rp-tiles": `url("${tiles.src}")` } as CSSProperties}>
    <style>{styles}</style>
    <header className="rp-wire-header">
      <button type="button" className="rp-wire-back" onClick={onBack} aria-label="Voltar"><Icon name="arrow" /></button>
      <h1 id={`${uid}-title`}>{editing ? "Crie sua rota" : route?.name ?? "Planeje sua rota"}</h1>
    </header>

    <nav className="rp-route-tabs" aria-label="Rotas salvas">
      {state.routes.map((item) => <button type="button" key={item.id} disabled={editing}
        className={!editing && active?.id === item.id ? "is-active" : ""} onClick={() => selectRoute(item)}>{item.name}</button>)}
      <button type="button" className="rp-route-new" disabled={editing || places.length < 2} onClick={() => startDraft()}><Icon name="plus" /> Nova rota</button>
    </nav>

    {editing && state.draft ? <form className="rp-wire-editor" onSubmit={save}>
      <label className="rp-route-name" htmlFor={`${uid}-name`}><span>Nome da rota</span><input id={`${uid}-name`} value={state.draft.name} maxLength={40} required onChange={(event) => update({ ...state, draft: { ...state.draft!, name: event.target.value } })} /></label>
      <p className="rp-wire-help">Selecione os locais na ordem da visita. O primeiro será a origem e o último, o destino.</p>
      <div className="rp-wire-list rp-wire-list--editing">
        {places.map((place) => <WirePlaceRow key={place.id} place={place} selected={selectedIds.includes(place.id)} order={selectedIds.indexOf(place.id) + 1} onClick={() => togglePlace(place.id)} />)}
      </div>
      <div className="rp-wire-actions"><button type="submit" disabled={selectedIds.length < 2}>Salvar rota</button><button type="button" onClick={() => update({ ...state, draft: null })}>Cancelar</button></div>
    </form> : route && summary ? <>
      <div className="rp-wire-list">
        {summary.places.map((place, index) => <WirePlaceRow key={place.id} place={place} order={index + 1} onClick={() => onOpenPlace?.(place)} />)}
      </div>
      <div className="rp-wire-actions rp-wire-actions--saved">
        <button type="button" onClick={() => startDraft(route)}><Icon name="plus" /> Editar rota</button>
        <button type="button" disabled={summary.places.length < 2} onClick={() => onOpenMap?.(route, summary)}><Icon name="map" /> Ver no mapa</button>
      </div>
    </> : <p className="rp-wire-empty">Nenhuma rota criada. Toque em “Nova rota” para começar.</p>}

    <p className="rp-wire-feedback" role="status" aria-live="polite">{message}</p>
    <Image className="rp-wire-logo" src={brandLogo} alt="Rota São Luís" />
  </section>;
}

function WirePlaceRow({ place, order, selected = false, onClick }: { place: Place; order: number; selected?: boolean; onClick?: () => void }) {
  return <button type="button" className={`rp-wire-place ${selected ? "is-selected" : ""}`} onClick={onClick} aria-pressed={selected || undefined}>
    <span className="rp-wire-photo"><Image src={place.image} alt="" width={72} height={64} />{selected && <b>{order}</b>}</span>
    <span className="rp-wire-copy"><b>{place.name}</b><small>{place.category}</small><i><span /> <span /></i></span>
    <Icon name={selected ? "x" : "chevron"} />
  </button>;
}

const styles = `
.route-planner--wireframe{--rp-gold:var(--gold,#f4b900);--rp-gold-deep:#d9a500;--rp-blue:var(--blue-deep,#1d5ca7);position:relative;isolation:isolate;display:flex;min-height:calc(100svh - 145px);flex-direction:column;width:100%;padding:4px 3px 18px;color:#9f7600;font-family:Georgia,"Times New Roman",serif}
.route-planner--wireframe::before{position:absolute;z-index:-1;inset:-40px -22px -30px;background-image:var(--rp-tiles);background-size:228px auto;content:"";opacity:.08;pointer-events:none}
.route-planner--wireframe *{box-sizing:border-box}.route-planner--wireframe button,.route-planner--wireframe input{font:inherit}.route-planner--wireframe button{cursor:pointer}.route-planner--wireframe button:disabled{cursor:default;opacity:.48}.route-planner--wireframe button:focus-visible,.route-planner--wireframe input:focus-visible{outline:3px solid var(--rp-blue);outline-offset:3px}
.rp-wire-header{display:grid;grid-template-columns:48px minmax(0,1fr);align-items:center;gap:10px;margin-bottom:14px}.rp-wire-back{display:grid;width:46px;height:46px;place-items:center;padding:0;border:0;border-radius:50%;background:var(--rp-gold);color:var(--rp-blue);box-shadow:0 2px 0 rgba(172,123,0,.18)}.rp-wire-back svg{width:27px}.rp-wire-header h1{display:grid;min-height:43px;place-items:center;margin:0;padding:7px 16px;border-radius:22px 22px 12px 12px;background:var(--rp-gold);color:white;font-size:18px;line-height:1;text-align:center;text-transform:uppercase;box-shadow:0 2px 0 rgba(172,123,0,.18)}
.rp-route-tabs{display:flex;gap:7px;margin:0 0 15px;padding:0 2px;overflow-x:auto;scrollbar-width:none}.rp-route-tabs::-webkit-scrollbar{display:none}.rp-route-tabs button{display:flex;min-height:34px;flex:0 0 auto;align-items:center;gap:4px;padding:6px 12px;border:2px solid var(--rp-gold);border-radius:18px;background:#fff8d7;color:#b17e00;font-size:11px;font-weight:700}.rp-route-tabs button.is-active{background:var(--rp-gold);color:white}.rp-route-tabs svg{width:15px}
.rp-wire-list{display:grid;gap:10px}.rp-wire-place{display:grid;grid-template-columns:78px minmax(0,1fr) 17px;align-items:center;gap:8px;width:100%;min-height:68px;padding:0 10px 0 0;border:0;background:transparent;color:#a87800;text-align:left}.rp-wire-photo{position:relative;display:grid;width:78px;height:68px;place-items:center;border-radius:10px;background:var(--rp-gold);overflow:hidden}.rp-wire-photo img{width:58px;height:52px;border:2px solid rgba(255,255,255,.82);border-radius:3px;object-fit:cover}.rp-wire-photo b{position:absolute;right:5px;bottom:5px;display:grid;width:20px;height:20px;place-items:center;border-radius:50%;background:var(--rp-blue);color:white;font:700 10px Arial,sans-serif}.rp-wire-copy{display:grid;min-width:0;min-height:68px;align-content:center;gap:4px;padding:9px 12px;border:4px solid var(--rp-gold);border-radius:10px;background:#fff3b7}.rp-wire-copy>b{overflow:hidden;font-size:13px;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}.rp-wire-copy small{overflow:hidden;color:#b59742;font:9px Arial,sans-serif;text-overflow:ellipsis;white-space:nowrap}.rp-wire-copy i{display:grid;grid-template-columns:2fr 1.2fr;gap:5px;margin-top:2px}.rp-wire-copy i span{height:4px;border-radius:4px;background:#e1b000}.rp-wire-place>svg{width:17px}.rp-wire-place.is-selected .rp-wire-copy{background:#ffe784}.rp-wire-place:hover .rp-wire-copy{background:#ffed9b}
.rp-route-name{display:grid;gap:5px;margin-bottom:10px;color:#a87800;font-size:11px;font-weight:700}.rp-route-name input{width:100%;height:39px;padding:0 12px;border:3px solid var(--rp-gold);border-radius:10px;background:#fff8d7;color:#8d6a0b;outline:0}.rp-wire-help{margin:0 2px 12px;color:#8c846b;font:11px/1.4 Arial,sans-serif}.rp-wire-list--editing{max-height:calc(100svh - 365px);overflow-y:auto;padding:2px 2px 5px}.rp-wire-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:13px}.rp-wire-actions button{display:flex;min-height:40px;align-items:center;justify-content:center;gap:5px;padding:8px;border:0;border-radius:20px;background:var(--rp-gold);color:white;font-size:11px;font-weight:700;text-transform:uppercase}.rp-wire-actions button+button{background:var(--rp-blue)}.rp-wire-actions svg{width:16px}.rp-wire-actions--saved{margin-top:16px}.rp-wire-feedback{min-height:16px;margin:10px 0 0;color:#4d8b43;font:11px Arial,sans-serif;text-align:center}.rp-wire-empty{margin:30px 5px;padding:20px;border:3px solid var(--rp-gold);border-radius:12px;background:#fff3b7;font-size:12px;text-align:center}.rp-wire-logo{width:108px;height:auto;margin:auto auto 0;object-fit:contain}
@media(max-width:350px){.route-planner--wireframe{padding-right:0;padding-left:0}.rp-wire-place{grid-template-columns:66px minmax(0,1fr) 14px}.rp-wire-photo{width:66px}.rp-wire-photo img{width:51px}.rp-wire-copy{padding-right:8px;padding-left:8px}.rp-wire-header h1{font-size:15px}}
`;

export default RoutePlanner;
