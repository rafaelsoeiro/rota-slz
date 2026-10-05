"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Icon } from "@/components/icons";
import { mockUsers, monthlyHighlights, places, type MockUser, type Place } from "./mock-data";
import homeNavigationIcon from "../assets/icon_navbar_home.png";
import brandLogo from "../assets/logo/logo.png";
import casarõesCategory from "../assets/categorias/casaroes.png";
import ruasPracasCategory from "../assets/categorias/ruas&pracas.png";
import museusCategory from "../assets/categorias/museus.png";
import restaurantesCategory from "../assets/categorias/restaurantes&cafes.png";
import igrejasCategory from "../assets/categorias/igrejas.png";
import lojasCategory from "../assets/categorias/lojas&sebos.png";
import qrCodeBlue from "../assets/icones/qr-code-blue.png";

type Screen = "splash" | "login" | "signup" | "home" | "search" | "highlights" | "detail";
type NavActive = Screen | "nearby";
type DetailOrigin = "search" | "highlights";
type Coordinates = { latitude: number; longitude: number };

const DEFAULT_MAP_ORIGIN: Coordinates = { latitude: -2.5292, longitude: -44.3061 };
const popularPlaceIds = [1, 2, 6, 8, 12];

const searchCategories = [
  { label: "Casarões", value: "casarão", image: casarõesCategory },
  { label: "Ruas e Praças", value: "rua", image: ruasPracasCategory },
  { label: "Museus", value: "museu", image: museusCategory },
  { label: "Restaurantes e Cafés", value: "gastronomia", image: restaurantesCategory },
  { label: "Igrejas", value: "igreja", image: igrejasCategory },
  { label: "Lojas e Sebos", value: "sebo", image: lojasCategory },
];

const TouristMap = dynamic(() => import("@/components/tourist-map"), {
  ssr: false,
  loading: () => <section className="tourist-map tourist-map--loading" aria-label="Carregando mapa dos pontos"><div className="tourist-map__heading"><span className="tourist-map__eyebrow"><Icon name="map" /> Mapa dos pontos</span></div><div className="tourist-map__loading">Carregando mapa…</div></section>,
});

function Wordmark({ small = false }: { small?: boolean }) {
  return <div className={`wordmark ${small ? "wordmark--small" : ""}`}><span>rota</span><strong>São Luís</strong></div>;
}

function BrandLogo({ className = "" }: { className?: string }) {
  return <Image className={`brand-logo ${className}`} src={brandLogo} alt="Rota São Luís" priority />;
}

function BottomNav({ onNavigate, onNearby, active }: { active: NavActive; onNavigate: (screen: Screen) => void; onNearby: () => void }) {
  return <nav className="bottom-nav" aria-label="Navegação principal">
    <button onClick={() => onNavigate("search")} aria-label="Explorar destinos"><Icon name="search" /></button>
    <button className="home-button" onClick={() => onNavigate("home")} aria-label="Tela inicial"><span><Image src={homeNavigationIcon} alt="" /></span></button>
    <button className={active === "nearby" ? "is-active" : ""} onClick={onNearby} aria-label="Destinos próximos"><Icon name="pin" /></button>
  </nav>;
}

function AppHeader({ title, onBack, color = "yellow" }: { title: string; onBack?: () => void; color?: "yellow" | "blue" | "green" }) {
  return <header className="app-header">
    <button className={`header-circle header-circle--${color}`} onClick={onBack} aria-label="Voltar">{onBack ? <Icon name="arrow" /> : <span />}</button>
    <h1 className={`header-pill header-pill--${color}`}>{title}</h1>
  </header>;
}

function PlaceList({ items, color, onSelect, selected, onToggle }: { items: Place[]; color: "yellow" | "blue" | "green"; onSelect: (place: Place) => void; selected?: number[]; onToggle?: (id: number) => void }) {
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

type QrCodeDetector = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>>;
};
type QrCodeDetectorConstructor = new (options?: { formats?: string[] }) => QrCodeDetector;

