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
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* PLACEHOLDER: Replace with a high-quality photograph of the community */}
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          quality={90}
          // object-top on mobile keeps the focal centre visible in portrait
          className="object-cover object-center md:object-center"
          sizes="100vw"
        />

        {/* Base dark wash — lifts contrast across the whole frame */}
        <div className="absolute inset-0 bg-[#14110F]/40" />

        {/* Main gradient — heavy at bottom where text lives */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,17,15,0) 20%, rgba(20,17,15,0.55) 55%, rgba(20,17,15,0.92) 100%)",
          }}
        />

        {/* Top vignette — keeps nav legible */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,17,15,0.65) 0%, transparent 100%)",
          }}
        />

        {/* Side vignettes — stops text bleeding at wide viewports */}
        <div
          className="absolute inset-y-0 left-0 w-32 hidden lg:block"
          style={{ background: "linear-gradient(90deg, rgba(20,17,15,0.35) 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32 hidden lg:block"
          style={{ background: "linear-gradient(270deg, rgba(20,17,15,0.35) 0%, transparent 100%)" }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-12 w-full flex flex-col items-center text-center pt-28 pb-24">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 text-[0.75rem] md:text-sm font-semibold uppercase tracking-[0.14em] text-white/75"
        >
          {brand.eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="display-heading text-white max-w-[17ch]"
          style={{ textShadow: "0 2px 32px rgba(0,0,0,0.55)" }}
        >
          {hero.headline}
        </motion.h1>

        {/* Divider accent */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 mb-7 w-12 h-0.5 bg-[var(--color-primary)] origin-left"
        />

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-[1rem] md:text-[1.125rem] leading-[1.75] text-white/80 max-w-[52ch]"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
        >
          {hero.subcopy}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto"
        >
          <Link
            href={hero.cta.primary.href}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-(--color-primary) text-white font-medium text-sm transition-all duration-200 hover:bg-(--color-primary-600) hover:-translate-y-px shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {hero.cta.primary.label}
          </Link>
          <Link
            href={hero.cta.secondary.href}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-white/60 text-white font-medium text-sm backdrop-blur-sm bg-white/5 transition-all duration-200 hover:bg-white/15 hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {hero.cta.secondary.label}
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="/about"
        aria-label="Go to about section"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/90 transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 7, 0] }}
        transition={{
          opacity: { delay: 1.3, duration: 0.6 },
          y: { repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 1.6 },
        }}
      >
        <ChevronDown size={26} strokeWidth={1.5} />
      </motion.a>
    </section>
  );
}
