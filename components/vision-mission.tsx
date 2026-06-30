import { visionMission } from "@/data/content";
import { FadeIn } from "./motion-wrapper";
import { Eye, Target } from "lucide-react";

export function VisionMission() {
  return (
    <section
      aria-labelledby="vm-heading"
      className="py-16 md:py-28 bg-(--color-stone-100)"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <FadeIn className="text-center mb-16">
          <p className="eyebrow mb-3">Who we are</p>
          <h2 id="vm-heading" className="h2 text-(--color-foreground)">Vision &amp; Mission</h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Vision */}
          <FadeIn delay={0.1}>
            <div className="bg-(--color-card) rounded-2xl p-8 md:p-10 border border-(--color-border) shadow-(--shadow-md) h-full">
              <div className="w-12 h-12 rounded-xl bg-(--color-red-50) flex items-center justify-center mb-6 mx-auto">
                <Eye size={22} className="text-(--color-primary-600)" strokeWidth={1.5} />
              </div>
              <p className="eyebrow mb-4 text-center">{visionMission.vision.label}</p>
              <p className="font-display text-[1.375rem] leading-[1.45] font-medium text-(--color-foreground) text-center">
                {visionMission.vision.body}
              </p>
            </div>
          </FadeIn>

          {/* Mission */}
          <FadeIn delay={0.2}>
            <div className="bg-(--color-primary) rounded-2xl p-8 md:p-10 h-full relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-12 -left-6 w-40 h-40 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 mx-auto">
                  <Target size={22} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-white/70 mb-4 text-center">
                  {visionMission.mission.label}
                </p>
                <p className="font-display text-[1.375rem] leading-[1.45] font-medium text-white text-center">
                  {visionMission.mission.body}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
