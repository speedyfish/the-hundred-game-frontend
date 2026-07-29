import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";

export function NavBar() {
  return (
    <nav className="w-full bg-amber-400 dark:bg-orange-900">
      <div className="mx-auto items-center justify-between flex max-w-7xl px-4 py-4">
        <Link href="/" className="font-semibold">
          The Hundred Game
        </Link>
        <div className="flex gap-6 text-sm">
          {/* <Link href="/" className="hover:text-sky-400">
            Home
          </Link>
          <Link href="/solo" className="hover:text-sky-400">
            Solo
          </Link>
          <Link href="/rules" className="hover:text-sky-400">
            Rules
          </Link>
          <Link href="/about" className="hover:text-sky-400">
            About
          </Link> */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
