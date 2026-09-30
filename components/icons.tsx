import type { SVGProps } from "react";

type IconName =
  | "arrow"
  | "bookmark"
  | "calendar"
  | "chevron"
  | "clock"
  | "compass"
  | "filter"
  | "heart"
  | "map"
  | "menu"
  | "pin"
  | "plus"
  | "route"
  | "search"
  | "sparkle"
  | "star"
  | "trophy"
  | "user"
  | "x";

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path {...common} d="m12 5-7 7 7 7"/><path {...common} d="M19 12H5"/></>,
    bookmark: <path {...common} d="M7 4.5A2.5 2.5 0 0 1 9.5 2h5A2.5 2.5 0 0 1 17 4.5V22l-5-3-5 3V4.5Z"/>,
    calendar: <><rect {...common} x="3" y="5" width="18" height="16" rx="2"/><path {...common} d="M16 3v4M8 3v4M3 10h18"/></>,
    chevron: <path {...common} d="m9 18 6-6-6-6"/>,
    clock: <><circle {...common} cx="12" cy="12" r="8.5"/><path {...common} d="M12 7v5l3.5 2"/></>,
    compass: <><circle {...common} cx="12" cy="12" r="9"/><path {...common} d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4 5.4-2.2Z"/></>,
    filter: <path {...common} d="M4 6h16M7 12h10m-7 6h4"/>,
    heart: <path {...common} d="M20.8 8.6c0 5.3-8.8 10.4-8.8 10.4S3.2 13.9 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z"/>,
    map: <><path {...common} d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path {...common} d="M9 3v15M15 6v15"/></>,
    menu: <><path {...common} d="M4 7h16M4 12h16M4 17h16"/></>,
    pin: <><path {...common} d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle {...common} cx="12" cy="10" r="2.3"/></>,
    plus: <path {...common} d="M12 5v14M5 12h14"/>,
    route: <><circle {...common} cx="6" cy="18" r="2"/><circle {...common} cx="18" cy="6" r="2"/><path {...common} d="M8 18h2a4 4 0 0 0 4-4v-4a4 4 0 0 1 4-4"/></>,
    search: <><circle {...common} cx="10.8" cy="10.8" r="6.5"/><path {...common} d="m16 16 4.3 4.3"/></>,
    sparkle: <path {...common} d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/>,
    star: <path {...common} d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 5.9-5.4-2.9-5.4 2.9 1-5.9L3.3 9.4l6-.9L12 3Z"/>,
    trophy: <><path {...common} d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path {...common} d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v5M8.5 21h7M9 18h6"/></>,
    user: <><circle {...common} cx="12" cy="8" r="3.5"/><path {...common} d="M5 21a7 7 0 0 1 14 0"/></>,
    x: <path {...common} d="m6 6 12 12M18 6 6 18"/>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
