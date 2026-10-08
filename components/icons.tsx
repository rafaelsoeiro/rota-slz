import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  Map,
  MapPin,
  Menu,
  Plus,
  Route,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

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

const icons: Record<IconName, LucideIcon> = {
  arrow: ArrowLeft,
  bookmark: Bookmark,
  calendar: CalendarDays,
  chevron: ChevronRight,
  clock: Clock3,
  compass: Compass,
  filter: SlidersHorizontal,
  heart: Heart,
  map: Map,
  menu: Menu,
  pin: MapPin,
  plus: Plus,
  route: Route,
  search: Search,
  sparkle: Sparkles,
  star: Star,
  trophy: Trophy,
  user: UserRound,
  x: X,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.9} {...props} />;
}
