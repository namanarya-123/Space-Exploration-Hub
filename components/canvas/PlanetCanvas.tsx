"use client";

import { useEffect, useRef } from "react";
import type { Planet } from "@/lib/planets";

interface PlanetCanvasProps {
  planet: Planet;
  size?: number;
}

export default function PlanetCanvas({ planet, size = 400 }: PlanetCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = size;
    canvas.height = size;
    let t = 0;

    cancelAnimationFrame(rafRef.current);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };

    const lighten = (hex: string, factor: number) => {
      const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + factor * 255) | 0;
      const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + factor * 255) | 0;
      const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + factor * 255) | 0;
      return `rgb(${r},${g},${b})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.36;

      // Outer atmosphere glow
      const glow = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.5);
      const rgb = planet.glowColor || hexToRgb(planet.atmosphere);
      glow.addColorStop(0, `rgba(${rgb}, ${(planet.atmosOpacity || 0.2) * 0.5})`);
      glow.addColorStop(0.5, `rgba(${rgb}, ${(planet.atmosOpacity || 0.2) * 0.15})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      const planet_grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
      planet_grad.addColorStop(0, lighten(planet.color, 0.35));
      planet_grad.addColorStop(0.35, planet.color);
      planet_grad.addColorStop(0.7, planet.color);
      planet_grad.addColorStop(1, "#000");
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = planet_grad;
      ctx.fill();
      ctx.clip();

      // Surface bands
      const bandColors = [
        `rgba(0,0,0,0.06)`,
        `rgba(0,0,0,0.04)`,
        `rgba(255,255,255,0.03)`,
        `rgba(0,0,0,0.08)`,
        `rgba(0,0,0,0.05)`,
      ];
      for (let i = 0; i < 5; i++) {
        const by = cy - r + r * 0.3 * i + 10 + Math.sin(t * 0.5 + i) * 6;
        const bh = r * 0.08 + Math.sin(t * 0.3 + i * 0.7) * r * 0.04;
        ctx.beginPath();
        ctx.ellipse(cx, by, r, bh, 0, 0, Math.PI * 2);
        ctx.fillStyle = bandColors[i % bandColors.length];
        ctx.fill();
      }

      // Earth-specific continents
      if (planet.name === "EARTH") {
        const contData = [
          { ox: -0.15, oy: -0.1, w: 0.45, h: 0.28 },
          { ox: 0.45, oy: -0.05, w: 0.22, h: 0.4 },
          { ox: -0.35, oy: 0.1, w: 0.28, h: 0.38 },
          { ox: 0.2, oy: 0.3, w: 0.35, h: 0.2 },
        ];
        contData.forEach((c, i) => {
          const angle = t * 0.08 * (i % 2 === 0 ? 1 : -1);
          const ox = Math.cos(angle) * c.ox - Math.sin(angle) * c.oy;
          const oy = Math.sin(angle) * c.ox + Math.cos(angle) * c.oy;
          ctx.beginPath();
          ctx.ellipse(cx + ox * r, cy + oy * r, c.w * r * 0.5, c.h * r * 0.5, i * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34,100,34,0.6)";
          ctx.fill();
        });
        // Cloud wisps
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + t * 0.12;
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(angle) * r * 0.55, cy + Math.sin(angle) * r * 0.25, 35, 12, angle, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.fill();
        }
      }

      // Mars dust storms
      if (planet.name === "MARS") {
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + t * 0.06;
          ctx.beginPath();
          ctx.ellipse(cx + Math.cos(angle) * r * 0.5, cy + Math.sin(angle) * r * 0.3, 25, 8, angle, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(200,100,50,0.25)";
          ctx.fill();
        }
        // Polar ice cap
        ctx.beginPath();
        ctx.ellipse(cx, cy - r * 0.8, r * 0.3, r * 0.1, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
      }

      // Jupiter bands
      if (planet.name === "JUPITER") {
        for (let i = 0; i < 8; i++) {
          const by = cy - r + (i / 8) * r * 2 + Math.sin(t * 0.2 + i) * 3;
          ctx.beginPath();
          ctx.ellipse(cx, by, r, r * 0.06, 0, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "rgba(180,120,60,0.35)" : "rgba(220,180,100,0.25)";
          ctx.fill();
        }
        // Great Red Spot
        const grsX = cx + Math.cos(t * 0.04) * r * 0.3;
        const grsY = cy + r * 0.15;
        const grd = ctx.createRadialGradient(grsX, grsY, 0, grsX, grsY, 22);
        grd.addColorStop(0, "rgba(180,60,40,0.9)");
        grd.addColorStop(0.6, "rgba(140,40,20,0.5)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.ellipse(grsX, grsY, 22, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      ctx.restore();

      // Saturn rings
      if (planet.hasRings) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.28);
        for (let i = 0; i < 5; i++) {
          const ri = r * 1.15 + i * r * 0.12;
          const ro = ri + r * 0.08;
          const opacity = 0.45 - i * 0.07;
          ctx.beginPath();
          ctx.arc(0, 0, ro, 0, Math.PI * 2);
          ctx.arc(0, 0, ri, 0, Math.PI * 2, true);
          ctx.fillStyle = `rgba(230,200,150,${opacity})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Atmosphere ring
      const atmo = ctx.createRadialGradient(cx, cy, r - 3, cx, cy, r + 18);
      atmo.addColorStop(0, "rgba(0,0,0,0)");
      atmo.addColorStop(0.5, `rgba(${planet.glowColor || hexToRgb(planet.atmosphere)}, ${planet.atmosOpacity || 0.25})`);
      atmo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      // Terminator shadow
      const shadow = ctx.createRadialGradient(cx + r * 0.35, cy, r * 0.1, cx + r, cy, r * 1.15);
      shadow.addColorStop(0, "rgba(0,0,0,0)");
      shadow.addColorStop(0.4, "rgba(0,0,0,0.15)");
      shadow.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = shadow;
      ctx.fill();

      // Orbit line
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Orbiting moon
      const moonX = cx + Math.cos(t * 0.7) * r * 1.45;
      const moonY = cy + Math.sin(t * 0.7) * r * 0.4;
      const moonR = planet.name === "JUPITER" ? 9 : planet.name === "SATURN" ? 8 : 5;
      const moonGrad = ctx.createRadialGradient(moonX - 2, moonY - 2, 0, moonX, moonY, moonR);
      moonGrad.addColorStop(0, "rgba(255,255,255,0.9)");
      moonGrad.addColorStop(1, "rgba(150,150,150,0.5)");
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      t += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [planet, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, maxWidth: "100%" }}
      aria-label={`3D rendering of ${planet.name}`}
    />
  );
}
