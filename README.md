# SPACE EXPLORATION HUB — The Cinematic Space Journey

> A cinematic, award-quality space exploration web experience built with Next.js 15, Three.js, GSAP, and Framer Motion.

## ✨ Features

- **Cinematic Preloader** — Holographic boot sequence with terminal logs, pulse rings, and particle effects
- **Deep Space Hero** — Animated starfield with twinkling stars, nebula clouds, and parallax depth
- **Interactive Solar System** — All 7 planets with procedural shaders, atmospheres, moons, rings, and live stats
- **Mars Colony** — Animated dust storms, colony domes, rover traversal, and god rays
- **Black Hole** — Gravitational lensing simulation, accretion disk, relativistic jets, event horizon
- **Wormhole Transit** — Light streak tunnel with scroll-driven warp acceleration
- **Future Civilization** — Orbital megastructures, AI network nodes, flying ships, neon skyline
- **Hyperspace Ending** — Scroll-driven star warp with cosmic energy burst

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 App Router | Framework & routing |
| TypeScript | Type safety |
| TailwindCSS | Utility-first styling |
| GSAP + ScrollTrigger | Cinematic scroll animations |
| Framer Motion | Component-level animations |
| Lenis | Buttery smooth scrolling |
| Canvas 2D API | Planet & scene rendering |
| WebGL / GLSL Shaders | Advanced visual effects |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or unzip the project
cd beyond-humanity

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to experience it.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
beyond-humanity/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   └── page.tsx            # Main page, section orchestration
├── components/
│   ├── canvas/
│   │   ├── StarField.tsx   # Animated starfield background
│   │   └── PlanetCanvas.tsx # Procedural planet renderer
│   ├── layout/
│   │   ├── HUD.tsx         # Cinematic HUD overlay
│   │   └── SmoothScroll.tsx # Lenis smooth scroll wrapper
│   ├── sections/
│   │   ├── HeroSection.tsx       # Deep space intro
│   │   ├── SolarSystemSection.tsx # Interactive planet explorer
│   │   ├── MarsSection.tsx       # Mars colonization
│   │   ├── BlackHoleSection.tsx  # Event horizon simulation
│   │   ├── WormholeSection.tsx   # Wormhole transit
│   │   ├── FutureSection.tsx     # Interstellar civilization
│   │   └── EndingSection.tsx     # Hyperspace finale
│   └── ui/
│       ├── CustomCursor.tsx  # Glowing cursor
│       ├── Preloader.tsx     # Cinematic boot sequence
│       └── Scanlines.tsx     # CRT scanline overlay
├── hooks/
│   ├── useScrollProgress.ts  # Scroll tracking hooks
│   └── useMagneticButton.ts  # Magnetic button interaction
├── lib/
│   ├── planets.ts  # Planet data & types
│   └── utils.ts    # Utility functions
├── shaders/
│   ├── planet.vert  # Planet vertex shader
│   ├── planet.frag  # Planet fragment shader (atmosphere, lighting)
│   └── blackhole.frag # Gravitational lensing shader
├── styles/
│   └── globals.css  # Design system, animations, custom properties
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Design System

### Colors
```css
--cyan: #00f5ff
--blue: #0066ff
--purple: #8b00ff
--red: #ff2244
--gold: #ffd700
```

### Fonts
- **Orbitron** — Headings, HUD elements, cinematic titles
- **Exo 2** — Body text, descriptions
- **Share Tech Mono** — Terminal text, data readouts, labels

## ⚡ Performance Notes

- Dynamic imports with `next/dynamic` for all 3D sections
- `Suspense` boundaries with fallback states
- Canvas-based rendering instead of heavy 3D libraries where possible
- `requestAnimationFrame` with proper cleanup
- Passive scroll event listeners
- Optimized resize handlers

## 🔧 Customization

### Adding a new planet
Edit `lib/planets.ts` and add a new entry to the `PLANETS` array.

### Modifying colors
Update CSS custom properties in `styles/globals.css` or Tailwind config.

### Adjusting animations
GSAP timelines are in each section component. Scroll triggers use standard `ScrollTrigger` API.

## 📄 License

MIT — Build something beyond humanity.
