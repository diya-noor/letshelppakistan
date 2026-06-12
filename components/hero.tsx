"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { hero, brand } from "@/data/content";

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: prefersReduced ? 1 : 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* PLACEHOLDER: Replace with a high-quality photograph of the community */}
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,17,15,0.15) 0%, rgba(20,17,15,0) 40%, rgba(20,17,15,0.75) 100%)",
          }}
        />
        {/* Top vignette for nav legibility */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: "linear-gradient(180deg, rgba(20,17,15,0.5) 0%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-12 w-full flex flex-col items-center text-center pt-24 pb-20">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-white/80"
        >
          {brand.eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="display-heading text-white max-w-4xl"
        >
          {hero.headline}
        </motion.h1>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[1.125rem] leading-[1.7] text-white/85 max-w-2xl"
        >
          {hero.subcopy}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link
            href={hero.cta.primary.href}
            className="inline-flex items-center h-12 px-8 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm transition-all duration-200 hover:bg-[var(--color-primary-600)] hover:-translate-y-px shadow-[var(--shadow-lg)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {hero.cta.primary.label}
          </Link>
          <Link
            href={hero.cta.secondary.href}
            className="inline-flex items-center h-12 px-8 rounded-full border border-white/70 text-white font-medium text-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {hero.cta.secondary.label}
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.6 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1.5 },
        }}
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
}
