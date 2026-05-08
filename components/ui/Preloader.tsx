"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "> INITIALIZING INTERSTELLAR SYSTEMS...",
  "> CONNECTING TO DEEP SPACE NETWORK...",
  "> CALIBRATING QUANTUM NAVIGATION ARRAY...",
  "> LOADING STELLAR CARTOGRAPHY DATABASE...",
  "> SYNCING WITH HUBBLE SPACE TELESCOPE...",
  "> ENGAGING DARK MATTER SENSORS...",
  "> WARP DRIVE STANDBY MODE ACTIVE...",
  "> PREPARING SPACE EXPLORATION HUB...",
  "> ALL SYSTEMS NOMINAL. LAUNCH SEQUENCE READY.",
];

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [exiting, setExiting] = useState(false);
  const logIdx = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Particle canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number; r: number; a: number;
    }> = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
    }));

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.globalAlpha = p.a * 0.6;
        ctx.fillStyle = "#00f5ff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    // Boot logs
    const logInterval = setInterval(() => {
      if (logIdx.current < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[logIdx.current]]);
        logIdx.current++;
      } else {
        clearInterval(logInterval);
      }
    }, 380);

    // Progress
    const progInterval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 3 + 0.5;
        if (next >= 100) {
          clearInterval(progInterval);
          setTimeout(() => {
            setExiting(true);
            setTimeout(onComplete, 1500);
          }, 500);
          return 100;
        }
        return next;
      });
    }, 70);

    return () => {
      clearInterval(logInterval);
      clearInterval(progInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Pulse rings */}
          {[0, 0.6, 1.2].map((delay, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-cyan-400/30"
              style={{
                animation: `pulse-ring 2.5s linear ${delay}s infinite`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase mb-6"
          >
            SPACE EXPLORATION HUB · INTERACTIVE SPACE JOURNEY
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-orbitron text-4xl md:text-6xl font-black tracking-[0.2em] uppercase mb-8"
          >
            SPACE{" "}
            <span
              className="text-cyan-400"
              style={{ textShadow: "0 0 30px #00f5ff, 0 0 60px rgba(0,245,255,0.4)" }}
            >
              EXPLORATION HUB
            </span>
          </motion.div>

          {/* Boot log */}
          <div className="w-full max-w-lg mb-6 h-32 overflow-hidden">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-[11px] text-green-400/80 leading-relaxed"
              >
                {log}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-lg">
            <div className="h-[2px] bg-white/5 relative overflow-hidden loading-bar">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                style={{
                  width: `${progress}%`,
                  boxShadow: "0 0 20px #00f5ff",
                  transition: "width 0.1s ease",
                }}
              />
            </div>
            <div className="font-mono text-[11px] text-cyan-400/80 text-center mt-2">
              {Math.floor(progress)}%
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
