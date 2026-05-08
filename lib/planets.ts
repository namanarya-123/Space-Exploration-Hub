export interface Planet {
  name: string;
  color: string;
  atmosphere: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  hasRings?: boolean;
  ringColor?: string;
  glowColor?: string;
  atmosOpacity?: number;
}

export const PLANETS: Planet[] = [
  {
    name: "MERCURY",
    color: "#a0978a",
    atmosphere: "#c8a882",
    description:
      "The scorched messenger of the gods. Closest to the Sun, Mercury endures extreme temperature swings from +430°C to -180°C. A barren, cratered world with no atmosphere to shield it.",
    glowColor: "180, 160, 130",
    atmosOpacity: 0.15,
    stats: [
      { label: "Distance from Sun", value: "0.39 AU" },
      { label: "Orbital Period", value: "88 Earth Days" },
      { label: "Surface Temp", value: "+430°C / -180°C" },
      { label: "Moons", value: "0" },
    ],
  },
  {
    name: "VENUS",
    color: "#e8c97a",
    atmosphere: "#d4a043",
    description:
      "A hellish world cloaked in thick clouds of sulfuric acid. Venus, Earth's twisted twin, burns at 465°C — hot enough to melt lead — beneath crushing atmospheric pressure.",
    glowColor: "230, 180, 80",
    atmosOpacity: 0.35,
    stats: [
      { label: "Distance from Sun", value: "0.72 AU" },
      { label: "Rotation Period", value: "243 Earth Days" },
      { label: "Surface Pressure", value: "92x Earth" },
      { label: "Cloud Composition", value: "H₂SO₄" },
    ],
  },
  {
    name: "EARTH",
    color: "#1a6bcc",
    atmosphere: "#4db5ff",
    description:
      "Our blue cradle. The only confirmed harbor of life in the known universe — a world of liquid water, breathable air, and extraordinary biodiversity. Home.",
    glowColor: "77, 181, 255",
    atmosOpacity: 0.3,
    stats: [
      { label: "Distance from Sun", value: "1.00 AU" },
      { label: "Day Length", value: "24 Hours" },
      { label: "Known Species", value: "8.7 Million" },
      { label: "Surface Water", value: "71%" },
    ],
  },
  {
    name: "MARS",
    color: "#c1440e",
    atmosphere: "#e87c4f",
    description:
      "The Red Planet. Humanity's next frontier. Mars offers a 24.6-hour day, polar ice caps, and evidence of ancient oceans. The proving ground for our interplanetary ambitions.",
    glowColor: "232, 124, 79",
    atmosOpacity: 0.2,
    stats: [
      { label: "Distance from Sun", value: "1.52 AU" },
      { label: "Day Length", value: "24.6 Hours" },
      { label: "Gravity", value: "38% of Earth" },
      { label: "Moons", value: "2" },
    ],
  },
  {
    name: "JUPITER",
    color: "#c88b3a",
    atmosphere: "#e8a44e",
    description:
      "King of the solar system. Jupiter's Great Red Spot — a storm larger than Earth — has raged for over 350 years. Its 95 moons may harbor life in subsurface oceans.",
    glowColor: "200, 140, 60",
    atmosOpacity: 0.25,
    stats: [
      { label: "Distance from Sun", value: "5.20 AU" },
      { label: "Day Length", value: "9.9 Hours" },
      { label: "Known Moons", value: "95" },
      { label: "Mass", value: "317.8x Earth" },
    ],
  },
  {
    name: "SATURN",
    color: "#e8d5a0",
    atmosphere: "#f0e0b0",
    description:
      "Lord of the Rings. Saturn's magnificent ring system spans 282,000 km yet is only 10 meters thick. The least dense planet in the solar system — it would float in water.",
    glowColor: "230, 210, 160",
    atmosOpacity: 0.2,
    hasRings: true,
    ringColor: "rgba(230,200,150,",
    stats: [
      { label: "Distance from Sun", value: "9.58 AU" },
      { label: "Ring Span", value: "282,000 km" },
      { label: "Known Moons", value: "146" },
      { label: "Density", value: "0.69 g/cm³" },
    ],
  },
  {
    name: "NEPTUNE",
    color: "#2255cc",
    atmosphere: "#4488ff",
    description:
      "The ice giant at the edge of our solar system. Neptune's supersonic winds reach 2,100 km/h — the fastest in the solar system. Its moon Triton orbits backwards.",
    glowColor: "68, 136, 255",
    atmosOpacity: 0.3,
    stats: [
      { label: "Distance from Sun", value: "30.1 AU" },
      { label: "Day Length", value: "16.1 Hours" },
      { label: "Wind Speed", value: "2,100 km/h" },
      { label: "Known Moons", value: "16" },
    ],
  },
];
