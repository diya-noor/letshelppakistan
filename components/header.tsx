"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, brand } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "h-16 backdrop-blur-md border-b border-(--color-border)"
            : "h-20",
        )}
        style={{
          background: scrolled ? "rgba(250,247,242,0.88)" : "transparent",
        }}
        role="banner"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label={`${brand.name} — home`} className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-white/20">
              <Image
                src="/lets-help-logo.jpeg"
                alt="Let's Help Pakistan logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span
              className={cn(
                "font-display font-semibold text-lg leading-tight transition-colors duration-300",
                scrolled ? "text-(--color-foreground)" : "text-white",
              )}
            >
              Let&apos;s Help<br />
              <span className="text-xs font-sans font-medium opacity-80">Pakistan</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-(--color-primary-600)",
                  scrolled ? "text-(--color-stone-600)" : "text-white/90",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Donate button + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/get-involved"
              className="hidden sm:inline-flex items-center h-11 px-6 rounded-full bg-(--color-primary) text-white text-sm font-medium transition-all duration-200 hover:bg-(--color-primary-600) hover:-translate-y-px shadow-(--shadow-md) focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:ring-offset-2"
            >
              Donate
            </Link>
            <button
              className={cn(
                "lg:hidden p-2 rounded-md transition-colors duration-200",
                scrolled
                  ? "text-(--color-foreground) hover:bg-(--color-muted)"
                  : "text-white hover:bg-white/10",
              )}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-(--color-background) shadow-(--shadow-lg) flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
                <span className="font-display font-semibold text-(--color-foreground)">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md text-(--color-stone-600) hover:bg-(--color-muted) transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-6 flex flex-col gap-1" aria-label="Mobile navigation">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-4 rounded-lg text-(--color-foreground) font-medium hover:bg-(--color-muted) transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-(--color-border)">
                <Link
                  href="/get-involved"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full h-12 rounded-full bg-(--color-primary) text-white font-medium hover:bg-(--color-primary-600) transition-all duration-200"
                >
                  Donate now
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
