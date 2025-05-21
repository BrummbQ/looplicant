"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/", label: "Application" },
  { href: "/import", label: "Import" },
];

const Header: FC = () => {
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
    <header className="w-full px-4 py-4 flex items-center justify-between max-w-6xl mx-auto mb-4 border-b">
      {/* Left: Logo and title */}
      <div className="flex items-center space-x-2">
        <Bot className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold text-primary">Looplicant</span>
      </div>

      {/* Center: Carousel-style navigation */}
      <div className="relative flex " ref={containerRef}>
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

      {/* Optional right space (future icons, auth, etc.) */}
      <div className="w-6 h-6" />
    </header>
  );
};

export default Header;
