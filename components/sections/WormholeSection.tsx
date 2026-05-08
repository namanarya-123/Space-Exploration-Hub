"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function WormholeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(1);

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

    // Wormhole light streaks
    const streaks = Array.from({ length: 180 }, (_, i) => ({
      angle: (i / 180) * Math.PI * 2,
      length: 0.4 + Math.random() * 0.6,
      speed: 0.8 + Math.random() * 0.4,
      hue: Math.random() * 60 + 180, // cyan to blue range
      width: 0.5 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const speed = speedRef.current;

      // Motion blur trail
      ctx.fillStyle = `rgba(0, 0, 15, ${0.08 + speed * 0.015})`;
      ctx.fillRect(0, 0, W, H);

      const maxR = Math.sqrt(cx * cx + cy * cy);
      const tunnelNear = 60 + speed * 15;

      // Tunnel rings
      const ringCount = 12;
      for (let r = 0; r < ringCount; r++) {
        const ringR = tunnelNear + ((r / ringCount) * (maxR - tunnelNear));
        const pulse = Math.sin(t * 2.5 - r * 0.6) * 0.5 + 0.5;
        const alpha = (0.18 - (r / ringCount) * 0.15) * pulse;
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringR, ringR * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Light streaks
      streaks.forEach((s) => {
        const a = s.angle + t * 0.03;
        const near = tunnelNear * 0.9;
        const far = maxR * s.length * (0.7 + speed * 0.25);

        const sx = cx + Math.cos(a) * near;
        const sy = cy + Math.sin(a) * near * 0.38;
        const ex = cx + Math.cos(a) * far;
        const ey = cy + Math.sin(a) * far * 0.38;

        const hue = (s.hue + t * 30) % 360;
        const alpha = (0.5 + speed * 0.15) * (0.7 + Math.sin(s.phase + t) * 0.3);

        const grad = ctx.createLinearGradient(sx, sy, ex, ey);
        grad.addColorStop(0, `hsla(${hue}, 100%, 80%, 0)`);
        grad.addColorStop(0.25, `hsla(${hue}, 100%, 80%, ${alpha})`);
        grad.addColorStop(0.7, `hsla(${hue}, 100%, 80%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${hue}, 100%, 80%, 0)`);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width * (0.8 + speed * 0.4);
        ctx.stroke();
      });

      // Central vortex
      const vortexR = tunnelNear * 0.8;
      for (let i = 0; i < 3; i++) {
        const vgrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, vortexR);
        vgrd.addColorStop(0, `rgba(200, 240, 255, ${0.6 + Math.sin(t * 3 + i) * 0.2})`);
        vgrd.addColorStop(0.4, `rgba(0, 200, 255, ${0.3})`);
        vgrd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.ellipse(cx, cy, vortexR, vortexR * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = vgrd;
        ctx.fill();
      }

      // Spacetime distortion particles
      for (let i = 0; i < 40; i++) {
        const pa = (i / 40) * Math.PI * 2 + t * 0.8;
        const pr = tunnelNear * 0.5 + Math.sin(t * 2 + i) * tunnelNear * 0.3;
        const px = cx + Math.cos(pa) * pr;
        const py = cy + Math.sin(pa) * pr * 0.38;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(t * 3 + i) * 0.2})`;
        ctx.fill();
      }

      // Color aberration glow at center
      [
        { r: 255, g: 50, b: 50 },
        { r: 50, g: 255, b: 200 },
        { r: 100, g: 100, b: 255 },
      ].forEach((c, i) => {
        const offset = { x: Math.sin(t * 2 + (i * Math.PI * 2) / 3) * (5 + speed * 3), y: Math.cos(t * 2 + (i * Math.PI * 2) / 3) * (3 + speed * 2) };
        const cgrd = ctx.createRadialGradient(cx + offset.x, cy + offset.y, 0, cx + offset.x, cy + offset.y, 40 + speed * 10);
        cgrd.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.15)`);
        cgrd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(cx + offset.x, cy + offset.y, 40 + speed * 10, 0, Math.PI * 2);
        ctx.fillStyle = cgrd;
        ctx.fill();
      });

      t += 0.018;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Speed up on scroll
  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("wormhole");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        speedRef.current = 1 + progress * 9;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="wormhole"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #001a3d 0%, #000 70%)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* HUD overlays */}
      <div className="absolute top-8 left-8 z-10 font-mono text-[10px] text-cyan-400/50 space-y-1">
        <div>TRANSIT TYPE: EINSTEIN-ROSEN BRIDGE</div>
        <div>DESTINATION: ANDROMEDA SECTOR</div>
        <div>SPACETIME CURVATURE: EXTREME</div>
        <div className="animate-pulse text-yellow-400/60">⚠ TEMPORAL COHERENCE: UNSTABLE</div>
      </div>

      <div className="absolute top-8 right-8 z-10 font-mono text-[10px] text-cyan-400/40 text-right space-y-1">
        <div>ETA: ∞ / 0 (SIMULTANEOUS)</div>
        <div>DISTANCE COMPRESSED: 2.5M LY → 0</div>
        <div>QUANTUM ENTANGLEMENT: ACTIVE</div>
        <div>HULL INTEGRITY: 94.7%</div>
      </div>

      {/* Center text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6"
      >
        <div className="font-mono text-[11px] text-cyan-400/50 tracking-[0.3em] uppercase mb-6">
          ◈ WORMHOLE TRANSIT · ETA: ∞
        </div>
        <h2
          className="font-orbitron font-black text-white leading-tight"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          TRAVERSING
          <span
            className="block"
            style={{ color: "#00f5ff", textShadow: "0 0 40px rgba(0,245,255,0.5)" }}
          >
            SPACETIME
          </span>
        </h2>
        <p className="font-exo text-white/30 mt-6 text-base max-w-md mx-auto leading-relaxed">
          The fabric of space folds. Distance collapses. Two points in the cosmos — 
          separated by millions of light years — become one.
        </p>
      </motion.div>

      {/* Speed gauge */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="font-mono text-[10px] text-cyan-400/40 tracking-widest">WARP VELOCITY</div>
        <div className="w-48 h-[2px] bg-white/5 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-cyan-400"
            style={{
              width: "60%",
              boxShadow: "0 0 10px #00f5ff",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <div className="font-orbitron text-xs text-cyan-400/60">0.99c</div>
      </div>

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">
        05 · WORMHOLE TRANSIT
      </div>
    </section>
  );
}
