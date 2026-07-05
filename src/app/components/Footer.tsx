export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/70 text-xs text-slate-400">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span>© {new Date().getFullYear()} The Hundred Game</span>
      </div>
    </footer>
  );
}
