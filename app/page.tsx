"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Icon } from "@/components/icons";
import { getMapPoint } from "@/components/map-geometry";
import { mockUsers, monthlyHighlights, places, type MockUser, type Place } from "./mock-data";
import portalLogin from "../assets/portal_login_scream.png";
import homeNavigationIcon from "../assets/icon_navbar_home.png";

type Screen = "splash" | "login" | "signup" | "home" | "search" | "highlights" | "planner" | "route" | "profile" | "detail";
type DetailOrigin = "search" | "highlights" | "planner" | "route";
type Coordinates = { latitude: number; longitude: number };

const TouristMap = dynamic(() => import("@/components/tourist-map"), {
  ssr: false,
  loading: () => <section className="tourist-map tourist-map--loading" aria-label="Carregando mapa dos pontos"><div className="tourist-map__heading"><span className="tourist-map__eyebrow"><Icon name="map" /> Mapa dos pontos</span></div><div className="tourist-map__loading">Carregando mapa…</div></section>,
});

function Wordmark({ small = false }: { small?: boolean }) {
  return <div className={`wordmark ${small ? "wordmark--small" : ""}`}><span>rota</span><strong>São Luís</strong></div>;
}

function BottomNav({ onNavigate, active }: { active: Screen; onNavigate: (screen: Screen) => void }) {
  return <nav className="bottom-nav" aria-label="Navegação principal">
    <button onClick={() => onNavigate("search")} aria-label="Explorar destinos"><Icon name="search" /></button>
    <button onClick={() => onNavigate("planner")} aria-label="Planejar rota"><Icon name="route" /></button>
    <button className="home-button" onClick={() => onNavigate("home")} aria-label="Tela inicial"><span><Image src={homeNavigationIcon} alt="" /></span></button>
    <button className={active === "route" ? "is-active" : ""} onClick={() => onNavigate("route")} aria-label="Minhas rotas"><Icon name="map" /></button>
    <button className={active === "profile" ? "is-active" : ""} onClick={() => onNavigate("profile")} aria-label="Meu perfil"><Icon name="user" /></button>
  </nav>;
}

function AppHeader({ title, onBack, color = "yellow" }: { title: string; onBack?: () => void; color?: "yellow" | "blue" | "green" }) {
  return <header className="app-header">
    <button className={`header-circle header-circle--${color}`} onClick={onBack} aria-label="Voltar">{onBack ? <Icon name="arrow" /> : <span />}</button>
    <h1 className={`header-pill header-pill--${color}`}>{title}</h1>
  </header>;
}

function PlaceList({ items, color, onSelect, selected, onToggle }: { items: Place[]; color: "yellow" | "blue" | "green"; onSelect: (place: Place) => void; selected?: string[]; onToggle?: (id: string) => void }) {
  return <div className={`place-list place-list--${color}`}>
    {items.map((place, index) => <article className="tourist-item" key={place.id}>
      {onToggle && <button className={`stop-toggle ${selected?.includes(place.id) ? "is-selected" : ""}`} onClick={() => onToggle(place.id)} aria-label={`Selecionar ${place.name}`}>{selected?.includes(place.id) ? "✓" : index + 1}</button>}
      <button className="tourist-item__main" onClick={() => onSelect(place)}>
        <Image src={place.image} alt="" />
        <span><b>{place.name}</b><small>{place.category} · {place.duration}</small></span>
        <Icon name="chevron" />
      </button>
    </article>)}
  </div>;
}

function FeedbackToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  if (!message) return null;
  return <div className="app-toast" role="status">{message}<button onClick={onDismiss} aria-label="Fechar mensagem"><Icon name="x" /></button></div>;
}

function formatRouteDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} min`;
  return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
}

function distanceInKilometers(from: Coordinates, to: Coordinates) {
  const toRadians = (value: number) => value * (Math.PI / 180);
  const earthRadius = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MonthlyHighlights({ onBack, onNavigate, onSelect }: { onBack: () => void; onNavigate: (screen: Screen) => void; onSelect: (place: Place) => void }) {
  const featuredPlaces = [places[1], places[3], places[5]];

  return <main className="mobile-stage app-screen highlights-screen">
    <AppHeader title="Destaques do mês" onBack={onBack} />
    <section className="highlights-list" aria-label="Experiências em destaque">
      {monthlyHighlights.map((highlight, index) => {
        const place = featuredPlaces[index];
        return <button className="monthly-highlight" key={highlight.label} onClick={() => onSelect(place)}>
          <span className="monthly-highlight__cap"><Icon name="trophy" /></span>
          <span className="monthly-highlight__content">
            <small>Experiência selecionada</small>
            <b>{highlight.label}</b>
            <em>{highlight.detail}</em>
            <span className="monthly-highlight__action">Conhecer <Icon name="chevron" /></span>
          </span>
        </button>;
      })}
    </section>
    <p className="highlights-note">Descubra caminhos especiais para viver São Luís neste mês.</p>
    <BottomNav active="home" onNavigate={onNavigate} />
  </main>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [accounts, setAccounts] = useState<MockUser[]>(mockUsers);
  const [user, setUser] = useState<MockUser | null>(null);
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<"popular" | "nearby" | "highlights">("popular");
  const [route, setRoute] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place>(places[0]);
  const [detailOrigin, setDetailOrigin] = useState<DetailOrigin>("search");
  const [routeStarted, setRouteStarted] = useState(false);
  const [routeHydrated, setRouteHydrated] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const redirect = window.setTimeout(() => setScreen("login"), 2200);
    return () => window.clearTimeout(redirect);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedRoute = JSON.parse(window.localStorage.getItem("rota-slz-route") ?? "[]") as string[];
        setRoute(savedRoute.filter((id) => places.some((place) => place.id === id)));
      } catch {
        window.localStorage.removeItem("rota-slz-route");
      }
      setRouteHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (routeHydrated) window.localStorage.setItem("rota-slz-route", JSON.stringify(route));
  }, [route, routeHydrated]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visiblePlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return places;
    return places.filter((place) => `${place.name} ${place.category} ${place.address}`.toLocaleLowerCase("pt-BR").includes(normalized));
  }, [query]);
  const nearbyPlaces = useMemo(() => {
    const origin = userLocation ?? { latitude: -2.5292, longitude: -44.3061 };
    return [...places].sort((first, second) => distanceInKilometers(origin, first.coordinates) - distanceInKilometers(origin, second.coordinates)).slice(0, 5);
  }, [userLocation]);
  const collectionPlaces = collection === "popular" ? places.slice(0, 5) : collection === "nearby" ? nearbyPlaces : [places[2], places[0], places[5], places[1], places[4]];
  const routePlaces = useMemo(() => route.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place)), [route]);
  const routeVisitMinutes = routePlaces.reduce((total, place) => total + place.durationMinutes, 0);

  const show = (next: Screen) => { setScreen(next); setQuery(""); };
  const showNearby = () => {
    setCollection("nearby");
    show("search");
    if (!navigator.geolocation) {
      setToast("Seu dispositivo não oferece localização. Usamos o Centro Histórico como referência.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      () => setToast("Permissão de localização não concedida. Usamos o Centro Histórico como referência."),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 },
    );
  };
  const selectPlace = (place: Place, origin: DetailOrigin) => { setSelectedPlace(place); setDetailOrigin(origin); setScreen("detail"); };
  const returnFromDetail = () => setScreen(detailOrigin);
  const addStop = (id: string) => { setRouteStarted(false); setRoute((current) => current.includes(id) ? current : [...current, id]); };
  const removeStop = (id: string) => { setRouteStarted(false); setRoute((current) => current.filter((stop) => stop !== id)); };
  const toggleStop = (id: string) => { setRouteStarted(false); setRoute((current) => current.includes(id) ? current.filter((stop) => stop !== id) : [...current, id]); };

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("email") ?? "").trim().toLocaleLowerCase();
    const password = String(form.get("password") ?? "");
    const found = accounts.find((account) => (account.email.toLocaleLowerCase() === identity || account.name.toLocaleLowerCase() === identity) && account.password === password);
    if (!found) { setLoginError("Usuário ou senha incorretos."); return; }
    setUser(found); setLoginError(""); setScreen("home");
  };
  const signup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newAccount = { name: String(form.get("name") ?? "").trim(), email: String(form.get("email") ?? "").trim(), password: String(form.get("password") ?? ""), birth: String(form.get("birth") ?? "") };
    if (newAccount.password !== String(form.get("confirm") ?? "")) { setLoginError("As senhas não coincidem."); return; }
    if (accounts.some((account) => account.email.toLocaleLowerCase() === newAccount.email.toLocaleLowerCase())) { setLoginError("Este e-mail já está cadastrado."); return; }
    setAccounts((current) => [...current, newAccount]); setUser(newAccount); setLoginError(""); setScreen("home");
  };

  if (screen === "splash") return <main className="mobile-stage splash-screen"><div className="splash-sun" /><div className="splash-lamp"><span /><i /></div><Wordmark /><p>Viva a história de cada caminho.</p></main>;

  if (screen === "login" || screen === "signup") return <main className="mobile-stage auth-screen">
    {screen === "login" ? <Image className="auth-portal" src={portalLogin} alt="" preload /> : <div className="auth-arch"><div className="arch-window"><span /><span /><span /></div><div className="arch-railing" /></div>}
    <section className="auth-card">
      <h1>{screen === "login" ? <>Bem<br /><em>vindo</em></> : <>Cadastre-<em>se</em></>}</h1>
      <p>{screen === "login" ? "Entre e crie memórias pelos caminhos de São Luís." : "Crie sua conta e comece a montar sua rota."}</p>
      <form onSubmit={screen === "login" ? login : signup}>
        {screen === "signup" && <label>Nome completo<input name="name" required placeholder="Seu nome" /></label>}
        {screen === "signup" && <label>Data de nascimento<input name="birth" type="date" required /></label>}
        <label>{screen === "login" ? "E-mail ou usuário" : "E-mail"}<input name="email" required autoComplete="username" placeholder={screen === "login" ? "admin" : "nome@exemplo.com"} /></label>
        <label>Senha<input name="password" required minLength={6} type="password" autoComplete={screen === "login" ? "current-password" : "new-password"} placeholder="••••••" /></label>
        {screen === "signup" && <label>Confirme a senha<input name="confirm" required minLength={6} type="password" placeholder="••••••" /></label>}
        {loginError && <p className="form-error" role="alert">{loginError}</p>}
        <button className="auth-submit" type="submit">{screen === "login" ? "Entrar" : "Cadastrar"}</button>
      </form>
      {screen === "login" ? <><button className="forgot-button" onClick={() => setToast("Use o usuário admin e a senha 123456.")}>Esqueci minha senha</button><button className="auth-switch" onClick={() => { setLoginError(""); setScreen("signup"); }}>Ainda não tenho cadastro</button><small>Demo: admin · 123456</small></> : <button className="auth-switch" onClick={() => { setLoginError(""); setScreen("login"); }}>Já tenho uma conta</button>}
    </section>
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "home") return <main className="mobile-stage app-screen home-screen">
    <header className="home-top"><Wordmark small /><button className="qr-button" onClick={() => setScannerOpen(true)} aria-label="Abrir câmera e escanear QR Code"><span /><span /><span /><span /></button></header>
    <label className="home-search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setScreen("search")} placeholder="Para onde vamos?" /></label>
    <section className="home-sections">
      <button className="home-section home-section--popular" onClick={() => { setCollection("popular"); show("search"); }}><span><b>Destinos populares</b><small>Histórias que todo mundo precisa viver</small></span><Icon name="sparkle" /></button>
      <button className="home-section home-section--nearby" onClick={showNearby}><span><b>Destinos próximos</b><small>Descubra o que está ao seu redor</small></span><Icon name="pin" /></button>
      <button className="home-section home-section--highlights" onClick={() => show("highlights")}><span><b>Destaques do mês</b><small>Experiências selecionadas para você</small></span><Icon name="star" /></button>
    </section>
    <div className="home-helper"><span>Comece sua jornada</span><b>Escolha uma das experiências acima</b></div>
    <BottomNav active="home" onNavigate={show} />
    {scannerOpen && <div className="scanner-modal"><button onClick={() => setScannerOpen(false)} aria-label="Fechar leitor"><Icon name="x" /></button><div className="scanner-frame"><i /><i /><i /><i /><span>Posicione o QR Code aqui</span></div><p>Simulação de câmera. Seus destinos podem ter códigos de acesso rápido.</p></div>}
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "search") return <main className="mobile-stage app-screen list-screen">
    <AppHeader title={query ? "Resultados" : collection === "popular" ? "Destinos populares" : collection === "nearby" ? "Destinos próximos" : "Destaques do mês"} onBack={() => show("home")} color={collection === "nearby" ? "blue" : collection === "highlights" ? "green" : "yellow"} />
    <label className={`list-search list-search--${collection}`}><Icon name="search" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ponto turístico" /></label>
    <p className="list-instruction">{query ? `${visiblePlaces.length} ponto${visiblePlaces.length === 1 ? "" : "s"} turístico${visiblePlaces.length === 1 ? "" : "s"} encontrado${visiblePlaces.length === 1 ? "" : "s"}` : collection === "nearby" ? userLocation ? "Organizado pela sua localização atual" : "Proximidade estimada a partir do Centro Histórico" : "Toque em um local para conhecer sua história"}</p>
    <TouristMap places={places} routePlaceIds={route} onSelect={(place) => selectPlace(place, "search")} />
    <PlaceList items={query ? visiblePlaces : collectionPlaces} color={collection === "nearby" ? "blue" : collection === "highlights" ? "green" : "yellow"} onSelect={(place) => selectPlace(place, "search")} />
    {query && !visiblePlaces.length && <div className="not-found"><Icon name="search" /><b>Nenhum ponto encontrado</b><span>Todos os resultados são da nossa lista local de São Luís.</span></div>}
    <BottomNav active="search" onNavigate={show} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "highlights") return <MonthlyHighlights onBack={() => show("home")} onNavigate={show} onSelect={(place) => selectPlace(place, "highlights")} />;

  if (screen === "detail") return <main className="mobile-stage app-screen detail-screen">
    <AppHeader title="Galeria histórica" onBack={returnFromDetail} />
    <article className="history-card"><Image src={selectedPlace.image} alt={selectedPlace.name} /><div><span className="place-kind">{selectedPlace.category}</span><h2>{selectedPlace.name}</h2><p>{selectedPlace.description}</p><p className="long-copy">Um convite para caminhar com calma, observar os detalhes e descobrir os encontros que fazem do Centro Histórico de São Luís um lugar único.</p><div className="history-meta"><span><Icon name="clock" /> {selectedPlace.duration}</span><span><Icon name="star" /> {selectedPlace.rating}</span></div><button className={`route-add ${route.includes(selectedPlace.id) ? "is-added" : ""}`} onClick={() => { if (route.includes(selectedPlace.id)) { removeStop(selectedPlace.id); setToast("Ponto removido da sua rota."); } else { addStop(selectedPlace.id); setToast("Ponto adicionado à sua rota."); } }}><Icon name={route.includes(selectedPlace.id) ? "x" : "plus"} /> {route.includes(selectedPlace.id) ? "Remover da rota" : "Adicionar à rota"}</button></div></article>
    <BottomNav active="search" onNavigate={show} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "planner") return <main className="mobile-stage app-screen planner-screen">
    <AppHeader title="Planeje sua rota" onBack={() => show("home")} />
    <div className="route-path"><Icon name="route" /><span /><Icon name="pin" /></div>
    <section className="route-builder"><p>Crie sua rota</p><h2>Escolha os lugares que quer visitar</h2><p className="route-builder__caption">{route.length ? `${route.length} ${route.length === 1 ? "parada selecionada" : "paradas selecionadas"}` : "Todos os pontos turísticos estão disponíveis"}</p><PlaceList items={places} color="yellow" onSelect={(place) => selectPlace(place, "planner")} selected={route} onToggle={toggleStop} /></section>
    <button className="route-create" onClick={() => { if (!route.length) { setToast("Selecione pelo menos um ponto turístico."); return; } show("route"); }}>Ver minha rota · {route.length} {route.length === 1 ? "parada" : "paradas"}</button>
    <BottomNav active="planner" onNavigate={show} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "route") return <main className="mobile-stage app-screen route-screen">
    <AppHeader title="Minha rota" onBack={() => show("home")} />
    <div className="map-preview" aria-label="Prévia geográfica da rota">
      <div className="map-water" /><i /><i /><i />
      {routePlaces.length > 1 && <svg className="route-map-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={routePlaces.map((place) => { const point = getMapPoint(place); return `${point.x},${point.y}`; }).join(" ")} /></svg>}
      {routePlaces.map((place, index) => { const point = getMapPoint(place); return <button key={place.id} className="route-map-pin" style={{ left: `${point.x}%`, top: `${point.y}%` }} onClick={() => selectPlace(place, "route")} aria-label={`Ver parada ${index + 1}: ${place.name}`}><span>{index + 1}</span></button>; })}
      {!routePlaces.length && <p className="map-empty-state">Selecione pontos para visualizar seu caminho.</p>}
    </div>
    <section className="route-summary"><div className="route-summary__heading"><div><p>Seu roteiro</p><h2>Rota de hoje</h2></div>{route.length > 0 && <span>{route.length} {route.length === 1 ? "parada" : "paradas"} · {formatRouteDuration(routeVisitMinutes)}</span>}</div>{route.length ? routePlaces.map((place, index) => <div className="route-summary__item" key={place.id}><b>{index + 1}</b><Image src={place.image} alt="" /><span>{place.name}<small>{place.duration} · {place.category}</small></span><button onClick={() => removeStop(place.id)} aria-label={`Remover ${place.name}`}><Icon name="x" /></button></div>) : <p className="empty-route">Sua rota ainda está vazia. Escolha pontos para começar.</p>}<button className="start-route" disabled={!route.length} onClick={() => { setRouteStarted(true); setToast(`Rota iniciada! Boa caminhada, ${user?.name ?? "Admin"}.`); }}><Icon name="route" /> {routeStarted ? "Rota em andamento" : "Começar rota"}</button></section>
    <BottomNav active="route" onNavigate={show} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  return <main className="mobile-stage app-screen profile-screen">
    <section className="profile-hero"><div className="profile-statue"><Icon name="user" /></div><h1>Olá, {user?.name || "Admin"}!</h1></section>
    <div className="profile-menu"><button onClick={() => setToast("A edição de perfil será disponibilizada em breve.")}><Icon name="user" /> Meu perfil <Icon name="chevron" /></button><button onClick={() => show("route")}><Icon name="route" /> Minha rota <Icon name="chevron" /></button><button onClick={() => { setCollection("popular"); show("search"); }}><Icon name="map" /> Explorar pontos <Icon name="chevron" /></button><button onClick={() => setToast("As configurações estarão disponíveis em breve.")}><Icon name="filter" /> Configurações <Icon name="chevron" /></button></div>
    <button className="logout-button" onClick={() => { setUser(null); setScreen("login"); }}>Sair da conta</button><Wordmark small /><BottomNav active="profile" onNavigate={show} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

}
