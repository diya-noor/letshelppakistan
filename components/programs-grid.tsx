"use client";

import {
  GraduationCap,
  HeartPulse,
  Users,
  Sparkles,
  Briefcase,
  HandHeart,
} from "lucide-react";
import { programs } from "@/data/content";
import { StaggerContainer, StaggerItem, FadeIn } from "./motion-wrapper";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  GraduationCap,
  HeartPulse,
  Users,
  Sparkles,
  Briefcase,
  HandHeart,
};

export function ProgramsGrid() {
  return (
    <section id="programs" aria-labelledby="programs-heading" className="py-16 md:py-28 bg-(--color-background)">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <FadeIn className="max-w-2xl mb-14 md:mb-20">
          <p className="eyebrow mb-3">What we do</p>
          <h2 id="programs-heading" className="h2 text-(--color-foreground)">
            Six programs, one mission.
          </h2>
          <p className="mt-4 text-[1.125rem] leading-[1.7] text-(--color-muted-foreground)">
            Every program is designed to give communities lasting tools — not temporary relief.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => {
            const Icon = iconMap[program.icon];
            return (
              <StaggerItem key={program.id}>
                <article className="group bg-(--color-card) border border-(--color-border) rounded-2xl p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-lg) cursor-default border-t-4 border-t-(--color-primary)">
                  <div className="w-12 h-12 rounded-xl bg-(--color-red-50) flex items-center justify-center mb-6 shrink-0 border border-(--color-red-100)">
                    {Icon && (
                      <Icon size={22} className="text-(--color-primary-600)" strokeWidth={1.5} />
                    )}
                  </div>
                  <h3 className="font-display text-[1.25rem] font-semibold text-(--color-foreground) mb-2">
                    {program.title}
                  </h3>
                  <p className="text-(--color-primary-600) text-sm font-medium mb-4">
                    {program.lead}
                  </p>
                  <ul className="mt-auto space-y-1.5">
                    {program.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-(--color-muted-foreground) leading-[1.6]">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--color-primary) shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
