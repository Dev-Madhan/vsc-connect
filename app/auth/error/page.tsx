"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

// Map Better Auth error codes to human-readable messages
const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  unable_to_create_session: {
    title: "Access Denied",
    message:
      "Your Google account is not registered with Vistara Connect. Only pre-approved members (Super Administrator, President, Vice President, and Sub-Club Secretaries) may sign in via Google.",
  },
  unable_to_get_user_info: {
    title: "Access Denied",
    message:
      "Your Google account is not registered with Vistara Connect. Only pre-approved members may sign in.",
  },
  oauth_provider_not_found: {
    title: "Provider Error",
    message: "The sign-in provider could not be found. Please try again.",
  },
  invalid_code: {
    title: "Session Expired",
    message: "The sign-in link has expired or is invalid. Please try again.",
  },
  no_callback_url: {
    title: "Configuration Error",
    message: "Something is misconfigured. Please contact the administrator.",
  },
};

const FALLBACK = {
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try again.",
};

function AuthErrorContent() {
  const params = useSearchParams();
  const code = params.get("error") ?? "";
  const { title, message } = ERROR_MESSAGES[code] ?? FALLBACK;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap');

        .ae-root {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .ae-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          pointer-events: none;
        }
        .ae-blob-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #fca5a5 0%, #f87171 100%);
          top: -120px; right: -100px;
        }
        .ae-blob-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #c4b5fd 0%, #818cf8 100%);
          bottom: -80px; left: -80px;
        }

        .ae-card {
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.95);
          border-radius: 24px;
          padding: 48px 44px;
          max-width: 460px;
          width: 100%;
          text-align: center;
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 20px 60px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,1);
          animation: ae-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes ae-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ae-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 28px;
          border: 1px solid #fca5a5;
        }

        .ae-title {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0f0a1e;
          margin: 0 0 12px;
          letter-spacing: -0.4px;
        }

        .ae-message {
          font-size: 14.5px;
          color: #4b5563;
          line-height: 1.65;
          margin: 0 0 32px;
        }

        .ae-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 28px;
          text-align: left;
          color: #5b21b6;
          font-size: 13px;
          line-height: 1.55;
        }

        .ae-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ae-btn-primary {
          display: block;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: #fff;
          font-size: 14.5px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(124,58,237,0.35);
        }

        .ae-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.45);
        }

        .ae-btn-secondary {
          display: block;
          width: 100%;
          padding: 13px;
          background: transparent;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }

        .ae-btn-secondary:hover {
          border-color: #d1d5db;
          color: #374151;
        }

        .ae-code {
          margin-top: 24px;
          font-size: 11px;
          color: #9ca3af;
          font-family: monospace;
        }
      `}</style>

      <div className="ae-root">
        <div className="ae-blob ae-blob-1" />
        <div className="ae-blob ae-blob-2" />

        <div className="ae-card">
          <div className="ae-icon">🚫</div>

          <h1 className="ae-title">{title}</h1>
          <p className="ae-message">{message}</p>

          {(code === "unable_to_create_session" || code === "unable_to_get_user_info") && (
            <div className="ae-note">
              <span>🔒</span>
              <span>
                Access is restricted to authorised members only. If you believe this is an error,
                contact your club administrator.
              </span>
            </div>
          )}

          <div className="ae-actions">
            <Link href="/login" className="ae-btn-primary">
              Back to Login
            </Link>
            <Link href="/" className="ae-btn-secondary">
              Return to Home
            </Link>
          </div>

          {code && <p className="ae-code">error: {code}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
