export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 text-sm text-muted-foreground lg:grid-cols-3 lg:px-10">
        <div>
          <p className="font-semibold text-foreground">EcoSpark Hub</p>
          <p className="mt-2 leading-6">
            A sustainability idea portal for members, moderators, and
            community-led environmental action.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Contact</p>
          <p className="mt-2 leading-6">
            hello@ecosparkhub.dev
            <br />
            +880 1000-000000
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Legal</p>
          <p className="mt-2 leading-6">
            Terms of use
            <br />
            Privacy policy
          </p>
        </div>
      </div>
    </footer>
  );
}