function QrScannerModal({ onClose, onDetected }: { onClose: () => void; onDetected: (value: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [status, setStatus] = useState("Iniciando câmera…");
  const [manualValue, setManualValue] = useState("");

  useEffect(() => {
    let cancelled = false;
    const detectorConstructor = (window as Window & { BarcodeDetector?: QrCodeDetectorConstructor }).BarcodeDetector;

    const startScanner = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("A câmera não está disponível neste dispositivo.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        if (!detectorConstructor) {
          setStatus("Leitura automática indisponível. Cole o conteúdo do QR Code abaixo.");
          return;
        }

        const detector = new detectorConstructor({ formats: ["qr_code"] });
        setStatus("Aponte a câmera para um QR Code");
        const scan = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const value = codes[0]?.rawValue?.trim();
            if (value) {
              onDetected(value);
              return;
            }
          } catch {
            setStatus("Não foi possível ler este QR Code. Tente novamente.");
          }
          animationFrameRef.current = window.requestAnimationFrame(() => { void scan(); });
        };
        void scan();
      } catch {
        setStatus("Não foi possível acessar a câmera. Verifique a permissão ou cole o conteúdo do QR Code.");
      }
    };

    void startScanner();
    return () => {
      cancelled = true;
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [onDetected]);

  return <div className="scanner-modal" role="dialog" aria-modal="true" aria-labelledby="scanner-title">
    <button onClick={onClose} aria-label="Fechar leitor"><Icon name="x" /></button>
    <div className="scanner-content">
      <h2 id="scanner-title">Escanear QR Code</h2>
      <div className="scanner-frame"><video ref={videoRef} autoPlay muted playsInline /><i /><i /><i /><i /><span>{status}</span></div>
      <label className="scanner-manual"><span>Ou cole o conteúdo do QR Code</span><input value={manualValue} onChange={(event) => setManualValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && manualValue.trim()) onDetected(manualValue.trim()); }} placeholder="Código ou URL" /><button type="button" disabled={!manualValue.trim()} onClick={() => onDetected(manualValue.trim())}>Validar código</button></label>
    </div>
  </div>;
}

function SearchLanding({ query, onQueryChange, onBack, onCategory, onNearby }: { query: string; onQueryChange: (value: string) => void; onBack: () => void; onCategory: (value: string) => void; onNearby: () => void }) {
  return <main className="mobile-stage app-screen search-landing-screen">
    <header className="search-landing-header">
      <button className="search-landing-menu" onClick={onBack} aria-label="Voltar para a tela inicial"><span /><span /><span /></button>
      <label className="search-landing-input">
        <Icon name="search" />
        <input aria-label="Buscar ponto turístico" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="....." autoFocus />
      </label>
    </header>
    <div className="search-quick-filters" aria-label="Filtros rápidos">
      {searchCategories.slice(0, 4).map((category) => <button key={category.value} onClick={() => onCategory(category.value)}><Icon name="search" />{category.label}</button>)}
    </div>
    <section className="search-category-grid" aria-label="Categorias de lugares">
      {searchCategories.map((category) => <button className="search-category-card" key={category.value} onClick={() => onCategory(category.value)}>
        <Image src={category.image} alt="" sizes="(max-width: 430px) 30vw, 130px" />
        <span>{category.label}</span>
      </button>)}
    </section>
    <BottomNav active="search" onNavigate={(screen) => screen === "home" ? onBack() : undefined} onNearby={onNearby} />
  </main>;
}

