import type { StaticImageData } from "next/image";

import casaDoMaranhao from "../assets/1000206130_15904a85a5c466e50ffa4a2a8158a432-10_09_2026, 14_53_47.png";
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
];

export type Place = {
  id: string;
  name: string;
  category: "História" | "Cultura" | "Gastronomia" | "Arquitetura";
  image: StaticImageData;
  position: { x: number; y: number };
  description: string;
  duration: string;
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
    position: { x: 40, y: 30 },
    description: "Símbolo do poder maranhense, com vista privilegiada para a Baía de São Marcos.",
    duration: "45 min",
    address: "Av. Pedro II, Centro",
    rating: 4.9,
    color: "yellow",
  },
  {
    id: "azulejos",
    name: "Museu de Artes Visuais",
    category: "Cultura",
    image: azulejos,
    position: { x: 61, y: 45 },
    description: "Arte, memória e os famosos azulejos portugueses em um casarão do século XIX.",
    duration: "1 h",
    address: "Rua do Giz, Praia Grande",
    rating: 4.8,
    color: "blue",
  },
  {
    id: "casa",
    name: "Casa de Nhozinho",
    category: "Cultura",
    image: casaDoMaranhao,
    position: { x: 31, y: 56 },
    description: "Um encontro afetivo com a criatividade e os saberes do artesanato maranhense.",
    duration: "50 min",
    address: "Rua Portugal, Praia Grande",
    rating: 4.7,
    color: "green",
  },
  {
    id: "regueira",
    name: "Beco da Regueira",
    category: "Gastronomia",
    image: regueira,
    position: { x: 52, y: 68 },
    description: "Um dos becos mais vivos da cidade: sabores, música e mesas ao ar livre.",
    duration: "1 h 30",
    address: "Rua da Estrela, Centro",
    rating: 4.8,
    color: "yellow",
  },
  {
    id: "teatro",
    name: "Teatro Arthur Azevedo",
    category: "Arquitetura",
    image: teatro,
    position: { x: 70, y: 68 },
    description: "Um palco histórico inaugurado em 1817 e parte indispensável da cena cultural local.",
    duration: "40 min",
    address: "Rua do Sol, Centro",
    rating: 4.9,
    color: "blue",
  },
  {
    id: "boi",
    name: "Casa do Maranhão",
    category: "Cultura",
    image: bumbaMeuBoi,
    position: { x: 76, y: 30 },
    description: "A riqueza do Bumba Meu Boi e das festas que fazem pulsar o Maranhão.",
    duration: "1 h",
    address: "Rua do Trapiche, Praia Grande",
    rating: 4.8,
    color: "green",
  },
  {
    id: "centro",
    name: "Centro Histórico",
    category: "Arquitetura",
    image: centroHistorico,
    position: { x: 20, y: 37 },
    description: "Caminhe por uma das maiores coleções de arquitetura colonial portuguesa da América Latina.",
    duration: "2 h",
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
