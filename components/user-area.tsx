"use client";

import Image from "next/image";
import { useState } from "react";

import { Icon } from "@/components/icons";
import type { Place } from "@/app/mock-data";
import brandLogo from "../assets/logo/logo.png";

export type UserAreaLanguage = "pt" | "en" | "es";
type UserAreaSection = "home" | "profile" | "favorites" | "visited" | "settings" | "support";

export type UserAreaProps = {
  userName?: string;
  userEmail?: string;
  userBirth?: string;
  userPhone?: string;
  language?: UserAreaLanguage;
  onLanguageChange?: (language: UserAreaLanguage) => void;
  favoritePlaces?: Place[];
  visitedPlaces?: Place[];
  notificationsEnabled?: boolean;
  onNotificationsChange?: (enabled: boolean) => void;
  onBack?: () => void;
  onSelectPlace?: (place: Place) => void;
  onSupport?: () => void;
};

const copy: Record<UserAreaLanguage, Record<string, string>> = {
  pt: { greeting: "OLÁ", profile: "MEU PERFIL", favorites: "MEUS FAVORITOS", visited: "LOCAIS VISITADOS", settings: "CONFIGURAÇÕES", support: "SUPORTE", name: "Nome", birth: "Data de nascimento", phone: "Telefone", email: "E-mail", password: "Senha", language: "Idioma", notifications: "Notificações", contact: "Falar com suporte", emptyFavorites: "Seus lugares favoritos aparecerão aqui.", emptyVisited: "Os lugares que você visitar aparecerão aqui." },
  en: { greeting: "HELLO", profile: "MY PROFILE", favorites: "MY FAVORITES", visited: "PLACES VISITED", settings: "SETTINGS", support: "SUPPORT", name: "Name", birth: "Date of birth", phone: "Phone", email: "Email", password: "Password", language: "Language", notifications: "Notifications", contact: "Contact support", emptyFavorites: "Your favorite places will appear here.", emptyVisited: "Places you visit will appear here." },
  es: { greeting: "HOLA", profile: "MI PERFIL", favorites: "MIS FAVORITOS", visited: "LUGARES VISITADOS", settings: "CONFIGURACIÓN", support: "AYUDA", name: "Nombre", birth: "Fecha de nacimiento", phone: "Teléfono", email: "Correo electrónico", password: "Contraseña", language: "Idioma", notifications: "Notificaciones", contact: "Contactar con soporte", emptyFavorites: "Tus lugares favoritos aparecerán aquí.", emptyVisited: "Los lugares que visites aparecerán aquí." },
};

const languageNames: Record<UserAreaLanguage, string> = { pt: "Português", en: "English", es: "Español" };

