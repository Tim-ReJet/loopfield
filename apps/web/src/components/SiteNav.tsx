"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IntensityToggle } from "./IntensityToggle";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/field", label: "Field" },
  { href: "/loops", label: "Loops" },
  { href: "/constellation", label: "Constellation" },
  { href: "/contribute", label: "Contribute" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4 md:p-6">
      <Link
        href="/"
        className="pointer-events-auto font-display text-lg tracking-tight text-white md:text-xl"
      >
        Loopfield
      </Link>
      <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs tracking-wide transition md:text-sm",
              pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href))
                ? "bg-white/15 text-white"
                : "text-white/55 hover:text-white",
            )}
          >
            {link.label}
          </Link>
        ))}
        <IntensityToggle />
      </div>
    </nav>
  );
}
