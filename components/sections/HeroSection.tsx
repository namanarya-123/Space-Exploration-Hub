"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const stagger = {hidden:{},show:{transition:{staggerChildren:0.13,delayChildren:0.2}}};
const item = {hidden:{opacity:0,y:44},show:{opacity:1,y:0,transition:{duration:0.9,ease:[0.16,1,0.3,1]}}};

export default function HeroSection() {
  const earthRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas=earthRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;
    canvas.width=500;canvas.height=500;
    let t=0,raf:number;
    const draw=()=>{
      ctx.clearRect(0,0,500,500);
      const cx=250,cy=250,r=188;
      const outerGlow=ctx.createRadialGradient(cx,cy,r*0.88,cx,cy,r*1.65);
      outerGlow.addColorStop(0,"rgba(30,107,200,0.22)");
      outerGlow.addColorStop(0.5,"rgba(0,100,255,0.07)");
      outerGlow.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=outerGlow;ctx.beginPath();ctx.arc(cx,cy,r*1.65,0,Math.PI*2);ctx.fill();
      const pg=ctx.createRadialGradient(cx-55,cy-55,r*0.04,cx,cy,r);
      pg.addColorStop(0,"#7ecfff");pg.addColorStop(0.2,"#1a6bcc");pg.addColorStop(0.65,"#0d3d6b");pg.addColorStop(1,"#000");
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();ctx.clip();
      [[-0.15,-0.1,0.45,0.3],[0.42,-0.05,0.22,0.38],[-0.38,0.12,0.28,0.36],[0.18,0.32,0.35,0.2]].forEach(([ox,oy,w,h],i)=>{
        const sp=t*0.003;
        const rx=cx+(ox*Math.cos(sp)-oy*Math.sin(sp))*r;
        const ry=cy+(ox*Math.sin(sp)+oy*Math.cos(sp))*r;
        ctx.beginPath();ctx.ellipse(rx,ry,w*r*0.5,h*r*0.5,i*0.4,0,Math.PI*2);
        ctx.fillStyle="rgba(34,110,34,0.65)";ctx.fill();
      });
      for(let c=0;c<5;c++){
        const ca=(c/5)*Math.PI*2+t*0.005;
        ctx.beginPath();ctx.ellipse(cx+Math.cos(ca)*r*0.55,cy+Math.sin(ca)*r*0.28,r*0.42,r*0.13,ca,0,Math.PI*2);
        ctx.fillStyle="rgba(255,255,255,0.11)";ctx.fill();
      }
      ctx.restore();
      const atmo=ctx.createRadialGradient(cx,cy,r-3,cx,cy,r+24);
      atmo.addColorStop(0,"rgba(0,0,0,0)");atmo.addColorStop(0.5,"rgba(100,190,255,0.3)");atmo.addColorStop(1,"rgba(100,190,255,0)");
      ctx.beginPath();ctx.arc(cx,cy,r+14,0,Math.PI*2);ctx.fillStyle=atmo;ctx.fill();
      const shadow=ctx.createRadialGradient(cx+r*0.38,cy,r*0.08,cx+r,cy,r*1.18);
      shadow.addColorStop(0,"rgba(0,0,0,0)");shadow.addColorStop(0.4,"rgba(0,0,0,0.18)");shadow.addColorStop(1,"rgba(0,0,0,0.8)");
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=shadow;ctx.fill();
      for(let cl=0;cl<12;cl++){
        const ca=Math.PI*0.6+cl*0.18;
        ctx.beginPath();ctx.arc(cx+Math.cos(ca)*r*0.62,cy+Math.sin(ca)*r*0.38,1.4,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,220,100,${0.28+Math.sin(t*0.01+cl)*0.18})`;ctx.fill();
      }
      t++;raf=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(raf);
  },[]);

  const scrollToJourney=()=>document.getElementById("solar-journey")?.scrollIntoView({behavior:"smooth"});

  return(
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 50%,rgba(0,102,255,0.07) 0%,rgba(139,0,255,0.04) 40%,transparent 70%)"}}/>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-22 pointer-events-none hidden lg:block" style={{right:"-5%"}}>
        <canvas ref={earthRef} style={{width:440,height:440}}/>
      </div>
      <motion.div className="relative z-10 text-center px-6 max-w-5xl mx-auto" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={item} className="font-mono text-[11px] text-cyan-400/70 tracking-[0.35em] uppercase mb-5">
          ◈ SPACE EXPLORATION HUB · DEEP SPACE NETWORK ONLINE
        </motion.div>
        <motion.h1 variants={item} className="font-orbitron font-black leading-[1.02] tracking-tight mb-5" style={{fontSize:"clamp(2.8rem,9vw,7.5rem)"}}>
          <span className="block text-white">SPACE</span>
          <span className="block gradient-text-cyan">EXPLORATION HUB</span>
        </motion.h1>
        <motion.p variants={item} className="font-exo text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
          A cinematic journey through our solar system. Travel planet by planet — from the Sun to frozen Neptune — through one living, breathing universe.
        </motion.p>
        <motion.div variants={item} className="mt-10 flex gap-4 justify-center">
          <button className="mag-btn border border-cyan-400 text-cyan-400 font-orbitron text-sm tracking-[0.15em] uppercase px-8 py-3" onClick={scrollToJourney} data-cursor>
            <span>BEGIN JOURNEY</span>
          </button>
        </motion.div>
        <motion.div variants={item} className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-white/5 pt-8">
          {[{label:"Planets",val:"7"},{label:"Distance",val:"30 AU"},{label:"Secrets",val:"∞"}].map(s=>(
            <div key={s.label} className="text-center">
              <div className="font-orbitron text-2xl font-bold text-white">{s.val}</div>
              <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] mt-1 uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2}}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] text-white/30 tracking-[0.25em] uppercase">SCROLL TO EXPLORE</span>
        <div className="w-px h-12" style={{background:"linear-gradient(to bottom,#00f5ff,transparent)",animation:"pulse 2s ease-in-out infinite"}}/>
      </motion.div>
      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">01 · HERO</div>
    </section>
  );
}
