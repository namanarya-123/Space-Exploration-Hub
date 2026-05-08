"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.max(0, Math.min(1, pct)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

export function useSectionProgress(sectionId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const h = window.innerHeight;
      if (rect.bottom < 0 || rect.top > h) {
        setProgress(rect.top > h ? 0 : 1);
        return;
      }
      const pct = (h - rect.top) / (h + rect.height);
      setProgress(Math.max(0, Math.min(1, pct)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionId]);

  return progress;
}

export function useInView(threshold = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}
