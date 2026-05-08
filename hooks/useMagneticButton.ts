"use client";

import { useRef, useCallback } from "react";

export function useMagneticButton(strength = 0.3) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = ref.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0)";
    btn.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
