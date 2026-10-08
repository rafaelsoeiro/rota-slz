import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  LocateFixed,
  Map,
  MapPin,
  Menu,
  Plus,
  Route,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
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
  | "locate"
  | "map"
  | "menu"
  | "pin"
  | "plus"
  | "route"
  | "search"
  | "sparkle"
  | "star"
  | "trash"
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
  locate: LocateFixed,
  map: Map,
  menu: Menu,
  pin: MapPin,
  plus: Plus,
  route: Route,
  search: Search,
  sparkle: Sparkles,
  star: Star,
  trash: Trash2,
  trophy: Trophy,
  user: UserRound,
  x: X,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" strokeWidth={1.9} {...props} />;
}
