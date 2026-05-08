"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  color: string;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let rafId: number;

    const starColors = [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#cce8ff",
      "#ffddaa",
      "#aaccff",
      "#00f5ff",
    ];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.min(900, Math.floor((width * height) / 1400));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.2,
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      }));
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.005;

      stars.forEach((star) => {
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(star.phase + t * star.speed * 200));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;

        if (star.r > 1.2) {
          // Bigger stars get a cross/sparkle
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha * 0.3;
          ctx.fillStyle = star.color;
          ctx.fillRect(star.x - star.r * 3, star.y - 0.5, star.r * 6, 1);
          ctx.fillRect(star.x - 0.5, star.y - star.r * 3, 1, star.r * 6);
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;

      // Subtle nebula clouds
      const drawNebula = (
        x: number, y: number, rx: number, ry: number,
        r: number, g: number, b: number, alpha: number
      ) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.save();
        ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(
          x / (rx / Math.max(rx, ry)),
          y / (ry / Math.max(rx, ry)),
          Math.max(rx, ry), 0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      };

      drawNebula(width * 0.2, height * 0.3, 300, 200, 0, 50, 200, 0.04);
      drawNebula(width * 0.8, height * 0.6, 250, 180, 100, 0, 200, 0.035);
      drawNebula(width * 0.5, height * 0.8, 350, 150, 0, 100, 150, 0.03);

      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      aria-hidden="true"
    />
  );
}
