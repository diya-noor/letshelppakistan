"use client";

import { Phone, MapPin, Send } from "lucide-react";
import { brand } from "@/data/content";
import { FadeIn } from "./motion-wrapper";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-16 md:py-28 bg-[var(--color-stone-100)]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <FadeIn className="mb-14">
          <p className="eyebrow mb-3">Get in touch</p>
          <h2 id="contact-heading" className="h2 text-[var(--color-foreground)]">
            We&apos;d love to hear from you.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Info */}
          <FadeIn delay={0.1}>
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="font-display text-[1.125rem] font-semibold text-[var(--color-foreground)] mb-4">
                  Contact details
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-red-50)] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone size={18} className="text-[var(--color-primary-600)]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-stone-500)] font-medium uppercase tracking-wider mb-1">Phone</p>
                      <a href={`tel:${brand.phone1}`} className="block text-[var(--color-foreground)] font-medium hover:text-[var(--color-primary-600)] transition-colors">
                        {brand.phone1}
                      </a>
                      <a href={`tel:${brand.phone2}`} className="block text-[var(--color-foreground)] font-medium hover:text-[var(--color-primary-600)] transition-colors">
                        {brand.phone2}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-red-50)] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={18} className="text-[var(--color-primary-600)]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-stone-500)] font-medium uppercase tracking-wider mb-1">Location</p>
                      <p className="text-[var(--color-foreground)] font-medium">{brand.location}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map placeholder */}
              <div className="rounded-[24px] overflow-hidden border border-[var(--color-border)] aspect-[4/3] bg-[var(--color-muted)] flex items-center justify-center">
                <div className="text-center px-6">
                  <MapPin size={32} className="text-[var(--color-stone-400)] mx-auto mb-3" strokeWidth={1} />
                  <p className="text-sm text-[var(--color-stone-500)]">
                    Parachinar, Kurram District<br />Khyber Pakhtunkhwa, Pakistan
                  </p>
                  <p className="text-xs text-[var(--color-stone-400)] mt-2">
                    {/* PLACEHOLDER: Replace with embedded Google Map */}
                    Map embed — add Google Maps iframe here
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Form (UI only) */}
          <FadeIn delay={0.2}>
            <form
              onSubmit={(e) => e.preventDefault()}
              aria-label="Contact form"
              className="bg-[var(--color-card)] rounded-[24px] p-8 border border-[var(--color-border)] shadow-[var(--shadow-md)]"
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-stone-400)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-stone-400)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 0000000"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-stone-400)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-shadow"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="How can we help, or how would you like to get involved?"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-stone-400)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-shadow resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--color-primary-600)] hover:-translate-y-px shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
                >
                  <Send size={16} />
                  Send message
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
