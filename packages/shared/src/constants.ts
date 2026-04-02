import type { SportSeed } from "./types";

export const FIELD_DOOR_SPORTS: SportSeed[] = [
  {
    slug: "box-cricket",
    name: "Box Cricket",
    icon: "Cricket",
    pricePerHour: 799,
    description: "Fast-paced matches under lights with premium turf and match-ready boundary setup.",
    rules: ["8 players per side", "Bring non-marking shoes", "Arrive 15 minutes early"],
    imagePath: "/media/sports/box-cricket.png",
    accent: "#FF7A00"
  },
  {
    slug: "football",
    name: "Football",
    icon: "SoccerBall",
    pricePerHour: 999,
    description: "Five-a-side football with cushioned turf, bright floodlights, and secure fencing.",
    rules: ["Studs not allowed", "Max 10 players", "Shin guards recommended"],
    imagePath: "/media/sports/football.png",
    accent: "#F97316"
  },
  {
    slug: "badminton",
    name: "Badminton",
    icon: "TennisBall",
    pricePerHour: 499,
    description: "Indoor-style badminton courts with quick booking windows for short sessions.",
    rules: ["Non-marking shoes only", "2 to 4 players", "Feather shuttles allowed"],
    imagePath: "/media/sports/badminton.png",
    accent: "#FB923C"
  },
  {
    slug: "tennis",
    name: "Tennis",
    icon: "TennisBall",
    pricePerHour: 899,
    description: "Practice rallies or coaching sessions on a clean court with evening prime slots.",
    rules: ["Singles or doubles", "Bring your own racquet", "Clay shoes not required"],
    imagePath: "/media/sports/tennis.png",
    accent: "#EA580C"
  },
  {
    slug: "bowling",
    name: "Bowling",
    icon: "Circle",
    pricePerHour: 699,
    description: "Compact fun lane sessions designed for groups and event bookings.",
    rules: ["Socks required", "Children allowed with adults", "Food not allowed inside lanes"],
    imagePath: "/media/sports/bowling.png",
    accent: "#F59E0B"
  },
  {
    slug: "drift-bikes",
    name: "Drift Bikes",
    icon: "Motorcycle",
    pricePerHour: 1199,
    description: "Adrenaline-heavy drift bike loops with guided safety brief before each ride.",
    rules: ["Helmet mandatory", "Height restrictions apply", "Safety waiver required"],
    imagePath: "/media/sports/drift-bikes.png",
    accent: "#C2410C"
  },
  {
    slug: "paintball",
    name: "Paintball",
    icon: "Target",
    pricePerHour: 1299,
    description: "Team combat zones with obstacle layouts, marshals, and premium safety gear.",
    rules: ["Face mask mandatory", "Minimum 6 players", "Extra ammo billed separately"],
    imagePath: "/media/sports/paintball.png",
    accent: "#FB923C"
  }
];

export const TESTIMONIALS = [
  {
    name: "Aarav Menon",
    quote: "The slot flow feels sharp on mobile. We booked football in less than a minute.",
    rating: 5
  },
  {
    name: "Kavya Narang",
    quote: "The venue looked active, the timing was clear, and checkout felt trustworthy.",
    rating: 5
  },
  {
    name: "Ritvik Sharma",
    quote: "Our cricket group now uses Field Door every weekend because the slots stay updated live.",
    rating: 4.8
  }
];
