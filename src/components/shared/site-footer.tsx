import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import type { SVGProps } from "react";

import { BrandMark } from "@/components/shared/brand-mark";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1S18.7.7 16 2.5a13.4 13.4 0 0 0-8 0C5.3.7 4.1 1 4.1 1A5 5 0 0 0 4 4.8a5.4 5.4 0 0 0-1.3 3.7c0 5.5 3.2 6.7 6.2 7A3.4 3.4 0 0 0 8 18.1V22" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const platformLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Explore Ideas" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
];

const memberLinks = [
  { href: "/register", label: "Become a Member" },
  { href: "/login", label: "Member Login" },
  { href: "/my-profile", label: "My Profile" },
];

const resourceLinks = [
  { href: "/newsletter", label: "Newsletter" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

const footerLegalLinks = [
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/newsletter", label: "Newsletter" },
];

const socialLinks = [
  {
    href: "https://www.linkedin.com/feed/hashtag/?keywords=sustainability",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "https://github.com/topics/sustainability",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://www.instagram.com/explore/tags/sustainability/",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://www.facebook.com/hashtag/sustainability",
    label: "Facebook",
    icon: FacebookIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--secondary)_48%,transparent),var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10 md:px-8 lg:px-10">
        <div className="rounded-[28px] border border-border/80 bg-card/92 p-5 text-sm sm:rounded-[32px] sm:p-8">
          <div className="space-y-5 border-b border-border/70 pb-6 sm:pb-8">
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
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 sm:gap-8 sm:pt-8 lg:grid-cols-4">
            <div>
              <p className="font-semibold text-foreground">Platform</p>
              <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
                {platformLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground">Members</p>
              <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
                {memberLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground">Resources</p>
              <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
                {resourceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-foreground"
                  >
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
                  className="flex items-start gap-3 break-all transition hover:text-foreground"
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
          <div className="flex flex-row flex-wrap gap-x-5 gap-y-2">
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
