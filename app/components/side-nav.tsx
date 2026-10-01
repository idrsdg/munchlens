"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, BookOpen, BarChart2,
  User, Utensils, Crown, CalendarDays, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export default function SideNav({ isPro = false }: { isPro?: boolean }) {
  const pathname = usePathname();
  const t = useT();

  const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/plan",      icon: CalendarDays,    label: t.nav.plan      },
    { href: "/tarifler",  icon: BookOpen,        label: t.nav.recipes   },
    { href: "/analizler", icon: BarChart2,        label: t.nav.analysis  },
    { href: "/takip",     icon: Scale,            label: t.nav.tracking  },
    { href: "/alisveris", icon: ShoppingCart,     label: t.nav.shopping  },
    { href: "/profil",    icon: User,             label: t.nav.profile   },
  ];

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-border bg-card fixed top-0 left-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Utensils className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">MunchLens</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: upgrade (sadece free kullanıcılar) */}
      {!isPro && (
        <div className="px-3 py-4 border-t border-border">
          <Link
            href="/fiyatlar"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
          >
            <Crown className="h-4 w-4" />
            {t.nav.upgrade}
          </Link>
        </div>
      )}
    </aside>
  );
}
