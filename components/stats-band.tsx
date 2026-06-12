"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { stats } from "@/data/content";
import { StaggerContainer, StaggerItem } from "./motion-wrapper";

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active, target, duration]);

  return count;
}

function StatItem({ value, label, suffix = "" }: {
  value: string;
  label: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();
  const numericValue = parseInt(value.replace(/,/g, ""), 10);
  const count = useCountUp(numericValue, prefersReduced ? true : inView);

  return (
    <StaggerItem>
      <div ref={ref} className="text-center">
        <p
          className="font-display font-semibold text-(--color-primary) leading-none"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          aria-label={`${value}${suffix} ${label}`}
        >
          {prefersReduced ? value : count.toLocaleString()}
          {suffix}
        </p>
        <p className="mt-3 text-sm font-sans text-(--color-stone-600) uppercase tracking-[0.08em] font-medium">
          {label}
        </p>
      </div>
    </StaggerItem>
  );
}

export function StatsBand() {
  return (
    <section id="impact" aria-labelledby="impact-heading" className="py-16 md:py-24 bg-(--color-background)">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3" id="impact-heading">Our impact</p>
          <h2 className="h2 text-(--color-foreground)">15 years of real change</h2>
          <p className="mt-1 text-xs text-(--color-stone-500) italic">
            * All figures are placeholders — client must supply verified data before launch.
          </p>
        </div>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
