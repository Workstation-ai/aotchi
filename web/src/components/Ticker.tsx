const tickerItems = [
  { hash: "0x7bc0...d35c", action: "Register", chain: "BSC", time: "2m ago" },
  { hash: "0xa1b2...c3d4", action: "Deploy", chain: "BSC", time: "5m ago" },
  { hash: "0xe5f6...g7h8", action: "Fund", chain: "BSC", time: "8m ago" },
  { hash: "0x9i0j...k1l2", action: "Execute", chain: "BSC", time: "12m ago" },
  { hash: "0xm3n4...o5p6", action: "Register", chain: "BSC", time: "15m ago" },
  { hash: "0xq7r8...s9t0", action: "Deploy", chain: "Testnet", time: "18m ago" },
  { hash: "0xu1v2...w3x4", action: "Fund", chain: "BSC", time: "22m ago" },
  { hash: "0xy5z6...a7b8", action: "Execute", chain: "Testnet", time: "25m ago" },
];

export function Ticker() {
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-md border-t border-primary-container/10">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="shrink-0 text-xs font-mono text-primary-container tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            LIVE
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center marquee-track">
              {duplicatedItems.map((item, index) => (
                <span key={index} className="ticker-text text-on-surface-600 whitespace-nowrap">
                  <span className="text-primary-container/70 font-semibold">{item.hash}</span>
                  {" · "}
                  <span className="text-on-surface-400">{item.action}</span>
                  {" · "}
                  <span className="text-on-surface-500">{item.chain}</span>
                  {" · "}
                  <span className="text-on-surface-600">{item.time}</span>
                  {' \u00a0\u00a0\u00a0 '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}