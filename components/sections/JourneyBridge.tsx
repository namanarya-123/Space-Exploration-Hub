"use client";
import { motion } from "framer-motion";

export default function JourneyBridge(){
  return(
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{background:"radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.06) 0%, #000 70%)"}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 50%,rgba(139,0,255,0.06) 0%,transparent 60%);"}}/>
      <motion.div
        initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
        viewport={{once:true}} transition={{duration:1.2}}
        className="text-center px-6 max-w-3xl relative z-10">
        <div className="font-mono text-[11px] text-cyan-400/55 tracking-[0.3em] uppercase mb-6">
          ◈ SOLAR SYSTEM TRAVERSAL COMPLETE · VENTURING FURTHER
        </div>
        <h2 className="font-orbitron font-black text-white leading-tight mb-6"
          style={{fontSize:"clamp(2rem,6vw,5rem)"}}>
          BEYOND THE
          <span className="block gradient-text-cyan">SOLAR SYSTEM</span>
        </h2>
        <p className="font-exo text-white/35 text-base leading-relaxed max-w-xl mx-auto">
          You have witnessed all seven worlds of our solar system. Now journey further — through black holes, wormholes, and into the far future of human civilization among the stars.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="w-px h-16" style={{background:"linear-gradient(to bottom,#00f5ff,transparent)",animation:"pulse 2s ease-in-out infinite"}}/>
        </div>
      </motion.div>
      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/18">02 · BEYOND</div>
    </section>
  );
}
