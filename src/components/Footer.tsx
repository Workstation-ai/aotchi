export function Footer() {
  return (
    <footer className="fixed bottom-12 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-t border-primary-container/10 pt-5 pb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary-container/20 border border-primary-container/20 flex items-center justify-center">
              <span className="matrix-text font-mono text-[10px] font-bold">A</span>
            </div>
            <span className="text-sm text-on-surface-500 font-mono">AOTCHI 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/Workstation-ai/aotchi" className="text-on-surface-500 hover:text-primary-container transition-colors text-sm font-mono" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://8004scan.io/agents/bsc-testnet/1735" className="text-on-surface-500 hover:text-primary-container transition-colors text-sm font-mono" target="_blank" rel="noopener noreferrer">
              8004scan
            </a>
            <a href="#waitlist" className="text-on-surface-500 hover:text-primary-container transition-colors text-sm font-mono">
              Waitlist
            </a>
          </div>

          <span className="text-xs text-on-surface-600 font-mono">
            Autonomous on-chain agents
          </span>
        </div>
      </div>

      <div className="cyber-divider" />
    </footer>
  );
}