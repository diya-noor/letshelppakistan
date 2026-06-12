import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { brand, nav } from "@/data/content";

const socials = [
  { label: "Facebook", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-(--color-stone-900) text-white" role="contentinfo">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-white/20">
                <Image
                  src="/lets-help-logo.jpeg"
                  alt="Let's Help Pakistan logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-semibold text-lg leading-tight">{brand.name}</p>
                <p className="text-xs text-white/50 font-sans mt-0.5">{brand.tagline}</p>
              </div>
            </div>
            <p className="text-sm leading-[1.7] text-white/60 max-w-xs">
              Serving underprivileged communities in Parachinar since 2009 — without discrimination.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`${brand.name} on ${label}`}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-(--color-primary) hover:text-white transition-all duration-200 text-[10px] font-bold"
                >
                  {label.slice(0, 1)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Quick links</p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Contact</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-white/40 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="text-sm text-white/60 space-y-1">
                  <a href={`tel:${brand.phone1}`} className="block hover:text-white transition-colors">{brand.phone1}</a>
                  <a href={`tel:${brand.phone2}`} className="block hover:text-white transition-colors">{brand.phone2}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-white/40 mt-0.5 shrink-0" strokeWidth={1.5} />
                <p className="text-sm text-white/60">{brand.location}</p>
              </li>
            </ul>

            <Link
              href="#get-involved"
              className="inline-flex items-center mt-8 h-10 px-6 rounded-full bg-(--color-primary) text-white text-sm font-medium transition-all duration-200 hover:bg-(--color-primary-600) hover:-translate-y-px"
            >
              Donate
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} {brand.name}. All rights reserved.</p>
          <p>Registered non-profit · Parachinar, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
