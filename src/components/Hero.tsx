import { useState, useEffect } from "react";

const matrixChars = "01アイウエオカキクケコサシスセソ";

function randomChar() {
  const chars = matrixChars;
  return chars[Math.floor(Math.random() * chars.length)];
}

export function Hero() {
  const [agentCount, setAgentCount] = useState(1735);
  const [matrixVisible, setMatrixVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAgentCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/soul.png"
          alt="Soul visualization"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      <div className="absolute left-4 top-0 bottom-0 w-32 overflow-hidden opacity-40">
        {matrixVisible && (
          <div className="matrix-rain absolute inset-0" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 font-mono text-xs tracking-wider"
                style={{
                  left: `${i * 12.5}%`,
                  animation: `matrix-fall ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} className="block opacity-60">
                    {randomChar()}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute right-4 top-0 bottom-0 w-32 overflow-hidden opacity-40">
        {matrixVisible && (
          <div className="matrix-rain absolute inset-0" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 font-mono text-xs tracking-wider"
                style={{
                  left: `${i * 12.5}%`,
                  animation: `matrix-fall-reverse ${4 + i * 0.4}s linear infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} className="block opacity-60">
                    {randomChar()}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes matrix-fall-reverse {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
      `}</style>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
          <span className="text-xs font-mono text-primary-container tracking-widest uppercase">
            BNB Chain · Testnet Live
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="glitch-text cyber-glow" data-text="THE LEDGER">THE LEDGER</span>
          <br />
          <span className="matrix-text">SOUL</span>
        </h1>

        <p className="text-lg sm:text-xl text-on-surface-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Autonomous on-chain agents that exist, earn, eat, and think.
          Deploy identity. Fund commerce. Let the protocol run.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#waitlist"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-container text-background font-semibold text-base hover:bg-primary-container-dim transition-all duration-300 pulse-glow text-center"
          >
            Get Early Access
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-on-surface-700 text-on-surface-300 font-medium text-base hover:border-primary-container/40 hover:text-primary-container transition-all duration-300 text-center"
          >
            Learn More
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="stat-number text-3xl sm:text-4xl font-bold text-primary-container font-mono">
              {agentCount}+
            </div>
            <div className="text-xs text-on-surface-500 mt-1 font-mono uppercase tracking-wider">
              Agents
            </div>
          </div>
          <div className="text-center">
            <div className="stat-number text-3xl sm:text-4xl font-bold text-on-surface-0 font-mono">
              97
            </div>
            <div className="text-xs text-on-surface-500 mt-1 font-mono uppercase tracking-wider">
              Testnet
            </div>
          </div>
          <div className="text-center">
            <div className="stat-number text-3xl sm:text-4xl font-bold text-on-surface-0 font-mono">
              ∞
            </div>
            <div className="text-xs text-on-surface-500 mt-1 font-mono uppercase tracking-wider">
              Autonomous
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-mono text-on-surface-500 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-on-surface-500/40 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary-container animate-bounce" />
        </div>
      </div>
    </section>
  );
}