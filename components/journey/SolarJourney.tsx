"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Journey stops: SUN first, then all 8 planets ───────────────────────────
export const JOURNEY_STOPS = [
  {
    id:"sun", name:"THE SUN", symbol:"☀", isSun:true,
    bodyColor:"#ffdd40", glowRgb:"255,180,30", accentColor:"#ffcc00",
    bgOverlay:"rgba(100,60,0,0.65)", orbitFrac:0, radius:60,
    orbitSpd:0, spinSpd:0.008, hasRings:false, moonCount:0, atmosOpacity:0,
    tagline:"THE HEART OF THE SOLAR SYSTEM",
    description:"A sphere of plasma 1.39 million km wide, burning at 15 million°C at its core. Every second, the Sun converts 600 million tonnes of hydrogen into helium — releasing more energy than all of human history combined.",
    stats:[{l:"Core Temperature",v:"15 Million °C"},{l:"Surface Temp",v:"5,500 °C"},{l:"Diameter",v:"1.39 Million km"},{l:"Age",v:"4.6 Billion years"}],
  },
  {
    id:"mercury", name:"MERCURY", symbol:"☿", isSun:false,
    bodyColor:"#a09080", glowRgb:"180,150,100", accentColor:"#c8a882",
    bgOverlay:"rgba(80,50,10,0.6)", orbitFrac:0.13, radius:10,
    orbitSpd:0.88, spinSpd:0.003, hasRings:false, moonCount:0, atmosOpacity:0.10,
    tagline:"THE SCORCHED WORLD",
    description:"Closest to the Sun, Mercury endures temperatures from +430°C to −180°C with no atmosphere to shield it. Ancient craters scar its surface like wounds of cosmic violence.",
    stats:[{l:"Distance",v:"0.39 AU"},{l:"Orbital Period",v:"88 Earth days"},{l:"Surface Temp",v:"+430°C / −180°C"},{l:"Diameter",v:"4,879 km"}],
  },
  {
    id:"venus", name:"VENUS", symbol:"♀", isSun:false,
    bodyColor:"#e0b850", glowRgb:"230,160,40", accentColor:"#e8a020",
    bgOverlay:"rgba(100,55,0,0.6)", orbitFrac:0.21, radius:20,
    orbitSpd:0.615, spinSpd:0.001, hasRings:false, moonCount:0, atmosOpacity:0.45,
    tagline:"THE HELLISH TWIN",
    description:"Earth's evil twin burns at 465°C beneath 90 atmospheres of crushing pressure. Clouds of sulfuric acid swirl endlessly, trapping heat in a runaway greenhouse spiral.",
    stats:[{l:"Distance",v:"0.72 AU"},{l:"Rotation",v:"243 days (retrograde)"},{l:"Pressure",v:"92× Earth"},{l:"Clouds",v:"H₂SO₄"}],
  },
  {
    id:"earth", name:"EARTH", symbol:"🌍", isSun:false,
    bodyColor:"#1a6bcc", glowRgb:"30,130,230", accentColor:"#4db5ff",
    bgOverlay:"rgba(0,40,100,0.6)", orbitFrac:0.30, radius:22,
    orbitSpd:1.0, spinSpd:0.016, hasRings:false, moonCount:1, atmosOpacity:0.32,
    tagline:"OUR BLUE CRADLE",
    description:"The only confirmed harbor of life in the cosmos. 71% ocean, breathable air, and 8.7 million species — a pale blue dot adrift in the immensity of space.",
    stats:[{l:"Distance",v:"1.00 AU"},{l:"Day Length",v:"24 hours"},{l:"Surface Water",v:"71%"},{l:"Known Species",v:"8.7 Million"}],
  },
  {
    id:"mars", name:"MARS", symbol:"♂", isSun:false,
    bodyColor:"#c14010", glowRgb:"200,70,20", accentColor:"#e87c4f",
    bgOverlay:"rgba(100,20,0,0.6)", orbitFrac:0.40, radius:16,
    orbitSpd:0.532, spinSpd:0.015, hasRings:false, moonCount:2, atmosOpacity:0.18,
    tagline:"THE RED FRONTIER",
    description:"Humanity's next home. Ancient river deltas, towering volcanoes, polar ice caps — Mars whispers of a world that once thrived. Our colony of 847,000 has already begun.",
    stats:[{l:"Distance",v:"1.52 AU"},{l:"Day Length",v:"24.6 hours"},{l:"Gravity",v:"38% of Earth"},{l:"Colony Status",v:"ACTIVE · 847K"}],
  },
  {
    id:"jupiter", name:"JUPITER", symbol:"♃", isSun:false,
    bodyColor:"#c0803a", glowRgb:"200,130,50", accentColor:"#e8a44e",
    bgOverlay:"rgba(80,40,0,0.6)", orbitFrac:0.54, radius:54,
    orbitSpd:0.084, spinSpd:0.032, hasRings:false, moonCount:4, atmosOpacity:0.22,
    tagline:"THE KING OF WORLDS",
    description:"318 Earth masses of swirling gas and fury. The Great Red Spot — a storm twice Earth's size — has raged for four centuries. Its moons Europa and Ganymede may harbour life.",
    stats:[{l:"Distance",v:"5.20 AU"},{l:"Day Length",v:"9.9 hours"},{l:"Known Moons",v:"95"},{l:"Mass",v:"318× Earth"}],
  },
  {
    id:"saturn", name:"SATURN", symbol:"♄", isSun:false,
    bodyColor:"#e0c880", glowRgb:"230,200,110", accentColor:"#f0d060",
    bgOverlay:"rgba(80,60,0,0.6)", orbitFrac:0.69, radius:44,
    orbitSpd:0.034, spinSpd:0.028, hasRings:true, moonCount:3, atmosOpacity:0.18,
    tagline:"LORD OF THE RINGS",
    description:"Saturn's ring system spans 282,000 km yet is barely 10 metres thick — thinner proportionally than a sheet of paper. It would float in water. A jewel of the cosmos.",
    stats:[{l:"Distance",v:"9.58 AU"},{l:"Ring Span",v:"282,000 km"},{l:"Known Moons",v:"146"},{l:"Density",v:"0.69 g/cm³"}],
  },
  {
    id:"uranus", name:"URANUS", symbol:"⛢", isSun:false,
    bodyColor:"#7de8e8", glowRgb:"100,220,220", accentColor:"#88dddd",
    bgOverlay:"rgba(0,60,60,0.6)", orbitFrac:0.78, radius:32,
    orbitSpd:0.012, spinSpd:0.022, hasRings:true, moonCount:2, atmosOpacity:0.35,
    tagline:"THE TILTED GIANT",
    description:"Uranus rotates on its side — its axis tilted 98° — causing extreme seasonal shifts. Its rings are vertical. It radiates almost no internal heat, making it the coldest planet at −224°C.",
    stats:[{l:"Distance",v:"19.2 AU"},{l:"Axial Tilt",v:"97.77°"},{l:"Min Temp",v:"−224°C"},{l:"Moons",v:"28"}],
  },
  {
    id:"neptune", name:"NEPTUNE", symbol:"♆", isSun:false,
    bodyColor:"#1a3acc", glowRgb:"30,80,220", accentColor:"#4488ff",
    bgOverlay:"rgba(0,20,80,0.6)", orbitFrac:0.87, radius:28,
    orbitSpd:0.006, spinSpd:0.02, hasRings:false, moonCount:2, atmosOpacity:0.28,
    tagline:"THE DARK SENTINEL",
    description:"At the edge of our solar system, Neptune endures 2,100 km/h winds — the fastest in the solar system. Cold, dark, impossibly distant — it guards the threshold of interstellar space.",
    stats:[{l:"Distance",v:"30.1 AU"},{l:"Day Length",v:"16.1 hours"},{l:"Wind Speed",v:"2,100 km/h"},{l:"Known Moons",v:"16"}],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const lighten=(hex:string,f:number)=>"#"+[1,3,5].map(i=>Math.min(255,(parseInt(hex.slice(i,i+2),16)+f*255)|0).toString(16).padStart(2,"0")).join("");
const orbR=(frac:number,W:number,H:number)=>frac*Math.min(W,H)*0.92;

interface PlanetAngle{orbit:number;spin:number;moons:number[]}
interface WarpStar{x:number;y:number;angle:number;speed:number;len:number;col:string}

export default function SolarJourney(){
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const tRef       = useRef(0);
  const cam        = useRef({x:0,y:0,zoom:1,tx:0,ty:0,tz:1});
  const warpRef    = useRef(0);
  const lastStop   = useRef(-1);
  const warpTimer  = useRef<ReturnType<typeof setTimeout>|null>(null);
  const angRef     = useRef<PlanetAngle[]>(JOURNEY_STOPS.map(p=>({
    orbit:Math.random()*Math.PI*2, spin:0,
    moons:Array.from({length:p.moonCount},()=>Math.random()*Math.PI*2),
  })));
  const warpStars  = useRef<WarpStar[]>([]);
  const activeRef  = useRef(-1);

  const [activeStop,  setActiveStop]  = useState(-1);
  const [showInfo,    setShowInfo]    = useState(false);
  const [isWarping,   setIsWarping]   = useState(false);
  const [scrollPct,   setScrollPct]   = useState(0);

  // init warp stars
  useEffect(()=>{
    warpStars.current=Array.from({length:400},()=>{
      const a=Math.random()*Math.PI*2;
      const cols=["255,255,255","100,210,255","255,220,100","255,150,80"];
      return{x:0.5+Math.cos(a)*0.02,y:0.5+Math.sin(a)*0.02,angle:a,
             speed:0.002+Math.random()*0.005,len:0.4+Math.random()*0.8,
             col:cols[Math.floor(Math.random()*cols.length)]};
    });
  },[]);

  // resize
  useEffect(()=>{
    const resize=()=>{
      const c=canvasRef.current,w=wrapRef.current;
      if(!c||!w)return;
      c.width=w.clientWidth;c.height=w.clientHeight;
    };
    resize();
    window.addEventListener("resize",resize);
    return()=>window.removeEventListener("resize",resize);
  },[]);

  // ── render ────────────────────────────────────────────────────────────────
  const render=useCallback(()=>{
    const canvas=canvasRef.current;
    if(!canvas){rafRef.current=requestAnimationFrame(render);return;}
    const ctx=canvas.getContext("2d")!;
    const W=canvas.width,H=canvas.height,CX=W/2,CY=H/2;
    const t=tRef.current;
    const c=cam.current;
    const warp=warpRef.current;
    const ap=activeRef.current;

    c.x=lerp(c.x,c.tx,0.05);
    c.y=lerp(c.y,c.ty,0.05);
    c.zoom=lerp(c.zoom,c.tz,0.038);

    // BG
    ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
    const bgG=ctx.createRadialGradient(CX,CY*0.5,0,CX,CY,Math.max(W,H)*0.85);
    bgG.addColorStop(0,"#000a18");bgG.addColorStop(1,"#000000");
    ctx.fillStyle=bgG;ctx.fillRect(0,0,W,H);

    // planet tint
    if(ap>=0){
      const s=JOURNEY_STOPS[ap];
      const [r,g,b]=s.glowRgb.split(",").map(Number);
      const tG=ctx.createRadialGradient(CX,CY,0,CX,CY,Math.max(W,H)*0.75);
      tG.addColorStop(0,`rgba(${r},${g},${b},0.07)`);
      tG.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=tG;ctx.fillRect(0,0,W,H);
    }

    // nebula
    const neb=(x:number,y:number,rx:number,ry:number,r:number,g:number,b:number,a:number)=>{
      const mx=Math.max(rx,ry),sx=rx/mx,sy=ry/mx;
      ctx.save();ctx.scale(sx,sy);
      const grd=ctx.createRadialGradient(x/sx,y/sy,0,x/sx,y/sy,mx);
      grd.addColorStop(0,`rgba(${r},${g},${b},${a})`);grd.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=grd;ctx.beginPath();ctx.arc(x/sx,y/sy,mx,0,Math.PI*2);ctx.fill();ctx.restore();
    };
    neb(W*0.1,H*0.2,W*0.28,H*0.2,0,30,120,0.055);
    neb(W*0.9,H*0.6,W*0.22,H*0.18,80,0,140,0.045);
    neb(W*0.5,H*0.9,W*0.38,H*0.14,0,60,100,0.04);
    neb(W*0.3,H*0.65,W*0.18,H*0.14,30,0,80,0.03);

    // static stars
    const sA=clamp(1-warp*2,0,1);
    if(sA>0.01){
      ctx.save();
      for(let i=0;i<750;i++){
        const sx=((i*73.13)%1)*W,sy=((i*47.77)%1)*H,sr=0.25+((i*11.3)%1)*1.4;
        const pulse=0.5+0.5*Math.sin(t*(0.4+((i%7)*0.28))+i*0.3);
        ctx.globalAlpha=(0.22+((i*31.7)%1)*0.78)*sA*pulse;
        ctx.fillStyle=i%15===0?"#4db5ff":i%21===0?"#ffcc88":i%33===0?"#ff9988":"#fff";
        ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;ctx.restore();
    }

    // warp
    if(warp>0.01){
      ctx.fillStyle=`rgba(0,0,12,${warp*0.22})`;ctx.fillRect(0,0,W,H);
      warpStars.current.forEach(s=>{
        s.x+=Math.cos(s.angle)*s.speed*(1+warp*9);
        s.y+=Math.sin(s.angle)*s.speed*(1+warp*9);
        if(s.x<-0.06||s.x>1.06||s.y<-0.06||s.y>1.06){
          const a=Math.random()*Math.PI*2;s.angle=a;s.x=0.48+Math.cos(a)*0.04;s.y=0.48+Math.sin(a)*0.04;
        }
        const sx=s.x*W,sy=s.y*H,stretch=warp*s.len*95+3;
        const ex=sx-Math.cos(s.angle)*stretch,ey=sy-Math.sin(s.angle)*stretch;
        const lg=ctx.createLinearGradient(ex,ey,sx,sy);
        lg.addColorStop(0,`rgba(${s.col},0)`);lg.addColorStop(1,`rgba(${s.col},${clamp(0.5+warp*0.5,0,1)})`);
        ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(sx,sy);ctx.strokeStyle=lg;ctx.lineWidth=0.8+warp;ctx.stroke();
      });
      warpRef.current=lerp(warp,0,0.028);
    }

    // meteors
    if(ap<=0){
      for(let m=0;m<4;m++){
        const mt=(t*0.28+m*4.2)%14;
        const mx=((m*193+mt*55)%W),my=mt*30;
        const mlen=mt*22+8;
        const mg=ctx.createLinearGradient(mx,my,mx-mlen*0.7,my-mlen*0.4);
        mg.addColorStop(0,"rgba(255,255,255,0.7)");mg.addColorStop(1,"rgba(255,255,255,0)");
        ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx-mlen*0.7,my-mlen*0.4);
        ctx.strokeStyle=mg;ctx.lineWidth=1.5;ctx.stroke();
      }
    }

    // camera
    ctx.save();
    ctx.translate(CX+c.x,CY+c.y);
    ctx.scale(c.zoom,c.zoom);

    // ── ENHANCED SUN ──────────────────────────────────────────────────────
    drawEnhancedSun(ctx,t,ap);

    // asteroid belt
    const bR=orbR(0.47,W,H);
    const bAlpha=ap<=0?0.28:Math.max(0.04,0.28-Math.abs(ap-4)*0.05);
    for(let i=0;i<240;i++){
      const ba=(i/240)*Math.PI*2+t*0.0014;
      const br=bR+(((i*73)%100)/100-0.5)*55;
      const bx=Math.cos(ba)*br,by=Math.sin(ba)*br*0.34;
      ctx.globalAlpha=bAlpha*(0.18+((i*31)%10)/10*0.45);
      ctx.fillStyle="#907860";
      ctx.beginPath();ctx.arc(bx,by,0.7+((i*17)%10)/10*1.8,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;

    // planets (skip index 0 = sun, start from 1)
    JOURNEY_STOPS.slice(1).forEach((p,rawI)=>{
      const i=rawI+1; // real index in JOURNEY_STOPS
      const ang=angRef.current[i];
      ang.orbit+=p.orbitSpd*0.0008;
      ang.spin+=p.spinSpd;
      const oR2=orbR(p.orbitFrac,W,H);
      const isActive=ap===i;
      const oa=ap<=0?0.07:isActive?0.4:Math.abs(ap-i)===1?0.06:0.015;
      if(oa>0.01){
        ctx.beginPath();ctx.ellipse(0,0,oR2,oR2*0.34,0,0,Math.PI*2);
        ctx.strokeStyle=isActive?`rgba(${p.glowRgb},0.48)`:`rgba(255,255,255,${oa})`;
        ctx.lineWidth=isActive?1.8:0.5;ctx.stroke();
      }
      const px=Math.cos(ang.orbit)*oR2,py=Math.sin(ang.orbit)*oR2*0.34;
      drawRealisticPlanet(ctx,p,px,py,p.radius,t,ang,isActive);
    });

    ctx.restore();
    tRef.current+=0.007;
    rafRef.current=requestAnimationFrame(render);
  },[]);

  // ── Enhanced Sun Renderer ─────────────────────────────────────────────────
  function drawEnhancedSun(ctx:CanvasRenderingContext2D,t:number,ap:number){
    const sR=36,sunX=0,sunY=0;
    const isActive=ap===0;
    const scale=isActive?1:1;

    // distant glow halo (huge)
    const halo=ctx.createRadialGradient(sunX,sunY,sR*2,sunX,sunY,sR*12);
    halo.addColorStop(0,`rgba(255,180,20,${isActive?0.12:0.05})`);
    halo.addColorStop(0.4,`rgba(255,100,0,${isActive?0.06:0.02})`);
    halo.addColorStop(1,"rgba(255,50,0,0)");
    ctx.beginPath();ctx.arc(sunX,sunY,sR*12,0,Math.PI*2);ctx.fillStyle=halo;ctx.fill();

    // animated plasma loops (coronal mass ejections)
    for(let fl=0;fl<18;fl++){
      const fa=(fl/18)*Math.PI*2+t*0.035;
      const fPulse=1+Math.sin(t*1.4+fl*0.8)*0.35;
      const flen=sR*(1.8+fPulse*0.6);
      const fw=0.04+Math.sin(t*0.7+fl)*0.02;
      const fg=ctx.createLinearGradient(sunX,sunY,sunX+Math.cos(fa)*flen*2.2,sunY+Math.sin(fa)*flen*2.2);
      fg.addColorStop(0,`rgba(255,200,40,${0.06+fPulse*0.03})`);
      fg.addColorStop(0.6,`rgba(255,120,0,${0.04+fPulse*0.02})`);
      fg.addColorStop(1,"rgba(255,60,0,0)");
      ctx.beginPath();
      ctx.moveTo(sunX+Math.cos(fa)*sR*0.9,sunY+Math.sin(fa)*sR*0.9);
      ctx.lineTo(sunX+Math.cos(fa-fw)*flen*2.2,sunY+Math.sin(fa-fw)*flen*2.2);
      ctx.lineTo(sunX+Math.cos(fa+fw)*flen*2.2,sunY+Math.sin(fa+fw)*flen*2.2);
      ctx.fillStyle=fg;ctx.fill();
    }

    // corona inner ring
    const corona=ctx.createRadialGradient(sunX,sunY,sR*0.95,sunX,sunY,sR*4.5);
    corona.addColorStop(0,"rgba(255,220,60,0.35)");
    corona.addColorStop(0.2,"rgba(255,140,20,0.18)");
    corona.addColorStop(0.6,"rgba(255,80,0,0.06)");
    corona.addColorStop(1,"rgba(255,40,0,0)");
    ctx.beginPath();ctx.arc(sunX,sunY,sR*4.5,0,Math.PI*2);ctx.fillStyle=corona;ctx.fill();

    // chromosphere ring
    const chrom=ctx.createRadialGradient(sunX,sunY,sR-2,sunX,sunY,sR+6);
    chrom.addColorStop(0,"rgba(255,100,0,0)");
    chrom.addColorStop(0.5,"rgba(255,80,20,0.5)");
    chrom.addColorStop(1,"rgba(255,40,0,0)");
    ctx.beginPath();ctx.arc(sunX,sunY,sR+6,0,Math.PI*2);ctx.fillStyle=chrom;ctx.fill();

    // main photosphere (surface)
    const surf=ctx.createRadialGradient(sunX-sR*0.28,sunY-sR*0.28,sR*0.03,sunX,sunY,sR);
    surf.addColorStop(0,"#fff9f0");
    surf.addColorStop(0.15,"#fff0c0");
    surf.addColorStop(0.4,"#ffdd40");
    surf.addColorStop(0.7,"#ff9800");
    surf.addColorStop(0.9,"#ff5500");
    surf.addColorStop(1,"#cc2200");
    ctx.beginPath();ctx.arc(sunX,sunY,sR,0,Math.PI*2);ctx.fillStyle=surf;ctx.fill();

    // granulation texture (convection cells)
    ctx.save();ctx.beginPath();ctx.arc(sunX,sunY,sR,0,Math.PI*2);ctx.clip();
    for(let g=0;g<22;g++){
      const ga=(g/22)*Math.PI*2+t*0.015*((g%2)*2-1);
      const gd=sR*(0.15+((g*37)%10)/10*0.65);
      const gx=sunX+Math.cos(ga)*gd,gy=sunY+Math.sin(ga)*gd;
      const gSz=sR*(0.12+((g*13)%10)/10*0.18);
      const gg=ctx.createRadialGradient(gx,gy,0,gx,gy,gSz);
      const bright=0.2+Math.sin(t*0.8+g*1.2)*0.15;
      gg.addColorStop(0,`rgba(255,255,180,${bright})`);
      gg.addColorStop(0.5,`rgba(255,200,50,${bright*0.4})`);
      gg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(gx,gy,gSz,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
    }
    // sunspots
    for(let ss=0;ss<7;ss++){
      const sa=(ss/7)*Math.PI*2+t*0.018;
      const sd=sR*(0.25+((ss*41)%10)/10*0.5);
      const sx2=sunX+Math.cos(sa)*sd,sy2=sunY+Math.sin(sa)*sd;
      const sg=ctx.createRadialGradient(sx2,sy2,0,sx2,sy2,sR*0.18);
      sg.addColorStop(0,"rgba(80,20,0,0.75)");
      sg.addColorStop(0.5,"rgba(150,60,0,0.4)");
      sg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(sx2,sy2,sR*0.18,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
    }
    // plasma ripples
    for(let pr=0;pr<4;pr++){
      const prR=sR*(0.3+pr*0.18);
      const prA=0.08+Math.sin(t*1.5+pr)*0.05;
      ctx.beginPath();ctx.arc(sunX,sunY,prR,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,220,100,${prA})`;ctx.lineWidth=1.5;ctx.stroke();
    }
    ctx.restore();

    // fire particles (floating embers)
    if(ap<=1){
      for(let fp=0;fp<30;fp++){
        const fpa=(fp/30)*Math.PI*2+t*(0.2+fp*0.01);
        const fpd=sR*(1.05+((fp*17)%10)/10*0.4+Math.sin(t*1.2+fp)*0.15);
        const fpx=sunX+Math.cos(fpa)*fpd,fpy=sunY+Math.sin(fpa)*fpd;
        const fpSize=0.8+((fp*13)%10)/10*2;
        ctx.beginPath();ctx.arc(fpx,fpy,fpSize,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,${Math.floor(100+((fp*31)%100))},0,${0.4+Math.sin(t*2+fp)*0.3})`;
        ctx.fill();
      }
    }

    // active sun orbit highlight
    if(ap===0){
      ctx.beginPath();ctx.arc(sunX,sunY,sR*1.3,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,200,50,0.4)";ctx.lineWidth=2;ctx.stroke();
    }
  }

  // ── Realistic Planet Renderer ────────────────────────────────────────────
  function drawRealisticPlanet(
    ctx:CanvasRenderingContext2D,p:typeof JOURNEY_STOPS[0],
    px:number,py:number,size:number,t:number,
    ang:PlanetAngle,isActive:boolean
  ){
    const [r,g,b]=p.glowRgb.split(",").map(Number);

    // thick atmosphere glow (multi-layer)
    for(let layer=3;layer>=0;layer--){
      const layerR=size*(1.3+layer*0.3+p.atmosOpacity*layer*0.4);
      const layerA=(isActive?0.18:0.07)/(layer+1);
      const ag=ctx.createRadialGradient(px,py,size*0.8,px,py,layerR);
      ag.addColorStop(0,`rgba(${r},${g},${b},${layerA*2})`);
      ag.addColorStop(0.4,`rgba(${r},${g},${b},${layerA})`);
      ag.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(px,py,layerR,0,Math.PI*2);ctx.fillStyle=ag;ctx.fill();
    }

    // planet body with realistic gradient
    const pG=ctx.createRadialGradient(px-size*0.32,py-size*0.32,size*0.03,px+size*0.1,py+size*0.1,size*1.1);
    pG.addColorStop(0,lighten(p.bodyColor,0.38));
    pG.addColorStop(0.3,lighten(p.bodyColor,0.18));
    pG.addColorStop(0.6,p.bodyColor);
    pG.addColorStop(0.85,p.bodyColor);
    pG.addColorStop(1,"#000014");
    ctx.save();
    ctx.beginPath();ctx.arc(px,py,size,0,Math.PI*2);ctx.fillStyle=pG;ctx.fill();
    ctx.clip();

    // ── surface detail by planet ───────────────────────────────────────────
    if(p.id==="earth"){
      // ocean base
      ctx.fillStyle="rgba(20,80,160,0.3)";ctx.fillRect(px-size,py-size,size*2,size*2);
      // continents
      const sp=ang.spin*0.5;
      [[-0.18,-0.08,0.44,0.3],[0.38,0.02,0.22,0.36],[-0.36,0.14,0.26,0.32],[0.15,0.3,0.32,0.18],[0.0,-0.35,0.18,0.12]].forEach(([ox,oy,w,h],ci)=>{
        const rx=px+(ox*Math.cos(sp)-oy*Math.sin(sp))*size;
        const ry=py+(ox*Math.sin(sp)+oy*Math.cos(sp))*size;
        ctx.beginPath();ctx.ellipse(rx,ry,w*size*0.5,h*size*0.5,ci*0.4,0,Math.PI*2);
        ctx.fillStyle="rgba(34,110,34,0.72)";ctx.fill();
        // continent highlands
        ctx.beginPath();ctx.ellipse(rx+size*0.03,ry-size*0.02,w*size*0.25,h*size*0.25,ci*0.4,0,Math.PI*2);
        ctx.fillStyle="rgba(80,130,50,0.4)";ctx.fill();
      });
      // cloud system
      for(let c=0;c<7;c++){
        const ca=(c/7)*Math.PI*2+t*0.055;
        const cr=size*(0.38+((c*17)%10)/10*0.3);
        ctx.beginPath();ctx.ellipse(px+Math.cos(ca)*cr,py+Math.sin(ca)*cr*0.6,size*(0.25+((c*13)%10)/10*0.25),size*0.09,ca,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${0.10+((c*7)%10)/10*0.08})`;ctx.fill();
      }
      // polar ice
      ctx.beginPath();ctx.ellipse(px,py-size*0.82,size*0.35,size*0.1,0,0,Math.PI*2);
      ctx.fillStyle="rgba(220,240,255,0.6)";ctx.fill();
      ctx.beginPath();ctx.ellipse(px,py+size*0.82,size*0.25,size*0.08,0,0,Math.PI*2);
      ctx.fillStyle="rgba(220,240,255,0.5)";ctx.fill();
      // city lights (dark side)
      for(let cl=0;cl<12;cl++){
        const ca=Math.PI*0.55+cl*0.2;
        ctx.beginPath();ctx.arc(px+Math.cos(ca)*size*0.62,py+Math.sin(ca)*size*0.38,1.2,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,220,100,${0.3+Math.sin(t*0.9+cl)*0.18})`;ctx.fill();
      }
      // aurora
      if(isActive){
        const aG=ctx.createLinearGradient(px-size,py-size*0.9,px+size,py-size*0.9);
        aG.addColorStop(0,"rgba(0,255,100,0)");aG.addColorStop(0.3,"rgba(0,255,100,0.15)");
        aG.addColorStop(0.7,"rgba(0,150,255,0.12)");aG.addColorStop(1,"rgba(0,255,100,0)");
        ctx.beginPath();ctx.ellipse(px,py-size*0.9,size*0.7,size*0.1,0,0,Math.PI*2);
        ctx.fillStyle=aG;ctx.fill();
      }
    } else if(p.id==="jupiter"){
      // band system — more bands, more detail
      const bands=[
        {y:-0.85,h:0.08,c:"rgba(220,180,100,0.25)"},{y:-0.65,h:0.15,c:"rgba(160,100,50,0.4)"},
        {y:-0.42,h:0.12,c:"rgba(200,150,70,0.3)"},{y:-0.22,h:0.18,c:"rgba(140,90,40,0.45)"},
        {y:0.02,h:0.15,c:"rgba(180,130,60,0.35)"},{y:0.22,h:0.18,c:"rgba(150,100,45,0.42)"},
        {y:0.44,h:0.12,c:"rgba(200,155,75,0.28)"},{y:0.62,h:0.15,c:"rgba(160,110,55,0.38)"},
        {y:0.82,h:0.08,c:"rgba(220,180,100,0.22)"},
      ];
      bands.forEach(({y,h,c:bc})=>{
        const by=py+y*size+Math.sin(t*0.15+y*3)*2;
        ctx.beginPath();ctx.ellipse(px,by,size,h*size*0.5,0,0,Math.PI*2);
        ctx.fillStyle=bc;ctx.fill();
      });
      // Great Red Spot with swirl
      const gx=px+Math.cos(t*0.03)*size*0.28,gy=py+size*0.18;
      for(let rs=3;rs>=0;rs--){
        const rsG=ctx.createRadialGradient(gx,gy,rs*size*0.05,gx,gy,size*(0.28-rs*0.05));
        rsG.addColorStop(0,`rgba(${200-rs*20},${50+rs*10},${30+rs*5},${0.9-rs*0.2})`);
        rsG.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath();ctx.ellipse(gx,gy,size*(0.28-rs*0.04),size*(0.17-rs*0.03),0,0,Math.PI*2);
        ctx.fillStyle=rsG;ctx.fill();
      }
    } else if(p.id==="venus"){
      // thick cloud layers in yellows/oranges
      for(let cl=0;cl<4;cl++){
        for(let c=0;c<5;c++){
          const ca=(c/5)*Math.PI*2+t*(0.012+cl*0.004)+cl*0.8;
          const cr=size*(0.25+cl*0.18);
          ctx.beginPath();ctx.ellipse(px+Math.cos(ca)*cr,py+Math.sin(ca)*cr*0.7,size*(0.38+cl*0.06),size*(0.11+cl*0.02),ca,0,Math.PI*2);
          ctx.fillStyle=`rgba(${200+cl*10},${130+cl*8},${30+cl*5},${0.18+cl*0.06})`;ctx.fill();
        }
      }
      // atmospheric lightning
      if(Math.sin(t*3.4)>0.95){
        const lx=px+Math.cos(t*2)*size*0.45,ly=py+Math.sin(t*1.3)*size*0.4;
        ctx.beginPath();ctx.arc(lx,ly,size*0.07,0,Math.PI*2);
        ctx.fillStyle="rgba(255,240,180,0.8)";ctx.fill();
        const lG=ctx.createRadialGradient(lx,ly,0,lx,ly,size*0.25);
        lG.addColorStop(0,"rgba(255,240,180,0.3)");lG.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath();ctx.arc(lx,ly,size*0.25,0,Math.PI*2);ctx.fillStyle=lG;ctx.fill();
      }
    } else if(p.id==="mars"){
      // terrain detail
      ctx.fillStyle="rgba(150,60,20,0.2)";ctx.fillRect(px-size,py-size,size*2,size*2);
      // highland regions
      [[-0.3,-0.2,0.5,0.35],[-0.1,0.3,0.4,0.2],[0.35,-0.1,0.3,0.3]].forEach(([ox,oy,w,h],mi)=>{
        ctx.beginPath();ctx.ellipse(px+ox*size,py+oy*size,w*size*0.5,h*size*0.5,mi*0.7,0,Math.PI*2);
        ctx.fillStyle="rgba(180,80,30,0.35)";ctx.fill();
      });
      // dust storms
      for(let d=0;d<4;d++){
        const da=(d/4)*Math.PI*2+t*0.045;
        ctx.beginPath();ctx.ellipse(px+Math.cos(da)*size*0.42,py+Math.sin(da)*size*0.32,size*0.28,size*0.09,da,0,Math.PI*2);
        ctx.fillStyle=`rgba(210,100,40,${0.2+Math.sin(t*0.5+d)*0.1})`;ctx.fill();
      }
      // polar caps
      ctx.beginPath();ctx.ellipse(px,py-size*0.78,size*0.28,size*0.09,0,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,240,0.6)";ctx.fill();
      ctx.beginPath();ctx.ellipse(px,py+size*0.8,size*0.18,size*0.06,0,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,240,0.4)";ctx.fill();
      // colony lights
      if(isActive){
        for(let cv=0;cv<8;cv++){
          const ca=(cv/8)*Math.PI*2+0.5;
          ctx.beginPath();ctx.arc(px+Math.cos(ca)*size*0.5,py+Math.sin(ca)*size*0.35,1.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(100,200,255,${0.4+Math.sin(t*1.5+cv)*0.2})`;ctx.fill();
        }
      }
    } else if(p.id==="neptune"){
      // deep blue atmospheric bands
      for(let b=0;b<5;b++){
        const by=py-size+(b/5)*size*2+Math.sin(t*0.25+b)*4;
        ctx.beginPath();ctx.ellipse(px,by,size,size*0.07,0,0,Math.PI*2);
        ctx.fillStyle=b%2===0?"rgba(40,100,230,0.42)":"rgba(20,60,180,0.3)";ctx.fill();
      }
      // Great Dark Spot
      const ndx=px+Math.cos(t*0.06)*size*0.3,ndy=py-size*0.15;
      const ndG=ctx.createRadialGradient(ndx,ndy,0,ndx,ndy,size*0.2);
      ndG.addColorStop(0,"rgba(10,30,120,0.8)");ndG.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.ellipse(ndx,ndy,size*0.2,size*0.13,0,0,Math.PI*2);
      ctx.fillStyle=ndG;ctx.fill();
      // frozen particle haze
      if(isActive){
        for(let fp=0;fp<20;fp++){
          const fpa=(fp/20)*Math.PI*2+t*0.18;
          const fpR=size*(1.1+((fp*13)%10)/10*0.3);
          ctx.beginPath();ctx.arc(px+Math.cos(fpa)*fpR,py+Math.sin(fpa)*fpR*0.5,1,0,Math.PI*2);
          ctx.fillStyle=`rgba(150,200,255,${0.3+Math.sin(t*2+fp)*0.15})`;ctx.fill();
        }
      }
    } else if(p.id==="uranus"){
      // pale blue-green with subtle bands
      for(let b=0;b<5;b++){
        const by=py-size+(b/5)*size*2+Math.sin(t*0.2+b)*2;
        ctx.beginPath();ctx.ellipse(px,by,size,size*0.06,0,0,Math.PI*2);
        ctx.fillStyle=b%2===0?"rgba(100,220,220,0.2)":"rgba(60,180,180,0.15)";ctx.fill();
      }
    } else if(p.id==="mercury"){
      // crater landscape
      for(let cr=0;cr<14;cr++){
        const ca=(cr/14)*Math.PI*2+cr*0.65;
        const crR=(0.15+((cr*37)%10)/10*0.6)*size;
        const crx=px+Math.cos(ca)*crR,cry=py+Math.sin(ca)*crR*0.8;
        const crSz=size*(0.05+((cr*13)%10)/10*0.1);
        const crG=ctx.createRadialGradient(crx,cry,0,crx,cry,crSz);
        crG.addColorStop(0,"rgba(50,40,30,0.6)");crG.addColorStop(0.7,"rgba(80,70,60,0.3)");crG.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath();ctx.arc(crx,cry,crSz,0,Math.PI*2);ctx.fillStyle=crG;ctx.fill();
        // crater rim highlight
        ctx.beginPath();ctx.arc(crx-crSz*0.3,cry-crSz*0.3,crSz*0.6,0,Math.PI*2);
        ctx.strokeStyle="rgba(180,160,140,0.3)";ctx.lineWidth=0.8;ctx.stroke();
      }
    } else if(p.id==="saturn"){
      // banded atmosphere
      for(let b=0;b<6;b++){
        const by=py-size+(b/6)*size*2+Math.sin(t*0.22+b)*2;
        ctx.beginPath();ctx.ellipse(px,by,size,size*0.058,0,0,Math.PI*2);
        ctx.fillStyle=b%2===0?"rgba(200,170,80,0.24)":"rgba(240,210,120,0.18)";ctx.fill();
      }
    }

    ctx.restore();

    // saturn+uranus rings
    if(p.hasRings){
      ctx.save();ctx.translate(px,py);
      const tilt=p.id==="uranus"?0.15:0.28;
      ctx.scale(1,tilt);
      for(let ri=0;ri<7;ri++){
        const rIn=size*1.22+ri*size*0.16,rOut=rIn+size*0.13;
        const rAlpha=p.id==="uranus"?0.35-ri*0.04:0.5-ri*0.07;
        const rColor=p.id==="uranus"?"rgba(150,200,200,":"rgba(230,200,145,";
        ctx.beginPath();ctx.arc(0,0,rOut,0,Math.PI*2);ctx.arc(0,0,rIn,0,Math.PI*2,true);
        ctx.fillStyle=rColor+rAlpha+")";ctx.fill();
      }
      if(isActive){
        for(let rp=0;rp<55;rp++){
          const rpa=(rp/55)*Math.PI*2+t*0.55;
          const rpR=size*1.3+((rp*17)%size)*1.9;
          ctx.beginPath();ctx.arc(Math.cos(rpa)*rpR,Math.sin(rpa)*rpR,0.8,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,245,210,${0.3+Math.sin(t+rp)*0.2})`;ctx.fill();
        }
      }
      ctx.restore();
    }

    // realistic terminator (shadow)
    const shG=ctx.createRadialGradient(px+size*0.4,py,size*0.05,px+size*1.1,py,size*1.22);
    shG.addColorStop(0,"rgba(0,0,0,0)");
    shG.addColorStop(0.3,"rgba(0,0,8,0.15)");
    shG.addColorStop(0.65,"rgba(0,0,5,0.55)");
    shG.addColorStop(1,"rgba(0,0,0,0.88)");
    ctx.beginPath();ctx.arc(px,py,size*1.02,0,Math.PI*2);ctx.fillStyle=shG;ctx.fill();

    // specular highlight
    const specG=ctx.createRadialGradient(px-size*0.35,py-size*0.35,0,px-size*0.25,py-size*0.25,size*0.55);
    specG.addColorStop(0,`rgba(255,255,255,${isActive?0.18:0.1})`);
    specG.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.arc(px,py,size,0,Math.PI*2);ctx.fillStyle=specG;ctx.fill();

    // active orbit ring + dust
    if(isActive){
      ctx.beginPath();ctx.arc(px,py,size*1.25,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${r},${g},${b},0.6)`;ctx.lineWidth=2;ctx.stroke();
      for(let od=0;od<40;od++){
        const oda=(od/40)*Math.PI*2+t*0.26;
        const odR=size*1.7+Math.sin(t*2+od)*size*0.2;
        ctx.beginPath();ctx.arc(px+Math.cos(oda)*odR,py+Math.sin(oda)*odR*0.5,0.8,0,Math.PI*2);
        ctx.fillStyle=`rgba(${r},${g},${b},${0.18+Math.sin(t+od)*0.1})`;ctx.fill();
      }
    }

    // moons with realistic detail
    ang.moons.forEach((ma,mi)=>{
      ang.moons[mi]+=0.018+mi*0.012;
      const mR=size*1.9+mi*size*0.7;
      const mSz=size*(0.13+mi*0.055);
      const mx=px+Math.cos(ang.moons[mi])*mR,my=py+Math.sin(ang.moons[mi])*mR*0.45;
      const mG=ctx.createRadialGradient(mx-mSz*0.3,my-mSz*0.25,0,mx,my,mSz);
      mG.addColorStop(0,"rgba(230,225,220,0.95)");mG.addColorStop(0.6,"rgba(160,155,150,0.8)");mG.addColorStop(1,"rgba(60,60,60,0.4)");
      ctx.beginPath();ctx.arc(mx,my,Math.max(1.5,mSz),0,Math.PI*2);ctx.fillStyle=mG;ctx.fill();
      // moon shadow
      const msG=ctx.createRadialGradient(mx+mSz*0.3,my,mSz*0.05,mx+mSz,my,mSz*1.1);
      msG.addColorStop(0,"rgba(0,0,0,0)");msG.addColorStop(1,"rgba(0,0,0,0.7)");
      ctx.beginPath();ctx.arc(mx,my,mSz,0,Math.PI*2);ctx.fillStyle=msG;ctx.fill();
    });

    // jupiter lightning
    if(p.id==="jupiter"&&isActive&&Math.sin(t*4.8)>0.94){
      const lx=px+(Math.random()-0.5)*size*1.5,ly=py+(Math.random()-0.5)*size;
      const lG=ctx.createRadialGradient(lx,ly,0,lx,ly,size*0.15);
      lG.addColorStop(0,"rgba(255,255,200,0.9)");lG.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(lx,ly,size*0.15,0,Math.PI*2);ctx.fillStyle=lG;ctx.fill();
    }
  }

  // ── scroll handler ────────────────────────────────────────────────────────
  useEffect(()=>{
    const sc=scrollRef.current,canvas=canvasRef.current;
    if(!sc||!canvas)return;
    const onScroll=()=>{
      const prog=sc.scrollTop/(sc.scrollHeight-sc.clientHeight);
      setScrollPct(prog);
      const W=canvas.width,H=canvas.height;
      const totalStops=JOURNEY_STOPS.length; // 9 (sun + 8 planets)

      if(prog<0.05){
        activeRef.current=-1;setActiveStop(-1);setShowInfo(false);
        cam.current.tx=0;cam.current.ty=0;cam.current.tz=1;warpRef.current=0;return;
      }

      const raw=((prog-0.05)/0.95)*totalStops;
      const sIdx=clamp(Math.floor(raw),0,totalStops-1);
      const segP=raw-sIdx;

      if(sIdx!==lastStop.current){
        lastStop.current=sIdx;activeRef.current=sIdx;
        setActiveStop(sIdx);setShowInfo(false);setIsWarping(true);
        warpRef.current=sIdx===0?0.4:1;
        if(warpTimer.current)clearTimeout(warpTimer.current);
        warpTimer.current=setTimeout(()=>{setIsWarping(false);setShowInfo(true);},sIdx===0?600:1100);
      }

      const stop=JOURNEY_STOPS[sIdx];
      if(stop.isSun){
        // Sun: start at overview zoom, slowly close in
        const zF=1.5+segP*2.5;
        cam.current.tx=0;cam.current.ty=0;cam.current.tz=zF;
      } else {
        const ang=angRef.current[sIdx];
        const oR2=orbR(stop.orbitFrac,W,H);
        const plx=Math.cos(ang.orbit)*oR2,ply=Math.sin(ang.orbit)*oR2*0.34;
        const zMap:{[k:string]:number}={mercury:13,venus:9,earth:9,mars:11,jupiter:4.5,saturn:5,uranus:6,neptune:8};
        const zB=zMap[stop.id]??8;
        const zF=zB+segP*1.8;
        cam.current.tx=-plx*(zF*0.9);cam.current.ty=-ply*(zF*0.9);cam.current.tz=zF;
      }
    };
    sc.addEventListener("scroll",onScroll,{passive:true});
    return()=>sc.removeEventListener("scroll",onScroll);
  },[]);

  // start loop
  useEffect(()=>{rafRef.current=requestAnimationFrame(render);return()=>cancelAnimationFrame(rafRef.current);},[render]);

  const cur=activeStop>=0?JOURNEY_STOPS[activeStop]:null;

  return(
    <div ref={wrapRef} style={{position:"relative",width:"100%",height:"100vh"}}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:3,pointerEvents:"none"}}/>
      <div ref={scrollRef} style={{position:"fixed",inset:0,zIndex:5,overflowY:"scroll",overflowX:"hidden"}}>
        {/* 9 stops × ~2 screens each = 1800vh */}
        <div style={{height:"1900vh"}}/>
      </div>

      <AnimatePresence>
        {activeStop===-1&&(
          <motion.div key="ov" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}}
            style={{position:"fixed",bottom:110,left:"50%",transform:"translateX(-50%)",zIndex:20,textAlign:"center",pointerEvents:"none"}}>
            <div className="font-mono text-cyan-400/60 tracking-[0.3em] text-[11px] mb-2 uppercase">◈ SCROLL TO BEGIN — SUN TO NEPTUNE</div>
            <div style={{width:1,height:44,background:"linear-gradient(to bottom,#00f5ff,transparent)",margin:"0 auto",animation:"pulse 2s ease-in-out infinite"}}/>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWarping&&cur&&(
          <motion.div key="warp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:20,pointerEvents:"none"}}>
            <p className="font-orbitron tracking-[0.4em] text-sm uppercase animate-pulse"
               style={{color:cur.accentColor,textShadow:`0 0 30px ${cur.accentColor}`}}>
              {cur.isSun?"APPROACHING THE SUN":"TRAVELING TO "+cur.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfo&&cur&&!isWarping&&(<InfoPanel stop={cur} index={activeStop} key={cur.id}/>)}
      </AnimatePresence>

      {/* nav dots */}
      <div style={{position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",zIndex:20,display:"flex",flexDirection:"column",gap:8}}>
        {JOURNEY_STOPS.map((s,i)=>(
          <button key={s.id} title={s.name}
            onClick={()=>{
              const sc=scrollRef.current;if(!sc)return;
              const maxH=sc.scrollHeight-sc.clientHeight;
              sc.scrollTo({top:(0.05+(i/JOURNEY_STOPS.length)*0.95+0.02)*maxH,behavior:"smooth"});
            }}
            style={{width:activeStop===i?10:6,height:activeStop===i?10:6,borderRadius:"50%",
              background:activeStop===i?s.accentColor:"rgba(255,255,255,0.18)",
              border:"none",cursor:"pointer",
              boxShadow:activeStop===i?`0 0 10px ${s.accentColor}`:"none",
              transition:"all 0.3s ease"}}/>
        ))}
      </div>

      <div style={{position:"fixed",bottom:12,left:"50%",transform:"translateX(-50%)",zIndex:20,width:160,height:1,background:"rgba(255,255,255,0.06)"}}>
        <div style={{height:"100%",width:`${scrollPct*100}%`,background:cur?cur.accentColor:"#00f5ff",
          boxShadow:`0 0 8px ${cur?cur.accentColor:"#00f5ff"}`,transition:"width 0.1s ease"}}/>
      </div>
    </div>
  );
}

function InfoPanel({stop,index}:{stop:typeof JOURNEY_STOPS[0];index:number}){
  return(
    <motion.div
      initial={{opacity:0,x:-55}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-55}}
      transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
      style={{position:"fixed",left:28,top:"50%",transform:"translateY(-50%)",zIndex:20,maxWidth:300,pointerEvents:"none"}}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.15}}
        className="font-mono text-[10px] tracking-[0.3em] mb-1 uppercase" style={{color:stop.accentColor+"80"}}>
        {stop.isSun?"◈ OUR STAR · THE SUN":`◈ PLANET ${String(index).padStart(2,"0")} / 08`}
      </motion.div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
        className="font-mono text-[9px] tracking-[0.22em] mb-2" style={{color:stop.accentColor+"55"}}>
        {stop.tagline}
      </motion.div>
      <motion.h2 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.28,duration:0.7}}
        className="font-orbitron font-black leading-none mb-1"
        style={{fontSize:"clamp(2rem,5vw,3.5rem)",color:stop.accentColor,textShadow:`0 0 28px ${stop.accentColor}80`}}>
        {stop.name}
      </motion.h2>
      <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.44,duration:0.55}}
        style={{height:1,marginBottom:12,background:`linear-gradient(90deg,${stop.accentColor}80,transparent)`,transformOrigin:"left"}}/>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.58}}
        className="font-exo text-white/40 text-sm leading-relaxed mb-5">{stop.description}</motion.p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
        {stop.stats.map((s,si)=>(
          <motion.div key={s.l} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.68+si*0.08}}
            style={{padding:"9px 11px",border:`1px solid ${stop.accentColor}22`,background:stop.bgOverlay,backdropFilter:"blur(8px)"}}>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-1" style={{color:stop.accentColor+"70"}}>{s.l}</div>
            <div className="font-orbitron text-xs font-bold text-white">{s.v}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{opacity:0,scale:0.5}} animate={{opacity:0.08,scale:1}} transition={{delay:0.9}}
        className="font-orbitron select-none"
        style={{position:"absolute",right:-16,top:"42%",transform:"translateY(-50%)",fontSize:88,color:stop.accentColor,lineHeight:1}}>
        {stop.symbol}
      </motion.div>
    </motion.div>
  );
}
