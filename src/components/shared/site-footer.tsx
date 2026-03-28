import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/shared/brand-mark";

const platformLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Explore Ideas" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
];

const memberLinks = [
  { href: "/register", label: "Become a Member" },
  { href: "/login", label: "Member Login" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-profile", label: "My Profile" },
];

const resourceLinks = [
  { href: "/newsletter", label: "Newsletter" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/change-password", label: "Account Security" },
];

const footerLegalLinks = [
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/newsletter", label: "Newsletter" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://github.com", label: "GitHub" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--secondary)_48%,transparent),var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-8 lg:px-10">
        <div className="grid gap-6 rounded-[28px] border border-border/80 bg-card/92 p-5 text-sm sm:gap-8 sm:rounded-[32px] sm:p-8 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.95fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <BrandMark className="size-10" />
              <div>
                <p className="text-base font-semibold text-foreground">EcoSpark Hub</p>
                <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Sustainability platform
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              A professional community platform for sustainability proposals, transparent
              moderation, and premium implementation guidance when deeper execution is needed.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                Community ideas
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                Transparent review flow
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                Free and premium access
              </span>
            </div>

            <div>
              <p className="font-semibold text-foreground">Follow EcoSpark Hub</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/25 hover:bg-primary/8 hover:text-foreground"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold text-foreground">Platform</p>
            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              {platformLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-foreground">Members</p>
            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              {memberLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-semibold text-foreground">Resources</p>
              <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
                {resourceLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground">Contact</p>
              <div className="mt-4 space-y-3 text-muted-foreground">
                <a
                  href="mailto:arefinrounok@gmail.com"
                  className="flex items-start gap-3 transition hover:text-foreground"
                >
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  <span>arefinrounok@gmail.com</span>
                </a>
                <a
                  href="tel:+8801712394302"
                  className="flex items-start gap-3 transition hover:text-foreground"
                >
                  <Phone className="mt-0.5 size-4 shrink-0" />
                  <span>+880 1712394302</span>
                </a>
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground md:mt-6 md:flex-row md:items-center md:justify-between">
          <p className="leading-7 text-muted-foreground">
            © 2026 EcoSpark Hub. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLegalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
