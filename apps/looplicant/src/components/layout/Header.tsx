import { Bot } from "lucide-react";
import { FC } from "react";
import { SignIn } from "../ui/SignIn";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";

export default function Header({ minimal }: { minimal?: boolean }) {
  return (
    <header className="w-full px-4 py-4 flex items-center justify-between max-w-6xl mx-auto mb-8 border-b">
      {/* Left: Logo and title */}
      <Link className="flex items-center space-x-2" href="/">
        <Bot className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold text-primary">Looplicant</span>
      </Link>

      {!minimal && (
        <>
          {/* Center: Carousel-style navigation */}
          <HeaderMenu />

          <div>
            <SignIn />
          </div>
        </>
      )}
    </header>
  );
}
