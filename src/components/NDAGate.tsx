"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

export default function NDAGate({ projectTitle }: { projectTitle: string }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/nda", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setError("Incorrect password. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <p style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#F35900",
          marginBottom: 16,
          margin: "0 0 16px",
        }}>
          NDA Protected
        </p>

        <h2 style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#1a1a1a",
          margin: "0 0 12px",
        }}>
          {projectTitle}
        </h2>

        <p style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: 15,
          color: "rgba(58,58,58,0.7)",
          lineHeight: 1.6,
          margin: "0 0 24px",
        }}>
          This project is protected. Enter the password to view.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              padding: "10px 14px",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 14,
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 4,
              outline: "none",
              marginBottom: error ? 8 : 12,
              boxSizing: "border-box",
              color: "#1a1a1a",
              backgroundColor: "#fff",
            }}
          />

          {error && (
            <p style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 11,
              color: "#F35900",
              margin: "0 0 12px",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              borderRadius: 4,
              cursor: loading ? "wait" : "pointer",
              marginBottom: 20,
            }}
          >
            {loading ? "Checking…" : "Submit"}
          </button>
        </form>

        <p style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 10,
          color: "rgba(58,58,58,0.5)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          Don&apos;t have the password?{" "}
          <a
            href="mailto:harsha.pillai98@gmail.com"
            style={{ color: "#F35900", textDecoration: "none" }}
          >
            Contact harsha.pillai98@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
