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
    let issAngle = -Math.PI * 0.3;

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Signal rings
    const rings: { x: number; y: number; r: number; alpha: number }[] = [];
    let ringTimer = 0;

    // Distant satellites
    const sats = Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      r: 0.3 + Math.random() * 0.12,
      speed: 0.0012 + Math.random() * 0.001,
    }));

    function drawRealisticEarth(W: number, H: number) {
      const eX = W * 0.5, eY = H * 0.88, eR = H * 0.62;

      // Outer space glow (deep blue haze)
      const outerGlow = ctx.createRadialGradient(eX, eY, eR * 0.85, eX, eY, eR * 1.35);
      outerGlow.addColorStop(0, "rgba(20,80,200,0.0)");
      outerGlow.addColorStop(0.4, "rgba(40,120,255,0.18)");
      outerGlow.addColorStop(0.75, "rgba(60,140,255,0.08)");
      outerGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(eX, eY, eR * 1.35, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow; ctx.fill();

      // Earth base
      const earthG = ctx.createRadialGradient(eX - eR * 0.28, eY - eR * 0.28, eR * 0.05, eX, eY, eR);
      earthG.addColorStop(0, "#6ec8ff");
      earthG.addColorStop(0.08, "#3a9fe8");
      earthG.addColorStop(0.22, "#1a6bcc");
      earthG.addColorStop(0.48, "#0d4088");
      earthG.addColorStop(0.72, "#071e4a");
      earthG.addColorStop(0.88, "#030c22");
      earthG.addColorStop(1, "#000508");
      ctx.save();
      ctx.beginPath(); ctx.arc(eX, eY, eR, 0, Math.PI * 2);
      ctx.fillStyle = earthG; ctx.fill();
      ctx.clip();

      // Continent masses — painted as organic shapes
      const continentDrift = t * 0.004;
      const continents = [
        // North America
        { ox: -0.18, oy: -0.32, rx: 0.26, ry: 0.18, rot: -0.4 },
        // South America
        { ox: -0.08, oy: -0.02, rx: 0.12, ry: 0.22, rot: 0.2 },
        // Europe/Africa
        { ox: 0.12, oy: -0.25, rx: 0.13, ry: 0.12, rot: 0.1 },
        { ox: 0.14, oy: 0.04, rx: 0.14, ry: 0.28, rot: 0.05 },
        // Asia
        { ox: 0.28, oy: -0.32, rx: 0.28, ry: 0.22, rot: -0.15 },
        // Australia
        { ox: 0.32, oy: 0.1, rx: 0.1, ry: 0.08, rot: 0.3 },
        // Greenland
        { ox: -0.1, oy: -0.52, rx: 0.07, ry: 0.07, rot: 0.0 },
      ];
      continents.forEach(c => {
        const cx = eX + (c.ox + Math.sin(continentDrift + c.rot) * 0.002) * eR;
        const cy = eY + (c.oy + Math.cos(continentDrift * 0.7) * 0.001) * eR;
        // land shadow
        const landSh = ctx.createRadialGradient(cx + 4, cy + 4, 0, cx, cy, c.rx * eR);
        landSh.addColorStop(0, "rgba(0,0,0,0.3)");
        landSh.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.ellipse(cx + 4, cy + 4, c.rx * eR, c.ry * eR, c.rot, 0, Math.PI * 2);
        ctx.fillStyle = landSh; ctx.fill();
        // land color — greenish brown
        const landG = ctx.createRadialGradient(cx - c.rx * eR * 0.2, cy - c.ry * eR * 0.2, 0, cx, cy, c.rx * eR * 1.1);
        landG.addColorStop(0, "rgba(80,120,55,0.92)");
        landG.addColorStop(0.4, "rgba(55,100,40,0.85)");
        landG.addColorStop(0.75, "rgba(85,110,50,0.75)");
        landG.addColorStop(1, "rgba(60,90,35,0.6)");
        ctx.beginPath(); ctx.ellipse(cx, cy, c.rx * eR, c.ry * eR, c.rot, 0, Math.PI * 2);
        ctx.fillStyle = landG; ctx.fill();
        // snow caps at top
        if (c.oy < -0.28) {
          const snowG = ctx.createRadialGradient(cx, cy - c.ry * eR * 0.6, 0, cx, cy, c.rx * eR * 0.4);
          snowG.addColorStop(0, "rgba(240,248,255,0.7)");
          snowG.addColorStop(1, "rgba(240,248,255,0)");
          ctx.beginPath(); ctx.ellipse(cx, cy - c.ry * eR * 0.5, c.rx * eR * 0.45, c.ry * eR * 0.35, c.rot, 0, Math.PI * 2);
          ctx.fillStyle = snowG; ctx.fill();
        }
      });

      // Polar ice caps
      // North pole
      const npG = ctx.createRadialGradient(eX, eY - eR * 0.82, 0, eX, eY - eR * 0.82, eR * 0.22);
      npG.addColorStop(0, "rgba(230,245,255,0.85)");
      npG.addColorStop(0.5, "rgba(200,230,255,0.45)");
      npG.addColorStop(1, "rgba(200,230,255,0)");
      ctx.beginPath(); ctx.ellipse(eX, eY - eR * 0.82, eR * 0.26, eR * 0.12, 0, 0, Math.PI * 2);
      ctx.fillStyle = npG; ctx.fill();
      // South pole (Antarctica)
      const spG = ctx.createRadialGradient(eX, eY + eR * 0.76, 0, eX, eY + eR * 0.76, eR * 0.3);
      spG.addColorStop(0, "rgba(240,248,255,0.88)");
      spG.addColorStop(0.5, "rgba(215,235,255,0.55)");
      spG.addColorStop(1, "rgba(215,235,255,0)");
      ctx.beginPath(); ctx.ellipse(eX, eY + eR * 0.76, eR * 0.32, eR * 0.14, 0, 0, Math.PI * 2);
      ctx.fillStyle = spG; ctx.fill();

      // City lights (night side — lower right)
      const nightLightZones = [
        { ox: 0.05, oy: -0.12, density: 18 }, // Europe
        { ox: -0.14, oy: -0.22, density: 22 }, // N. America east
        { ox: 0.3, oy: -0.18, density: 20 }, // Asia
        { ox: 0.22, oy: -0.32, density: 14 }, // Japan
      ];
      nightLightZones.forEach(zone => {
        for (let d = 0; d < zone.density; d++) {
          const lx = eX + (zone.ox + (Math.random() - 0.5) * 0.18) * eR;
          const ly = eY + (zone.oy + (Math.random() - 0.5) * 0.14) * eR;
          const lBrightness = 0.4 + Math.sin(t * 0.5 + d) * 0.15;
          ctx.beginPath(); ctx.arc(lx, ly, 0.8 + Math.random(), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,230,150,${lBrightness * 0.55})`;
          ctx.fill();
        }
      });

      // Moving cloud bands
      const cloudPhase = t * 0.005;
      for (let cl = 0; cl < 8; cl++) {
        const angle = (cl / 8) * Math.PI * 2 + cloudPhase + cl * 0.4;
        const radius = eR * (0.25 + ((cl * 37) % 10) / 10 * 0.55);
        const cw = eR * (0.35 + ((cl * 13) % 10) / 10 * 0.25);
        const ch = eR * (0.04 + ((cl * 7) % 10) / 10 * 0.04);
        const cxPos = eX + Math.cos(angle) * radius;
        const cyPos = eY + Math.sin(angle) * radius * 0.65;
        const cloudAlpha = 0.06 + ((cl * 23) % 10) / 10 * 0.1;
        ctx.beginPath();
        ctx.ellipse(cxPos, cyPos, cw, ch, angle * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${cloudAlpha})`;
        ctx.fill();
      }

      // Tropical storm (swirling cloud)
      const stormX = eX + Math.cos(t * 0.003) * eR * 0.3;
      const stormY = eY - eR * 0.12;
      for (let sr = 0; sr < 4; sr++) {
        const sa = t * 0.02 + sr * Math.PI * 0.5;
        ctx.beginPath();
        ctx.ellipse(stormX + Math.cos(sa) * eR * 0.04, stormY + Math.sin(sa) * eR * 0.025,
          eR * 0.065, eR * 0.025, sa, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.05 - sr * 0.01})`;
        ctx.fill();
      }

      // Aurora borealis (green/teal glow near north pole)
      const auroraPhase = t * 0.018;
      for (let ab = 0; ab < 5; ab++) {
        const aa = ab * 0.4 + auroraPhase;
        const auroraX = eX + Math.cos(aa) * eR * 0.55;
        const auroraY = eY - eR * 0.68 + Math.sin(aa * 2) * eR * 0.06;
        const aGrad = ctx.createRadialGradient(auroraX, auroraY, 0, auroraX, auroraY, eR * 0.12);
        const aAlpha = (0.08 + Math.sin(t * 0.4 + ab) * 0.04) * 0.6;
        aGrad.addColorStop(0, `rgba(0,255,150,${aAlpha})`);
        aGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(auroraX, auroraY, eR * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = aGrad; ctx.fill();
      }

      // Night side shadow (terminator)
      const terminatorG = ctx.createLinearGradient(eX - eR, eY - eR, eX + eR * 0.6, eY + eR * 0.6);
      terminatorG.addColorStop(0, "rgba(0,0,0,0)");
      terminatorG.addColorStop(0.52, "rgba(0,0,0,0)");
      terminatorG.addColorStop(0.62, "rgba(0,2,10,0.45)");
      terminatorG.addColorStop(0.78, "rgba(0,2,10,0.75)");
      terminatorG.addColorStop(1, "rgba(0,2,10,0.88)");
      ctx.beginPath(); ctx.arc(eX, eY, eR, 0, Math.PI * 2);
      ctx.fillStyle = terminatorG; ctx.fill();

      ctx.restore();

      // Atmosphere limb glow
      const atmG = ctx.createRadialGradient(eX, eY, eR * 0.95, eX, eY, eR * 1.14);
      atmG.addColorStop(0, "rgba(0,0,0,0)");
      atmG.addColorStop(0.3, "rgba(80,160,255,0.32)");
      atmG.addColorStop(0.65, "rgba(60,130,255,0.14)");
      atmG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(eX, eY, eR * 1.14, 0, Math.PI * 2);
      ctx.fillStyle = atmG; ctx.fill();

      // Thin stratosphere
      const stratG = ctx.createRadialGradient(eX, eY, eR * 0.99, eX, eY, eR * 1.04);
      stratG.addColorStop(0, "rgba(150,210,255,0.22)");
      stratG.addColorStop(0.5, "rgba(100,180,255,0.1)");
      stratG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(eX, eY, eR * 1.04, 0, Math.PI * 2);
      ctx.fillStyle = stratG; ctx.fill();
    }

    function drawISS(issX: number, issY: number, angle: number) {
      const scale = 2.2; // much bigger
      ctx.save();
      ctx.translate(issX, issY);
      ctx.rotate(angle + Math.PI / 4);
      ctx.scale(scale, scale);

      // ISS glow halo
      ctx.restore();
      const haloG = ctx.createRadialGradient(issX, issY, 10, issX, issY, 90);
      haloG.addColorStop(0, "rgba(180,220,255,0.18)");
      haloG.addColorStop(0.5, "rgba(100,180,255,0.06)");
      haloG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(issX, issY, 90, 0, Math.PI * 2);
      ctx.fillStyle = haloG; ctx.fill();

      ctx.save();
      ctx.translate(issX, issY);
      ctx.rotate(angle + Math.PI / 4);
      ctx.scale(scale, scale);

      // Main integrated truss segment (long horizontal spine)
      const trussLen = 130;
      const trussG = ctx.createLinearGradient(-trussLen / 2, -3, trussLen / 2, 3);
      trussG.addColorStop(0, "rgba(140,145,155,0.7)");
      trussG.addColorStop(0.25, "rgba(215,218,225,0.95)");
      trussG.addColorStop(0.5, "rgba(230,232,238,1)");
      trussG.addColorStop(0.75, "rgba(200,205,215,0.9)");
      trussG.addColorStop(1, "rgba(140,145,155,0.7)");
      ctx.fillStyle = trussG;
      ctx.beginPath(); ctx.roundRect(-trussLen / 2, -3.5, trussLen, 7, 1.5); ctx.fill();

      // Vertical connecting truss
      const vTrussG = ctx.createLinearGradient(0, -35, 0, 35);
      vTrussG.addColorStop(0, "rgba(160,165,175,0.6)");
      vTrussG.addColorStop(0.5, "rgba(200,205,215,0.9)");
      vTrussG.addColorStop(1, "rgba(160,165,175,0.6)");
      ctx.fillStyle = vTrussG;
      ctx.beginPath(); ctx.roundRect(-3.5, -35, 7, 70, 1.5); ctx.fill();

      // Habitat modules along vertical truss
      const modules = [
        { y: 0, w: 38, h: 14, name: "Unity/Destiny" },
        { y: -22, w: 28, h: 12, name: "Harmony" },
        { y: 22, w: 24, h: 11, name: "Tranquility" },
        { y: -38, w: 20, h: 10, name: "Columbus" },
      ];
      modules.forEach(m => {
        const modG = ctx.createLinearGradient(-m.w / 2, m.y - m.h / 2, m.w / 2, m.y + m.h / 2);
        modG.addColorStop(0, "rgba(235,238,245,0.95)");
        modG.addColorStop(0.4, "rgba(210,215,225,0.9)");
        modG.addColorStop(1, "rgba(170,175,188,0.8)");
        ctx.fillStyle = modG;
        ctx.beginPath(); ctx.roundRect(-m.w / 2, m.y - m.h / 2, m.w, m.h, 3); ctx.fill();
        // module seams
        ctx.strokeStyle = "rgba(140,145,160,0.4)"; ctx.lineWidth = 0.5;
        for (let seg = 1; seg < 4; seg++) {
          ctx.beginPath();
          ctx.moveTo(-m.w / 2 + seg * (m.w / 4), m.y - m.h / 2);
          ctx.lineTo(-m.w / 2 + seg * (m.w / 4), m.y + m.h / 2);
          ctx.stroke();
        }
        // windows (glowing cyan)
        for (let w = 0; w < 3; w++) {
          const wx = -m.w / 2 + 5 + w * 9;
          const winG = ctx.createRadialGradient(wx, m.y, 0, wx, m.y, 3);
          winG.addColorStop(0, "rgba(160,230,255,0.9)");
          winG.addColorStop(1, "rgba(80,180,240,0.3)");
          ctx.beginPath(); ctx.arc(wx, m.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = winG; ctx.fill();
          // window glow
          ctx.beginPath(); ctx.arc(wx, m.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(100,200,255,0.08)"; ctx.fill();
        }
      });

      // Solar arrays — 4 pairs along main truss
      const panelYOffset = [-1, 1];
      const panelXPositions = [-56, -28, 22, 50];
      panelXPositions.forEach((px, pi) => {
        panelYOffset.forEach((py, yi) => {
          const panelW = 42, panelH = 14;
          const yDir = py < 0 ? -1 : 1;
          const armLen = 28;
          // strut
          ctx.beginPath();
          ctx.moveTo(px, 0);
          ctx.lineTo(px, yDir * armLen);
          ctx.strokeStyle = "rgba(180,185,195,0.7)"; ctx.lineWidth = 1.5; ctx.stroke();

          // solar panel body
          const panelGrad = ctx.createLinearGradient(px - panelW / 2, yDir * armLen, px + panelW / 2, yDir * (armLen + panelH));
          panelGrad.addColorStop(0, "rgba(18,45,110,0.95)");
          panelGrad.addColorStop(0.3, "rgba(22,60,145,0.9)");
          panelGrad.addColorStop(0.7, "rgba(15,40,100,0.88)");
          panelGrad.addColorStop(1, "rgba(10,28,80,0.85)");
          ctx.fillStyle = panelGrad;
          ctx.beginPath();
          ctx.roundRect(px - panelW / 2, yDir * armLen, panelW, yDir * panelH, 1);
          ctx.fill();

          // grid lines on panel
          ctx.strokeStyle = "rgba(60,120,220,0.35)"; ctx.lineWidth = 0.4;
          for (let col = 1; col < 7; col++) {
            ctx.beginPath();
            ctx.moveTo(px - panelW / 2 + col * (panelW / 7), yDir * armLen);
            ctx.lineTo(px - panelW / 2 + col * (panelW / 7), yDir * (armLen + panelH));
            ctx.stroke();
          }
          for (let row = 1; row < 3; row++) {
            ctx.beginPath();
            ctx.moveTo(px - panelW / 2, yDir * (armLen + row * (panelH / 3)));
            ctx.lineTo(px + panelW / 2, yDir * (armLen + row * (panelH / 3)));
            ctx.stroke();
          }

          // Sunlight shimmer on panels
          const shimmer = (Math.sin(t * 1.5 + pi * 0.8 + yi * 0.4) + 1) * 0.5;
          ctx.fillStyle = `rgba(200,230,255,${shimmer * 0.18})`;
          ctx.fillRect(px - panelW / 2, yDir * armLen, panelW * shimmer, Math.abs(yDir * panelH));
        });
      });

      // Radiator panels
      [[-18, -3], [8, -3]].forEach(([rx, ry]) => {
        ctx.fillStyle = "rgba(195,205,218,0.75)";
        ctx.beginPath(); ctx.roundRect(rx, ry - 22, 8, 44, 1); ctx.fill();
        ctx.strokeStyle = "rgba(150,160,180,0.3)"; ctx.lineWidth = 0.4;
        for (let rr = 1; rr < 5; rr++) {
          ctx.beginPath();
          ctx.moveTo(rx, ry - 22 + rr * (44 / 5));
          ctx.lineTo(rx + 8, ry - 22 + rr * (44 / 5));
          ctx.stroke();
        }
      });

      // Blinking navigation light
      const blinkAlpha = Math.sin(t * 3) > 0 ? 0.9 : 0.1;
      ctx.beginPath(); ctx.arc(-trussLen / 2 + 4, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,80,80,${blinkAlpha})`; ctx.fill();
      ctx.beginPath(); ctx.arc(trussLen / 2 - 4, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80,255,80,${blinkAlpha})`; ctx.fill();

      // Tiny astronaut silhouettes in windows
      const astAlpha = 0.55 + Math.sin(t * 0.6) * 0.15;
      ctx.fillStyle = `rgba(30,50,80,${astAlpha})`;
      ctx.beginPath(); ctx.arc(-8, 0, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(4, 0, 2.2, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    }

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep space background
      ctx.fillStyle = "#000005";
      ctx.fillRect(0, 0, W, H);

      // Subtle deep nebula
      const nebG = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.5);
      nebG.addColorStop(0, "rgba(0,10,40,0.6)");
      nebG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebG; ctx.fillRect(0, 0, W, H);

      // Stars — dense and varied
      for (let i = 0; i < 700; i++) {
        const sx = ((i * 73.13) % 1) * W;
        const sy = ((i * 47.77) % 1) * H;
        const sr = 0.3 + ((i * 11.3) % 1) * 1.1;
        const pulse = 0.5 + 0.5 * Math.sin(t * (0.3 + (i % 7) * 0.12) + i * 0.4);
        const alpha = (0.2 + ((i * 31.7) % 1) * 0.75) * pulse;
        ctx.globalAlpha = alpha;
        if (i % 20 === 0) ctx.fillStyle = "#4db5ff";
        else if (i % 33 === 0) ctx.fillStyle = "#ffd080";
        else if (i % 45 === 0) ctx.fillStyle = "#ff9988";
        else ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Distant satellites
      const eX = W * 0.5, eY = H * 0.88;
      sats.forEach(s => {
        s.angle += s.speed;
        const satX = eX + Math.cos(s.angle) * W * s.r;
        const satY = eY + Math.sin(s.angle) * W * s.r * 0.28;
        ctx.beginPath(); ctx.arc(satX, satY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,220,255,0.4)"; ctx.fill();
      });

      // Realistic Earth
      drawRealisticEarth(W, H);

      // ISS orbit path (faint)
      const issOrbitRx = W * 0.36, issOrbitRy = W * 0.068;
      const issOrbitCX = W * 0.5, issOrbitCY = H * 0.3;
      ctx.beginPath();
      ctx.ellipse(issOrbitCX, issOrbitCY, issOrbitRx, issOrbitRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,245,255,0.07)";
      ctx.lineWidth = 1; ctx.setLineDash([4, 10]); ctx.stroke(); ctx.setLineDash([]);

      // ISS position
      issAngle += 0.004;
      const issX = issOrbitCX + Math.cos(issAngle) * issOrbitRx;
      const issY = issOrbitCY + Math.sin(issAngle) * issOrbitRy;

      drawISS(issX, issY, issAngle);

      // Signal rings from ISS
      ringTimer++;
      if (ringTimer > 80) {
        ringTimer = 0;
        rings.push({ x: issX, y: issY, r: 0, alpha: 0.7 });
      }
      rings.forEach(ring => {
        ring.r += 1.2; ring.alpha = 0.7 * (1 - ring.r / 80);
        ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,245,255,${ring.alpha})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      });
      for (let i = rings.length - 1; i >= 0; i--) {
        if (rings[i].r >= 80) rings.splice(i, 1);
      }

      // ISS orbit progress indicator
      const orbPct = ((issAngle / (Math.PI * 2)) % 1 + 1) % 1;
      const hudX = W - 60, hudY = 60;
      ctx.strokeStyle = "rgba(0,245,255,0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hudX, hudY, 22, -Math.PI / 2, -Math.PI / 2 + orbPct * Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(0,245,255,0.55)";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("ORBIT", hudX, hudY + 3);
      ctx.textAlign = "left";

      t += 0.007;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="iss" className="relative overflow-hidden" style={{ background: "#000", minHeight: "100vh" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Live telemetry HUD — top left */}
      <div className="absolute top-8 left-8 z-10 space-y-1.5">
        {[
          { l: "◉ ALTITUDE", v: "408 KM", c: "#00f5ff" },
          { l: "◉ SPEED", v: "27,600 KM/H", c: "#00f5ff" },
          { l: "◉ ORBIT PERIOD", v: "92 MIN", c: "#00f5ff" },
          { l: "◉ CREW", v: "7 ASTRONAUTS", c: "#00ff88" },
          { l: "◉ UPTIME", v: "24+ YEARS", c: "#00ff88" },
        ].map(tag => (
          <motion.div key={tag.l} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-mono text-[10px] px-3 py-1.5 border"
            style={{ color: tag.c, borderColor: tag.c + "33", background: tag.c + "08", letterSpacing: "0.15em" }}>
            {tag.l}: {tag.v}
          </motion.div>
        ))}
      </div>

      {/* Main content — right panel */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 py-24">
        <div className="ml-auto max-w-sm mr-8 md:mr-16">
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>

            <div className="font-mono text-[10px] text-cyan-400/60 tracking-[0.3em] uppercase mb-3">
              ◈ LOW EARTH ORBIT · 408 KM
            </div>
            <h2 className="font-orbitron font-black text-white leading-tight mb-3"
              style={{ fontSize: "clamp(1.8rem,4.5vw,3.2rem)", textShadow: "0 0 30px rgba(0,245,255,0.2)" }}>
              HUMANITY&apos;S<br />
              <span style={{ color: "#00f5ff", textShadow: "0 0 25px rgba(0,245,255,0.5)" }}>OUTPOST</span><br />
              IN ORBIT
            </h2>
            <div className="h-px mb-4" style={{ background: "linear-gradient(90deg,#00f5ff80,transparent)" }} />

            <p className="font-exo text-white/38 text-sm leading-relaxed mb-5">
              Launched in 1998 and continuously inhabited since November 2000, the ISS is the largest structure
              ever placed in space — a football-field-sized laboratory that circles Earth 16 times every single day.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { v: "270+", l: "Astronauts visited" },
                { v: "3,000+", l: "Experiments run" },
                { v: "420 t", l: "Total station mass" },
                { v: "16×", l: "Earth orbits daily" },
              ].map(s => (
                <div key={s.l} className="border border-cyan-400/15 p-3"
                  style={{ background: "rgba(0,245,255,0.04)" }}>
                  <div className="font-orbitron text-xl font-black text-cyan-300">{s.v}</div>
                  <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Partner nations */}
            <div className="font-mono text-[9px] text-cyan-400/50 tracking-[0.2em] uppercase mb-2">
              PARTNER NATIONS
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {["🇺🇸 NASA", "🇷🇺 Roscosmos", "🇯🇵 JAXA", "🇨🇦 CSA", "🇪🇺 ESA"].map(c => (
                <span key={c} className="font-mono text-[9px] border border-white/10 px-2 py-1 text-white/40">{c}</span>
              ))}
            </div>

            {/* Research areas */}
            <div className="space-y-2">
              {[
                { icon: "🧬", title: "HUMAN BIOLOGY", desc: "Bone density, muscle atrophy, fluid redistribution in microgravity" },
                { icon: "🔬", title: "MATERIALS SCIENCE", desc: "Perfect crystals and alloys impossible to form under gravity" },
                { icon: "🌍", title: "EARTH OBSERVATION", desc: "Climate monitoring, disaster response, ocean current tracking" },
              ].map(r => (
                <div key={r.title} className="flex gap-3 p-3 border border-white/5"
                  style={{ background: "rgba(0,245,255,0.025)" }}>
                  <span className="text-base mt-0.5">{r.icon}</span>
                  <div>
                    <div className="font-orbitron text-[10px] font-bold text-cyan-300/80 tracking-wider">{r.title}</div>
                    <div className="font-mono text-[9px] text-white/28 leading-relaxed mt-0.5">{r.desc}</div>
                  </div>
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
