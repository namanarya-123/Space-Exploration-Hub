"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const APOLLO_MISSIONS = [
  { mission: "Apollo 11", date: "Jul 20, 1969", crew: "Armstrong, Aldrin, Collins", note: "First humans on the Moon" },
  { mission: "Apollo 12", date: "Nov 19, 1969", crew: "Conrad, Bean, Gordon", note: "Precision landing near Surveyor 3" },
  { mission: "Apollo 14", date: "Feb 5, 1971", crew: "Shepard, Mitchell, Roosa", note: "Furthest walk from LM" },
  { mission: "Apollo 15", date: "Jul 30, 1971", crew: "Scott, Irwin, Worden", note: "First Lunar Roving Vehicle" },
  { mission: "Apollo 16", date: "Apr 21, 1972", crew: "Young, Duke, Mattingly", note: "Descartes Highlands landing" },
  { mission: "Apollo 17", date: "Dec 11, 1972", crew: "Cernan, Schmitt, Evans", note: "Last humans on the Moon" },
];

export default function MoonLandingSection() {
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

    // Dust particles
    const dust = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: 0.6 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: -Math.random() * 0.0002,
      r: Math.random() * 2 + 0.5, life: Math.random(),
    }));

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Starry sky
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      sky.addColorStop(0, "#000000");
      sky.addColorStop(0.6, "#050510");
      sky.addColorStop(1, "#0a0a18");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.65);

      // Stars
      for (let i = 0; i < 300; i++) {
        const sx = ((i * 73.13) % 1) * W, sy = ((i * 47.77) % 1) * H * 0.65;
        const pulse = 0.4 + 0.6 * Math.sin(t * 0.5 + i);
        ctx.globalAlpha = (0.3 + ((i * 31.7) % 1) * 0.7) * pulse;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(sx, sy, 0.5 + ((i * 11.3) % 1) * 1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Earth in sky (distant, glowing)
      const earthX = W * 0.8, earthY = H * 0.18, earthR = H * 0.12;
      const earthGlow = ctx.createRadialGradient(earthX, earthY, earthR * 0.8, earthX, earthY, earthR * 1.6);
      earthGlow.addColorStop(0, "rgba(30,100,200,0.15)"); earthGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = earthGlow; ctx.beginPath(); ctx.arc(earthX, earthY, earthR * 1.6, 0, Math.PI * 2); ctx.fill();
      const earthG = ctx.createRadialGradient(earthX - earthR * 0.3, earthY - earthR * 0.3, earthR * 0.05, earthX, earthY, earthR);
      earthG.addColorStop(0, "#6ec6ff"); earthG.addColorStop(0.2, "#1a6bcc");
      earthG.addColorStop(0.65, "#0d3d6b"); earthG.addColorStop(1, "#000");
      ctx.beginPath(); ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2); ctx.fillStyle = earthG; ctx.fill();
      // Earth atmosphere
      const atmE = ctx.createRadialGradient(earthX, earthY, earthR * 0.92, earthX, earthY, earthR * 1.12);
      atmE.addColorStop(0, "rgba(0,0,0,0)"); atmE.addColorStop(0.5, "rgba(100,190,255,0.25)"); atmE.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(earthX, earthY, earthR * 1.12, 0, Math.PI * 2); ctx.fillStyle = atmE; ctx.fill();

      // Moon surface gradient
      const surface = ctx.createLinearGradient(0, H * 0.6, 0, H);
      surface.addColorStop(0, "#2a2a2a"); surface.addColorStop(0.3, "#1e1e1e"); surface.addColorStop(1, "#111");
      ctx.fillStyle = surface; ctx.fillRect(0, H * 0.6, W, H * 0.4);

      // Surface horizon glow (sunlight)
      const horizonGlow = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.7);
      horizonGlow.addColorStop(0, "rgba(200,200,180,0.08)");
      horizonGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = horizonGlow; ctx.fillRect(0, H * 0.55, W, H * 0.15);

      // Craters on surface
      const craters = [
        { x: 0.1, y: 0.68, r: 0.04 }, { x: 0.3, y: 0.75, r: 0.025 },
        { x: 0.65, y: 0.7, r: 0.035 }, { x: 0.85, y: 0.72, r: 0.02 },
        { x: 0.5, y: 0.85, r: 0.05 }, { x: 0.15, y: 0.9, r: 0.03 },
      ];
      craters.forEach(cr => {
        const cx = cr.x * W, cy = cr.y * H, cr2 = cr.r * Math.min(W, H);
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr2);
        cg.addColorStop(0, "rgba(0,0,0,0.5)"); cg.addColorStop(0.8, "rgba(0,0,0,0.15)"); cg.addColorStop(1, "rgba(255,255,255,0.05)");
        ctx.beginPath(); ctx.arc(cx, cy, cr2, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();
        ctx.beginPath(); ctx.arc(cx - cr2 * 0.2, cy - cr2 * 0.2, cr2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200,200,190,0.12)"; ctx.lineWidth = 1.5; ctx.stroke();
      });

      // LM (Lunar Module) — schematic shape
      const lmX = W * 0.42, lmY = H * 0.57;
      ctx.save();
      ctx.translate(lmX, lmY);
      // legs
      [[-1, 1], [1, 1]].forEach(([dx]) => {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dx * 22, 18);
        ctx.strokeStyle = "rgba(200,190,170,0.7)"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(dx * 22, 19, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,190,170,0.5)"; ctx.fill();
      });
      // body
      ctx.fillStyle = "rgba(220,210,180,0.8)";
      ctx.fillRect(-14, -28, 28, 28);
      ctx.fillStyle = "rgba(180,170,140,0.6)";
      ctx.fillRect(-10, -38, 20, 12);
      // antenna
      ctx.beginPath(); ctx.moveTo(0, -38); ctx.lineTo(0, -52);
      ctx.strokeStyle = "rgba(200,200,200,0.8)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -52, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,200,0.6)"; ctx.fill();
      // window
      ctx.beginPath(); ctx.arc(-5, -20, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150,200,255,0.5)"; ctx.fill();
      ctx.restore();

      // Astronaut walking animation
      const astX = W * 0.54 + Math.sin(t * 0.4) * 8;
      const astY = H * 0.595;
      const walkPhase = t * 0.4;
      ctx.save();
      ctx.translate(astX, astY);
      // suit
      const sg = ctx.createRadialGradient(-2, -20, 0, 0, -15, 20);
      sg.addColorStop(0, "rgba(240,240,235,0.9)"); sg.addColorStop(1, "rgba(180,180,175,0.7)");
      ctx.fillStyle = sg;
      // torso
      ctx.beginPath(); ctx.roundRect(-10, -38, 20, 24, 4); ctx.fill();
      // helmet
      ctx.beginPath(); ctx.arc(0, -42, 12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(230,230,225,0.9)"; ctx.fill();
      // visor
      ctx.beginPath(); ctx.ellipse(3, -42, 8, 7, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180,140,40,0.7)"; ctx.fill();
      // backpack
      ctx.fillStyle = "rgba(200,200,195,0.8)";
      ctx.fillRect(8, -36, 8, 18);
      // legs
      [[-6, 1], [6, -1]].forEach(([dx, phase], li) => {
        const legAngle = Math.sin(walkPhase + li * Math.PI) * 0.25;
        ctx.save(); ctx.translate(dx, -15);
        ctx.rotate(legAngle);
        ctx.fillStyle = "rgba(220,220,215,0.85)";
        ctx.fillRect(-4, 0, 8, 22);
        ctx.restore();
      });
      // arms
      ctx.fillStyle = "rgba(220,220,215,0.8)";
      const armSwing = Math.sin(walkPhase) * 0.3;
      ctx.save(); ctx.translate(-10, -32); ctx.rotate(-armSwing - 0.3);
      ctx.fillRect(-3, 0, 6, 16); ctx.restore();
      ctx.save(); ctx.translate(10, -32); ctx.rotate(armSwing + 0.3);
      ctx.fillRect(-3, 0, 6, 16); ctx.restore();
      ctx.restore();

      // American flag
      const flagX = W * 0.48, flagY = H * 0.555;
      ctx.save(); ctx.translate(flagX, flagY);
      // pole
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -55);
      ctx.strokeStyle = "rgba(200,200,200,0.8)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -55); ctx.lineTo(30, -55);
      ctx.lineWidth = 1.5; ctx.stroke();
      // flag cloth with wave
      for (let fx = 0; fx < 30; fx++) {
        const wave = Math.sin((fx / 30) * Math.PI * 2 + t * 0.3) * 2;
        const fy = -54 + wave;
        const stripe = Math.floor(fx / 2.3) % 2;
        ctx.fillStyle = stripe === 0 ? "rgba(180,20,20,0.9)" : "rgba(220,220,220,0.9)";
        ctx.fillRect(fx, fy, 2, 18);
      }
      // stars field
      ctx.fillStyle = "rgba(20,30,120,0.8)";
      ctx.fillRect(0, -54, 13, 9);
      for (let s = 0; s < 6; s++) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillRect(1 + (s % 3) * 4, -53 + Math.floor(s / 3) * 4, 1.5, 1.5);
      }
      ctx.restore();

      // Footprints
      for (let fp = 0; fp < 8; fp++) {
        const fpx = W * 0.46 + fp * 12, fpy = H * 0.608 + Math.sin(fp * 0.9) * 2;
        ctx.save(); ctx.translate(fpx, fpy); ctx.rotate(fp % 2 === 0 ? 0.2 : -0.2);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath(); ctx.ellipse(0, 0, 3, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Moon dust particles
      dust.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        d.life -= 0.003;
        if (d.life <= 0) { d.x = 0.4 + Math.random() * 0.2; d.y = 0.62; d.life = Math.random(); }
        ctx.globalAlpha = d.life * 0.4;
        ctx.fillStyle = "#aaa";
        ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Sun rays from upper left
      const rayX = W * 0.02, rayY = H * 0.02;
      for (let r = 0; r < 5; r++) {
        const ra = 0.3 + r * 0.12;
        const rg = ctx.createLinearGradient(rayX, rayY, rayX + Math.cos(ra) * W, rayY + Math.sin(ra) * H);
        rg.addColorStop(0, "rgba(255,240,200,0.04)"); rg.addColorStop(1, "rgba(255,240,200,0)");
        ctx.beginPath(); ctx.moveTo(rayX, rayY);
        ctx.lineTo(rayX + Math.cos(ra - 0.05) * W * 2, rayY + Math.sin(ra - 0.05) * H * 2);
        ctx.lineTo(rayX + Math.cos(ra + 0.05) * W * 2, rayY + Math.sin(ra + 0.05) * H * 2);
        ctx.fillStyle = rg; ctx.fill();
      }

      t += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="moon-landing" className="relative overflow-hidden" style={{ background: "#000", minHeight: "100vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* HUD tags */}
      <div className="absolute top-8 left-8 z-10 space-y-1">
        {[
          { l: "◉ MISSION", v: "APOLLO 11", c: "#c8a882" },
          { l: "◉ DATE", v: "JUL 20, 1969", c: "#c8a882" },
          { l: "◉ LOCATION", v: "SEA OF TRANQUILITY", c: "#c8a882" },
          { l: "◉ STATUS", v: "MISSION SUCCESSFUL", c: "#00ff88" },
        ].map(tag => (
          <div key={tag.l} className="font-mono text-[10px] px-3 py-1.5 border"
            style={{ color: tag.c, borderColor: tag.c + "33", background: tag.c + "08", letterSpacing: "0.15em" }}>
            {tag.l}: {tag.v}
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-24">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1 }} className="text-center max-w-3xl mb-10">
          <div className="font-mono text-[11px] text-amber-400/60 tracking-[0.3em] uppercase mb-4">
            ◈ JULY 20, 1969 · MARE TRANQUILLITATIS
          </div>
          <h2 className="font-orbitron font-black text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem,6vw,4.5rem)", textShadow: "0 0 40px rgba(200,168,130,0.3)" }}>
            ONE SMALL STEP
            <span className="block" style={{ color: "#c8a882", textShadow: "0 0 30px rgba(200,168,130,0.5)" }}>
              FOR MANKIND
            </span>
          </h2>
          <p className="font-exo text-white/35 text-base leading-relaxed max-w-xl mx-auto">
            Neil Armstrong became the first human to walk on the Moon on July 20, 1969.
            12 astronauts walked on the lunar surface across 6 Apollo missions — the greatest achievement in human exploration.
          </p>
        </motion.div>

        {/* NASA Image Gallery */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.9 }}
          className="grid grid-cols-3 gap-3 w-full max-w-3xl mb-10">
          {[
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/400px-Aldrin_Apollo_11_original.jpg",
              caption: "Buzz Aldrin on the lunar surface — Apollo 11",
              label: "AS11-40-5931"
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Apollo11_-_GPN-2000-001999.jpg/400px-Apollo11_-_GPN-2000-001999.jpg",
              caption: "Neil Armstrong's bootprint in lunar regolith",
              label: "BOOTPRINT"
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/NASA-Apollo8-Dec24-Earthrise.jpg/400px-NASA-Apollo8-Dec24-Earthrise.jpg",
              caption: "Earthrise — Earth from lunar orbit, Apollo 8",
              label: "AS08-14-2383"
            },
          ].map((img, i) => (
            <motion.div key={img.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
              style={{ position: "relative", border: "1px solid rgba(200,168,130,0.2)", overflow: "hidden",
                boxShadow: "0 0 20px rgba(200,168,130,0.1)" }}>
              {/* Corner accents */}
              <div style={{position:"absolute",top:0,left:0,width:12,height:12,borderTop:"1px solid #c8a882",borderLeft:"1px solid #c8a882",zIndex:2}}/>
              <div style={{position:"absolute",top:0,right:0,width:12,height:12,borderTop:"1px solid #c8a882",borderRight:"1px solid #c8a882",zIndex:2}}/>
              <div style={{position:"absolute",bottom:0,left:0,width:12,height:12,borderBottom:"1px solid #c8a882",borderLeft:"1px solid #c8a882",zIndex:2}}/>
              <div style={{position:"absolute",bottom:0,right:0,width:12,height:12,borderBottom:"1px solid #c8a882",borderRight:"1px solid #c8a882",zIndex:2}}/>
              {/* NASA label */}
              <div style={{position:"absolute",top:4,left:4,zIndex:3,fontFamily:"monospace",fontSize:8,color:"rgba(200,168,130,0.7)",letterSpacing:"0.1em"}}>
                NASA · {img.label}
              </div>
              {/* scan lines */}
              <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(200,168,130,0.02) 3px,rgba(200,168,130,0.02) 4px)",zIndex:1,pointerEvents:"none"}}/>
              <img src={img.src} alt={img.caption}
                style={{width:"100%",aspectRatio:"1",objectFit:"cover",display:"block",filter:"sepia(15%) contrast(1.1) brightness(0.9)"}}
                onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}}
              />
              <div style={{padding:"6px 8px",background:"rgba(0,0,0,0.7)",borderTop:"1px solid rgba(200,168,130,0.1)"}}>
                <div style={{fontFamily:"monospace",fontSize:8,color:"rgba(200,168,130,0.55)",letterSpacing:"0.08em",lineHeight:1.4}}>
                  {img.caption}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl w-full mb-10">
          {[
            { v: "12", l: "Humans walked the Moon" },
            { v: "6", l: "Successful landings" },
            { v: "382 kg", l: "Moon rocks returned" },
            { v: "3 days", l: "Average travel time" },
          ].map(s => (
            <div key={s.l} className="border border-amber-400/15 p-4 text-center" style={{ background: "rgba(200,168,130,0.05)" }}>
              <div className="font-orbitron text-xl font-black text-amber-300">{s.v}</div>
              <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission timeline */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }} className="w-full max-w-3xl">
          <div className="font-mono text-[10px] text-amber-400/50 tracking-[0.25em] uppercase mb-4 text-center">
            ◈ APOLLO MISSION TIMELINE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {APOLLO_MISSIONS.map((m, i) => (
              <motion.div key={m.mission} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-start gap-3 border border-white/5 p-3" style={{ background: "rgba(200,168,130,0.03)" }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#c8a882" }} />
                <div>
                  <div className="font-orbitron text-xs font-bold text-amber-200/80">{m.mission}
                    <span className="font-mono text-[9px] text-white/30 ml-2">{m.date}</span>
                  </div>
                  <div className="font-mono text-[9px] text-white/25 tracking-wide mt-0.5">{m.note}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">03 · MOON LANDING</div>
    </section>
  );
}
