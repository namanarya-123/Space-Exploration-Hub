"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ISSSection() {
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

    // Signal particles
    const signals: { x: number; y: number; r: number; maxR: number; alpha: number; speed: number }[] = [];
    let sigTimer = 0;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep space BG
      ctx.fillStyle = "#000008";
      ctx.fillRect(0, 0, W, H);
      const bgG = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H) * 0.7);
      bgG.addColorStop(0, "rgba(0,10,30,0.8)"); bgG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 500; i++) {
        const sx = ((i * 73.13) % 1) * W, sy = ((i * 47.77) % 1) * H;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.5 + i * 0.3);
        ctx.globalAlpha = (0.2 + ((i * 31.7) % 1) * 0.7) * pulse;
        ctx.fillStyle = i % 20 === 0 ? "#4db5ff" : "#fff";
        ctx.beginPath(); ctx.arc(sx, sy, 0.4 + ((i * 11.3) % 1) * 1.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Earth (large, below)
      const eX = W * 0.5, eY = H * 0.85, eR = H * 0.55;
      const earthG = ctx.createRadialGradient(eX - eR * 0.25, eY - eR * 0.25, eR * 0.05, eX, eY, eR);
      earthG.addColorStop(0, "#5ec0ff"); earthG.addColorStop(0.15, "#1a6bcc");
      earthG.addColorStop(0.5, "#0d3d6b"); earthG.addColorStop(0.85, "#051e38"); earthG.addColorStop(1, "#000");
      ctx.save(); ctx.beginPath(); ctx.arc(eX, eY, eR, 0, Math.PI * 2);
      ctx.fillStyle = earthG; ctx.fill(); ctx.clip();
      // continents
      for (let c = 0; c < 5; c++) {
        const ca = (c / 5) * Math.PI * 2 + t * 0.006;
        const cr = eR * (0.3 + ((c * 37) % 10) / 10 * 0.45);
        ctx.beginPath();
        ctx.ellipse(eX + Math.cos(ca) * cr, eY + Math.sin(ca) * cr * 0.7, eR * 0.22 + ((c * 13) % 10) / 10 * eR * 0.2, eR * 0.1, ca, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,110,34,0.55)"; ctx.fill();
      }
      // cloud bands
      for (let cl = 0; cl < 4; cl++) {
        const ca = (cl / 4) * Math.PI * 2 + t * 0.01;
        ctx.beginPath();
        ctx.ellipse(eX + Math.cos(ca) * eR * 0.55, eY + Math.sin(ca) * eR * 0.4, eR * 0.4, eR * 0.09, ca, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fill();
      }
      ctx.restore();
      // atmosphere
      const atmG = ctx.createRadialGradient(eX, eY, eR * 0.94, eX, eY, eR * 1.12);
      atmG.addColorStop(0, "rgba(0,0,0,0)"); atmG.addColorStop(0.5, "rgba(100,190,255,0.3)"); atmG.addColorStop(1, "rgba(100,190,255,0)");
      ctx.beginPath(); ctx.arc(eX, eY, eR * 1.12, 0, Math.PI * 2); ctx.fillStyle = atmG; ctx.fill();

      // ISS orbit path
      const issOrbitY = H * 0.32, issOrbitRx = W * 0.38, issOrbitRy = W * 0.07;
      ctx.beginPath(); ctx.ellipse(W * 0.5, issOrbitY, issOrbitRx, issOrbitRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,245,255,0.06)"; ctx.lineWidth = 1; ctx.stroke();

      // ISS position
      const issAngle = t * 0.25;
      const issX = W * 0.5 + Math.cos(issAngle) * issOrbitRx;
      const issY = issOrbitY + Math.sin(issAngle) * issOrbitRy;

      // Draw ISS
      ctx.save();
      ctx.translate(issX, issY);
      ctx.rotate(issAngle - Math.PI / 6);

      // Main truss
      const trussW = 80, trussH = 6;
      const trussG = ctx.createLinearGradient(-trussW / 2, 0, trussW / 2, 0);
      trussG.addColorStop(0, "rgba(180,180,180,0.6)"); trussG.addColorStop(0.5, "rgba(220,220,220,0.9)"); trussG.addColorStop(1, "rgba(180,180,180,0.6)");
      ctx.fillStyle = trussG; ctx.fillRect(-trussW / 2, -trussH / 2, trussW, trussH);

      // Habitat modules
      [[-20, 0, 22, 11], [-4, 0, 16, 11], [9, 0, 14, 11]].forEach(([mx, my, mw, mh]) => {
        const modG = ctx.createRadialGradient(mx + mw * 0.25, my, 0, mx, my, mw);
        modG.addColorStop(0, "rgba(230,230,225,0.9)"); modG.addColorStop(1, "rgba(150,150,145,0.7)");
        ctx.fillStyle = modG; ctx.beginPath(); ctx.roundRect(mx, my - mh / 2, mw, mh, 3); ctx.fill();
        // windows
        for (let w = 0; w < 3; w++) {
          ctx.beginPath(); ctx.arc(mx + 4 + w * 6, my, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(150,220,255,0.6)"; ctx.fill();
        }
      });

      // Solar panels (4 pairs)
      const panelPositions = [[-36, -1], [-14, -1], [14, -1], [34, -1]];
      panelPositions.forEach(([px], pi) => {
        const panelGlow = Math.sin(t * 0.8 + pi) * 0.1;
        const panelColor = `rgba(20,80,160,${0.8 + panelGlow})`;
        // top panel
        ctx.fillStyle = panelColor;
        ctx.fillRect(px - 1, -26, 3, 22);
        ctx.fillStyle = "rgba(30,100,200,0.7)";
        ctx.fillRect(px - 11, -26, 22, 10);
        // panel grid lines
        ctx.strokeStyle = "rgba(80,150,255,0.5)"; ctx.lineWidth = 0.5;
        for (let gl = 0; gl < 4; gl++) {
          ctx.beginPath(); ctx.moveTo(px - 11 + gl * 6, -26); ctx.lineTo(px - 11 + gl * 6, -16); ctx.stroke();
        }
        // bottom panel
        ctx.fillStyle = panelColor;
        ctx.fillRect(px - 1, 4, 3, 22);
        ctx.fillStyle = "rgba(30,100,200,0.7)";
        ctx.fillRect(px - 11, 16, 22, 10);
        for (let gl = 0; gl < 4; gl++) {
          ctx.beginPath(); ctx.moveTo(px - 11 + gl * 6, 16); ctx.lineTo(px - 11 + gl * 6, 26); ctx.stroke();
        }
        // sun reflection glint
        const glint = Math.sin(t * 2 + pi * 0.7) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,255,200,${glint * 0.3})`;
        ctx.fillRect(px - 11, -26, 22, 2);
      });

      // Radiator panels
      ctx.fillStyle = "rgba(200,210,220,0.6)";
      [[-20, -3], [10, -3]].forEach(([rx, ry]) => {
        ctx.fillRect(rx, -18 + ry, 8, 14);
      });

      ctx.restore();

      // ISS glow
      const issGlow = ctx.createRadialGradient(issX, issY, 5, issX, issY, 30);
      issGlow.addColorStop(0, "rgba(150,200,255,0.15)"); issGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(issX, issY, 30, 0, Math.PI * 2); ctx.fillStyle = issGlow; ctx.fill();

      // Signal circles from ISS
      sigTimer++;
      if (sigTimer > 60) { sigTimer = 0; signals.push({ x: issX, y: issY, r: 0, maxR: 60, alpha: 0.6, speed: 0.8 }); }
      signals.forEach((s, i) => {
        s.r += s.speed; s.alpha = 0.6 * (1 - s.r / s.maxR);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,245,255,${s.alpha})`; ctx.lineWidth = 1; ctx.stroke();
      });
      for (let i = signals.length - 1; i >= 0; i--) { if (signals[i].r >= signals[i].maxR) signals.splice(i, 1); }

      // Orbit progress HUD
      const orbPct = ((t * 0.25 / (Math.PI * 2)) % 1);
      ctx.strokeStyle = "rgba(0,245,255,0.3)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(W - 50, 50, 25, -Math.PI / 2, -Math.PI / 2 + orbPct * Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(0,245,255,0.6)"; ctx.font = "9px monospace";
      ctx.fillText("ORB", W - 61, 53);

      t += 0.008;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const countries = ["🇺🇸 USA", "🇷🇺 Russia", "🇯🇵 Japan", "🇨🇦 Canada", "🇪🇺 ESA (11 nations)"];

  return (
    <section id="iss" className="relative min-h-screen overflow-hidden" style={{ background: "#000" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* HUD */}
      <div className="absolute top-8 left-8 z-10 space-y-1">
        {[
          { l: "◉ ALTITUDE", v: "408 KM", c: "#00f5ff" },
          { l: "◉ SPEED", v: "27,600 KM/H", c: "#00f5ff" },
          { l: "◉ CREW", v: "7 ASTRONAUTS", c: "#00ff88" },
          { l: "◉ ORBIT PERIOD", v: "92 MINUTES", c: "#00f5ff" },
        ].map(tag => (
          <div key={tag.l} className="font-mono text-[10px] px-3 py-1.5 border"
            style={{ color: tag.c, borderColor: tag.c + "33", background: tag.c + "08", letterSpacing: "0.15em" }}>
            {tag.l}: {tag.v}
          </div>
        ))}
      </div>

      {/* Content — right panel */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 py-24">
        <div className="ml-auto max-w-sm mr-8 md:mr-16">
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <div className="font-mono text-[11px] text-cyan-400/60 tracking-[0.3em] uppercase mb-3">
              ◈ INTERNATIONAL SPACE STATION
            </div>
            <h2 className="font-orbitron font-black text-white leading-tight mb-3"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", textShadow: "0 0 30px rgba(0,245,255,0.25)" }}>
              HUMANITY'S<br />
              <span style={{ color: "#00f5ff" }}>OUTPOST</span><br />
              IN ORBIT
            </h2>
            <div className="h-px mb-4" style={{ background: "linear-gradient(90deg,#00f5ff80,transparent)" }} />
            <p className="font-exo text-white/35 text-sm leading-relaxed mb-6">
              Continuously inhabited since November 2000, the ISS is the largest structure humanity has ever placed in space — a football-field-sized laboratory orbiting Earth 16 times a day.
            </p>

            {/* Partner nations */}
            <div className="font-mono text-[10px] text-cyan-400/50 tracking-[0.2em] uppercase mb-2">PARTNER NATIONS</div>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {countries.map(c => (
                <span key={c} className="font-mono text-[10px] border border-white/10 px-2 py-1 text-white/40">{c}</span>
              ))}
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "24+", l: "Years in orbit" },
                { v: "3,000+", l: "Experiments run" },
                { v: "240+", l: "Astronauts visited" },
                { v: "420,000 kg", l: "Total mass" },
              ].map(s => (
                <div key={s.l} className="border border-cyan-400/15 p-3" style={{ background: "rgba(0,245,255,0.04)" }}>
                  <div className="font-orbitron text-lg font-black text-cyan-300">{s.v}</div>
                  <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">04 · ISS</div>
    </section>
  );
}
