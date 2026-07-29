import { useState } from "react";
import { supabase } from "../lib/supabase";

export function FloatingWaitlistButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
      const { error } = await supabase.from("waitlist").insert([
        {
          email: email.toLowerCase().trim(),
          source: "floating-form",
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          setStatus("error");
          setMessage("This email is already on the waitlist.");
        } else {
          setStatus("error");
          setMessage(error.message || "Something went wrong.");
        }
        return;
      }

      setStatus("success");
      setMessage("You're on the list!");
      setEmail("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-primary-container text-background font-semibold text-sm shadow-lg shadow-primary-container/30 hover:bg-primary-container-dim transition-all duration-300 pulse-glow"
        type="button"
        aria-label="Join waitlist"
      >
        <span className="w-2 h-2 rounded-full bg-background animate-pulse" />
        Join Waitlist
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Waitlist"
        >
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md mx-4 sm:mx-0 mb-4 sm:mb-0">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-on-surface-0">
                  Join the Waitlist
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-on-surface-500 hover:text-on-surface-0 transition-colors"
                  type="button"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-on-surface-400 mb-4">
                Be the first to deploy autonomous agents on BNB Chain.
              </p>

              {status === "success" ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">✓</div>
                  <p className="text-sm text-on-surface-0 font-mono">
                    {message}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl text-on-surface-0 bg-surface-variant border border-primary-container/20 text-sm font-mono placeholder:text-on-surface-600 focus:outline-none focus:border-primary-container"
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="px-4 py-2.5 rounded-xl bg-primary-container text-background text-sm font-semibold hover:bg-primary-container-dim transition-colors disabled:opacity-50"
                    >
                      {status === "submitting" ? "..." : "Join"}
                    </button>
                  </div>

                  {status === "error" && message && (
                    <p className="mt-3 text-xs text-red-400 font-mono" role="alert">
                      {message}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
