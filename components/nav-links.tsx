"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, DashboardIcon, ListIcon } from "./icons";

const links = [
  { href: "/", label: "Dashboard", Icon: DashboardIcon },
  { href: "/assignments", label: "Assignments", Icon: ListIcon },
  { href: "/classes", label: "Classes", Icon: BookIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-1">
      {links.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-accent-soft font-semibold text-accent"
                  : "font-medium text-ink-2 hover:bg-sunken hover:text-ink"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Bottom tab bar shown in place of the header links on phones.
export function MobileNavLinks() {
  const pathname = usePathname();

  return (
    <ul className="grid grid-cols-3 gap-1">
      {links.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-lg text-xs ${
                active ? "font-semibold text-accent" : "font-medium text-muted"
              }`}
            >
              <Icon className="size-5.5" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
