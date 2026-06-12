import { intro } from "@/data/content";
import { FadeIn } from "./motion-wrapper";

export function IntroStrip() {
  return (
    <section id="about" aria-labelledby="intro-heading" className="bg-(--color-stone-900) py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-6" style={{ color: "var(--color-red-100)" }}>
            About us
          </p>
          <p className="text-[1.25rem] md:text-[1.5rem] leading-[1.6] font-display font-medium text-white">
            {intro.body}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
