import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl italic">House of Polaris</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            Olfactory stories drawn from wild earth, distant stars, and the hush between them.
          </p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/shop">The collection</Link>
            <Link href="/#house">The house</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Private notes</p>
          <div className="mt-5 flex border-b border-border pb-2">
            <input
              aria-label="Email address"
              type="email"
              placeholder="EMAIL ADDRESS"
              className="min-w-0 flex-1 bg-transparent text-[10px] tracking-[0.18em] outline-none placeholder:text-muted-foreground"
            />
            <button type="button" className="text-primary" aria-label="Join mailing list">→</button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl flex-col justify-between gap-3 text-[9px] uppercase tracking-[0.25em] text-muted-foreground md:flex-row">
        <span>© 2026 House of Polaris</span>
        <span>Made beneath open skies</span>
      </div>
    </footer>
  );
}
