"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlanetCanvas from "@/components/canvas/PlanetCanvas";
import { PLANETS } from "@/lib/planets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SolarSystemSection() {
  const [activePlanet, setActivePlanet] = useState(2); // Earth default
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".planet-content", {
        opacity: 0, x: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const planet = PLANETS[activePlanet];

  return (
    <section
      ref={sectionRef}
      id="solar"
      className="relative min-h-screen py-24 overflow-hidden"
    >
      {/* Nebula */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(139,0,255,0.1) 0%, transparent 55%), radial-gradient(ellipse at 70% 40%, rgba(0,102,255,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="font-mono text-[11px] text-cyan-400/60 tracking-[0.3em] uppercase mb-4">
            ◈ INTERPLANETARY TRANSIT · SECTOR 02
          </div>
          <h2
            className="font-orbitron font-black text-white"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 1.05 }}
          >
            THE SOLAR
            <span className="block gradient-text-cyan">SYSTEM</span>
          </h2>
        </motion.div>

        {/* Planet selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {PLANETS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setActivePlanet(i)}
              data-cursor
              className="font-orbitron text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-300"
              style={{
                borderColor: i === activePlanet ? "#00f5ff" : "rgba(255,255,255,0.1)",
                color: i === activePlanet ? "#00f5ff" : "rgba(255,255,255,0.4)",
                background: i === activePlanet ? "rgba(0,245,255,0.05)" : "transparent",
                boxShadow: i === activePlanet ? "0 0 20px rgba(0,245,255,0.1)" : "none",
              }}
            >
              {p.name}
            </button>
          ))}
        </motion.div>

        {/* Planet detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlanet}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Info */}
            <div className="planet-content order-2 lg:order-1">
              <div className="font-mono text-[10px] text-cyan-400/50 tracking-[0.3em] uppercase mb-3">
                ◈ {activePlanet === 2 ? "HOME WORLD" : activePlanet === 3 ? "NEXT FRONTIER" : "CELESTIAL BODY"} · PLANET {String(activePlanet + 1).padStart(2, "0")}
              </div>

              <h3
                className="font-orbitron font-black mb-4"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6.5rem)",
                  lineHeight: 1,
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                }}
              >
                {planet.name}
              </h3>

              <p className="font-exo text-white/40 leading-relaxed mb-8 max-w-md">
                {planet.description}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {planet.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-white/5 p-4 bg-white/[0.02]"
                  >
                    <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase mb-1">
                      {stat.label}
                    </div>
                    <div className="font-orbitron text-lg font-bold text-white">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Planet visual */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
              <div className="relative">
                {/* Scan ring */}
                <div
                  className="absolute -inset-8 rounded-full border border-cyan-400/10"
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />
                <div
                  className="absolute -inset-16 rounded-full border border-cyan-400/05"
                  style={{ animation: "pulse 3s ease-in-out infinite 1s" }}
                />
                {/* HUD scan line */}
                <div className="absolute top-4 right-4 w-16 h-16 border border-cyan-400/20 rounded-full z-10">
                  <div
                    className="absolute w-1/2 h-[1px] bg-cyan-400/60 top-1/2 left-1/2"
                    style={{
                      transformOrigin: "left",
                      animation: "scan 3s linear infinite",
                    }}
                  />
                  <div className="absolute inset-1 rounded-full border border-cyan-400/10" />
                </div>
                <PlanetCanvas planet={planet} size={420} />
              </div>

              {/* Distance indicator */}
              <div className="mt-6 font-mono text-[10px] text-white/20 tracking-[0.2em] text-center">
                DISTANCE: {planet.stats[0].value} FROM SOL
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">
        02 · SOLAR SYSTEM
      </div>
    </section>
  );
}
