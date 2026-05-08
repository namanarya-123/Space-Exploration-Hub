"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MarsSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Martian sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0a0200");
      sky.addColorStop(0.4, "#2a0900");
      sky.addColorStop(0.7, "#5c1a00");
      sky.addColorStop(1, "#8b3000");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // God rays
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 0.4 - Math.PI * 0.2;
        const sx = W * 0.75, sy = H * 0.1;
        const rayGrad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * W, sy + Math.sin(angle) * H);
        rayGrad.addColorStop(0, "rgba(255,120,30,0.15)");
        rayGrad.addColorStop(1, "rgba(255,120,30,0)");
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle - 0.05) * W * 1.5, sy + Math.sin(angle - 0.05) * H * 1.5);
        ctx.lineTo(sx + Math.cos(angle + 0.05) * W * 1.5, sy + Math.sin(angle + 0.05) * H * 1.5);
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }

      // Martian sun
      const sunGrad = ctx.createRadialGradient(W * 0.75, H * 0.12, 0, W * 0.75, H * 0.12, 60);
      sunGrad.addColorStop(0, "rgba(255,200,100,0.9)");
      sunGrad.addColorStop(0.3, "rgba(255,150,50,0.5)");
      sunGrad.addColorStop(1, "rgba(255,100,20,0)");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(W * 0.75, H * 0.12, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(W * 0.75, H * 0.12, 15, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,220,150,0.95)";
      ctx.fill();

      // Ground
      const ground = ctx.createLinearGradient(0, H * 0.6, 0, H);
      ground.addColorStop(0, "#6b2200");
      ground.addColorStop(0.5, "#8b3300");
      ground.addColorStop(1, "#4a1500");
      ctx.fillStyle = ground;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.65);
      for (let x = 0; x <= W; x += 30) {
        ctx.lineTo(x, H * 0.65 + Math.sin(x * 0.01 + t * 0.1) * 8 + Math.sin(x * 0.03) * 4);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.fill();

      // Dust storm particles
      for (let i = 0; i < 120; i++) {
        const px = ((i * 137.5 + t * 25) % (W + 100)) - 50;
        const py = H * 0.45 + Math.sin(i * 1.7 + t * 0.5) * H * 0.15;
        const pr = Math.random() * 2 + 0.5;
        ctx.globalAlpha = Math.random() * 0.25 + 0.05;
        ctx.fillStyle = `rgb(${180 + Math.random() * 40}, ${80 + Math.random() * 30}, ${20 + Math.random() * 20})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Colony domes
      const domes = [
        { x: 0.15, y: 0.65, r: 0.07, glow: "rgba(100,200,255,0.15)" },
        { x: 0.42, y: 0.62, r: 0.1, glow: "rgba(100,200,255,0.2)" },
        { x: 0.68, y: 0.64, r: 0.08, glow: "rgba(100,200,255,0.15)" },
        { x: 0.85, y: 0.66, r: 0.055, glow: "rgba(100,200,255,0.12)" },
      ];
      domes.forEach((d) => {
        const dx = d.x * W, dy = d.y * H, dr = d.r * W;
        // Dome glow
        const dg = ctx.createRadialGradient(dx, dy - dr * 0.3, 0, dx, dy, dr * 1.2);
        dg.addColorStop(0, "rgba(100,200,255,0.15)");
        dg.addColorStop(0.6, d.glow);
        dg.addColorStop(1, "rgba(0,50,150,0)");
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(dx, dy, dr * 1.1, 0, Math.PI * 2);
        ctx.fill();
        // Dome body
        const db = ctx.createRadialGradient(dx - dr * 0.2, dy - dr * 0.3, 0, dx, dy, dr);
        db.addColorStop(0, "rgba(150,220,255,0.25)");
        db.addColorStop(0.6, "rgba(50,130,220,0.1)");
        db.addColorStop(1, "rgba(0,30,100,0.05)");
        ctx.beginPath();
        ctx.arc(dx, dy, dr, Math.PI, 0);
        ctx.fillStyle = db;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dx, dy, dr, Math.PI, 0);
        ctx.strokeStyle = "rgba(100,200,255,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Base line
        ctx.beginPath();
        ctx.moveTo(dx - dr, dy);
        ctx.lineTo(dx + dr, dy);
        ctx.strokeStyle = "rgba(100,200,255,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Pulse light
        const pulse = (Math.sin(t * 2 + d.x * 10) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(dx, dy + dr * 0.8, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,150,${0.4 + pulse * 0.6})`;
        ctx.fill();
      });

      // Rovers
      for (let r = 0; r < 3; r++) {
        const rx = ((W * 0.2 * r + t * 8) % W * 0.9) + W * 0.05;
        const ry = H * 0.66 + Math.sin(rx * 0.02) * 4;
        ctx.fillStyle = "rgba(200,180,150,0.7)";
        ctx.fillRect(rx - 12, ry - 5, 24, 8);
        ctx.fillRect(rx - 8, ry - 10, 16, 6);
        ctx.fillStyle = "rgba(0,200,255,0.5)";
        ctx.fillRect(rx - 3, ry - 12, 6, 3);
      }

      // Atmospheric haze
      const haze = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.72);
      haze.addColorStop(0, "rgba(200,80,20,0)");
      haze.addColorStop(0.5, "rgba(200,80,20,0.12)");
      haze.addColorStop(1, "rgba(200,80,20,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, H * 0.55, W, H * 0.2);

      t += 0.008;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="mars" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* HUD overlays */}
      <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
        {[
          { label: "◉ COLONY STATUS", val: "ACTIVE", color: "#00ff88" },
          { label: "◉ ATMOSPHERE", val: "0.6% O₂", color: "#ff8844" },
          { label: "◉ POPULATION", val: "847,000", color: "#00f5ff" },
          { label: "◉ TEMP", val: "-63°C AVG", color: "#4488ff" },
        ].map((item) => (
          <div
            key={item.label}
            className="font-mono text-[10px] px-3 py-2 border"
            style={{
              color: item.color,
              borderColor: `${item.color}33`,
              background: `${item.color}08`,
              letterSpacing: "0.15em",
            }}
          >
            {item.label}: {item.val}
          </div>
        ))}
      </div>

      {/* Radar */}
      <div className="absolute top-8 right-8 z-10 w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,100,50,0.2)" strokeWidth="1" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,100,50,0.15)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="rgba(255,100,50,0.1)" strokeWidth="0.5" />
          <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255,100,50,0.1)" strokeWidth="0.5" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255,100,50,0.1)" strokeWidth="0.5" />
          <g style={{ animation: "scan 4s linear infinite", transformOrigin: "50px 50px" }}>
            <line x1="50" y1="50" x2="50" y2="4" stroke="rgba(255,120,50,0.7)" strokeWidth="1.5" />
          </g>
          {[{x:35,y:40},{x:65,y:55},{x:45,y:70}].map((p,i)=>(
            <circle key={i} cx={p.x} cy={p.y} r="2" fill="rgba(0,255,100,0.8)" />
          ))}
        </svg>
      </div>

      {/* Central quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <div className="font-mono text-[11px] text-red-400/60 tracking-[0.3em] uppercase mb-6">
          ◈ YEAR 2157 · MARTIAN COLONY ALPHA
        </div>
        <h2
          className="font-orbitron font-black text-white leading-tight"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
        >
          MARS IS NOT AN ESCAPE.
          <span
            className="block mt-2"
            style={{ color: "#ff6633", textShadow: "0 0 30px rgba(255,100,50,0.5)" }}
          >
            IT IS A NEW BEGINNING.
          </span>
        </h2>
        <p className="font-exo text-white/35 mt-6 text-base md:text-lg leading-relaxed">
          Humanity&apos;s first multi-planetary civilization. 847,000 souls breathe recycled air
          beneath dome habitats, building a future that Earth alone could not contain.
        </p>
      </motion.div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-red-400/10 bg-black/40 backdrop-blur-sm px-6 py-3 flex justify-between">
        {[
          { l: "Sols on Mars", v: "38,420" },
          { l: "Active Domes", v: "47" },
          { l: "Energy Output", v: "2.4 TW" },
          { l: "Mission Status", v: "NOMINAL" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-orbitron text-sm font-bold text-red-300/80">{s.v}</div>
            <div className="font-mono text-[9px] text-white/25 tracking-widest uppercase mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-6 font-mono text-[10px] text-white/20">
        03 · MARS COLONY
      </div>
    </section>
  );
}
