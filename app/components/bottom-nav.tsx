"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, BookOpen, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";

export default function BottomNav() {
  const pathname = usePathname();
  const t = useT();

  const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/plan",      icon: CalendarDays,    label: t.nav.plan      },
    { href: "/tarifler",  icon: BookOpen,        label: t.nav.recipes   },
    { href: "/analizler", icon: BarChart2,        label: t.nav.analysis  },
    { href: "/profil",    icon: User,             label: t.nav.profile   },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb z-20">
      <div className="flex">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-orange-100 dark:fill-orange-950")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
