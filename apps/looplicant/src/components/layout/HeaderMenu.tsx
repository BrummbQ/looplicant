"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/cv", label: "Application" },
  { href: "/import", label: "Import" },
];

export default function HeaderMenu() {
  const pathname = usePathname();
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeLink = containerRef.current?.querySelector(
      `a[data-active="true"]`
    ) as HTMLElement;

    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [pathname]);

  return (
    <div className="relative flex" ref={containerRef}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          data-active={pathname === link.href}
          className={`relative font-medium ${
            pathname === link.href
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          } transition-colors px-4 pb-2`}
        >
          {link.label}
        </Link>
      ))}

      {/* Animated underline */}
      <span
        className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>
  );
}
