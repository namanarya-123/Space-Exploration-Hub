"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function FutureSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();

    // Network nodes (AI/civilization nodes)
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 3 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      hue: Math.random() > 0.7 ? 270 + Math.random() * 30 : 185 + Math.random() * 30,
    }));

    // Flying ships
    const ships = Array.from({ length: 12 }, () => ({
      x: Math.random(),
      y: 0.3 + Math.random() * 0.4,
      speed: 0.0005 + Math.random() * 0.001,
      size: Math.random() * 6 + 3,
      trail: [] as { x: number; y: number }[],
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep space city background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#000005");
      bg.addColorStop(0.5, "#000010");
      bg.addColorStop(1, "#000020");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Orbital ring megastructure
      ctx.save();
      ctx.translate(W / 2, H * 0.4);
      ctx.scale(1, 0.25);
      for (let i = 0; i < 3; i++) {
        const ringR = W * (0.35 + i * 0.12);
        const ringAlpha = 0.12 - i * 0.03;
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 245, 255, ${ringAlpha})`;
        ctx.lineWidth = 2 + i * 0.5;
        ctx.stroke();
        // Ring nodes
        for (let n = 0; n < 8 + i * 4; n++) {
          const na = (n / (8 + i * 4)) * Math.PI * 2 + t * (0.05 - i * 0.01);
          const nx = Math.cos(na) * ringR;
          const ny = Math.sin(na) * ringR;
          ctx.beginPath();
          ctx.arc(nx, ny, 4 + i * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 245, 255, ${0.4 - i * 0.1})`;
          ctx.fill();
        }
      }
      ctx.restore();

      // City skyline (megastructures)
      const buildings = [
        { x: 0.05, h: 0.35, w: 0.04 },
        { x: 0.1, h: 0.5, w: 0.035 },
        { x: 0.15, h: 0.4, w: 0.05 },
        { x: 0.2, h: 0.6, w: 0.03 },
        { x: 0.25, h: 0.45, w: 0.04 },
        { x: 0.3, h: 0.7, w: 0.04 },
        { x: 0.36, h: 0.55, w: 0.03 },
        { x: 0.4, h: 0.8, w: 0.05 },
        { x: 0.46, h: 0.65, w: 0.035 },
        { x: 0.52, h: 0.75, w: 0.04 },
        { x: 0.58, h: 0.5, w: 0.03 },
        { x: 0.63, h: 0.68, w: 0.045 },
        { x: 0.69, h: 0.58, w: 0.035 },
        { x: 0.74, h: 0.72, w: 0.04 },
        { x: 0.79, h: 0.45, w: 0.03 },
        { x: 0.83, h: 0.62, w: 0.05 },
        { x: 0.89, h: 0.38, w: 0.04 },
        { x: 0.93, h: 0.52, w: 0.035 },
      ];

      buildings.forEach((b) => {
        const bx = b.x * W;
        const bh = b.h * H * 0.35;
        const bw = b.w * W;
        const by = H - bh;

        // Building body
        const bgrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        bgrad.addColorStop(0, "rgba(0, 20, 60, 0.9)");
        bgrad.addColorStop(1, "rgba(0, 5, 20, 0.95)");
        ctx.fillStyle = bgrad;
        ctx.fillRect(bx, by, bw, bh);

        // Neon edge glow
        ctx.strokeStyle = "rgba(0, 245, 255, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, by, bw, bh);

        // Windows
        const winCols = Math.floor(bw / 8);
        const winRows = Math.floor(bh / 12);
        for (let wr = 0; wr < winRows; wr++) {
          for (let wc = 0; wc < winCols; wc++) {
            if (Math.random() > 0.6) {
              const wx = bx + wc * 8 + 2;
              const wy = by + wr * 12 + 3;
              const winHue = Math.random() > 0.8 ? 280 : Math.random() > 0.5 ? 185 : 60;
              ctx.fillStyle = `hsla(${winHue}, 80%, 70%, ${0.4 + Math.sin(t * 2 + wr + wc) * 0.15})`;
              ctx.fillRect(wx, wy, 4, 5);
            }
          }
        }

        // Top beacon
        const beaconAlpha = 0.5 + Math.sin(t * 3 + b.x * 20) * 0.4;
        ctx.beginPath();
        ctx.arc(bx + bw / 2, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 50, 50, ${beaconAlpha})`;
        ctx.fill();
      });

      // Ground glow
      const groundGlow = ctx.createLinearGradient(0, H * 0.7, 0, H);
      groundGlow.addColorStop(0, "rgba(0, 40, 100, 0.3)");
      groundGlow.addColorStop(0.5, "rgba(0, 20, 60, 0.5)");
      groundGlow.addColorStop(1, "rgba(0, 0, 20, 0.8)");
      ctx.fillStyle = groundGlow;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);

      // AI network connections between nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > 1) node.vx *= -1;
        if (node.y < 0.05 || node.y > 0.65) node.vy *= -1;

        const nx = node.x * W, ny = node.y * H;

        // Connections to nearby nodes
        nodes.forEach((other) => {
          const ox = other.x * W, oy = other.y * H;
          const dist = Math.hypot(nx - ox, ny - oy);
          if (dist < 150 && dist > 0) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = `hsla(${node.hue}, 100%, 70%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Node
        node.pulse += 0.03;
        const pulseAlpha = 0.4 + Math.sin(node.pulse) * 0.3;
        const nodeGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.r * 3);
        nodeGrad.addColorStop(0, `hsla(${node.hue}, 100%, 80%, ${pulseAlpha})`);
        nodeGrad.addColorStop(1, `hsla(${node.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(nx, ny, node.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(nx, ny, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.hue}, 100%, 85%, ${pulseAlpha + 0.2})`;
        ctx.fill();
      });

      // Flying ships with trails
      ships.forEach((ship) => {
        ship.x += ship.speed;
        if (ship.x > 1.1) {
          ship.x = -0.1;
          ship.y = 0.3 + Math.random() * 0.35;
          ship.trail = [];
        }

        const sx = ship.x * W, sy = ship.y * H;
        ship.trail.push({ x: sx, y: sy });
        if (ship.trail.length > 30) ship.trail.shift();

        // Trail
        ship.trail.forEach((tp, ti) => {
          const ta = (ti / ship.trail.length) * 0.4;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, ship.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 200, 255, ${ta})`;
          ctx.fill();
        });

        // Ship body
        ctx.save();
        ctx.translate(sx, sy);
        ctx.fillStyle = "rgba(150, 220, 255, 0.9)";
        ctx.beginPath();
        ctx.moveTo(ship.size, 0);
        ctx.lineTo(-ship.size * 0.6, -ship.size * 0.4);
        ctx.lineTo(-ship.size * 0.3, 0);
        ctx.lineTo(-ship.size * 0.6, ship.size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

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

  const civilizationStats = [
    { val: "847", label: "Colonies", color: "#00f5ff" },
    { val: "12B", label: "Colonists", color: "#8b00ff" },
    { val: "3,200", label: "Active Ships", color: "#ffd700" },
    { val: "∞", label: "Possibilities", color: "#00ff88" },
  ];

  return (
    <section
      id="future"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #000d1a 0%, #000 70%)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl"
        >
          <div className="font-mono text-[11px] text-cyan-400/60 tracking-[0.3em] uppercase mb-6">
            ◈ YEAR 2247 · INTERSTELLAR CIVILIZATION
          </div>

          <h2
            className="font-orbitron font-black text-white leading-tight mb-6"
            style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)" }}
          >
            HUMANITY BECOMES
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #00f5ff, #8b00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              INTERSTELLAR
            </span>
          </h2>

          <p className="font-exo text-white/35 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Orbital cities orbit distant suns. Megastructures span solar systems. 
            The AI network connects 847 colonies across 12 star systems. 
            The universe is no longer vast — it is home.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
            {civilizationStats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="border p-4 text-center"
                style={{
                  borderColor: `${s.color}33`,
                  background: `${s.color}08`,
                }}
              >
                <div
                  className="font-orbitron text-2xl font-black"
                  style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}
                >
                  {s.val}
                </div>
                <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technology cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left max-w-3xl mx-auto">
            {[
              {
                icon: "◉",
                title: "DYSON SWARMS",
                desc: "Harvesting 100% of stellar output through engineered megastructures orbiting 6 stars.",
                color: "#ffd700",
              },
              {
                icon: "◈",
                title: "NEURAL MESH",
                desc: "8 trillion minds connected through quantum-entangled consciousness networks.",
                color: "#00f5ff",
              },
              {
                icon: "◇",
                title: "GENERATION SHIPS",
                desc: "200 vessels en route to neighboring galaxies. ETA: 4.2 million years.",
                color: "#8b00ff",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-white/5 p-5 bg-white/[0.02] hover:border-white/10 transition-colors"
              >
                <div className="font-mono text-lg mb-2" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="font-orbitron text-sm font-bold text-white mb-2">{card.title}</div>
                <p className="font-exo text-white/30 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">
        06 · INTERSTELLAR CIVILIZATION
      </div>
    </section>
  );
}
