"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function EndingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
 
    const resize = () => { canvas.width=canvas.offsetWidth||window.innerWidth; canvas.height=canvas.offsetHeight||window.innerHeight; };
    resize();
    const stars = Array.from({length:500},()=>{const a=Math.random()*Math.PI*2;return{angle:a,dist:0.02+Math.random()*0.98,speed:0.003+Math.random()*0.006,brightness:0.4+Math.random()*0.6};});
    const draw = () => {
      const W=canvas.width,H=canvas.height,cx=W/2,cy=H/2,warp=progressRef.current;
      ctx.fillStyle=`rgba(0,0,5,${0.15+warp*0.05})`;ctx.fillRect(0,0,W,H);
      const maxR=Math.sqrt(cx*cx+cy*cy)*1.2;
      stars.forEach(s=>{
        s.dist+=s.speed*(1+warp*4);
        if(s.dist>1.1){s.dist=0.01+Math.random()*0.05;s.angle=Math.random()*Math.PI*2;}
        const r=s.dist*maxR,stretch=1+warp*8+s.dist*2;
        const sx=cx+Math.cos(s.angle)*(r-stretch*3),sy=cy+Math.sin(s.angle)*(r-stretch*3);
        const ex=cx+Math.cos(s.angle)*(r+stretch),ey=cy+Math.sin(s.angle)*(r+stretch);
        const alpha=s.brightness*(0.3+s.dist*0.7)*(0.6+warp*0.4);
        const grad=ctx.createLinearGradient(sx,sy,ex,ey);
        grad.addColorStop(0,"rgba(255,255,255,0)");grad.addColorStop(0.5,`rgba(255,255,255,${alpha})`);grad.addColorStop(1,"rgba(255,255,255,0)");
        ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.strokeStyle=grad;ctx.lineWidth=0.8+s.dist*1.5;ctx.stroke();
      });
      const bG=ctx.createRadialGradient(cx,cy,0,cx,cy,maxR*0.4*(0.3+warp*0.7));
      bG.addColorStop(0,`rgba(255,255,255,${(0.3+warp*0.5)*0.7})`);bG.addColorStop(0.2,`rgba(100,200,255,${(0.3+warp*0.5)*0.35})`);bG.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(cx,cy,maxR*0.4,0,Math.PI*2);ctx.fillStyle=bG;ctx.fill();
      [{x:0.3,y:0.4,r:80,g:100,b:255},{x:0.7,y:0.6,r:138,g:0,b:255}].forEach(n=>{
        const ng=ctx.createRadialGradient(n.x*W,n.y*H,0,n.x*W,n.y*H,W*0.3);
        ng.addColorStop(0,`rgba(${n.r},${n.g},${n.b},0.07)`);ng.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=ng;ctx.fillRect(0,0,W,H);
      });
      t+=0.01;rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize",resize);
    const onScroll=()=>{
      const section=document.getElementById("ending");if(!section)return;
      const rect=section.getBoundingClientRect();
      if(rect.top<window.innerHeight&&rect.bottom>0)
        progressRef.current=Math.max(0,Math.min(1,(window.innerHeight-rect.top)/(window.innerHeight+rect.height)));
    };
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener("resize",resize);window.removeEventListener("scroll",onScroll);};
  },[]);

  return(
    <section id="ending" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true"/>
      <motion.div initial={{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1.5}}
        className="relative z-10 text-center px-6 max-w-4xl">
        <div className="font-mono text-[11px] text-cyan-400/50 tracking-[0.3em] uppercase mb-8">◈ END OF JOURNEY · SPACE EXPLORATION HUB</div>
        <h2 className="font-orbitron font-black text-white leading-tight" style={{fontSize:"clamp(2rem,6vw,5.5rem)"}}>
          THE UNIVERSE IS INFINITE.
          <span className="block mt-3" style={{color:"#00f5ff",textShadow:"0 0 40px rgba(0,245,255,0.5)"}}>SO IS HUMAN CURIOSITY.</span>
        </h2>
        <p className="font-exo text-white/30 mt-6 text-base leading-relaxed max-w-xl mx-auto">
          From the scorching surface of Mercury to the frozen darkness of Neptune, from the Moon&apos;s dust to the ISS orbiting above — humanity has always reached for the stars. And we are just beginning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button className="mag-btn border border-cyan-400 text-cyan-400 font-orbitron text-sm tracking-[0.15em] uppercase px-8 py-3"
            onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} data-cursor><span>RESTART JOURNEY</span></button>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="font-mono text-[10px] text-white/15 tracking-[0.2em] uppercase">SPACE EXPLORATION HUB · INTERACTIVE SPACE JOURNEY</div>
        </div>
      </motion.div>
      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">∞ · SPACE EXPLORATION HUB</div>
    </section>
  );
}
