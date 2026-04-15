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
    if (!value) return;

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
    <div className="min-h-[60vh] flex items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[11px] text-muted tracking-widest uppercase mb-2">
          NDA Protected
        </p>
        <h2 className="font-sans text-xl font-medium text-foreground mb-8">
          Password required
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Enter password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className="w-full font-mono text-sm bg-transparent border-b border-[rgba(10,10,10,0.2)] py-2 text-foreground placeholder:text-muted outline-none focus:border-foreground transition-colors duration-200"
          />

          {error && (
            <p className="font-mono text-[11px] text-red-600">
              Incorrect password.
            </p>
          )}

          <button
            type="submit"
            disabled={!value || loading}
            className="font-mono text-[11px] tracking-widest uppercase text-foreground border border-[rgba(10,10,10,0.15)] py-2.5 px-4 mt-2 hover:bg-foreground hover:text-background disabled:opacity-30 transition-all duration-200 self-start"
          >
            {loading ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
