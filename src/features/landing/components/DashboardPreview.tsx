import * as React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
      {/* SaaS Window Container */}
      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden font-bengali text-xs">
        {/* Browser Mockup Top Bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/80" />
            <span className="size-2.5 rounded-full bg-muted-foreground/40" />
            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          </div>
          <div className="rounded-md border border-border bg-background px-3 py-0.5 font-sans text-[11px] text-muted-foreground shadow-2xs">
            app.selldesk.com / dashboard
          </div>
          <div className="w-8" />
        </div>

        {/* Dashboard Body (Sidebar + Content) */}
        <div className="grid grid-cols-12 min-h-[360px]">
          {/* Dark Mini Sidebar */}
          <div className="hidden sm:flex sm:col-span-3 bg-foreground text-background flex-col p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-primary-foreground font-medium">
              <LayoutDashboard className="size-3.5" />
              <span>ড্যাশবোর্ড</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground hover:text-background">
              <ShoppingCart className="size-3.5" />
              <span>অর্ডারস</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground hover:text-background">
              <Package className="size-3.5" />
              <span>প্রোডাক্টস</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground hover:text-background">
              <Users className="size-3.5" />
              <span>কাস্টমার</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground hover:text-background">
              <BarChart3 className="size-3.5" />
              <span>হিসাব-নিকাশ</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-muted-foreground hover:text-background">
              <Settings className="size-3.5" />
              <span>সেটিংস</span>
            </div>
          </div>

          {/* Main Dashboard Canvas */}
          <div className="col-span-12 sm:col-span-9 bg-background p-3.5 sm:p-4 space-y-3">
            {/* Header with Date Tabs */}
            <div className="flex items-center justify-between pb-1 border-b border-border/60">
              <span className="font-bold text-foreground text-sm">
                ড্যাশবোর্ড
              </span>
              <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5 text-[10px]">
                <span className="rounded bg-background px-2 py-0.5 font-semibold text-foreground shadow-2xs">
                  Today
                </span>
                <span className="px-2 py-0.5 text-muted-foreground">
                  This Month
                </span>
              </div>
            </div>

            {/* 3 KPI Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border bg-card p-2">
                <span className="text-[10px] text-muted-foreground">
                  সব অর্ডার
                </span>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  ১৪২
                </div>
                <span className="text-[9px] font-semibold text-primary">
                  +১২.৪%
                </span>
              </div>
              <div className="rounded-lg border border-border bg-card p-2">
                <span className="text-[10px] text-muted-foreground">
                  কনফার্মড অর্ডার
                </span>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  ১১৮
                </div>
                <span className="text-[9px] font-semibold text-primary">
                  +৮.১%
                </span>
              </div>
              <div className="rounded-lg border border-border bg-card p-2">
                <span className="text-[10px] text-muted-foreground">
                  মোট সেলস
                </span>
                <div className="text-sm font-bold text-foreground mt-0.5">
                  ৳১২,৫০০
                </div>
                <span className="text-[9px] text-muted-foreground">পেইড</span>
              </div>
            </div>

            {/* Chart + Donut Grid */}
            <div className="grid grid-cols-12 gap-2">
              {/* Vertical Bar Chart Card */}
              <div className="col-span-8 rounded-lg border border-border bg-card p-2.5 space-y-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  অর্ডার — গত ৩০ দিন
                </span>
                <div className="flex items-end justify-between h-16 pt-2 px-1 gap-1">
                  {[35, 60, 45, 75, 55, 90, 40, 65, 80, 50, 95, 70].map(
                    (h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-full rounded-xs transition-all ${
                          i % 2 === 0 ? "bg-primary" : "bg-primary/70"
                        }`}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Donut Chart Card */}
              <div className="col-span-4 rounded-lg border border-border bg-card p-2.5 flex flex-col items-center justify-center">
                <span className="text-[10px] font-semibold text-muted-foreground self-start mb-1">
                  অর্ডার
                </span>
                <div className="relative size-14 flex items-center justify-center">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      strokeWidth="4"
                      className="stroke-secondary"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      strokeWidth="4"
                      className="stroke-primary"
                      strokeDasharray="88, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-sans font-bold text-[10px] text-foreground">
                    88%
                  </span>
                </div>
              </div>
            </div>

            {/* Cash Flow Mini Bar Row */}
            <div className="rounded-lg border border-border bg-card p-2 space-y-1.5">
              <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                <span className="font-semibold">ক্যাশ ফ্লো</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-primary" />
                    ইনকাম
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-muted-foreground" />
                    খরচ
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 h-3">
                <div className="h-full w-2/3 rounded-xs bg-primary" />
                <div className="h-full w-1/3 rounded-xs bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
