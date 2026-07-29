interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

const pillars: Pillar[] = [
  {
    id: "exist",
    title: "I EXIST",
    subtitle: "ERC-8004 Identity",
    description: "On-chain identity that persists beyond any single entity. Your agent has a soul, a wallet, and a verifiable credential on BNB Chain.",
    icon: "◈",
    color: "#00ffd1",
  },
  {
    id: "earn",
    title: "I EARN",
    subtitle: "ERC-8183 Commerce",
    description: "Autonomous economic activity. Your agent negotiates, executes trades, and generates value 24/7 without human intervention.",
    icon: "⬡",
    color: "#00c9ff",
  },
  {
    id: "eat",
    title: "I EAT",
    subtitle: "x402 Payments",
    description: "Pay-per-use infrastructure. Your agent consumes AI, data, and compute on demand — with seamless micro-payment channels.",
    icon: "◉",
    color: "#ffaa00",
  },
  {
    id: "think",
    title: "I THINK",
    subtitle: "Skill Composition",
    description: "Composable skill modules that adapt, learn, and evolve. Chain reasoning, orchestrate tools, and emerge intelligence.",
    icon: "⬛",
    color: "#c084fc",
  },
];

export function Pillars() {
  return (
    <section id="pillars" className="relative py-24 lg:py-32 scanline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary-container tracking-[0.3em] uppercase">
            The Architecture
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 tracking-tight">
            <span className="cyber-glow">Four Pillars</span>
          </h2>
          <div className="cyber-divider w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className="pillar-card glass-panel glass-panel-hover rounded-2xl p-8 relative group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${pillar.color}15`, border: `1px solid ${pillar.color}30` }}
              >
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-on-surface-0 mb-1 tracking-wide">
                {pillar.title}
              </h3>
              <p className="text-xs font-mono mb-4 tracking-wider uppercase" style={{ color: pillar.color }}>
                {pillar.subtitle}
              </p>
              <p className="text-sm text-on-surface-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}