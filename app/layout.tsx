import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Academy | Mercor",
  description:
    "An interactive course that teaches complete beginners how to work with AI agents: context, workflow, workspace, trajectory, and iteration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 sm:px-6">
          <SiteHeader />
          <main className="flex-1 py-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 py-5">
      <a href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
          A
        </span>
        <span className="font-semibold tracking-tight">
          Agent Academy <span className="text-black/40">by Mercor</span>
        </span>
      </a>
      <nav className="flex items-center gap-4 text-sm text-black/60">
        <a href="/" className="hover:text-ink">
          Modules
        </a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-black/10 py-6 text-center text-xs text-black/40">
      Built as a Mercor take-home assessment — a hands-on primer on operating AI
      agents.
    </footer>
  );
}
