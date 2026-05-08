"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const curr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };

    const onEnter = () => cursorRef.current?.classList.add("hover");
    const onLeave = () => cursorRef.current?.classList.remove("hover");

    document.addEventListener("mousemove", onMove);

    // Add hover to all interactive elements
    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    let raf: number;
    const animate = () => {
      curr.current.x += (pos.current.x - curr.current.x) * 0.12;
      curr.current.y += (pos.current.y - curr.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = curr.current.x + "px";
        cursorRef.current.style.top = curr.current.y + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
