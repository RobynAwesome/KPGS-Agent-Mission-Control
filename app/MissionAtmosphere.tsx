"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  drift: number;
};

export default function MissionAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 780px)").matches;
    const particleCount = compact ? 34 : 72;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollPhase = 0;

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.75,
      size: 0.6 + Math.random() * 1.8,
      drift: 0.08 + Math.random() * 0.24
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / Math.max(width, 1) - 0.5;
      pointerY = event.clientY / Math.max(height, 1) - 0.5;
    };

    const onScroll = () => {
      const range = Math.max(document.documentElement.scrollHeight - height, 1);
      scrollPhase = window.scrollY / range;
    };

    const drawGrid = () => {
      const horizon = height * (0.64 - scrollPhase * 0.08);
      const offsetX = pointerX * 18;
      context.save();
      context.translate(offsetX, pointerY * 8);
      context.lineWidth = 1;

      for (let i = 0; i < 13; i += 1) {
        const t = i / 12;
        const y = horizon + Math.pow(t, 1.9) * height * 0.55;
        context.strokeStyle = `rgba(176,255,207,${0.018 + t * 0.055})`;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const center = width / 2;
      for (let i = -9; i <= 9; i += 1) {
        const baseX = center + i * width * 0.105;
        context.strokeStyle = "rgba(176,255,207,0.04)";
        context.beginPath();
        context.moveTo(center + i * 6, horizon);
        context.lineTo(baseX, height * 1.12);
        context.stroke();
      }
      context.restore();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const glowX = width * (0.22 + pointerX * 0.06);
      const glowY = height * (0.18 + pointerY * 0.04);
      const glow = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.72);
      glow.addColorStop(0, "rgba(90, 255, 174, 0.13)");
      glow.addColorStop(0.38, "rgba(80, 196, 145, 0.055)");
      glow.addColorStop(1, "rgba(5, 10, 9, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      drawGrid();

      const elapsed = reducedMotion ? 0 : time * 0.00004;
      for (const particle of particles) {
        const depth = particle.z;
        const x = ((particle.x + elapsed * particle.drift) % 1) * width + pointerX * 24 * depth;
        const y = particle.y * height + Math.sin(time * 0.00035 + particle.x * 8) * 7 * depth + pointerY * 18 * depth;
        const radius = particle.size * depth;
        context.fillStyle = `rgba(194,255,221,${0.09 + depth * 0.28})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    draw(0);
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="missionAtmosphere" aria-hidden="true">
      <canvas ref={canvasRef} className="missionCanvas" />
      <div className="missionVignette" />
      <div className="missionGrain" />
    </div>
  );
}
