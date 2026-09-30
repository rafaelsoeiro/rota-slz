import type { StaticImageData } from "next/image";

import casaDoMaranhao from "../assets/icon_navbar_home.png";
import palacio from "../assets/1000206131_df4b42006f76ed90ec7d39beab612765-10_09_2026, 14_53_45.png";
import azulejos from "../assets/1000206132_56ca2218f82b6190ab1edb8e6919d8d4-10_09_2026, 16_45_01.png";
import centroHistorico from "../assets/1000206181_3a3cb58cfd1a81c112d3d0f2abe1292a-25_09_2026, 11_16_56.png";
import bumbaMeuBoi from "../assets/1000206184_11cd255591f9633e1c1bb27740c006d7-25_09_2026, 12_05_27.png";
import regueira from "../assets/1000206203_d5b5d7c29ced77b0fb6eec8323ffe99f-26_09_2026, 11_31_49.png";
import teatro from "../assets/1000206204_d1fca5c0e1df3c161212551d092544a0-26_09_2026, 11_36_39.png";

export type MockUser = {
  name: string;
  email: string;
  password: string;
  birth?: string;
};

export const mockUsers: MockUser[] = [
  {
    name: "Admin",
    email: "admin",
    password: "123456",
  },
  {
    name: "Julia",
    email: "julia",
    password: "123456",
  },
  {
    name: "Leticia",
    email: "leticia",
    password: "123456",
  },
];

export type Place = {
  id: string;
  name: string;
  category: "História" | "Cultura" | "Gastronomia" | "Arquitetura";
  image: StaticImageData;
  coordinates: { latitude: number; longitude: number };
  description: string;
  duration: string;
  durationMinutes: number;
  address: string;
  rating: number;
  color: "yellow" | "blue" | "green";
};

export const places: Place[] = [
  {
    id: "palacio",
    name: "Palácio dos Leões",
    category: "História",
    image: palacio,
    coordinates: { latitude: -2.52819, longitude: -44.30662 },
    description: "Símbolo do poder maranhense, com vista privilegiada para a Baía de São Marcos.",
    duration: "45 min",
    durationMinutes: 45,
    address: "Av. Dom Pedro II, s/n — Centro Histórico",
    rating: 4.9,
    color: "yellow",
  },
  {
    id: "azulejos",
    name: "Museu de Artes Visuais",
    category: "Cultura",
    image: azulejos,
    coordinates: { latitude: -2.52918, longitude: -44.30603 },
    description: "Arte, memória e os famosos azulejos portugueses em um casarão do século XIX.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Rua Portugal, 273 — Praia Grande",
    rating: 4.8,
    color: "blue",
  },
  {
    id: "casa",
    name: "Casa de Nhozinho",
    category: "Cultura",
    image: casaDoMaranhao,
    coordinates: { latitude: -2.52915, longitude: -44.30679 },
    description: "Um encontro afetivo com a criatividade e os saberes do artesanato maranhense.",
    duration: "50 min",
    durationMinutes: 50,
    address: "Rua Portugal, 185 — Praia Grande",
    rating: 4.7,
    color: "green",
  },
  {
    id: "regueira",
    name: "Beco da Regueira",
    category: "Gastronomia",
    image: regueira,
    coordinates: { latitude: -2.53058, longitude: -44.30522 },
    description: "Um dos becos mais vivos da cidade: sabores, música e mesas ao ar livre.",
    duration: "1 h 30",
    durationMinutes: 90,
    address: "Rua da Estrela, Centro",
    rating: 4.8,
    color: "yellow",
  },
  {
    id: "teatro",
    name: "Teatro Arthur Azevedo",
    category: "Arquitetura",
    image: teatro,
    coordinates: { latitude: -2.53145, longitude: -44.30103 },
    description: "Um palco histórico inaugurado em 1817 e parte indispensável da cena cultural local.",
    duration: "40 min",
    durationMinutes: 40,
    address: "Rua do Sol, 180 — Centro",
    rating: 4.9,
    color: "blue",
  },
  {
    id: "boi",
    name: "Casa do Maranhão",
    category: "Cultura",
    image: bumbaMeuBoi,
    coordinates: { latitude: -2.52973, longitude: -44.30812 },
    description: "A riqueza do Bumba Meu Boi e das festas que fazem pulsar o Maranhão.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Rua do Trapiche — Praia Grande",
    rating: 4.8,
    color: "green",
  },
  {
    id: "centro",
    name: "Centro Histórico",
    category: "Arquitetura",
    image: centroHistorico,
    coordinates: { latitude: -2.52986, longitude: -44.30417 },
    description: "Caminhe por uma das maiores coleções de arquitetura colonial portuguesa da América Latina.",
    duration: "2 h",
    durationMinutes: 120,
    address: "Centro, São Luís",
    rating: 4.9,
    color: "yellow",
  },
];

export const monthlyHighlights = [
  { label: "Roteiro pelos azulejos", detail: "6 paradas · Centro Histórico", image: azulejos },
  { label: "Sabores de São Luís", detail: "4 paradas · Gastronomia", image: regueira },
  { label: "Histórias do Maranhão", detail: "5 paradas · Cultura", image: bumbaMeuBoi },
];
