"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const APOLLO_MISSIONS = [
  { mission: "Apollo 11", date: "Jul 20, 1969", crew: "Armstrong · Aldrin · Collins", note: "First humans on the Moon — Sea of Tranquility", color: "#c8a882" },
  { mission: "Apollo 12", date: "Nov 19, 1969", crew: "Conrad · Bean · Gordon", note: "Precision landing near Surveyor 3 probe", color: "#b09870" },
  { mission: "Apollo 14", date: "Feb 5, 1971", crew: "Shepard · Mitchell · Roosa", note: "Fra Mauro highlands — Alan Shepard played golf", color: "#c0a278" },
  { mission: "Apollo 15", date: "Jul 30, 1971", crew: "Scott · Irwin · Worden", note: "First Lunar Roving Vehicle deployed", color: "#b09870" },
  { mission: "Apollo 16", date: "Apr 21, 1972", crew: "Young · Duke · Mattingly", note: "Descartes Highlands — first highland landing", color: "#c8a882" },
  { mission: "Apollo 17", date: "Dec 11, 1972", crew: "Cernan · Schmitt · Evans", note: "Last humans on the Moon · 75 hours on surface", color: "#e0b894" },
];

export default function MoonLandingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [activeApollo, setActiveApollo] = useState(0);

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
    window.addEventListener("resize", resize);

    // Dust particles
    const dust = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: 0.58 + Math.random() * 0.42,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: -Math.random() * 0.00015,
      r: Math.random() * 1.8 + 0.4,
      life: Math.random(), maxLife: 0.5 + Math.random() * 1.5,
      alpha: Math.random() * 0.5,
    }));

    // Shooting stars
    const shooters: { x: number; y: number; vx: number; vy: number; len: number; alpha: number; life: number }[] = [];
    let shootTimer = 0;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sky — black to deep navy
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
      sky.addColorStop(0, "#000000");
      sky.addColorStop(0.4, "#020308");
      sky.addColorStop(0.75, "#060912");
      sky.addColorStop(1, "#0e0e1a");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.62);

      // Stars — dense field
      for (let i = 0; i < 500; i++) {
        const sx = ((i * 73.13) % 1) * W;
        const sy = ((i * 47.77) % 1) * H * 0.62;
        const sr = 0.3 + ((i * 11.3) % 1) * 1.3;
        const pulse = 0.4 + 0.6 * Math.sin(t * (0.3 + (i % 9) * 0.1) + i * 0.5);
        const baseAlpha = 0.25 + ((i * 31.7) % 1) * 0.75;
        ctx.globalAlpha = baseAlpha * pulse;
        if (i % 15 === 0) ctx.fillStyle = "#88ccff";
        else if (i % 22 === 0) ctx.fillStyle = "#ffddaa";
        else if (i % 37 === 0) ctx.fillStyle = "#ffa0a0";
        else ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Milky Way band (subtle)
      for (let m = 0; m < 200; m++) {
        const mx = ((m * 137.5) % 1) * W;
        const my = H * 0.05 + ((m * 53.3) % 1) * H * 0.22;
        const mA = (Math.sin((mx / W) * Math.PI) * 0.08) * (0.3 + Math.random() * 0.4);
        ctx.fillStyle = `rgba(200,210,255,${mA})`;
        ctx.beginPath(); ctx.arc(mx, my, 0.5 + Math.random(), 0, Math.PI * 2); ctx.fill();
      }

      // Shooting stars
      shootTimer++;
      if (shootTimer > 180 + Math.random() * 120) {
        shootTimer = 0;
        const sx = Math.random() * W * 0.7 + W * 0.15;
        shooters.push({ x: sx, y: H * 0.04 + Math.random() * H * 0.2, vx: 4 + Math.random() * 3, vy: 1 + Math.random(), len: 40 + Math.random() * 50, alpha: 1, life: 0 });
      }
      shooters.forEach((s, si) => {
        s.x += s.vx; s.y += s.vy; s.life++;
        const fadeAlpha = s.alpha * (1 - s.life / 50);
        if (fadeAlpha > 0) {
          const sg = ctx.createLinearGradient(s.x - s.vx * 6, s.y - s.vy * 6, s.x, s.y);
          sg.addColorStop(0, `rgba(255,255,255,0)`);
          sg.addColorStop(1, `rgba(255,255,255,${fadeAlpha})`);
          ctx.beginPath(); ctx.moveTo(s.x - s.vx * 6, s.y - s.vy * 6); ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = sg; ctx.lineWidth = 1.2; ctx.stroke();
        }
      });
      for (let i = shooters.length - 1; i >= 0; i--) {
        if (shooters[i].life > 50 || shooters[i].x > W + 50) shooters.splice(i, 1);
      }

      // Earth in sky (upper right) — emotional, distant
      const earthX = W * 0.78, earthY = H * 0.19, earthR = H * 0.115;

      // Earth glow corona
      const earthCorona = ctx.createRadialGradient(earthX, earthY, earthR * 0.7, earthX, earthY, earthR * 2.1);
      earthCorona.addColorStop(0, "rgba(40,100,220,0.12)");
      earthCorona.addColorStop(0.5, "rgba(30,80,200,0.05)");
      earthCorona.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(earthX, earthY, earthR * 2.1, 0, Math.PI * 2);
      ctx.fillStyle = earthCorona; ctx.fill();

      // Earth body
      const earthG = ctx.createRadialGradient(earthX - earthR * 0.28, earthY - earthR * 0.22, earthR * 0.04, earthX, earthY, earthR);
      earthG.addColorStop(0, "#5ab8ff");
      earthG.addColorStop(0.12, "#2a7fd4");
      earthG.addColorStop(0.35, "#1458a8");
      earthG.addColorStop(0.65, "#0c3370");
      earthG.addColorStop(0.88, "#071840");
      earthG.addColorStop(1, "#020810");
      ctx.save();
      ctx.beginPath(); ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.fillStyle = earthG; ctx.fill(); ctx.clip();

      // continents on Earth
      const ecDrift = t * 0.003;
      [
        { ox: -0.15, oy: -0.28, rx: 0.24, ry: 0.16, rot: -0.3 },
        { ox: 0.15, oy: -0.22, rx: 0.22, ry: 0.18, rot: 0.1 },
        { ox: 0.12, oy: 0.1, rx: 0.12, ry: 0.26, rot: 0.05 },
      ].forEach(c => {
        const cx = earthX + (c.ox + Math.sin(ecDrift) * 0.01) * earthR;
        const cy = earthY + c.oy * earthR;
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.rx * earthR);
        cg.addColorStop(0, "rgba(70,110,45,0.88)");
        cg.addColorStop(0.6, "rgba(55,90,38,0.75)");
        cg.addColorStop(1, "rgba(50,80,32,0.5)");
        ctx.beginPath(); ctx.ellipse(cx, cy, c.rx * earthR, c.ry * earthR, c.rot, 0, Math.PI * 2);
        ctx.fillStyle = cg; ctx.fill();
      });
      // Cloud wisps
      for (let cl = 0; cl < 4; cl++) {
        const ca = (cl / 4) * Math.PI * 2 + t * 0.008;
        ctx.beginPath();
        ctx.ellipse(earthX + Math.cos(ca) * earthR * 0.45, earthY + Math.sin(ca) * earthR * 0.35,
          earthR * 0.32, earthR * 0.07, ca, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fill();
      }
      ctx.restore();

      // Earth atmosphere limb
      const eAtm = ctx.createRadialGradient(earthX, earthY, earthR * 0.93, earthX, earthY, earthR * 1.15);
      eAtm.addColorStop(0, "rgba(0,0,0,0)");
      eAtm.addColorStop(0.4, "rgba(80,160,255,0.28)");
      eAtm.addColorStop(0.8, "rgba(50,120,220,0.1)");
      eAtm.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(earthX, earthY, earthR * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = eAtm; ctx.fill();

      // Earth terminator shadow
      const eshG = ctx.createRadialGradient(earthX + earthR * 0.4, earthY + earthR * 0.2, 0, earthX + earthR * 0.4, earthY, earthR * 1.1);
      eshG.addColorStop(0, "rgba(0,0,0,0)");
      eshG.addColorStop(0.4, "rgba(0,0,10,0.5)");
      eshG.addColorStop(1, "rgba(0,0,10,0.82)");
      ctx.save(); ctx.beginPath(); ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = eshG; ctx.beginPath(); ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Moon surface
      const surfY = H * 0.62;
      const surface = ctx.createLinearGradient(0, surfY - 10, 0, H);
      surface.addColorStop(0, "#2f2f2f");
      surface.addColorStop(0.08, "#232323");
      surface.addColorStop(0.3, "#1a1a1a");
      surface.addColorStop(0.6, "#131313");
      surface.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = surface; ctx.fillRect(0, surfY - 10, W, H - surfY + 10);

      // Horizon rim glow — sunlit edge
      const horizG = ctx.createLinearGradient(0, surfY - 25, 0, surfY + 40);
      horizG.addColorStop(0, "rgba(0,0,0,0)");
      horizG.addColorStop(0.35, "rgba(180,165,140,0.14)");
      horizG.addColorStop(0.6, "rgba(160,148,120,0.08)");
      horizG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = horizG; ctx.fillRect(0, surfY - 25, W, 65);

      // Surface texture noise (micro craters)
      for (let n = 0; n < 80; n++) {
        const nx = ((n * 137.5) % 1) * W;
        const ny = surfY + 5 + ((n * 73.3) % 1) * (H - surfY - 10);
        const nr = 1 + ((n * 43.7) % 1) * 4;
        ctx.beginPath(); ctx.arc(nx, ny, nr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${0.25 + ((n * 17) % 10) / 10 * 0.3})`; ctx.fill();
        // crater rim highlights
        ctx.beginPath(); ctx.arc(nx - nr * 0.25, ny - nr * 0.2, nr * 0.9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,95,80,0.08)`; ctx.lineWidth = 0.5; ctx.stroke();
      }

      // Large craters
      const craters = [
        { x: 0.08, y: 0.7, r: 0.055 }, { x: 0.28, y: 0.76, r: 0.03 },
        { x: 0.68, y: 0.72, r: 0.04 }, { x: 0.88, y: 0.74, r: 0.026 },
        { x: 0.52, y: 0.88, r: 0.062 }, { x: 0.18, y: 0.91, r: 0.038 },
        { x: 0.78, y: 0.85, r: 0.032 },
      ];
      craters.forEach(cr => {
        const cx = cr.x * W, cy = cr.y * H, cr2 = cr.r * Math.min(W, H);
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr2);
        cg.addColorStop(0, "rgba(0,0,0,0.55)");
        cg.addColorStop(0.7, "rgba(0,0,0,0.18)");
        cg.addColorStop(1, "rgba(80,75,65,0.06)");
        ctx.beginPath(); ctx.arc(cx, cy, cr2, 0, Math.PI * 2);
        ctx.fillStyle = cg; ctx.fill();
        // sunlit rim
        ctx.beginPath();
        ctx.arc(cx - cr2 * 0.18, cy - cr2 * 0.12, cr2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(180,170,148,0.12)";
        ctx.lineWidth = 1.5; ctx.stroke();
      });

      // Rocks
      [[0.36, 0.63], [0.72, 0.65], [0.22, 0.67], [0.58, 0.64], [0.45, 0.66]].forEach(([rx, ry]) => {
        const rockX = rx * W, rockY = ry * H;
        const rockG = ctx.createRadialGradient(rockX - 3, rockY - 2, 0, rockX, rockY, 8);
        rockG.addColorStop(0, "rgba(120,115,100,0.8)");
        rockG.addColorStop(0.5, "rgba(80,78,68,0.6)");
        rockG.addColorStop(1, "rgba(40,40,35,0.4)");
        ctx.beginPath();
        ctx.ellipse(rockX, rockY, 7 + Math.sin(rx * 10) * 3, 4 + Math.cos(ry * 8) * 1.5, rx * 2, 0, Math.PI * 2);
        ctx.fillStyle = rockG; ctx.fill();
      });

      // Lunar Module
      const lmX = W * 0.38, lmY = H * 0.575;
      ctx.save(); ctx.translate(lmX, lmY);
      // descent stage legs
      [[-1, 1], [1, 1]].forEach(([dx]) => {
        ctx.beginPath(); ctx.moveTo(dx * 3, 2); ctx.lineTo(dx * 28, 24);
        ctx.strokeStyle = "rgba(200,190,165,0.75)"; ctx.lineWidth = 2.5; ctx.stroke();
        // footpad
        const fpG = ctx.createRadialGradient(dx * 28, 26, 0, dx * 28, 26, 7);
        fpG.addColorStop(0, "rgba(210,200,175,0.8)");
        fpG.addColorStop(1, "rgba(160,155,135,0.4)");
        ctx.beginPath(); ctx.ellipse(dx * 28, 26, 7, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = fpG; ctx.fill();
      });
      // Descent stage
      const dsG = ctx.createLinearGradient(-18, -5, 18, 10);
      dsG.addColorStop(0, "rgba(215,205,175,0.9)");
      dsG.addColorStop(0.5, "rgba(195,185,155,0.85)");
      dsG.addColorStop(1, "rgba(165,155,130,0.8)");
      ctx.fillStyle = dsG; ctx.fillRect(-18, -5, 36, 26);
      // mylar gold foil
      ctx.strokeStyle = "rgba(200,165,60,0.4)"; ctx.lineWidth = 0.5;
      for (let f = 0; f < 5; f++) {
        ctx.beginPath();
        ctx.moveTo(-18 + f * 7.2, -5);
        ctx.lineTo(-18 + f * 7.2, 21);
        ctx.stroke();
      }
      // Ascent stage
      const asG = ctx.createRadialGradient(-3, -28, 2, 0, -22, 18);
      asG.addColorStop(0, "rgba(230,225,210,0.95)");
      asG.addColorStop(0.5, "rgba(200,195,180,0.9)");
      asG.addColorStop(1, "rgba(165,160,145,0.8)");
      ctx.fillStyle = asG; ctx.beginPath(); ctx.roundRect(-14, -42, 28, 38, 4); ctx.fill();
      // Main window
      const winG = ctx.createRadialGradient(-4, -28, 0, -4, -28, 8);
      winG.addColorStop(0, "rgba(180,230,255,0.7)");
      winG.addColorStop(1, "rgba(80,160,220,0.3)");
      ctx.beginPath(); ctx.ellipse(-4, -28, 7, 6, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = winG; ctx.fill();
      ctx.beginPath(); ctx.ellipse(-4, -28, 7, 6, 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(150,200,255,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      // Antenna
      ctx.beginPath(); ctx.moveTo(4, -42); ctx.lineTo(4, -62);
      ctx.strokeStyle = "rgba(210,210,210,0.8)"; ctx.lineWidth = 1.5; ctx.stroke();
      const antG = ctx.createRadialGradient(4, -62, 0, 4, -62, 6);
      antG.addColorStop(0, "rgba(255,245,180,0.8)");
      antG.addColorStop(1, "rgba(255,200,50,0.1)");
      ctx.beginPath(); ctx.arc(4, -62, 5, 0, Math.PI * 2); ctx.fillStyle = antG; ctx.fill();
      // Thruster quads
      [[-16, -38], [14, -38], [-16, -15], [14, -15]].forEach(([tx, ty]) => {
        ctx.fillStyle = "rgba(80,75,65,0.7)";
        ctx.beginPath(); ctx.roundRect(tx - 2, ty - 2, 4, 4, 1); ctx.fill();
      });
      ctx.restore();

      // LM shadow on ground
      const shadowG = ctx.createRadialGradient(lmX, lmY + 24, 0, lmX, lmY + 24, 36);
      shadowG.addColorStop(0, "rgba(0,0,0,0.45)");
      shadowG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.ellipse(lmX, lmY + 24, 38, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowG; ctx.fill();

      // Astronaut (larger, more detailed)
      const astX = W * 0.55 + Math.sin(t * 0.35) * 12;
      const astY = H * 0.598;
      const walkPhase = t * 0.35;
      ctx.save(); ctx.translate(astX, astY);
      // shadow
      ctx.beginPath(); ctx.ellipse(0, 2, 16, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fill();
      // Suit body
      const suitG = ctx.createRadialGradient(-3, -32, 2, 0, -25, 22);
      suitG.addColorStop(0, "rgba(248,248,242,0.97)");
      suitG.addColorStop(0.5, "rgba(220,220,215,0.92)");
      suitG.addColorStop(1, "rgba(185,183,175,0.85)");
      ctx.fillStyle = suitG;
      ctx.beginPath(); ctx.roundRect(-13, -50, 26, 32, 5); ctx.fill();
      // Spacesuit detail lines
      ctx.strokeStyle = "rgba(160,158,150,0.4)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(-8, -50); ctx.lineTo(-8, -18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8, -50); ctx.lineTo(8, -18); ctx.stroke();
      // PLSS backpack
      ctx.fillStyle = "rgba(205,203,195,0.9)";
      ctx.beginPath(); ctx.roundRect(11, -48, 12, 28, 3); ctx.fill();
      // Backpack antenna
      ctx.beginPath(); ctx.moveTo(16, -48); ctx.lineTo(16, -58);
      ctx.strokeStyle = "rgba(200,200,200,0.7)"; ctx.lineWidth = 1.2; ctx.stroke();
      // Helmet
      const helmG = ctx.createRadialGradient(-4, -62, 0, 0, -58, 16);
      helmG.addColorStop(0, "rgba(248,248,248,0.97)");
      helmG.addColorStop(0.5, "rgba(215,215,215,0.9)");
      helmG.addColorStop(1, "rgba(170,168,162,0.8)");
      ctx.beginPath(); ctx.arc(0, -58, 16, 0, Math.PI * 2); ctx.fillStyle = helmG; ctx.fill();
      // Visor — gold tinted
      const visG = ctx.createLinearGradient(-11, -66, 11, -50);
      visG.addColorStop(0, "rgba(200,160,40,0.92)");
      visG.addColorStop(0.3, "rgba(180,140,30,0.85)");
      visG.addColorStop(0.7, "rgba(160,120,20,0.82)");
      visG.addColorStop(1, "rgba(130,100,15,0.78)");
      ctx.beginPath(); ctx.ellipse(0, -58, 11, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = visG; ctx.fill();
      // Visor reflection glint
      ctx.beginPath(); ctx.ellipse(-3, -63, 4, 2.5, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,245,200,0.35)"; ctx.fill();
      // Arm — left swing
      const lArmAngle = -0.35 - Math.sin(walkPhase) * 0.22;
      ctx.save(); ctx.translate(-14, -42); ctx.rotate(lArmAngle);
      ctx.fillStyle = "rgba(225,224,218,0.9)";
      ctx.beginPath(); ctx.roundRect(-5, 0, 9, 22, 4); ctx.fill();
      ctx.restore();
      // Arm — right
      const rArmAngle = 0.35 + Math.sin(walkPhase) * 0.22;
      ctx.save(); ctx.translate(14, -42); ctx.rotate(rArmAngle);
      ctx.fillStyle = "rgba(220,219,213,0.9)";
      ctx.beginPath(); ctx.roundRect(-4, 0, 9, 22, 4); ctx.fill();
      ctx.restore();
      // Legs
      [-7, 7].forEach((lx, li) => {
        const legA = Math.sin(walkPhase + li * Math.PI) * 0.22;
        ctx.save(); ctx.translate(lx, -18); ctx.rotate(legA);
        ctx.fillStyle = "rgba(228,227,220,0.92)";
        ctx.beginPath(); ctx.roundRect(-6, 0, 11, 22, 4); ctx.fill();
        // boot
        ctx.fillStyle = "rgba(175,172,162,0.85)";
        ctx.beginPath(); ctx.roundRect(-6, 22, 14, 6, 2); ctx.fill();
        ctx.restore();
      });
      ctx.restore();

      // US Flag (detailed with wave)
      const flagX = W * 0.46, flagY = H * 0.568;
      ctx.save(); ctx.translate(flagX, flagY);
      // pole
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -70);
      ctx.strokeStyle = "rgba(210,210,210,0.85)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(38, -70);
      ctx.lineWidth = 1.5; ctx.stroke();
      // flag with wave
      for (let fx = 0; fx < 38; fx++) {
        const waveY = Math.sin((fx / 38) * Math.PI * 1.8 + t * 0.25) * 2.2;
        const stripe = Math.floor(fx / 2.9) % 2;
        ctx.fillStyle = stripe === 0 ? "rgba(195,25,25,0.95)" : "rgba(235,235,235,0.95)";
        ctx.fillRect(fx, -69 + waveY, 2, 24);
      }
      // blue canton
      ctx.fillStyle = "rgba(18,35,130,0.92)";
      ctx.fillRect(0, -69, 16, 11);
      // stars
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      for (let s = 0; s < 9; s++) {
        ctx.fillRect(1.5 + (s % 3) * 4.5, -68 + Math.floor(s / 3) * 3.5, 1.5, 1.5);
      }
      ctx.restore();

      // Footprints
      for (let fp = 0; fp < 14; fp++) {
        const fpX = W * 0.44 + (fp % 7) * 15 + (Math.floor(fp / 7) * 7);
        const fpY = H * 0.624 + (fp % 7) * 0.8 + (fp % 2) * 3;
        ctx.save(); ctx.translate(fpX, fpY); ctx.rotate(fp % 2 === 0 ? 0.18 : -0.18);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.beginPath(); ctx.ellipse(0, 0, 3.5, 6, 0, 0, Math.PI * 2); ctx.fill();
        // toe marks
        for (let to = 0; to < 3; to++) {
          ctx.beginPath(); ctx.ellipse((to - 1) * 2, -7, 1.2, 1.5, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }

      // Dust particles
      dust.forEach(d => {
        d.life += 0.008; d.x += d.vx; d.y += d.vy;
        if (d.life >= d.maxLife) {
          d.life = 0; d.x = Math.random();
          d.y = 0.58 + Math.random() * 0.42;
          d.vy = -Math.random() * 0.00015;
        }
        const pAlpha = Math.sin(d.life / d.maxLife * Math.PI) * d.alpha;
        ctx.globalAlpha = pAlpha;
        ctx.fillStyle = "#b0a890";
        ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      t += 0.007;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="moon-landing" className="relative overflow-hidden" style={{ background: "#000", minHeight: "100vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* HUD tags */}
      <div className="absolute top-8 left-8 z-10 space-y-1.5">
        {[
          { l: "◉ MISSION", v: "APOLLO 11", c: "#c8a882" },
          { l: "◉ DATE", v: "JUL 20, 1969", c: "#c8a882" },
          { l: "◉ SITE", v: "MARE TRANQUILLITATIS", c: "#c8a882" },
          { l: "◉ STATUS", v: "MISSION SUCCESSFUL", c: "#00ff88" },
        ].map(tag => (
          <motion.div key={tag.l} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-mono text-[10px] px-3 py-1.5 border"
            style={{ color: tag.c, borderColor: tag.c + "33", background: tag.c + "08", letterSpacing: "0.15em" }}>
            {tag.l}: {tag.v}
          </motion.div>
        ))}
      </div>

      {/* Main content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between py-24 px-6 md:px-12">

        {/* Top center title */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1 }}
          className="text-center mt-8">
          <div className="font-mono text-[10px] text-amber-400/55 tracking-[0.35em] uppercase mb-3">
            ◈ JULY 20, 1969 · THE MOON
          </div>
          <h2 className="font-orbitron font-black text-white leading-tight"
            style={{ fontSize: "clamp(2rem,5.5vw,4rem)", textShadow: "0 0 40px rgba(200,168,130,0.25)" }}>
            ONE SMALL STEP
            <span className="block mt-1" style={{ color: "#c8a882", textShadow: "0 0 30px rgba(200,168,130,0.45)" }}>
              FOR MANKIND
            </span>
          </h2>
        </motion.div>

        {/* Bottom layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">

          {/* Left — image placeholders */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col gap-4">

            {/* Image placeholder 1 — Neil Armstrong */}
            <div className="group relative cursor-pointer" style={{ aspectRatio: "4/3" }}>
              {/* Holographic frame */}
              <div className="absolute inset-0" style={{
                border: "1px solid rgba(200,168,130,0.35)",
                boxShadow: "0 0 30px rgba(200,168,130,0.08), inset 0 0 20px rgba(200,168,130,0.03)",
                background: "rgba(10,8,5,0.85)",
              }}>
                {/* Animated corner accents */}
                {[["top-0 left-0", "borderTop borderLeft"], ["top-0 right-0", "borderTop borderRight"],
                  ["bottom-0 left-0", "borderBottom borderLeft"], ["bottom-0 right-0", "borderBottom borderRight"]].map(([pos], ci) => (
                  <div key={ci} className={`absolute ${pos}`} style={{
                    width: 18, height: 18,
                    borderTop: ci < 2 ? "2px solid #c8a882" : "none",
                    borderBottom: ci >= 2 ? "2px solid #c8a882" : "none",
                    borderLeft: ci % 2 === 0 ? "2px solid #c8a882" : "none",
                    borderRight: ci % 2 === 1 ? "2px solid #c8a882" : "none",
                  }} />
                ))}
                {/* Scan line overlay */}
                <div className="absolute inset-0" style={{
                  background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(200,168,130,0.015) 3px,rgba(200,168,130,0.015) 4px)",
                  pointerEvents: "none",
                }} />
                {/* NASA label */}
                <div className="absolute top-3 left-3 font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: "rgba(200,168,130,0.6)", letterSpacing: "0.18em" }}>
                  NASA · AS11-40-5931
                </div>
                {/* Content area */}
               <div className="absolute inset-0">
  <iframe
    src="https://www.youtube.com/embed/hzApsIPHRwo?autoplay=1&mute=1&rel=0"
    title="Neil Armstrong Moon Landing"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    className="w-full h-full"
    style={{ border: "none" }}
  />
</div>
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(200,168,130,0.06) 0%, transparent 70%)",
                }} />
              </div>
            </div>

            {/* Image placeholder 2 — Earth from Moon */}
            <div className="group relative cursor-pointer" style={{ aspectRatio: "4/3" }}>
              <div className="absolute inset-0" style={{
                border: "1px solid rgba(100,180,255,0.3)",
                boxShadow: "0 0 30px rgba(60,140,255,0.07), inset 0 0 20px rgba(60,140,255,0.03)",
                background: "rgba(3,5,12,0.88)",
              }}>
                {[["top-0 left-0"], ["top-0 right-0"], ["bottom-0 left-0"], ["bottom-0 right-0"]].map(([pos], ci) => (
                  <div key={ci} className={`absolute ${pos}`} style={{
                    width: 18, height: 18,
                    borderTop: ci < 2 ? "2px solid #4db5ff" : "none",
                    borderBottom: ci >= 2 ? "2px solid #4db5ff" : "none",
                    borderLeft: ci % 2 === 0 ? "2px solid #4db5ff" : "none",
                    borderRight: ci % 2 === 1 ? "2px solid #4db5ff" : "none",
                  }} />
                ))}
                <div className="absolute inset-0" style={{
                  background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(77,181,255,0.012) 3px,rgba(77,181,255,0.012) 4px)",
                  pointerEvents: "none",
                }} />
                <div className="absolute top-3 left-3 font-mono text-[9px] tracking-widest uppercase"
                  style={{ color: "rgba(77,181,255,0.6)", letterSpacing: "0.18em" }}>
                  NASA · AS08-14-2383
                </div>
                <div className="absolute inset-0">
  <img
    src="https://cdn.britannica.com/99/157599-050-743F6CAC/Neil-Armstrong-Moon-July-1969.jpg"
    alt="Neil Armstrong on the Moon"
    className="w-full h-full object-cover"
  />
</div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(77,181,255,0.06) 0%, transparent 70%)",
                }} />
              </div>
            </div>
          </motion.div>

          {/* Center — key facts */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3 }}
            className="space-y-3">
            <p className="font-exo text-white/35 text-sm leading-relaxed text-center mb-4">
              Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.
              Michael Collins orbited above in the Command Module. "That's one small step for man,
              one giant leap for mankind."
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "12", l: "Humans walked the Moon" },
                { v: "6", l: "Successful landings" },
                { v: "382 kg", l: "Lunar rock returned" },
                { v: "1969–72", l: "Apollo era" },
              ].map(s => (
                <div key={s.l} className="border border-amber-400/15 p-3 text-center"
                  style={{ background: "rgba(200,168,130,0.04)" }}>
                  <div className="font-orbitron text-xl font-black text-amber-300">{s.v}</div>
                  <div className="font-mono text-[8px] text-white/28 tracking-widest uppercase mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            {/* Quote */}
            <div className="border-l-2 border-amber-400/30 pl-4 py-2 mt-4">
              <p className="font-exo text-white/38 text-sm italic leading-relaxed">
                "One small step for man, one giant leap for mankind."
              </p>
              <p className="font-mono text-[9px] text-amber-400/50 tracking-widest uppercase mt-2">
                — Neil Armstrong · July 20, 1969
              </p>
            </div>
          </motion.div>

          {/* Right — mission timeline */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.4 }}>
            <div className="font-mono text-[9px] text-amber-400/50 tracking-[0.25em] uppercase mb-3">
              ◈ APOLLO MISSION TIMELINE
            </div>
            <div className="space-y-1.5">
              {APOLLO_MISSIONS.map((m, i) => (
                <motion.button
                  key={m.mission}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  onClick={() => setActiveApollo(i)}
                  className="w-full text-left flex items-start gap-3 p-3 transition-all duration-300"
                  style={{
                    border: activeApollo === i ? `1px solid ${m.color}40` : "1px solid rgba(255,255,255,0.05)",
                    background: activeApollo === i ? `${m.color}08` : "rgba(200,168,130,0.02)",
                    cursor: "pointer",
                  }}>
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: activeApollo === i ? m.color : "rgba(200,168,130,0.3)",
                        boxShadow: activeApollo === i ? `0 0 8px ${m.color}` : "none",
                      }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-orbitron text-[11px] font-bold"
                        style={{ color: activeApollo === i ? m.color : "rgba(200,168,130,0.65)" }}>
                        {m.mission}
                      </span>
                      <span className="font-mono text-[9px] text-white/25">{m.date}</span>
                    </div>
                    <AnimatePresence>
                      {activeApollo === i && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                          <div className="font-mono text-[9px] text-white/35 mt-1">{m.crew}</div>
                          <div className="font-mono text-[9px] text-white/22 mt-0.5">{m.note}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-white/20">03 · MOON LANDING</div>
    </section>
  );
}
