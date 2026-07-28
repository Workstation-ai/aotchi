import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserButton } from "@clerk/clerk-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 scanline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/30 flex items-center justify-center">
              <span className="matrix-text font-mono text-sm font-bold">A</span>
            </div>
            <span className="font-sans font-semibold text-lg text-on-surface-0 tracking-tight">
              AOTCHI
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="nav-link text-sm text-on-surface-300 font-medium">
              Home
            </a>
            <a href="#pillars" className="nav-link text-sm text-on-surface-300 font-medium">
              Pillars
            </a>
            <a href="#how-it-works" className="nav-link text-sm text-on-surface-300 font-medium">
              How It Works
            </a>
            <a href="#manifesto" className="nav-link text-sm text-on-surface-300 font-medium">
              Manifesto
            </a>
            <a href="#waitlist" className="nav-link text-sm text-on-surface-300 font-medium">
              Waitlist
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ConnectButton.Custom>
              {({ openConnectModal, account, mounted }) => {
                const ready = mounted;
                const connected = ready && account && account.address;

                if (connected) {
                  return (
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-variant/50 border border-primary-container/10">
                        <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                        <span className="text-xs font-mono text-on-surface-300">
                          {account.address.slice(0, 6)}...
                          {account.address.slice(-4)}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    onClick={openConnectModal}
                    className="px-4 py-2 rounded-xl bg-primary-container/10 border border-primary-container/30 text-primary-container text-sm font-semibold hover:bg-primary-container/20 hover:border-primary-container/50 transition-all duration-300 pulse-glow"
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }}
            </ConnectButton.Custom>

            <UserButton afterSignOutUrl="/" />

            <a
              href="#waitlist"
              className="hidden md:inline-flex px-4 py-2 rounded-xl bg-primary-container text-background text-sm font-semibold hover:bg-primary-container-dim transition-all duration-300 pulse-glow"
            >
              Join Waitlist
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-on-surface-300 hover:text-primary-container transition-colors"
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background/95 backdrop-blur-xl border-t border-primary-container/10 z-40 p-6">
          <div className="flex flex-col gap-4">
            <a href="#hero" className="text-on-surface-300 hover:text-primary-container transition-colors py-2">Home</a>
            <a href="#pillars" className="text-on-surface-300 hover:text-primary-container transition-colors py-2">Pillars</a>
            <a href="#how-it-works" className="text-on-surface-300 hover:text-primary-container transition-colors py-2">How It Works</a>
            <a href="#manifesto" className="text-on-surface-300 hover:text-primary-container transition-colors py-2">Manifesto</a>
            <a href="#waitlist" className="text-on-surface-300 hover:text-primary-container transition-colors py-2">Waitlist</a>
          </div>
        </div>
      )}

      <div className="cyber-divider" />
    </nav>
  );
}