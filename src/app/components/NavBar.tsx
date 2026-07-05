import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          The Hundred Game
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="hover:text-sky-400">
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
          </Link>
        </div>
      </nav>
    </header>
  );
}
