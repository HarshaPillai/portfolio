"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type Props = {
  projectName: string;
  slug: string;
  onClose: () => void;
};

const EMAIL = "harsha.pillai98@gmail.com";

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M3 8H2C1.45 8 1 7.55 1 7V2C1 1.45 1.45 1 2 1H7C7.55 1 8 1.45 8 2V3"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ModalContent({ projectName, slug, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onClose();
        router.push(`/projects/${slug}`);
      } else {
        setError("Incorrect password");
        inputRef.current?.focus();
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 9000,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Password gate for ${projectName}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 380,
          backgroundColor: "#FAFAF8",
          border: "0.5px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: 32,
          zIndex: 9001,
          boxSizing: "border-box",
        }}
      >
        {/* Project label */}
        <div style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(58,58,58,0.4)", marginBottom: 14,
        }}>
          {projectName}
        </div>

        {/* Heading */}
        <div style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: 18, fontWeight: 500, letterSpacing: "-0.04em",
          color: "#1a1a1a", marginBottom: 24, lineHeight: 1.3,
        }}>
          This project is password protected
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter password"
            autoComplete="current-password"
            style={{
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 13, letterSpacing: "0.02em",
              color: "#1a1a1a",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${error ? "rgba(200,40,40,0.5)" : "rgba(0,0,0,0.15)"}`,
              borderRadius: 6,
              padding: "11px 14px",
              outline: "none",
              marginBottom: error ? 8 : 12,
              transition: "border-color 0.15s",
            }}
          />

          {error && (
            <div style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 10, letterSpacing: "0.02em",
              color: "rgba(200,40,40,0.85)",
              marginBottom: 12,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              width: "100%",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: loading || !password.trim()
                ? "rgba(0,0,0,0.3)"
                : "#1a1a1a",
              border: "none",
              borderRadius: 6,
              padding: "12px 0",
              cursor: loading || !password.trim() ? "default" : "pointer",
              transition: "background-color 0.15s",
            }}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ height: "0.5px", backgroundColor: "rgba(0,0,0,0.1)", margin: "24px 0 18px" }} />

        {/* Contact section */}
        <div style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 10, letterSpacing: "0.02em",
          color: "rgba(58,58,58,0.45)", lineHeight: 1.7,
        }}>
          <div>Don&apos;t have the password?</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
            <span style={{ color: "rgba(58,58,58,0.65)" }}>{EMAIL}</span>
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy email address"}
              style={{
                background: "none", border: "none", padding: 2,
                cursor: "pointer", display: "flex", alignItems: "center",
                color: copied ? "#3D9142" : "rgba(58,58,58,0.35)",
                transition: "color 0.15s",
                flexShrink: 0,
              }}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NDAModal({ projectName, slug, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(
    <ModalContent projectName={projectName} slug={slug} onClose={onClose} />,
    document.body,
  );
}
