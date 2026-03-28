export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm md:grid-cols-3 md:px-8 lg:px-10">
        <div>
          <p className="font-semibold text-foreground">EcoSpark Hub</p>
          <p className="mt-3 leading-7 text-muted-foreground">
            A community portal for sustainability proposals, premium implementation
            guides, and transparent moderation.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Contact</p>
          <p className="mt-3 leading-7 text-muted-foreground">
            hello@ecosparkhub.dev
            <br />
            +880 1000-000000
            <br />
            Dhaka, Bangladesh
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Platform</p>
          <p className="mt-3 leading-7 text-muted-foreground">
            Terms of Use
            <br />
            Privacy Policy
            <br />
            Newsletter
          </p>
        </div>
      </div>
    </footer>
  );
}
