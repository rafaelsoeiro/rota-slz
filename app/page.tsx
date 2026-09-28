"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { places, type Place } from "./mock-data";

type Screen = "splash" | "login" | "signup" | "home" | "search" | "planner" | "route" | "profile" | "detail";
type Account = { name: string; email: string; password: string; birth?: string };

const demoAccount: Account = { name: "Rafael", email: "rafael", password: "123456" };

function Wordmark({ small = false }: { small?: boolean }) {
  return <div className={`wordmark ${small ? "wordmark--small" : ""}`}><span>rota</span><strong>São Luís</strong></div>;
}

function BottomNav({ onNavigate, active }: { active: Screen; onNavigate: (screen: Screen) => void }) {
  return <nav className="bottom-nav" aria-label="Navegação principal">
    <button onClick={() => onNavigate("search")} aria-label="Explorar destinos"><Icon name="search" /></button>
    <button onClick={() => onNavigate("planner")} aria-label="Planejar rota"><Icon name="route" /></button>
    <button className="home-button" onClick={() => onNavigate("home")} aria-label="Tela inicial"><span><Icon name="compass" /></span></button>
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
        <img src={place.image.src} alt="" />
        <span><b>{place.name}</b><small>{place.category} · {place.duration}</small></span>
        <Icon name="chevron" />
      </button>
    </article>)}
  </div>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [accounts, setAccounts] = useState<Account[]>([demoAccount]);
  const [user, setUser] = useState<Account | null>(null);
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<"popular" | "nearby" | "highlights">("popular");
  const [route, setRoute] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place>(places[0]);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const redirect = window.setTimeout(() => setScreen("login"), 2200);
    return () => window.clearTimeout(redirect);
  }, []);

  const visiblePlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return places;
    return places.filter((place) => `${place.name} ${place.category} ${place.address}`.toLocaleLowerCase("pt-BR").includes(normalized));
  }, [query]);
  const collectionPlaces = collection === "popular" ? places.slice(0, 5) : collection === "nearby" ? [places[1], places[3], places[4], places[5], places[6]] : [places[2], places[0], places[5], places[1], places[4]];

  const show = (next: Screen) => { setScreen(next); setQuery(""); };
  const selectPlace = (place: Place) => { setSelectedPlace(place); setScreen("detail"); };
  const toggleStop = (id: string) => setRoute((current) => current.includes(id) ? current.filter((stop) => stop !== id) : [...current, id]);

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
    if (accounts.some((account) => account.email.toLocaleLowerCase() === newAccount.email.toLocaleLowerCase())) { setLoginError("Este e-mail já está cadastrado."); return; }
    setAccounts((current) => [...current, newAccount]); setUser(newAccount); setLoginError(""); setScreen("home");
  };

  if (screen === "splash") return <main className="mobile-stage splash-screen"><div className="splash-sun" /><div className="splash-lamp"><span /><i /></div><Wordmark /><p>Viva a história de cada caminho.</p></main>;

  if (screen === "login" || screen === "signup") return <main className="mobile-stage auth-screen">
    <div className="auth-arch"><div className="arch-window"><span /><span /><span /></div><div className="arch-railing" /></div>
    <section className="auth-card">
      <h1>{screen === "login" ? <>Bem<br /><em>vindo</em></> : <>Cadastre-<em>se</em></>}</h1>
      <p>{screen === "login" ? "Entre e crie memórias pelos caminhos de São Luís." : "Crie sua conta e comece a montar sua rota."}</p>
      <form onSubmit={screen === "login" ? login : signup}>
        {screen === "signup" && <label>Nome completo<input name="name" required placeholder="Seu nome" /></label>}
        {screen === "signup" && <label>Data de nascimento<input name="birth" type="date" required /></label>}
        <label>{screen === "login" ? "E-mail ou usuário" : "E-mail"}<input name="email" required autoComplete="username" placeholder={screen === "login" ? "rafael" : "nome@exemplo.com"} /></label>
        <label>Senha<input name="password" required minLength={6} type="password" autoComplete={screen === "login" ? "current-password" : "new-password"} placeholder="••••••" /></label>
        {screen === "signup" && <label>Confirme a senha<input name="confirm" required minLength={6} type="password" placeholder="••••••" /></label>}
        {loginError && <p className="form-error" role="alert">{loginError}</p>}
        <button className="auth-submit" type="submit">{screen === "login" ? "Entrar" : "Cadastrar"}</button>
      </form>
      {screen === "login" ? <><button className="forgot-button" onClick={() => setToast("Use o usuário Rafael e a senha 123456.")}>Esqueci minha senha</button><button className="auth-switch" onClick={() => { setLoginError(""); setScreen("signup"); }}>Ainda não tenho cadastro</button><small>Demo: Rafael · 123456</small></> : <button className="auth-switch" onClick={() => { setLoginError(""); setScreen("login"); }}>Já tenho uma conta</button>}
    </section>
  </main>;

  if (screen === "home") return <main className="mobile-stage app-screen home-screen">
    <header className="home-top"><Wordmark small /><button className="qr-button" onClick={() => setScannerOpen(true)} aria-label="Abrir câmera e escanear QR Code"><span /><span /><span /><span /></button></header>
    <label className="home-search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setScreen("search")} placeholder="Para onde vamos?" /></label>
    <section className="home-sections">
      <button className="home-section home-section--popular" onClick={() => { setCollection("popular"); show("search"); }}><span><b>Destinos populares</b><small>Histórias que todo mundo precisa viver</small></span><Icon name="sparkle" /></button>
      <button className="home-section home-section--nearby" onClick={() => { setCollection("nearby"); show("search"); }}><span><b>Destinos próximos</b><small>Descubra o que está ao seu redor</small></span><Icon name="pin" /></button>
      <button className="home-section home-section--highlights" onClick={() => { setCollection("highlights"); show("search"); }}><span><b>Destaques do mês</b><small>Experiências selecionadas para você</small></span><Icon name="star" /></button>
    </section>
    <div className="home-helper"><span>Comece sua jornada</span><b>Escolha uma das experiências acima</b></div>
    <BottomNav active="home" onNavigate={show} />
    {scannerOpen && <div className="scanner-modal"><button onClick={() => setScannerOpen(false)} aria-label="Fechar leitor"><Icon name="x" /></button><div className="scanner-frame"><i /><i /><i /><i /><span>Posicione o QR Code aqui</span></div><p>Simulação de câmera. Seus destinos podem ter códigos de acesso rápido.</p></div>}
    {toast && <div className="app-toast" role="status">{toast}<button onClick={() => setToast("")}><Icon name="x" /></button></div>}
  </main>;

  if (screen === "search") return <main className="mobile-stage app-screen list-screen">
    <AppHeader title={query ? "Resultados" : collection === "popular" ? "Destinos populares" : collection === "nearby" ? "Destinos próximos" : "Destaques do mês"} onBack={() => show("home")} color={collection === "nearby" ? "blue" : collection === "highlights" ? "green" : "yellow"} />
    <label className={`list-search list-search--${collection}`}><Icon name="search" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ponto turístico" /></label>
    <p className="list-instruction">{query ? `${visiblePlaces.length} ponto${visiblePlaces.length === 1 ? "" : "s"} turístico${visiblePlaces.length === 1 ? "" : "s"} encontrado${visiblePlaces.length === 1 ? "" : "s"}` : "Toque em um local para conhecer sua história"}</p>
    <PlaceList items={query ? visiblePlaces : collectionPlaces} color={collection === "nearby" ? "blue" : collection === "highlights" ? "green" : "yellow"} onSelect={selectPlace} />
    {query && !visiblePlaces.length && <div className="not-found"><Icon name="search" /><b>Nenhum ponto encontrado</b><span>Todos os resultados são da nossa lista local de São Luís.</span></div>}
    <BottomNav active="search" onNavigate={show} />
  </main>;

  if (screen === "detail") return <main className="mobile-stage app-screen detail-screen">
    <AppHeader title="Galeria histórica" onBack={() => show("search")} />
    <article className="history-card"><img src={selectedPlace.image.src} alt="" /><div><span className="place-kind">{selectedPlace.category}</span><h2>{selectedPlace.name}</h2><p>{selectedPlace.description}</p><p className="long-copy">Um convite para caminhar com calma, observar os detalhes e descobrir os encontros que fazem do Centro Histórico de São Luís um lugar único.</p><div className="history-meta"><span><Icon name="clock" /> {selectedPlace.duration}</span><span><Icon name="star" /> {selectedPlace.rating}</span></div><button className="route-add" onClick={() => { toggleStop(selectedPlace.id); setToast("Ponto adicionado à sua rota."); }}><Icon name="plus" /> Adicionar à rota</button></div></article>
    <BottomNav active="search" onNavigate={show} />
  </main>;

  if (screen === "planner") return <main className="mobile-stage app-screen planner-screen">
    <AppHeader title="Planeje sua rota" onBack={() => show("home")} />
    <div className="route-path"><Icon name="route" /><span /><Icon name="pin" /></div>
    <section className="route-builder"><p>Crie sua rota</p><h2>Escolha os lugares que quer visitar</h2><PlaceList items={places.slice(0, 5)} color="yellow" onSelect={selectPlace} selected={route} onToggle={toggleStop} /></section>
    <button className="route-create" onClick={() => { if (!route.length) { setToast("Selecione pelo menos um ponto turístico."); return; } show("route"); }}>Ver minha rota · {route.length} {route.length === 1 ? "parada" : "paradas"}</button>
    <BottomNav active="planner" onNavigate={show} />
  </main>;

  if (screen === "route") return <main className="mobile-stage app-screen route-screen">
    <AppHeader title="Minha rota" onBack={() => show("home")} />
    <div className="map-preview"><div className="map-water" /><i /><i /><i />{route.map((id, index) => { const place = places.find((item) => item.id === id); return place ? <button key={id} className="route-map-pin" style={{ left: `${23 + index * 21}%`, top: `${28 + (index % 2) * 30}%` }} onClick={() => selectPlace(place)}>{index + 1}</button> : null; })}</div>
    <section className="route-summary"><h2>Rota de hoje</h2>{route.length ? route.map((id, index) => { const place = places.find((item) => item.id === id); return place ? <div className="route-summary__item" key={id}><b>{index + 1}</b><img src={place.image.src} alt="" /><span>{place.name}<small>{place.duration} · {place.category}</small></span><button onClick={() => toggleStop(id)} aria-label={`Remover ${place.name}`}><Icon name="x" /></button></div> : null; }) : <p className="empty-route">Sua rota ainda está vazia. Escolha pontos para começar.</p>}<button className="start-route" onClick={() => setToast("Sua rota começou! Boa caminhada, Rafael.")}><Icon name="route" /> Começar rota</button></section>
    <BottomNav active="route" onNavigate={show} />
  </main>;

  return <main className="mobile-stage app-screen profile-screen">
    <section className="profile-hero"><div className="profile-statue"><Icon name="user" /></div><h1>Olá, {user?.name || "Rafael"}!</h1></section>
    <div className="profile-menu"><button><Icon name="user" /> Meu perfil <Icon name="chevron" /></button><button onClick={() => show("route")}><Icon name="heart" /> Meus favoritos <Icon name="chevron" /></button><button onClick={() => show("search")}><Icon name="map" /> Locais visitados <Icon name="chevron" /></button><button><Icon name="filter" /> Configurações <Icon name="chevron" /></button></div>
    <button className="logout-button" onClick={() => { setUser(null); setScreen("login"); }}>Sair da conta</button><Wordmark small /><BottomNav active="profile" onNavigate={show} />
  </main>;

}