export default function UserArea({
  userName = "Visitante", userEmail = "", userBirth = "Não informado", userPhone = "(98) 00000-0000", language: controlledLanguage, onLanguageChange,
  favoritePlaces = [], visitedPlaces = [], notificationsEnabled: controlledNotifications, onNotificationsChange, onBack, onSelectPlace, onSupport,
}: UserAreaProps) {
  const [section, setSection] = useState<UserAreaSection>("home");
  const [localLanguage, setLocalLanguage] = useState<UserAreaLanguage>("pt");
  const [localNotifications, setLocalNotifications] = useState(true);
  const language = controlledLanguage ?? localLanguage;
  const notificationsEnabled = controlledNotifications ?? localNotifications;
  const t = copy[language];

  const goBack = () => section === "home" ? onBack?.() : setSection("home");
  const chooseLanguage = (next: UserAreaLanguage) => { setLocalLanguage(next); onLanguageChange?.(next); };
  const toggleNotifications = () => { const next = !notificationsEnabled; setLocalNotifications(next); onNotificationsChange?.(next); };

  return <section className={`user-area user-area--${section}`} aria-label={t.profile}>
    {section === "home" && <>
      <UserAreaBack onClick={goBack} />
      <button className="user-area__avatar user-area__avatar--home" type="button" onClick={() => setSection("profile")} aria-label={t.profile}><Icon name="user" /></button>
      <h1 className="user-area__welcome">{t.greeting}, <span>{userName.split(" ")[0]}</span>!</h1>
      <nav className="user-area__menu" aria-label="Área do usuário">
        <ProfileMenuButton label={t.profile} hint={`${t.name}, ${t.birth.toLocaleLowerCase()}, login, ${t.password.toLocaleLowerCase()}`} icon="user" onClick={() => setSection("profile")} />
        <ProfileMenuButton label={t.favorites} hint="Locais e rotas favoritas" icon="heart" onClick={() => setSection("favorites")} />
        <ProfileMenuButton label={t.visited} hint="" icon="map" onClick={() => setSection("visited")} />
        <ProfileMenuButton label={t.settings} hint={`${t.language.toLowerCase()}, ${t.notifications.toLowerCase()}, suporte`} icon="filter" onClick={() => setSection("settings")} />
      </nav>
      <UserAreaLogo />
    </>}

    {section === "profile" && <>
      <UserAreaBack onClick={goBack} />
      <button className="user-area__avatar user-area__avatar--profile" type="button" onClick={() => setSection("home")} aria-label="Voltar"><Icon name="user" /></button>
      <h1 className="user-area__title">{t.profile}</h1>
      <div className="profile-fields">
        <ProfileField label={t.name} value={userName} />
        <ProfileField label={t.birth} value={userBirth || "DD/MM/AA"} />
        <ProfileField label={t.phone} value={userPhone} />
        <ProfileField label={t.email} value={userEmail || "nome_de_usuário@dominio.com"} />
        <ProfileField label={t.password} value="••••••••••••••••" />
      </div>
      <UserAreaLogo />
    </>}

    {(section === "favorites" || section === "visited") && <>
      <UserAreaBack onClick={goBack} />
      <h1 className="user-area__title user-area__title--blue">{section === "favorites" ? t.favorites : t.visited}</h1>
      <div className="user-area__place-list">
        {(section === "favorites" ? favoritePlaces : visitedPlaces).length === 0 ? <p className="user-area__empty">{section === "favorites" ? t.emptyFavorites : t.emptyVisited}</p> : (section === "favorites" ? favoritePlaces : visitedPlaces).map((place) => <button className="user-area__place" key={place.id} type="button" onClick={() => onSelectPlace?.(place)}><Image src={place.image} alt="" width={58} height={58} /><span><b>{place.name}</b><small>{place.category} · {place.duration}</small></span><Icon name="chevron" /></button>)}
      </div>
      <UserAreaLogo />
    </>}

    {section === "settings" && <>
      <UserAreaBack onClick={goBack} />
      <h1 className="user-area__title user-area__title--gold">{t.settings}</h1>
      <div className="user-area__settings">
        <div><b>{t.language}</b><div className="language-options">{(["pt", "en", "es"] as const).map((code) => <button key={code} type="button" aria-pressed={language === code} onClick={() => chooseLanguage(code)}>{languageNames[code]}</button>)}</div></div>
        <button className="settings-toggle" type="button" role="switch" aria-checked={notificationsEnabled} onClick={toggleNotifications}><span>{t.notifications}</span><i className={notificationsEnabled ? "is-on" : ""} /></button>
        <button className="settings-support" type="button" onClick={onSupport}>{t.support}</button>
      </div>
      <UserAreaLogo />
    </>}

    {section === "support" && <><UserAreaBack onClick={goBack} /><h1 className="user-area__title user-area__title--blue">{t.support}</h1><button className="settings-support" type="button" onClick={onSupport}>{t.contact}</button><UserAreaLogo /></>}
  </section>;
}

function ProfileMenuButton({ label, hint, icon, onClick }: { label: string; hint: string; icon: "user" | "heart" | "map" | "filter"; onClick: () => void }) {
  return <button className="user-area__menu-button" type="button" onClick={onClick}><Icon name={icon} /><span><b>{label}</b>{hint && <small>({hint})</small>}</span><Icon name="chevron" /></button>;
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return <div className="profile-field"><b>{label}:</b><span>{value}</span></div>;
}

function UserAreaBack({ onClick }: { onClick: () => void }) {
  return <button className="user-area__back" type="button" onClick={onClick} aria-label="Voltar"><Icon name="arrow" /></button>;
}

function UserAreaLogo() {
  return <Image className="user-area__logo" src={brandLogo} alt="Rota São Luís" />;
}
