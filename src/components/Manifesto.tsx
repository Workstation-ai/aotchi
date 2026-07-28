export function Manifesto() {
  return (
    <section id="manifesto" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-variant/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-mono text-primary-container tracking-[0.3em] uppercase">
          Philosophy
        </span>

        <blockquote className="mt-8 relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 text-primary-container/30 text-6xl font-serif">
            "
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-on-surface-100 leading-relaxed italic font-serif">
            La verdadera descentralización no es solo técnica — es un acto de fe en la autonomía.
          </p>
          <p className="text-on-surface-500 mt-4 text-sm font-mono uppercase tracking-wider">
            — AOTCHI Manifesto, 2026
          </p>
        </blockquote>

        <p className="mt-10 text-on-surface-400 max-w-2xl mx-auto leading-relaxed">
          We believe autonomous agents are the next chapter of the open internet.
          Not tools controlled by platforms — sovereign entities that exist on-chain,
          earn on-chain, and think for themselves. The ledger soul is the future of
          digital coexistence.
        </p>

        <div className="cyber-divider w-32 mx-auto mt-12" />

        <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
          {[
            { label: "ERC-8004", desc: "Identity" },
            { label: "ERC-8183", desc: "Commerce" },
            { label: "x402", desc: "Payments" },
            { label: "Skills", desc: "Composition" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-lg font-bold text-primary-container font-mono">
                {item.label}
              </div>
              <div className="text-xs text-on-surface-500 font-mono uppercase tracking-wider mt-1">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}