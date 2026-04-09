"use client";

import { useState, FormEvent } from "react";

type Props = {
  slug: string;
  onUnlock: () => void;
};

export default function PasswordGate({ slug, onUnlock }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password: value }),
    });

    setLoading(false);

    if (res.ok) {
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="paper-card rounded-sm p-8 w-full max-w-sm relative">
        <div className="binder-clip" />
        <div className="relative z-10">
          {/* Lock icon */}
          <div className="flex justify-center mb-5">
            <svg
              className="w-8 h-8 text-ink-faint"
              viewBox="0 0 24 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="12" width="20" height="16" rx="2" />
              <path d="M7 12V8a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint text-center mb-1">
            NDA Protected
          </p>
          <h2 className="font-serif text-lg font-bold text-ink text-center mb-5">
            Password required
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Enter password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full font-mono text-sm bg-cream border border-kraft-dark rounded-sm px-3 py-2 text-ink placeholder:text-ink-faint outline-none focus:border-ink-muted transition-colors"
              autoFocus
            />

            {error && (
              <p className="font-mono text-[10px] text-rust">
                Incorrect password. Try again.
              </p>
            )}

            <button
              type="submit"
              disabled={!value || loading}
              className="font-mono text-[11px] uppercase tracking-widest bg-ink text-cream py-2 rounded-sm hover:bg-ink/80 disabled:opacity-40 transition-all"
            >
              {loading ? "Checking..." : "Unlock"}
            </button>
          </form>
        </div>
      </div>

      <p className="font-mono text-[10px] text-ink-faint">
        Request access via email if you need it.
      </p>
    </div>
  );
}
