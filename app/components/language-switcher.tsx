"use client";

import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { type Locale } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
  dropUp?: boolean;
}

export default function LanguageSwitcher({ compact = false, dropUp = false }: Props) {
  const { locale, setLocale, locales } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = locales[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
          open && "bg-accent"
        )}
      >
        <span>{current.flag}</span>
        {!compact && <span>{current.nativeName}</span>}
        {compact && <span className="uppercase">{locale}</span>}
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className={`absolute right-0 z-50 min-w-[130px] rounded-xl border border-border bg-popover shadow-lg overflow-hidden ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
          {(Object.entries(locales) as [Locale, typeof locales[Locale]][]).map(([key, info]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setLocale(key); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors hover:bg-accent",
                locale === key && "bg-primary/10 text-primary font-semibold"
              )}
            >
              <span className="text-base">{info.flag}</span>
              <span>{info.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
