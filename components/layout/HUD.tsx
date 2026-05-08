"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HUD(){
  const [time,setTime]=useState("");
  const [coords,setCoords]=useState({lat:"0.00",lon:"0.00"});

  useEffect(()=>{
    const tick=()=>setTime(new Date().toUTCString().slice(-12,-4)+" UTC");
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);

  useEffect(()=>{
    const onMove=(e:MouseEvent)=>{
      const lat=(((e.clientY/window.innerHeight)-0.5)*180).toFixed(2);
      const lon=(((e.clientX/window.innerWidth)-0.5)*360).toFixed(2);
      setCoords({lat,lon});
    };
    window.addEventListener("mousemove",onMove);
    return()=>window.removeEventListener("mousemove",onMove);
  },[]);

  return(
    <>
      <motion.header
        initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:1.6}}
        className="fixed top-0 left-0 right-0 z-[200] flex justify-between items-center px-6 py-4 pointer-events-none">
        <div className="hud-tag text-cyan-400/55">◈ SYS-ONLINE · VER 2.∞</div>
        <div className="font-orbitron text-sm font-bold tracking-[0.2em] text-white" style={{textShadow:"0 0 20px rgba(0,245,255,0.35)"}}>
          SPACE EXPLORATION HUB
        </div>
        <div className="hud-tag text-cyan-400/55">LAT {coords.lat}° · LON {coords.lon}°</div>
      </motion.header>
      <motion.footer
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.6}}
        className="fixed bottom-0 left-0 right-0 z-[150] flex justify-between items-end px-6 py-4 pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="w-24 h-px" style={{background:"linear-gradient(90deg,transparent,#00f5ff)"}}/>
          <div className="hud-tag text-cyan-400/35">DEEP SPACE NETWORK · ONLINE</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="w-24 h-px ml-auto" style={{background:"linear-gradient(90deg,#00f5ff,transparent)"}}/>
          <div className="hud-tag text-cyan-400/35">{time}</div>
        </div>
      </motion.footer>
      {/* corner brackets */}
      <div className="fixed top-0 left-0 z-[199] pointer-events-none w-14 h-14">
        <div className="absolute top-0 left-0 w-full h-px bg-cyan-400/18"/>
        <div className="absolute top-0 left-0 w-px h-full bg-cyan-400/18"/>
      </div>
      <div className="fixed top-0 right-0 z-[199] pointer-events-none w-14 h-14">
        <div className="absolute top-0 right-0 w-full h-px bg-cyan-400/18"/>
        <div className="absolute top-0 right-0 w-px h-full bg-cyan-400/18"/>
      </div>
    </>
  );
}
