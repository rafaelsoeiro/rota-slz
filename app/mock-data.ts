import type { StaticImageData } from "next/image";

import regueira from "../assets/pontosTuristicos/Beco da Regueira.png";
import florVinagreira from "../assets/pontosTuristicos/Flor de Vinagreira.png";
import cafofinho from "../assets/pontosTuristicos/Cafofinho da Tia Dica.png";
import quintasLisboa from "../assets/pontosTuristicos/Quintas da Lisboa.png";
import cacarola from "../assets/pontosTuristicos/Caçarola Bistrô.png";
import casaReal from "../assets/pontosTuristicos/Casa Real Empório.png";
import cafePoesia from "../assets/pontosTuristicos/Café e Poesia.png";
import duCarmo from "../assets/pontosTuristicos/Du'Carmo Cafeteria.png";
import seboArteiro from "../assets/pontosTuristicos/Sebo Livraria do Arteiro.png";
import casaDasTulhas from "../assets/pontosTuristicos/Casa das Tulhas.png";
import palacio from "../assets/pontosTuristicos/Palácio dos Leões.png";
import laRavardiere from "../assets/pontosTuristicos/Palácio La Ravardière.png";
import ruaDoGiz from "../assets/pontosTuristicos/Rua do Giz.png";
import ruaDoEgito from "../assets/pontosTuristicos/Rua do Egito.png";
import ruaDaEstrela from "../assets/pontosTuristicos/Rua da Estrela.png";
import centroHistorico from "../assets/pontosTuristicos/Centro Histórico Reviver.png";
import catarinaMina from "../assets/pontosTuristicos/Beco Catarina Mina.png";
import teatro from "../assets/pontosTuristicos/Teatro Arthur Azevedo.png";
import museuGastronomia from "../assets/pontosTuristicos/Museu da Gastronomia Maranhense.png";
import ccvm from "../assets/pontosTuristicos/CCVM — Centro Cultural Vale Maranhão.png";
import azulejos from "../assets/pontosTuristicos/Museu de Artes Visuais.png";
import museuReggae from "../assets/pontosTuristicos/Museu do Reggae.png";
import centroPesquisa from "../assets/pontosTuristicos/Centro de Pesquisa.png";
import tamborCrioula from "../assets/pontosTuristicos/Casa do Tambor de Crioula.png";
import casaDoMaranhao from "../assets/pontosTuristicos/Casa do Maranhão.png";
import museuCasaDeNhozinho from "../assets/pontosTuristicos/Museu Casa de Nhozinho.png";
import catedralSe from "../assets/pontosTuristicos/Catedral da Sé.png";
import igrejaDesterro from "../assets/pontosTuristicos/Igreja do Desterro.png";
import nossaSenhoraRemedios from "../assets/pontosTuristicos/Paróquia Nossa Senhora dos Remédios.png";
import pracaDomPedro from "../assets/pontosTuristicos/Praça Dom Pedro II.png";
import pracaGoncalvesDias from "../assets/pontosTuristicos/Praça Gonçalves Dias.png";
import pracaNauroMachado from "../assets/pontosTuristicos/Praça Nauro Machado.png";

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
  id: number;
  name: string;
  category: "História" | "Cultura" | "Gastronomia" | "Arquitetura";
  image: StaticImageData;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  duration: string;
  durationMinutes: number;
  address: string;
  rating: number;
  color: "yellow" | "blue" | "green";
};

