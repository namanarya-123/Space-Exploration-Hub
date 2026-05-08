"use client";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import Preloader from "@/components/ui/Preloader";
import HUD from "@/components/layout/HUD";
import CustomCursor from "@/components/ui/CustomCursor";
import Scanlines from "@/components/ui/Scanlines";

const HeroSection       = dynamic(()=>import("@/components/sections/HeroSection"),       {ssr:false});
const SolarJourney      = dynamic(()=>import("@/components/journey/SolarJourney"),       {ssr:false});
const MoonLandingSection= dynamic(()=>import("@/components/sections/MoonLandingSection"),{ssr:false});
const ISSSection        = dynamic(()=>import("@/components/sections/ISSSection"),        {ssr:false});
const ChandrayaanSection= dynamic(()=>import("@/components/sections/ChandrayaanSection"),{ssr:false});
const EndingSection     = dynamic(()=>import("@/components/sections/EndingSection"),     {ssr:false});

function Fallback(){
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#000"}}>
      <div className="text-cyan-400 font-mono text-xs tracking-widest animate-pulse">LOADING SECTOR...</div>
    </div>
  );
}

const wrap = (children: React.ReactNode) => (
  <div style={{position:"relative",zIndex:6,background:"#000"}}>{children}</div>
);

export default function Home(){
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    document.body.style.overflow=loaded?"":"hidden";
    return()=>{document.body.style.overflow="";};
  },[loaded]);

  return(
    <>
      <CustomCursor/>
      <Scanlines/>
      {!loaded&&<Preloader onComplete={()=>setLoaded(true)}/>}
      <div style={{opacity:loaded?1:0,transition:"opacity 1.5s ease 0.5s"}}>
        <HUD/>
        <main style={{position:"relative"}}>

          {/* 01 — HERO */}
          {wrap(<Suspense fallback={<Fallback/>}><HeroSection/></Suspense>)}

          {/* 02 — CINEMATIC SOLAR JOURNEY  Sun → Mercury → ... → Neptune */}
          <div id="solar-journey" style={{position:"relative",zIndex:4}}>
            <Suspense fallback={<Fallback/>}><SolarJourney/></Suspense>
          </div>

          {/* 03 — MOON LANDING */}
          {wrap(<><div className="cosmic-divider"/><Suspense fallback={<Fallback/>}><MoonLandingSection/></Suspense></>)}

          {/* 04 — ISS */}
          {wrap(<><div className="cosmic-divider"/><Suspense fallback={<Fallback/>}><ISSSection/></Suspense></>)}

          {/* 05 — CHANDRAYAAN / ISRO */}
          {wrap(<><div className="cosmic-divider"/><Suspense fallback={<Fallback/>}><ChandrayaanSection/></Suspense></>)}

          {/* 06 — ENDING */}
          {wrap(<><div className="cosmic-divider"/><Suspense fallback={<Fallback/>}><EndingSection/></Suspense></>)}

        </main>
      </div>
    </>
  );
}
