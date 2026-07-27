"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Database, Radar, Settings, ShieldCheck } from "lucide-react";

const nav = [
  { href: "/scan", label: "Scan", icon: Radar },
  { href: "/patterns", label: "Patterns", icon: Database },
  { href: "/history", label: "History", icon: Archive },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[88px] border-r border-white/10 bg-[#131313]/86 backdrop-blur-xl lg:flex lg:flex-col lg:items-center lg:gap-5 lg:py-6">
        <div className="grid size-12 place-items-center rounded-md border border-signal/40 bg-signal/10 shadow-signal">
          <ShieldCheck className="size-6 text-signal" />
        </div>
        <nav className="flex flex-1 flex-col gap-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group grid size-12 place-items-center rounded transition ${
                  active
                    ? "border border-signal/50 bg-signal/12 text-signal shadow-signal"
                    : "border border-white/5 bg-white/[0.02] text-muted hover:border-signal/30 hover:text-signal"
                }`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="size-5 transition group-hover:scale-105" />
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="pb-24 lg:pl-[88px] lg:pb-0">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-[#131313]/92 px-2 py-2 backdrop-blur-xl lg:hidden">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded p-2 text-[11px] ${active ? "text-signal" : "text-muted"}`}>
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