export const places: Place[] = [
  {
    id: 1,
    name: "Palácio dos Leões",
    category: "História",
    image: palacio,
    coordinates: {
      latitude: -2.52819,
      longitude: -44.30662,
    },
    description:
      "Símbolo do poder maranhense e sede do Governo do Estado, com salões históricos e vista privilegiada para a Baía de São Marcos.",
    duration: "45 min",
    durationMinutes: 45,
    address: "Av. Dom Pedro II, s/n — Centro",
    rating: 4.8,
    color: "yellow",
  },

  {
    id: 2,
    name: "Palácio de La Ravardière",
    category: "História",
    image: laRavardiere,
    coordinates: {
      latitude: -2.52795,
      longitude: -44.30555,
    },
    description:
      "Sede da Prefeitura de São Luís, instalado em um edifício histórico cujas origens remontam ao período colonial.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Av. Dom Pedro II, s/n — Centro",
    rating: 4.7,
    color: "blue",
  },

  {
    id: 3,
    name: "Rua do Giz",
    category: "Arquitetura",
    image: ruaDoGiz,
    coordinates: {
      latitude: -2.53109,
      longitude: -44.30487,
    },
    description:
      "Uma das vias mais características do Centro Histórico, cercada por casarões, fachadas coloniais e referências da memória ludovicense.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Rua do Giz — Centro Histórico",
    rating: 4.6,
    color: "yellow",
  },

  {
    id: 4,
    name: "Rua do Egito",
    category: "Arquitetura",
    image: ruaDoEgito,
    coordinates: {
      latitude: -2.5278,
      longitude: -44.30335,
    },
    description:
      "Rua tradicional do centro de São Luís que preserva parte da configuração urbana e arquitetônica da cidade histórica.",
    duration: "25 min",
    durationMinutes: 25,
    address: "Rua do Egito — Centro",
    rating: 4.5,
    color: "blue",
  },

  {
    id: 5,
    name: "Rua da Estrela",
    category: "Arquitetura",
    image: ruaDaEstrela,
    coordinates: {
      latitude: -2.53004,
      longitude: -44.30556,
    },
    description:
      "Um dos principais eixos da Praia Grande, reunindo museus, restaurantes, cultura popular e construções históricas.",
    duration: "40 min",
    durationMinutes: 40,
    address: "Rua da Estrela — Centro Histórico",
    rating: 4.7,
    color: "green",
  },

  {
    id: 6,
    name: "Centro Histórico",
    category: "Arquitetura",
    image: centroHistorico,
    coordinates: {
      latitude: -2.52986,
      longitude: -44.30417,
    },
    description:
      "Caminhe por uma das mais importantes coleções de arquitetura colonial portuguesa da América Latina.",
    duration: "2 h",
    durationMinutes: 120,
    address: "Centro Histórico — São Luís",
    rating: 4.9,
    color: "yellow",
  },

  {
    id: 7,
    name: "Beco Catarina Mina",
    category: "História",
    image: catarinaMina,
    coordinates: {
      latitude: -2.5295,
      longitude: -44.3062,
    },
    description:
      "Escadaria histórica da Praia Grande ligada à memória de Catarina Mina, personagem marcante da história popular de São Luís.",
    duration: "20 min",
    durationMinutes: 20,
    address: "Beco Catarina Mina — Praia Grande",
    rating: 4.5,
    color: "green",
  },

  {
    id: 8,
    name: "Beco da Regueira",
    category: "Gastronomia",
    image: regueira,
    coordinates: {
      latitude: -2.53058,
      longitude: -44.30522,
    },
    description:
      "Um dos becos mais vivos da cidade, com sabores, música e mesas ao ar livre.",
    duration: "1 h 30 min",
    durationMinutes: 90,
    address: "Rua da Estrela — Centro",
    rating: 4.8,
    color: "yellow",
  },

  {
    id: 9,
    name: "Teatro Arthur Azevedo",
    category: "Arquitetura",
    image: teatro,
    coordinates: {
      latitude: -2.52895,
      longitude: -44.30249,
    },
    description:
      "Inaugurado em 1817, é um dos teatros mais antigos do Brasil e uma referência arquitetônica e cultural de São Luís.",
    duration: "40 min",
    durationMinutes: 40,
    address: "Rua do Sol, s/n — Centro",
    rating: 4.8,
    color: "blue",
  },

  {
    id: 10,
    name: "Museu da Gastronomia Maranhense",
    category: "Gastronomia",
    image: museuGastronomia,
    coordinates: {
      latitude: -2.528394,
      longitude: -44.305528,
    },
    description:
      "Espaço dedicado aos sabores, ingredientes, personagens e tradições que formam a identidade gastronômica do Maranhão.",
    duration: "50 min",
    durationMinutes: 50,
    address: "Rua da Estrela, 82 — Centro",
    rating: 4.7,
    color: "yellow",
  },

  {
    id: 11,
    name: "Centro Cultural Vale Maranhão",
    category: "Cultura",
    image: ccvm,
    coordinates: {
      latitude: -2.531632,
      longitude: -44.305125,
    },
    description:
      "Centro cultural dedicado à arte, formação, exposições e manifestações contemporâneas e tradicionais do Maranhão.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Rua Direita, 149 — Centro",
    rating: 4.7,
    color: "green",
  },

  {
    id: 12,
    name: "Museu de Artes Visuais",
    category: "Cultura",
    image: azulejos,
    coordinates: {
      latitude: -2.52918,
      longitude: -44.30603,
    },
    description:
      "Arte, memória e os famosos azulejos portugueses em um casarão histórico da Praia Grande.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Rua Portugal, 273 — Praia Grande",
    rating: 4.6,
    color: "blue",
  },

  {
    id: 13,
    name: "Museu do Reggae Maranhão",
    category: "Cultura",
    image: museuReggae,
    coordinates: {
      latitude: -2.52887,
      longitude: -44.30561,
    },
    description:
      "Museu dedicado à história do reggae no Maranhão e à relação singular de São Luís com a cultura jamaicana.",
    duration: "50 min",
    durationMinutes: 50,
    address: "Rua da Estrela, 124 — Centro Histórico",
    rating: 4.5,
    color: "yellow",
  },

  {
    id: 14,
    name: "Centro de Pesquisa de História Natural e Arqueologia do Maranhão",
    category: "Cultura",
    image: centroPesquisa,
    coordinates: {
      latitude: -2.531091,
      longitude: -44.304868,
    },
    description:
      "Acervo dedicado à arqueologia, etnologia e história natural, oferecendo outro olhar sobre a formação do território maranhense.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Rua do Giz, 59 — Praia Grande",
    rating: 4.8,
    color: "green",
  },

  {
    id: 15,
    name: "Casa do Tambor de Crioula",
    category: "Cultura",
    image: tamborCrioula,
    coordinates: {
      latitude: -2.53049,
      longitude: -44.30542,
    },
    description:
      "Espaço de preservação e valorização do Tambor de Crioula, uma das manifestações culturais mais importantes do Maranhão.",
    duration: "45 min",
    durationMinutes: 45,
    address: "Rua da Estrela — Centro",
    rating: 4.7,
    color: "blue",
  },

  {
    id: 16,
    name: "Museu Casa de Nhozinho",
    category: "Cultura",
    image: museuCasaDeNhozinho,
    coordinates: {
      latitude: -2.52915,
      longitude: -44.30679,
    },
    description:
      "Um encontro com a criatividade, os costumes populares e os saberes do artesanato maranhense.",
    duration: "50 min",
    durationMinutes: 50,
    address: "Rua Portugal, 185 — Praia Grande",
    rating: 4.3,
    color: "green",
  },

  {
    id: 17,
    name: "Casa do Maranhão",
    category: "Cultura",
    image: casaDoMaranhao,
    coordinates: {
      latitude: -2.52973,
      longitude: -44.30812,
    },
    description:
      "Espaço dedicado à cultura popular maranhense e às tradições que cercam o Bumba Meu Boi.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Praia Grande — Centro Histórico",
    rating: 4.6,
    color: "green",
  },

  {
    id: 18,
    name: "Flor de Vinagreira",
    category: "Gastronomia",
    image: florVinagreira,
    coordinates: {
      latitude: -2.529638,
      longitude: -44.305678,
    },
    description:
      "Restaurante no coração do Centro Histórico com pratos inspirados nos sabores e ingredientes da cozinha maranhense.",
    duration: "1 h 30 min",
    durationMinutes: 90,
    address: "Rua da Estrela, 220 — Centro",
    rating: 4.1,
    color: "yellow",
  },

  {
    id: 19,
    name: "Cafofinho da Tia Dica",
    category: "Gastronomia",
    image: cafofinho,
    coordinates: {
      latitude: -2.52964,
      longitude: -44.3051,
    },
    description:
      "Restaurante conhecido pela culinária regional, frutos do mar e pelo ambiente descontraído da Praia Grande.",
    duration: "1 h 30 min",
    durationMinutes: 90,
    address: "Praia Grande — Centro Histórico",
    rating: 4.2,
    color: "green",
  },

  {
    id: 20,
    name: "Quintas da Lisboa",
    category: "Gastronomia",
    image: quintasLisboa,
    coordinates: {
      latitude: -2.52915,
      longitude: -44.30275,
    },
    description:
      "Restaurante instalado na região histórica da Praça João Lisboa, combinando gastronomia e atmosfera do centro antigo.",
    duration: "1 h 30 min",
    durationMinutes: 90,
    address: "Praça João Lisboa, 153 C — Centro",
    rating: 4.4,
    color: "blue",
  },

  {
    id: 21,
    name: "Caçarola Bistrô",
    category: "Gastronomia",
    image: cacarola,
    coordinates: {
      latitude: -2.5302,
      longitude: -44.3033,
    },
    description:
      "Bistrô no Centro Histórico que combina cozinha regional, frutos do mar e referências da herança culinária nordestina.",
    duration: "1 h 30 min",
    durationMinutes: 90,
    address: "Rua Nazaré, 200 — Centro Histórico",
    rating: 4.2,
    color: "yellow",
  },

  {
    id: 22,
    name: "Casa Real Empório",
    category: "Gastronomia",
    image: casaReal,
    coordinates: {
      latitude: -2.5278,
      longitude: -44.3054,
    },
    description:
      "Café e empório em uma área histórica da cidade, adequado para uma pausa entre os principais pontos do roteiro.",
    duration: "45 min",
    durationMinutes: 45,
    address: "Rua Eng. Couto Fernandes, 59 — Centro",
    rating: 4.4,
    color: "green",
  },

  {
    id: 23,
    name: "Café e Poesia",
    category: "Gastronomia",
    image: cafePoesia,
    coordinates: {
      latitude: -2.5284,
      longitude: -44.306,
    },
    description:
      "Cafeteria no Centro Histórico que une uma pausa gastronômica ao clima cultural da região.",
    duration: "45 min",
    durationMinutes: 45,
    address: "Rua Montanha Russa — Centro",
    rating: 3.8,
    color: "blue",
  },

  {
    id: 24,
    name: "Du'Carmo Cafeteria",
    category: "Gastronomia",
    image: duCarmo,
    coordinates: {
      latitude: -2.52915,
      longitude: -44.30275,
    },
    description:
      "Cafeteria localizada na região da Praça João Lisboa, ideal para uma pausa durante o passeio pelo Centro Histórico.",
    duration: "40 min",
    durationMinutes: 40,
    address: "Praça João Lisboa, 153 — Centro",
    rating: 3.8,
    color: "yellow",
  },

  {
    id: 25,
    name: "Catedral da Sé",
    category: "Arquitetura",
    image: catedralSe,
    coordinates: {
      latitude: -2.527793,
      longitude: -44.304992,
    },
    description:
      "Também conhecida como Catedral Metropolitana de Nossa Senhora da Vitória, guarda importante conjunto de arte sacra e arquitetura religiosa.",
    duration: "40 min",
    durationMinutes: 40,
    address: "Av. Dom Pedro II — Centro",
    rating: 4.8,
    color: "blue",
  },

  {
    id: 26,
    name: "Igreja do Desterro",
    category: "História",
    image: igrejaDesterro,
    coordinates: {
      latitude: -2.53555,
      longitude: -44.30428,
    },
    description:
      "Uma das igrejas históricas mais antigas de São Luís, localizada em uma área tradicional do bairro do Desterro.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Largo do Desterro, s/n — Centro",
    rating: 4.6,
    color: "green",
  },

  {
    id: 27,
    name: "Paróquia Nossa Senhora dos Remédios",
    category: "Arquitetura",
    image: nossaSenhoraRemedios,
    coordinates: {
      latitude: -2.5238,
      longitude: -44.2948,
    },
    description:
      "Igreja histórica situada junto à Praça Gonçalves Dias, compondo um dos cenários mais conhecidos da área central.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Praça Gonçalves Dias — Centro",
    rating: 4.8,
    color: "yellow",
  },

  {
    id: 28,
    name: "Sebo Livraria do Arteiro",
    category: "Cultura",
    image: seboArteiro,
    coordinates: {
      latitude: -2.5291,
      longitude: -44.3015,
    },
    description:
      "Sebo e livraria independente do centro, com livros usados, raridades e um ambiente ligado à produção cultural local.",
    duration: "40 min",
    durationMinutes: 40,
    address: "Rua do Sol, 441 B — Centro",
    rating: 4.7,
    color: "green",
  },

  {
    id: 29,
    name: "Casa das Tulhas",
    category: "Gastronomia",
    image: casaDasTulhas,
    coordinates: {
      latitude: -2.52931,
      longitude: -44.30566,
    },
    description:
      "Mercado tradicional da Praia Grande, com produtos regionais, temperos, bebidas, artesanato e sabores maranhenses.",
    duration: "1 h",
    durationMinutes: 60,
    address: "Rua da Estrela — Praia Grande",
    rating: 4.5,
    color: "yellow",
  },

  {
    id: 30,
    name: "Praça Dom Pedro II",
    category: "História",
    image: pracaDomPedro,
    coordinates: {
      latitude: -2.52785,
      longitude: -44.30514,
    },
    description:
      "Conjunto monumental que reúne alguns dos edifícios mais importantes da cidade, incluindo a Catedral e os palácios históricos.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Praça Dom Pedro II — Centro",
    rating: 4.8,
    color: "blue",
  },

  {
    id: 31,
    name: "Praça Gonçalves Dias",
    category: "História",
    image: pracaGoncalvesDias,
    coordinates: {
      latitude: -2.523664,
      longitude: -44.294699,
    },
    description:
      "Praça histórica com vista para a região central, conhecida pela Igreja dos Remédios e pela homenagem ao poeta Gonçalves Dias.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Praça Gonçalves Dias — Centro",
    rating: 4.7,
    color: "green",
  },

  {
    id: 32,
    name: "Praça Nauro Machado",
    category: "Cultura",
    image: pracaNauroMachado,
    coordinates: {
      latitude: -2.53005,
      longitude: -44.30575,
    },
    description:
      "Um dos principais espaços de convivência e eventos culturais da Praia Grande, cercado pelo casario histórico.",
    duration: "30 min",
    durationMinutes: 30,
    address: "Travessa Marcelino Almeida — Centro",
    rating: 4.5,
    color: "yellow",
  },
];

export const monthlyHighlights = [
  { label: "Roteiro pelos azulejos", detail: "6 paradas · Centro Histórico", image: azulejos },
  { label: "Sabores de São Luís", detail: "4 paradas · Gastronomia", image: regueira },
  { label: "Histórias do Maranhão", detail: "5 paradas · Cultura", image: casaDoMaranhao },
];
