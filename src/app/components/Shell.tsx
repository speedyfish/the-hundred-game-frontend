export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
      {children}
    </main>
  );
}
