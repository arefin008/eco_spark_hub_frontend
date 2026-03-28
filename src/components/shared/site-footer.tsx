import Link from "next/link";

const footerLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/ideas", label: "Ideas" },
  { href: "/blog", label: "Blog" },
];

const footerLegalLinks = [
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/newsletter", label: "Newsletter" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--secondary)_48%,transparent),var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 md:px-8 lg:px-10">
        <div className="grid gap-6 rounded-[28px] border border-border/80 bg-card/92 p-5 text-sm sm:gap-8 sm:rounded-[32px] sm:p-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground">
                E
              </span>
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
          </div>

          <div>
            <p className="font-semibold text-foreground">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-foreground">Contact</p>
            <p className="mt-4 leading-7 text-muted-foreground">
              hello@ecosparkhub.dev
              <br />
              +880 1000-000000
              <br />
              Dhaka, Bangladesh
            </p>
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
