"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function BlackHoleSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const shakeRef = useRef(0);

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

    // Generate fixed background stars for lensing
    const bgStars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      brightness: Math.random(),
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const shake = shakeRef.current;
      const cx = W / 2 + Math.sin(t * 1.3) * shake;
      const cy = H / 2 + Math.cos(t * 0.9) * shake;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H));
      bg.addColorStop(0, "#0d0020");
      bg.addColorStop(0.3, "#07000f");
      bg.addColorStop(1, "#000000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Gravitationally lensed stars
      bgStars.forEach((s) => {
        const sx = s.x * W, sy = s.y * H;
        const dx = sx - cx, dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const bhRadius = Math.min(W, H) * 0.12;
        const lensRadius = bhRadius * 3.5;

        // Gravitational lensing distortion
        let drawX = sx, drawY = sy;
        if (dist < lensRadius && dist > bhRadius) {
          const lensStrength = Math.pow((lensRadius - dist) / lensRadius, 2) * bhRadius * 1.2;
          const angle = Math.atan2(dy, dx);
          drawX = sx - Math.cos(angle) * lensStrength;
          drawY = sy - Math.sin(angle) * lensStrength;
        }

        if (dist > bhRadius * 0.9) {
          const brightness = dist < lensRadius
            ? s.brightness * (0.3 + (dist / lensRadius) * 0.7)
            : s.brightness;
          ctx.globalAlpha = brightness * 0.7;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
          ctx.fill();
          // Streak effect near BH
          if (dist < lensRadius * 1.2 && dist > bhRadius * 1.5) {
            const streakLen = (lensRadius - dist) / lensRadius * 15;
            const angle = Math.atan2(dy, dx);
            ctx.globalAlpha = brightness * 0.25;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(drawX + Math.cos(angle + Math.PI / 2) * streakLen, drawY + Math.sin(angle + Math.PI / 2) * streakLen);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = s.r;
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1;

      // Outer glow rings
      for (let i = 8; i >= 1; i--) {
        const ri = i * 28 + Math.sin(t * 0.5 + i) * 3;
        const grd = ctx.createRadialGradient(cx, cy, ri * 0.6, cx, cy, ri * 1.1);
        const alpha = 0.015 * i;
        grd.addColorStop(0, `rgba(160, 40, 255, ${alpha})`);
        grd.addColorStop(0.5, `rgba(80, 0, 200, ${alpha * 0.5})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, ri * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Photon sphere
      const photonR = Math.min(W, H) * 0.075;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, photonR * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 100, 255, ${0.15 + Math.sin(t) * 0.05})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Accretion disk
      const diskInner = photonR * 1.4;
      const diskOuter = photonR * 4.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.22);
      for (let r = diskInner; r < diskOuter; r += 2.5) {
        const t_factor = (r - diskInner) / (diskOuter - diskInner);
        const hue = 260 + t_factor * 80; // purple to gold
        const lightness = 70 - t_factor * 40;
        const alpha = (0.55 - t_factor * 0.5) * (0.8 + Math.sin(t * 2 + r * 0.1) * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = 2.8;
        ctx.stroke();
      }
      // Disk hotspot (doppler brightening)
      const hotspotAngle = t * 1.5;
      const hotspotR = diskInner * 1.6;
      const hx = Math.cos(hotspotAngle) * hotspotR;
      const hy = Math.sin(hotspotAngle) * hotspotR;
      const hgrd = ctx.createRadialGradient(hx, hy, 0, hx, hy, 30);
      hgrd.addColorStop(0, "rgba(255, 220, 150, 0.5)");
      hgrd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hgrd;
      ctx.beginPath();
      ctx.arc(hx, hy, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Event horizon — perfect black circle
      const ehGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, photonR * 1.25);
      ehGrd.addColorStop(0, "#000000");
      ehGrd.addColorStop(0.85, "#000000");
      ehGrd.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.beginPath();
      ctx.arc(cx, cy, photonR * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = ehGrd;
      ctx.fill();

      // Relativistic jets
      for (let side = -1; side <= 1; side += 2) {
        for (let p = 0; p < 18; p++) {
          const jt = (t * 1.5 + p * 0.35) % 8;
          const jy = cy + side * jt * (H * 0.025);
          const jx = cx + (Math.random() - 0.5) * 6;
          const alpha = Math.max(0, 0.6 - jt * 0.07);
          ctx.beginPath();
          ctx.arc(jx, jy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 120, 255, ${alpha})`;
          ctx.fill();
        }
      }

      // Infalling matter streams
      for (let i = 0; i < 3; i++) {
        const streamAngle = (i / 3) * Math.PI * 2 + t * 0.4;
        const streamR = photonR * (3 + Math.sin(t + i) * 0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, streamR, streamAngle, streamAngle + 0.8);
        ctx.strokeStyle = `rgba(255, 180, 100, ${0.25 + i * 0.05})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      shakeRef.current = Math.max(0, shakeRef.current - 0.15);
      t += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Shake on scroll into view
  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("blackhole");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        shakeRef.current = progress * 10;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="blackhole"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #1a0040 0%, #000 70%)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Quantum data overlay */}
      <div className="absolute top-8 left-8 z-10 font-mono text-[10px] text-purple-400/50 space-y-1">
        <div>MASS: 4.2 × 10⁶ M☉</div>
        <div>SPIN: 0.998 a/M</div>
        <div>TEMP: 1.4 × 10⁻¹⁴ K</div>
        <div>HAWKING RAD: MINIMAL</div>
      </div>

      {/* Gravitational warning */}
      <div className="absolute top-8 right-8 z-10 font-mono text-[10px] text-red-400/60 text-right space-y-1">
        <div className="animate-pulse">⚠ TIDAL FORCES: EXTREME</div>
        <div>ESCAPE VELOCITY: &gt;c</div>
        <div>TIME DILATION: ∞</div>
        <div>SPAGHETTIFICATION: ACTIVE</div>
      </div>

      {/* Central text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <div className="font-mono text-[11px] text-purple-400/60 tracking-[0.3em] uppercase mb-8">
          ◈ SAGITTARIUS A* · EVENT HORIZON PROXIMITY
        </div>
        <h2
          className="font-orbitron font-black text-white leading-tight"
          style={{
            fontSize: "clamp(2rem, 6vw, 5rem)",
            textShadow: "0 0 40px rgba(139,0,255,0.4)",
          }}
        >
          SPACE AND TIME
          <span
            className="block mt-2"
            style={{ color: "#a855f7", textShadow: "0 0 30px rgba(168,85,247,0.6)" }}
          >
            LOSE MEANING HERE.
          </span>
        </h2>
        <p className="font-exo text-white/30 mt-6 text-base leading-relaxed max-w-lg mx-auto">
          At the boundary of a black hole, the laws of physics unravel. Light bends, 
          time stretches, and the universe reveals its deepest secrets — then swallows them whole.
        </p>
      </motion.div>

      {/* Bottom physics bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-purple-400/10 bg-black/50 backdrop-blur-sm px-6 py-3 flex justify-between">
        {[
          { l: "Schwarzschild Radius", v: "12.4 km" },
          { l: "Orbital Period", v: "∞" },
          { l: "Information Paradox", v: "UNRESOLVED" },
          { l: "Singularity", v: "DETECTED" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-orbitron text-sm font-bold text-purple-300/80">{s.v}</div>
            <div className="font-mono text-[9px] text-white/20 tracking-widest uppercase mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-6 font-mono text-[10px] text-white/20">
        04 · EVENT HORIZON
      </div>
    </section>
  );
}
