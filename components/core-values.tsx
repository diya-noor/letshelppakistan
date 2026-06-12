"use client";

import {
  Heart,
  Shield,
  Eye,
  HandHeart,
  Scale,
  Zap,
  Building2,
} from "lucide-react";
import { values } from "@/data/content";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-wrapper";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  Heart,
  Shield,
  Eye,
  HandHeart,
  Scale,
  Zap,
  Building2,
};

export function CoreValues() {
  return (
    <section
      aria-labelledby="values-heading"
      className="py-16 md:py-28 bg-[var(--color-background)]"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <FadeIn className="text-center mb-16">
          <p className="eyebrow mb-3">What guides us</p>
          <h2 id="values-heading" className="h2 text-[var(--color-foreground)]">
            Our core values
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {values.map((value) => {
            const Icon = iconMap[value.icon];
            return (
              <StaggerItem key={value.label}>
                <div className="flex flex-col items-center text-center gap-3 group p-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-red-50)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-primary)] group-hover:shadow-[var(--shadow-md)]">
                    {Icon && (
                      <Icon
                        size={24}
                        className="text-[var(--color-primary-600)] transition-colors duration-300 group-hover:text-white"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-foreground)] leading-tight">
                    {value.label}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Decorative rule */}
        <div className="mt-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>
      </div>
    </section>
  );
}
