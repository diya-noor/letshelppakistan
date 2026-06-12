import Link from "next/link";
import { getInvolved } from "@/data/content";
import { FadeIn } from "./motion-wrapper";

export function GetInvolved() {
  return (
    <section
      id="get-involved"
      aria-labelledby="cta-heading"
      className="py-20 md:py-32 bg-[var(--color-primary)] relative overflow-hidden"
    >
      {/* Decorative background circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-12 text-center">
        <FadeIn>
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-white/60 mb-5">
            Get involved
          </p>
          <h2 id="cta-heading" className="h1 text-white max-w-3xl mx-auto mb-12">
            {getInvolved.headline}
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {getInvolved.options.map((opt) => {
              if (opt.variant === "primary") {
                return (
                  <Link
                    key={opt.label}
                    href={opt.href}
                    className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-2xl bg-white text-[var(--color-primary-600)] font-medium transition-all duration-200 hover:bg-[var(--color-stone-100)] hover:-translate-y-px shadow-[var(--shadow-lg)] min-w-[200px]"
                  >
                    <span className="font-semibold text-base">{opt.label}</span>
                    <span className="text-xs text-[var(--color-stone-600)] max-w-[180px] text-center leading-tight">
                      {opt.description}
                    </span>
                  </Link>
                );
              }
              if (opt.variant === "secondary") {
                return (
                  <Link
                    key={opt.label}
                    href={opt.href}
                    className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-2xl border border-white/50 text-white font-medium transition-all duration-200 hover:bg-white/10 hover:-translate-y-px min-w-[200px]"
                  >
                    <span className="font-semibold text-base">{opt.label}</span>
                    <span className="text-xs text-white/65 max-w-[180px] text-center leading-tight">
                      {opt.description}
                    </span>
                  </Link>
                );
              }
              return (
                <Link
                  key={opt.label}
                  href={opt.href}
                  className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-2xl text-white/80 font-medium transition-all duration-200 hover:text-white hover:bg-white/10 hover:-translate-y-px min-w-[200px]"
                >
                  <span className="font-semibold text-base">{opt.label}</span>
                  <span className="text-xs text-white/50 max-w-[180px] text-center leading-tight">
                    {opt.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
