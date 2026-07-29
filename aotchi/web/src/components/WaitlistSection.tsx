import { useState } from "react";

interface WaitlistResponse {
  success?: boolean;
  id?: number;
  error?: string;
  count?: number;
}

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  const API_URL = "https://aotchi-waitlist.cxto21h.workers.dev";

  async function fetchCount() {
    try {
      const res = await fetch(`${API_URL}/`);
      if (res.ok) {
        const data = (await res.json()) as WaitlistResponse;
        setCount(data.count ?? null);
      }
    } catch {
      // silent fail
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), source: "landing-page" }),
      });

      const data = (await res.json()) as WaitlistResponse;

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Welcome to the future. Check your inbox for early access.");
        setEmail("");
        fetchCount();
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <section id="waitlist" className="relative py-24 lg:py-32 scanline">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-primary-container tracking-[0.3em] uppercase">
            Early Access
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 tracking-tight">
            <span className="cyber-glow">Join the Waitlist</span>
          </h2>
          <p className="text-on-surface-400 mt-4 max-w-md mx-auto">
            Be the first to deploy autonomous agents on BNB Chain. We&apos;ll keep you updated on launch and early access.
          </p>
        </div>

        {count !== null && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/10 border border-primary-container/20 text-sm font-mono text-primary-container">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              {count.toLocaleString()} agents on the waitlist
            </span>
          </div>
        )}

        {status === "success" ? (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-on-surface-0 mb-2">You&apos;re on the list</h3>
            <p className="text-on-surface-400 text-sm">{message}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-sm text-primary-container hover:text-primary-container-dim transition-colors font-mono underline"
              type="button"
            >
              Submit another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="waitlist-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="your@email.com"
                  disabled={status === "submitting"}
                  className="waitlist-input w-full px-5 py-3.5 rounded-xl text-on-surface-0 font-mono text-sm placeholder:text-on-surface-600"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-8 py-3.5 rounded-xl bg-primary-container text-background font-semibold text-sm hover:bg-primary-container-dim transition-all duration-300 pulse-glow whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Joining..." : "Join Waitlist"}
              </button>
            </div>

            {status === "error" && message && (
              <p className="mt-4 text-sm text-red-400 font-mono text-center" role="alert">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}