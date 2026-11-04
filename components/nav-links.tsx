"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, HomeIcon, ListIcon } from "./icons";

const links = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/assignments", label: "Assignments", Icon: ListIcon },
  { href: "/classes", label: "Classes", Icon: BookIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-1.5 rounded-full border border-line bg-surface p-1.5">
      {links.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-full px-4.5 py-2.5 text-[15px] transition-colors ${
                active
                  ? "bg-accent-soft font-extrabold text-link-hover"
                  : "font-bold text-ink-2 hover:bg-warm-2"
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
              className={`flex min-h-13 flex-col items-center justify-center gap-px rounded-[18px] text-xs transition-colors ${
                active
                  ? "bg-accent-soft font-extrabold text-link-hover"
                  : "font-bold text-ink-2"
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