function distanceInKilometers(from: Coordinates, to: Coordinates) {
  const toRadians = (value: number) => value * (Math.PI / 180);
  const earthRadius = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function matchesSearchCategory(place: Place, value: string) {
  const searchableName = `${place.name} ${place.description} ${place.address}`.toLocaleLowerCase("pt-BR");
  if (value === "casarão") return place.category === "Arquitetura" || searchableName.includes("palácio");
  if (value === "rua") return /rua|beco|praça|centro histórico/.test(searchableName);
  if (value === "museu") return /museu|centro cultural|centro de pesquisa|casa do tambor|casa do maranhão/.test(searchableName);
  if (value === "gastronomia") return place.category === "Gastronomia";
  if (value === "igreja") return /igreja|catedral|paróquia/.test(searchableName);
  if (value === "sebo") return /sebo|livraria|empório|tulhas/.test(searchableName);
  return false;
}

function formatDistance(distanceKm: number) {
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1).replace(".", ",")} km`;
}

function MapPlaceSheet({ place, distanceKm, onOpen }: { place: Place; distanceKm?: number; onOpen: () => void }) {
  return <button className="map-place-sheet" onClick={onOpen} aria-label={`Ver detalhes de ${place.name}`}>
    <Image src={place.image} alt="" />
    <span className="map-place-sheet__content"><small>{place.category}{distanceKm !== undefined ? ` · ${formatDistance(distanceKm)}` : ""}</small><b>{place.name}</b><span>Toque para ver mais detalhes <Icon name="chevron" /></span></span>
  </button>;
}

function MonthlyHighlights({ onBack, onNavigate, onNearby, onSelect }: { onBack: () => void; onNavigate: (screen: Screen) => void; onNearby: () => void; onSelect: (place: Place) => void }) {
  const featuredPlaceIds = [12, 8, 17];
  const featuredPlaces = featuredPlaceIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));

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
    <BottomNav active="home" onNavigate={onNavigate} onNearby={onNearby} />
  </main>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [accounts, setAccounts] = useState<MockUser[]>(mockUsers);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [collection, setCollection] = useState<"popular" | "nearby" | "highlights">("popular");
  const [searchLandingVisible, setSearchLandingVisible] = useState(true);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState(5);
  const [selectedPlace, setSelectedPlace] = useState<Place>(places[0]);
  const [selectedMapPlace, setSelectedMapPlace] = useState<Place | null>(null);
  const [detailOrigin, setDetailOrigin] = useState<DetailOrigin>("search");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const redirect = window.setTimeout(() => setScreen("login"), 2200);
    return () => window.clearTimeout(redirect);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visiblePlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return places.filter((place) => {
      const matchesText = !normalized || `${place.name} ${place.category} ${place.description} ${place.address}`.toLocaleLowerCase("pt-BR").includes(normalized);
      return matchesText && (!activeCategory || matchesSearchCategory(place, activeCategory));
    });
  }, [activeCategory, query]);
  const nearbyPlaces = useMemo(() => {
    const origin = userLocation ?? DEFAULT_MAP_ORIGIN;
    return places
      .map((place) => ({ place, distance: distanceInKilometers(origin, place.coordinates) }))
      .filter(({ distance }) => distance <= nearbyRadiusKm)
      .sort((first, second) => first.distance - second.distance)
      .map(({ place }) => place);
  }, [nearbyRadiusKm, userLocation]);
  const popularPlaces = popularPlaceIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));
  const mapPlaces = collection === "nearby" ? nearbyPlaces : query || activeCategory ? visiblePlaces : [];
  const activeMapPlace = selectedMapPlace && mapPlaces.some((place) => place.id === selectedMapPlace.id) ? selectedMapPlace : null;

  const show = (next: Screen) => { if (next === "search") { setCollection("popular"); setSearchLandingVisible(true); } setScreen(next); setQuery(""); setActiveCategory(null); };
  const showPopular = () => { setCollection("popular"); setSearchLandingVisible(false); setQuery(""); setActiveCategory(null); setScreen("search"); };
  const showCategory = (value: string) => { setCollection("popular"); setSearchLandingVisible(false); setQuery(""); setActiveCategory(value); setScreen("search"); };
  const showNearby = () => {
    setCollection("nearby");
    setSearchLandingVisible(false);
    setQuery("");
    setActiveCategory(null);
    setUserLocation(null);
    setScreen("search");
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
  const handleQrDetected = useCallback((value: string) => {
    const normalizedValue = value.trim().toLocaleLowerCase("pt-BR");
    const idFromValue = normalizedValue.match(/(?:place|ponto|id)[=/:_-]?(\d+)/)?.[1] ?? (/^\d+$/.test(normalizedValue) ? normalizedValue : null);
    const place = idFromValue ? places.find((item) => item.id === Number(idFromValue)) : places.find((item) => item.name.toLocaleLowerCase("pt-BR") === normalizedValue);
    setScannerOpen(false);
    if (place) {
      setSelectedPlace(place);
      setDetailOrigin("search");
      setScreen("detail");
      setToast(`QR Code reconhecido: ${place.name}.`);
      return;
    }
    setToast("QR Code lido, mas ele não corresponde a um ponto turístico cadastrado.");
  }, []);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identity = String(form.get("email") ?? "").trim().toLocaleLowerCase();
    const password = String(form.get("password") ?? "");
    const found = accounts.find((account) => (account.email.toLocaleLowerCase() === identity || account.name.toLocaleLowerCase() === identity) && account.password === password);
    if (!found) { setLoginError("Usuário ou senha incorretos."); return; }
    setLoginError(""); setScreen("home");
  };
  const signup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newAccount = { name: String(form.get("name") ?? "").trim(), email: String(form.get("email") ?? "").trim(), password: String(form.get("password") ?? ""), birth: String(form.get("birth") ?? "") };
    if (newAccount.password !== String(form.get("confirm") ?? "")) { setLoginError("As senhas não coincidem."); return; }
    if (accounts.some((account) => account.email.toLocaleLowerCase() === newAccount.email.toLocaleLowerCase())) { setLoginError("Este e-mail já está cadastrado."); return; }
    setAccounts((current) => [...current, newAccount]); setLoginError(""); setScreen("home");
  };

  if (screen === "splash") return <main className="mobile-stage splash-screen"><div className="splash-sun" /><div className="splash-lamp"><span /><i /></div><BrandLogo className="brand-logo--splash" /><p>Viva a história de cada caminho.</p></main>;

  if (screen === "login" || screen === "signup") return <main className="mobile-stage auth-screen">
    {screen === "login" ? <BrandLogo className="brand-logo--login" /> : <div className="auth-arch"><div className="arch-window"><span /><span /><span /></div><div className="arch-railing" /></div>}
    <section className="auth-card">
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
      {screen === "login" ? <><button className="forgot-button" onClick={() => setToast("Use o usuário admin e a senha 123456.")}>Esqueci minha senha</button><button className="auth-switch" onClick={() => { setLoginError(""); setScreen("signup"); }}>Ainda não tenho cadastro</button><button type="button" className="demo-login-button" onClick={() => { setLoginError(""); setScreen("home"); }} aria-label="Entrar rapidamente como admin">Demo: <b>admin</b> · 123456</button></> : <button className="auth-switch" onClick={() => { setLoginError(""); setScreen("login"); }}>Já tenho uma conta</button>}
    </section>
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "home") return <main className="mobile-stage app-screen home-screen">
    <header className="home-top"><Wordmark small /><button className="qr-button" onClick={() => setScannerOpen(true)} aria-label="Abrir câmera e escanear QR Code"><Image src={qrCodeBlue} alt="" /></button></header>
    <label className="home-search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => { setCollection("popular"); setActiveCategory(null); setSearchLandingVisible(true); setScreen("search"); }} placeholder="Para onde vamos?" /></label>
    <section className="home-sections">
      <button className="home-section home-section--popular" onClick={showPopular}><span><b>Destinos populares</b><small>Histórias que todo mundo precisa viver</small></span><Icon name="sparkle" /></button>
      <button className="home-section home-section--nearby" onClick={showNearby}><span><b>Destinos próximos</b><small>Descubra o que está ao seu redor</small></span><Icon name="pin" /></button>
      <button className="home-section home-section--highlights" onClick={() => show("highlights")}><span><b>Destaques do mês</b><small>Experiências selecionadas para você</small></span><Icon name="star" /></button>
    </section>
    <div className="home-helper"><span>Comece sua jornada</span><b>Escolha uma das experiências acima</b></div>
    <BottomNav active="home" onNavigate={show} onNearby={showNearby} />
    {scannerOpen && <QrScannerModal onClose={() => setScannerOpen(false)} onDetected={handleQrDetected} />}
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "search" && !query && !activeCategory && collection === "popular" && searchLandingVisible) return <SearchLanding query={query} onQueryChange={(value) => { setQuery(value); setSearchLandingVisible(!value); }} onBack={() => show("home")} onCategory={showCategory} onNearby={showNearby} />;

  if (screen === "search" && collection === "popular" && !query && !activeCategory && !searchLandingVisible) return <main className="mobile-stage app-screen list-screen">
    <AppHeader title="Destinos populares" onBack={() => show("home")} color="yellow" />
    <p className="list-instruction">Uma seleção de lugares para começar a descobrir São Luís.</p>
    <PlaceList items={popularPlaces} color="yellow" onSelect={(place) => selectPlace(place, "search")} />
    <BottomNav active="search" onNavigate={show} onNearby={showNearby} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "search") return <main className={`mobile-stage map-search-screen ${collection === "nearby" ? "map-search-screen--nearby" : ""}`}>
    <AppHeader title={collection === "nearby" ? "Destinos próximos" : "Resultados"} onBack={() => show("home")} color={collection === "nearby" ? "blue" : "yellow"} />
    <section className="map-search-controls" aria-label="Controles de busca">
      <label className={`list-search list-search--${collection}`}><Icon name="search" /><input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setSearchLandingVisible(!event.target.value); }} placeholder="Buscar ponto turístico" /></label>
      {collection === "nearby" && <label className="radius-control"><span>Raio de busca <b>{nearbyRadiusKm} km</b></span><input type="range" min="1" max="20" step="1" value={nearbyRadiusKm} onChange={(event) => setNearbyRadiusKm(Number(event.target.value))} aria-label="Raio de busca em quilômetros" /></label>}
      <p>{query || activeCategory ? `${visiblePlaces.length} resultado${visiblePlaces.length === 1 ? "" : "s"}` : collection === "nearby" ? userLocation ? `${nearbyPlaces.length} ponto${nearbyPlaces.length === 1 ? "" : "s"} no raio selecionado` : `${nearbyPlaces.length} ponto${nearbyPlaces.length === 1 ? "" : "s"} do Centro Histórico (estimativa)` : "Pontos correspondentes à pesquisa"}</p>
    </section>
    {mapPlaces.length ? <TouristMap places={mapPlaces} selectedPlaceId={activeMapPlace?.id} fullScreen onSelect={setSelectedMapPlace} /> : <div className="map-search-empty"><Icon name={collection === "nearby" ? "pin" : "search"} /><b>{collection === "nearby" ? "Nenhum destino neste raio" : "Nenhum ponto encontrado"}</b><span>{collection === "nearby" ? "Aumente o raio ou tente novamente em outra região." : "Tente outro nome, endereço ou categoria."}</span></div>}
    {activeMapPlace && <MapPlaceSheet place={activeMapPlace} distanceKm={collection === "nearby" ? distanceInKilometers(userLocation ?? DEFAULT_MAP_ORIGIN, activeMapPlace.coordinates) : undefined} onOpen={() => selectPlace(activeMapPlace, "search")} />}
    <BottomNav active={collection === "nearby" ? "nearby" : "search"} onNavigate={show} onNearby={showNearby} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "detail") return <main className="mobile-stage app-screen detail-screen">
    <AppHeader title="Galeria histórica" onBack={returnFromDetail} />
    <article className="history-card"><Image src={selectedPlace.image} alt={selectedPlace.name} /><div><span className="place-kind">{selectedPlace.category}</span><h2>{selectedPlace.name}</h2><p>{selectedPlace.description}</p><p className="long-copy">Um convite para caminhar com calma, observar os detalhes e descobrir os encontros que fazem do Centro Histórico de São Luís um lugar único.</p><div className="history-meta"><span><Icon name="clock" /> {selectedPlace.duration}</span><span><Icon name="star" /> {selectedPlace.rating}</span></div></div></article>
    <BottomNav active="search" onNavigate={show} onNearby={showNearby} />
    <FeedbackToast message={toast} onDismiss={() => setToast("")} />
  </main>;

  if (screen === "highlights") return <MonthlyHighlights onBack={() => show("home")} onNavigate={show} onNearby={showNearby} onSelect={(place) => selectPlace(place, "highlights")} />;

  return <main className="mobile-stage app-screen home-screen">
    <header className="home-top"><Wordmark small /><button className="qr-button" onClick={() => setScannerOpen(true)} aria-label="Abrir câmera e escanear QR Code"><Image src={qrCodeBlue} alt="" /></button></header>
    <p className="home-helper"><span>Não encontramos esta tela</span><b>Volte para o início para continuar explorando São Luís.</b></p>
    <BottomNav active="home" onNavigate={show} onNearby={showNearby} />
  </main>;

}
