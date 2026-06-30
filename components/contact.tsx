"use client";

import { Send } from "lucide-react";
import { FadeIn } from "./motion-wrapper";

export function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;

    const text = `*New Contact Message*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Subject:* ${encodeURIComponent(subject)}%0A*Message:* ${encodeURIComponent(message)}`;

    window.open(`https://wa.me/923025722798?text=${text}`, "_blank");
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-16 md:py-28 bg-[var(--color-stone-100)]">
      <div className="mx-auto max-w-[640px] px-6 md:px-12">
        <FadeIn className="mb-10">
          <p className="eyebrow mb-3 text-center">Get in touch</p>
          <h2 id="contact-heading" className="h2 text-[var(--color-foreground)] text-center">
            We&apos;d love to hear from you.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit}
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
                  name="name"
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
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-stone-400)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-shadow"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="What is this about?"
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-stone-400)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-shadow"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
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
    </section>
  );
}
