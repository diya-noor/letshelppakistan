import Image from "next/image";
import { initiatives } from "@/data/content";
import { FadeIn } from "./motion-wrapper";

export function FeaturedInitiatives() {
  return (
    <section
      aria-labelledby="initiatives-heading"
      className="py-16 md:py-28 bg-(--color-stone-100)"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <FadeIn className="max-w-2xl mb-16 md:mb-20">
          <p className="eyebrow mb-3">Stories of change</p>
          <h2 id="initiatives-heading" className="h2 text-(--color-foreground)">
            The work, up close.
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-16 md:gap-24">
          {initiatives.map((item) => (
            <FadeIn key={item.id} delay={0.1}>
              <article
                className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                  item.imageLeft ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
                }`}
              >
                {/* Image — PLACEHOLDER: Replace URL with verified community photograph */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-(--shadow-lg)">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    quality={85}
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  {/* Warm grade overlay */}
                  <div className="absolute inset-0 bg-(--color-gold-500)/5 mix-blend-multiply" />
                </div>

                {/* Copy */}
                <div className="flex flex-col justify-center max-w-lg">
                  <p className="eyebrow mb-4">{item.eyebrow}</p>
                  <h3 className="h2 text-(--color-foreground) mb-5">{item.headline}</h3>
                  <p className="text-[1.0625rem] leading-[1.75] text-(--color-muted-foreground)">
                    {item.body}
                  </p>
                  <div className="mt-8">
                    <a
                      href="#get-involved"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary-600) hover:gap-3 transition-all duration-200"
                    >
                      Support this work
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
