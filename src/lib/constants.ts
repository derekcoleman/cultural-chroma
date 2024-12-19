import { 
  Book, 
  Plane, 
  Shirt, 
  Tv,
  Home,
  UtensilsCrossed,
  GraduationCap,
  Palette,
  Heart,
  Laptop,
  CalendarDays,
  Headphones,
  Newspaper,
  Film,
  LucideIcon
} from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "All Categories", icon: null },
  { id: "book", label: "Books", icon: Book },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "movies & tv", label: "Movies & TV", icon: Tv },
  { id: "home décor & art", label: "Home Décor & Art", icon: Home },
  { id: "food & drink", label: "Food & Drink", icon: UtensilsCrossed },
  { id: "online courses", label: "Online Courses", icon: GraduationCap },
  { id: "hobbies & crafts", label: "Hobbies & Crafts", icon: Palette },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "tech & gadgets", label: "Tech & Gadgets", icon: Laptop },
  { id: "cultural events", label: "Cultural Events", icon: CalendarDays },
  { id: "podcasts", label: "Podcasts", icon: Headphones },
  { id: "magazines", label: "Magazines", icon: Newspaper },
  { id: "cultural media", label: "Cultural Media", icon: Film },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];