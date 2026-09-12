import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1 text-xs font-semibold text-secondary-foreground shadow-xs">
          <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
          SellDesk Design System v1.0
        </div>

        {/* Hero Typography */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Unified Commerce for Multi-Tenant Platforms
          </h1>
          <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
            A high-performance SaaS frontend engineered with Clean Architecture,
            centralized HSL design tokens, and zero hardcoded colors.
          </p>
        </div>

        {/* Design System Preview Cards */}
        <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-ring/50">
            <div className="flex items-center gap-3">
              <div className="size-4 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-card-foreground">
                Primary Brand Token
              </h2>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Vibrant purple{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                262 83% 58%
              </code>{" "}
              for core actions and active navigation.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-ring/50">
            <div className="flex items-center gap-3">
              <div className="size-4 rounded-full bg-secondary border border-border" />
              <h2 className="text-sm font-semibold text-card-foreground">
                Secondary Brand Token
              </h2>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Soft lavender{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                250 91% 95%
              </code>{" "}
              with WCAG AAA contrast foreground.
            </p>
          </div>
        </div>

        {/* Platform Surface Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Store Dashboard
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Platform Admin
          </Link>
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
