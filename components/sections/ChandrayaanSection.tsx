"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CHANDRAYAAN_MISSIONS = [
  {
    name: "Chandrayaan-1",
    year: "2008",
    achievement: "First Indian mission to the Moon. Discovered water molecules on the lunar surface.",
    color: "#ff9933",
    icon: "01",
  },
  {
    name: "Chandrayaan-2",
    year: "2019",
    achievement: "Orbiter continues to function. Vikram lander attempted the first soft landing near the south pole.",
    color: "#ffffff",
    icon: "02",
  },
  {
    name: "Chandrayaan-3",
    year: "2023",
    achievement: "FIRST EVER successful soft landing at the lunar south pole. India became the 4th nation to land on the Moon.",
    color: "#138808",
    icon: "03",
  },
];

export default function ChandrayaanSection() {
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

    // Trajectory particles
    const trajParticles: { x: number; y: number; life: number; vx: number; vy: number }[] = [];

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep space BG with Indian tricolor tint
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      const bgG = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, Math.max(W, H) * 0.7);
      bgG.addColorStop(0, "rgba(20,5,0,0.8)"); bgG.addColorStop(0.5, "rgba(0,10,5,0.5)"); bgG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bgG; ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 500; i++) {
        const sx = ((i * 73.13) % 1) * W, sy = ((i * 47.77) % 1) * H;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.4 + i * 0.3);
        ctx.globalAlpha = (0.2 + ((i * 31.7) % 1) * 0.7) * pulse;
        ctx.fillStyle = i % 25 === 0 ? "#ff9933" : i % 30 === 0 ? "#138808" : "#fff";
        ctx.beginPath(); ctx.arc(sx, sy, 0.4 + ((i * 11.3) % 1) * 1.1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Moon — large, on right side
      const moonX = W * 0.72, moonY = H * 0.45, moonR = Math.min(W, H) * 0.28;
      // moon glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.8, moonX, moonY, moonR * 1.6);
      moonGlow.addColorStop(0, "rgba(200,200,180,0.12)"); moonGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = moonGlow; ctx.beginPath(); ctx.arc(moonX, moonY, moonR * 1.6, 0, Math.PI * 2); ctx.fill();
      // surface
      const moonG = ctx.createRadialGradient(moonX - moonR * 0.3, moonY - moonR * 0.3, moonR * 0.05, moonX, moonY, moonR);
      moonG.addColorStop(0, "#c8c4b8"); moonG.addColorStop(0.4, "#a0988a"); moonG.addColorStop(0.8, "#706860"); moonG.addColorStop(1, "#1a1512");
      ctx.save(); ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2); ctx.fillStyle = moonG; ctx.fill(); ctx.clip();
      // craters
      [[0.1, -0.2, 0.12], [-0.3, 0.15, 0.09], [0.25, 0.3, 0.14], [-0.1, -0.4, 0.07],
       [0.4, -0.1, 0.06], [-0.4, -0.3, 0.1], [0.0, 0.4, 0.08]].forEach(([cx2, cy2, cr]) => {
        const crG = ctx.createRadialGradient(moonX + cx2 * moonR, moonY + cy2 * moonR, 0, moonX + cx2 * moonR, moonY + cy2 * moonR, cr * moonR);
        crG.addColorStop(0, "rgba(0,0,0,0.55)"); crG.addColorStop(0.8, "rgba(0,0,0,0.15)"); crG.addColorStop(1, "rgba(255,255,255,0.04)");
        ctx.beginPath(); ctx.arc(moonX + cx2 * moonR, moonY + cy2 * moonR, cr * moonR, 0, Math.PI * 2); ctx.fillStyle = crG; ctx.fill();
      });
      // South pole — highlight region
      const spGlow = ctx.createRadialGradient(moonX, moonY + moonR * 0.8, 0, moonX, moonY + moonR * 0.8, moonR * 0.35);
      spGlow.addColorStop(0, "rgba(255,152,0,0.18)"); spGlow.addColorStop(0.6, "rgba(19,136,8,0.08)"); spGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(moonX, moonY + moonR * 0.8, moonR * 0.35, 0, Math.PI * 2); ctx.fillStyle = spGlow; ctx.fill();
      // south pole label
      ctx.fillStyle = "rgba(255,152,0,0.7)"; ctx.font = "bold 10px monospace";
      ctx.fillText("SOUTH POLE", moonX - 36, moonY + moonR * 0.85);
      ctx.beginPath(); ctx.arc(moonX, moonY + moonR * 0.82, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,152,0,0.9)"; ctx.fill();
      ctx.restore();
      // terminator
      const termG = ctx.createRadialGradient(moonX + moonR * 0.35, moonY, moonR * 0.05, moonX + moonR, moonY, moonR * 1.15);
      termG.addColorStop(0, "rgba(0,0,0,0)"); termG.addColorStop(0.4, "rgba(0,0,0,0.2)"); termG.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.beginPath(); ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2); ctx.fillStyle = termG; ctx.fill();

      // Earth (small, distant, bottom left)
      const eX = W * 0.12, eY = H * 0.75, eR = H * 0.09;
      const eG = ctx.createRadialGradient(eX - eR * 0.3, eY - eR * 0.3, 0, eX, eY, eR);
      eG.addColorStop(0, "#6ec6ff"); eG.addColorStop(0.2, "#1a6bcc"); eG.addColorStop(0.7, "#0d3d6b"); eG.addColorStop(1, "#000");
      ctx.beginPath(); ctx.arc(eX, eY, eR, 0, Math.PI * 2); ctx.fillStyle = eG; ctx.fill();
      const eAtm = ctx.createRadialGradient(eX, eY, eR * 0.92, eX, eY, eR * 1.14);
      eAtm.addColorStop(0, "rgba(0,0,0,0)"); eAtm.addColorStop(0.5, "rgba(100,190,255,0.25)"); eAtm.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(eX, eY, eR * 1.14, 0, Math.PI * 2); ctx.fillStyle = eAtm; ctx.fill();

      // Chandrayaan-3 trajectory arc
      const trajCx = W * 0.45, trajCy = H * 1.1;
      const trajRx = W * 0.38, trajRy = H * 0.8;
      ctx.beginPath(); ctx.ellipse(trajCx, trajCy, trajRx, trajRy, 0, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.strokeStyle = "rgba(255,152,0,0.2)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 8]); ctx.stroke(); ctx.setLineDash([]);

      // Trajectory animated dots
      const trajProgress = (t * 0.04) % 1;
      for (let d = 0; d < 5; d++) {
        const dp = (trajProgress + d * 0.06) % 1;
        const ta = -Math.PI * 0.85 + dp * Math.PI * 0.7;
        const dx = trajCx + Math.cos(ta) * trajRx;
        const dy = trajCy + Math.sin(ta) * trajRy;
        ctx.beginPath(); ctx.arc(dx, dy, 2.5 - d * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,152,0,${0.8 - d * 0.15})`; ctx.fill();
      }

      // Spacecraft (Chandrayaan-3 lander)
      const scProgress = (t * 0.015) % 1;
      const scAngle = -Math.PI * 0.85 + scProgress * Math.PI * 0.7;
      const scX = trajCx + Math.cos(scAngle) * trajRx;
      const scY = trajCy + Math.sin(scAngle) * trajRy;

      ctx.save(); ctx.translate(scX, scY); ctx.rotate(scAngle + Math.PI * 0.5);
      // lander body
      ctx.fillStyle = "rgba(220,210,180,0.85)";
      ctx.beginPath(); ctx.roundRect(-8, -10, 16, 14, 2); ctx.fill();
      // legs
      [[-1, 1], [1, 1]].forEach(([dx]) => {
        ctx.beginPath(); ctx.moveTo(dx * 5, 4); ctx.lineTo(dx * 14, 14);
        ctx.strokeStyle = "rgba(200,195,175,0.8)"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(dx * 14, 15, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,195,175,0.6)"; ctx.fill();
      });
      // solar panels
      ctx.fillStyle = "rgba(20,80,180,0.8)";
      [[-18, -4, 10, 8], [8, -4, 10, 8]].forEach(([px, py, pw, ph]) => {
        ctx.fillRect(px, py, pw, ph);
        // grid
        ctx.strokeStyle = "rgba(80,150,255,0.4)"; ctx.lineWidth = 0.5;
        for (let g = 1; g < 4; g++) { ctx.beginPath(); ctx.moveTo(px + g * 2.5, py); ctx.lineTo(px + g * 2.5, py + ph); ctx.stroke(); }
      });
      // engine nozzle
      ctx.fillStyle = "rgba(180,170,150,0.7)";
      ctx.beginPath(); ctx.moveTo(-5, 4); ctx.lineTo(-6, 10); ctx.lineTo(6, 10); ctx.lineTo(5, 4); ctx.fill();
      // thruster flame
      const flameAlpha = 0.6 + Math.sin(t * 8) * 0.3;
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(0, 18 + Math.random() * 4); ctx.lineTo(4, 10);
      ctx.fillStyle = `rgba(255,150,50,${flameAlpha})`; ctx.fill();
      ctx.restore();

      // Spacecraft glow
      const scGlow = ctx.createRadialGradient(scX, scY, 3, scX, scY, 18);
      scGlow.addColorStop(0, "rgba(255,152,0,0.2)"); scGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(scX, scY, 18, 0, Math.PI * 2); ctx.fillStyle = scGlow; ctx.fill();

      // Indian flag holographic effect — tricolor bands
      const flagX = W * 0.06, flagY = H * 0.1, flagW = 80, flagH = 50;
      ctx.save(); ctx.globalAlpha = 0.7 + Math.sin(t * 0.5) * 0.15;
      ctx.fillStyle = "#ff9933"; ctx.fillRect(flagX, flagY, flagW, flagH / 3);
      ctx.fillStyle = "#fff"; ctx.fillRect(flagX, flagY + flagH / 3, flagW, flagH / 3);
      ctx.fillStyle = "#138808"; ctx.fillRect(flagX, flagY + 2 * flagH / 3, flagW, flagH / 3);
      // Ashoka Chakra
      const chakraX = flagX + flagW / 2, chakraY = flagY + flagH / 2, chakraR = flagH / 6;
      ctx.strokeStyle = "rgba(0,0,128,0.8)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(chakraX, chakraY, chakraR, 0, Math.PI * 2); ctx.stroke();
      for (let sp = 0; sp < 24; sp++) {
        const sa = (sp / 24) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(chakraX, chakraY);
        ctx.lineTo(chakraX + Math.cos(sa) * chakraR, chakraY + Math.sin(sa) * chakraR);
        ctx.lineWidth = 0.8; ctx.stroke();
      }
      // flag glow
      const flagGlow = ctx.createRadialGradient(chakraX, chakraY, 0, chakraX, chakraY, 50);
      flagGlow.addColorStop(0, "rgba(255,152,0,0.15)"); flagGlow.addColorStop(0.5, "rgba(19,136,8,0.08)"); flagGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = flagGlow; ctx.fillRect(flagX - 20, flagY - 20, flagW + 40, flagH + 40);
      ctx.restore();

      // flag pole
      ctx.strokeStyle = "rgba(200,200,200,0.6)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(flagX, flagY); ctx.lineTo(flagX, flagY - 20); ctx.stroke();

      t += 0.008;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="chandrayaan" className="relative overflow-hidden" style={{ background: "#000", minHeight: "100vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* HUD */}
      <div className="absolute top-8 right-8 z-10 space-y-1 text-right">
        {[
          { l: "AGENCY", v: "ISRO", c: "#ff9933" },
          { l: "MISSION", v: "CHANDRAYAAN-3", c: "#ff9933" },
          { l: "LANDING DATE", v: "AUG 23, 2023", c: "#138808" },
          { l: "LANDING SITE", v: "LUNAR SOUTH POLE", c: "#ff9933" },
        ].map(tag => (
          <div key={tag.l} className="font-mono text-[10px] px-3 py-1.5 border inline-block"
            style={{ color: tag.c, borderColor: tag.c + "33", background: tag.c + "08", letterSpacing: "0.15em" }}>
            {tag.l}: {tag.v}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-8 md:px-16 py-24">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* Video panel */}
      <motion.div initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:1,delay:0.3}}
        className="order-last lg:order-first">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-3 text-orange-400/55">◈ MISSION LAUNCH FOOTAGE</div>
        {/* Holographic video frame */}
        <div style={{position:"relative",borderRadius:2,overflow:"hidden",border:"1px solid rgba(255,152,0,0.25)",boxShadow:"0 0 40px rgba(255,152,0,0.15), inset 0 0 20px rgba(255,152,0,0.05)"}}>
          {/* Corner accents */}
          <div style={{position:"absolute",top:0,left:0,width:20,height:20,borderTop:"2px solid #ff9933",borderLeft:"2px solid #ff9933",zIndex:2}}/>
          <div style={{position:"absolute",top:0,right:0,width:20,height:20,borderTop:"2px solid #ff9933",borderRight:"2px solid #ff9933",zIndex:2}}/>
          <div style={{position:"absolute",bottom:0,left:0,width:20,height:20,borderBottom:"2px solid #138808",borderLeft:"2px solid #138808",zIndex:2}}/>
          <div style={{position:"absolute",bottom:0,right:0,width:20,height:20,borderBottom:"2px solid #138808",borderRight:"2px solid #138808",zIndex:2}}/>
          {/* HUD scan line overlay */}
          <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,152,0,0.02) 2px,rgba(255,152,0,0.02) 4px)",zIndex:1,pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:8,left:8,zIndex:3,fontFamily:"monospace",fontSize:9,color:"rgba(255,152,0,0.7)",letterSpacing:"0.2em"}}>▶ ISRO · LIVE FEED</div>
          <div style={{position:"relative",paddingTop:"56.25%"}}>
            <iframe
              src="https://www.youtube.com/embed/9cYPtTuk5MQ?autoplay=1&mute=1&rel=0"
              title="Chandrayaan-3 Launch | ISRO"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none",background:"#000"}}
            />
          </div>
        </div>
        {/* Video caption */}
        <div className="mt-3 font-mono text-[9px] text-white/25 tracking-widest text-center">
          CHANDRAYAAN-3 LAUNCH · LVM3-M4 · SRIHARIKOTA · JULY 14, 2023
        </div>

        {/* Trajectory animation block */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            {v:"140 days",l:"Journey to Moon"},
            {v:"3,84,400 km",l:"Distance covered"},
            {v:"6018 kg",l:"Launch mass"},
          ].map(s=>(
            <div key={s.l} style={{padding:"10px 8px",border:"1px solid rgba(255,152,0,0.12)",background:"rgba(255,152,0,0.04)",textAlign:"center"}}>
              <div className="font-orbitron text-sm font-bold" style={{color:"#ff9933"}}>{s.v}</div>
              <div className="font-mono text-[8px] text-white/30 mt-1 uppercase tracking-wide">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Text content panel */}
      <div className="max-w-lg">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(255,152,0,0.6)" }}>
            ◈ INDIA'S LUNAR PROGRAMME · ISRO
          </div>
          <h2 className="font-orbitron font-black text-white leading-tight mb-3"
            style={{ fontSize: "clamp(2rem,5vw,3.8rem)" }}>
            CHANDRAYAAN
            <span className="block" style={{ color: "#ff9933", textShadow: "0 0 30px rgba(255,152,0,0.5)" }}>
              TO THE MOON
            </span>
          </h2>
          <div className="h-px mb-4" style={{ background: "linear-gradient(90deg,#ff993380,transparent)" }} />
          <p className="font-exo text-white/35 text-sm leading-relaxed mb-8">
            On August 23, 2023, India made history — becoming the first nation to land at the lunar south pole, and only the fourth country to achieve a soft landing on the Moon. A triumph of Indian science and human ambition.
          </p>

          {/* Mission cards */}
          <div className="space-y-3">
            {CHANDRAYAAN_MISSIONS.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.15 }}
                className="border p-4 relative overflow-hidden"
                style={{ borderColor: m.color + "30", background: m.color + "06" }}>
                <div className="flex items-start gap-4">
                  <div className="font-orbitron text-3xl font-black opacity-20 flex-shrink-0 leading-none"
                    style={{ color: m.color }}>
                    {m.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-orbitron text-sm font-bold" style={{ color: m.color }}>{m.name}</span>
                      <span className="font-mono text-[10px] text-white/30">{m.year}</span>
                    </div>
                    <p className="font-exo text-white/40 text-xs leading-relaxed">{m.achievement}</p>
                  </div>
                </div>
                {i === 2 && (
                  <div className="absolute top-2 right-2 font-mono text-[8px] px-1.5 py-0.5"
                    style={{ background: "#138808", color: "#fff", letterSpacing: "0.1em" }}>
                    HISTORIC
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ISRO achievements */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.9 }}
            className="mt-6 grid grid-cols-3 gap-2">
            {[
              { v: "4th", l: "Nation on Moon" },
              { v: "1st", l: "South Pole landing" },
              { v: "2008", l: "First mission" },
            ].map(s => (
              <div key={s.l} className="border border-orange-400/15 p-3 text-center" style={{ background: "rgba(255,152,0,0.04)" }}>
                <div className="font-orbitron text-lg font-black" style={{ color: "#ff9933" }}>{s.v}</div>
                <div className="font-mono text-[8px] text-white/30 tracking-wide uppercase mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>{/* end text panel */}
      </div>{/* end grid */}
      </div>{/* end outer */}

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">05 · CHANDRAYAAN</div>
    </section>
  );
}
