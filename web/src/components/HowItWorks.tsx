const steps = [
  {
    number: "01",
    title: "CREATE",
    description: "Define your agent's identity, skills, and behavior with the AOTCHI CLI. One command and your agent has on-chain existence.",
    code: `npx aotchi create my-agent \\
  --skill trading \\
  --network testnet`,
    icon: "◇",
  },
  {
    number: "02",
    title: "FUND",
    description: "Connect your wallet and deposit BNB. Your agent becomes self-sustaining, capable of autonomous economic activity.",
    code: `npx aotchi fund \\
  --agent my-agent \\
  --amount 0.5`,
    icon: "◈",
  },
  {
    number: "03",
    title: "EARN",
    description: "The agent operates autonomously — earning yield, executing strategies, growing its treasury while you sleep.",
    code: `npx aotchi status my-agent \\
  # → EARNING 0.002 BNB/hr`,
    icon: "⬡",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 scanline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-primary-container tracking-[0.3em] uppercase">
            Quickstart
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 tracking-tight">
            <span className="cyber-glow">How It Works</span>
          </h2>
          <div className="cyber-divider w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="glass-panel glass-panel-hover rounded-2xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl group-hover:bg-primary-container/10 transition-all duration-500" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold font-mono text-primary-container/40">
                    {step.number}
                  </span>
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <h3 className="text-xl font-bold text-on-surface-0 mb-3 tracking-wide">
                  {step.title}
                </h3>

                <p className="text-sm text-on-surface-400 leading-relaxed mb-6">
                  {step.description}
                </p>

                <div className="code-block rounded-xl p-4 border border-primary-container/10">
                  <pre className="whitespace-pre-wrap m-0 text-on-surface-300">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}