"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const slides = [
    {
      src: "https://images.unsplash.com/photo-1559060680-36abfac01944?q=80&w=1074&auto=format&fit=crop",
      caption: "Connecting People,\nCreating Journeys",
    },
    {
      src: "https://images.unsplash.com/photo-1678967630352-c40c4b2960b8?q=80&w=735&auto=format&fit=crop",
      caption: "Explore the World,\nOne Step at a Time",
    },
    {
      src: "https://images.unsplash.com/photo-1584526610735-85713819a065?q=80&w=749&auto=format&fit=crop",
      caption: "Your Journey\nStarts Here",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleCredentialSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Better Auth username plugin exposes signIn.username
      const result = await authClient.signIn.username({
        username,
        password,
      });

      if (result.error) {
        const msg = result.error.message ?? "";
        if (
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("credentials") ||
          msg.toLowerCase().includes("password")
        ) {
          setError("Invalid username or password. Please try again.");
        } else if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("user")) {
          setError("No account found with that username.");
        } else {
          setError(msg || "Something went wrong. Please try again.");
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .lp-root {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%);
          padding: 24px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .lp-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
          animation: lp-drift 12s ease-in-out infinite alternate;
        }
        .lp-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #c4b5fd 0%, #818cf8 100%);
          top: -140px; left: -140px;
          animation-delay: 0s;
        }
        .lp-blob-2 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #a5f3fc 0%, #38bdf8 100%);
          bottom: -120px; right: -120px;
          animation-delay: -4s;
        }
        .lp-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #bbf7d0 0%, #34d399 100%);
          top: 60%; left: 60%;
          animation-delay: -8s;
        }

        @keyframes lp-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.06); }
        }

        .lp-card {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 980px;
          min-height: 580px;
          max-height: 700px;
          height: 90vh;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 4px 6px rgba(124, 58, 237, 0.04),
            0 12px 40px rgba(124, 58, 237, 0.1),
            0 40px 80px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255,255,255,1);
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                      transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }

        .lp-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Left image panel ── */
        .lp-img-panel {
          position: relative;
          flex: 0 0 44%;
          overflow: hidden;
          border-radius: 22px 0 0 22px;
        }

        @media (max-width: 768px) {
          .lp-img-panel { display: none; }
          .lp-form-panel { flex: 1; padding: 32px 24px; }
          .lp-card { max-height: none; height: auto; }
        }

        .lp-img-track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lp-img-slide {
          flex: 0 0 100%;
          height: 100%;
          position: relative;
        }

        .lp-img-slide img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 8s ease-in-out;
        }

        .lp-img-slide.active img { transform: scale(1.05); }

        .lp-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(15,10,40,0.25) 0%,
            rgba(15,10,40,0.08) 35%,
            rgba(10,5,30,0.65) 100%
          );
        }

        .lp-img-logo {
          position: absolute;
          top: 26px; left: 26px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.03em;
          text-shadow: 0 1px 8px rgba(0,0,0,0.3);
        }

        .lp-img-logo-dot {
          width: 8px; height: 8px;
          background: #a78bfa;
          border-radius: 50%;
          box-shadow: 0 0 8px #a78bfa;
          animation: lp-pulse-dot 2s ease-in-out infinite;
        }

        @keyframes lp-pulse-dot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.45); opacity: 0.7; }
        }

        .lp-back-btn {
          position: absolute;
          top: 20px; right: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.28);
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }

        .lp-back-btn:hover {
          background: rgba(255,255,255,0.28);
          transform: translateX(-2px);
        }

        .lp-img-caption {
          position: absolute;
          bottom: 64px; left: 28px; right: 28px;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.35;
          font-family: 'Outfit', sans-serif;
          text-shadow: 0 2px 12px rgba(0,0,0,0.3);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .lp-img-caption.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .lp-slide-dots {
          position: absolute;
          bottom: 26px; left: 28px;
          display: flex;
          gap: 7px;
        }

        .lp-dot {
          width: 24px; height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.35);
          cursor: pointer;
          border: none;
          transition: background 0.25s, width 0.3s cubic-bezier(0.4,0,0.2,1);
          padding: 0;
        }

        .lp-dot.active { width: 40px; background: #fff; }

        /* ── Right form panel ── */
        .lp-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 44px 52px;
          overflow-y: auto;
          background: transparent;
        }

        @media (max-width: 900px) {
          .lp-form-panel { padding: 36px 32px; }
        }

        .lp-form-panel > * {
          opacity: 0;
          transform: translateY(16px);
          animation: lp-slide-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .lp-form-panel > *:nth-child(1) { animation-delay: 0.15s; }
        .lp-form-panel > *:nth-child(2) { animation-delay: 0.22s; }
        .lp-form-panel > *:nth-child(3) { animation-delay: 0.29s; }
        .lp-form-panel > *:nth-child(4) { animation-delay: 0.36s; }
        .lp-form-panel > *:nth-child(5) { animation-delay: 0.43s; }
        .lp-form-panel > *:nth-child(6) { animation-delay: 0.50s; }

        @keyframes lp-slide-up {
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #f3e8ff, #ede9fe);
          border: 1px solid #ddd6fe;
          color: #7c3aed;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 100px;
          margin-bottom: 18px;
          width: fit-content;
          letter-spacing: 0.02em;
        }

        .lp-heading {
          font-size: 30px;
          font-weight: 800;
          color: #0f0a1e;
          margin: 0 0 6px 0;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.6px;
          line-height: 1.2;
        }

        .lp-subtext {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 10px 0;
          line-height: 1.5;
        }

        /* Access note */
        .lp-access-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 24px;
          color: #5b21b6;
          font-size: 12.5px;
          line-height: 1.55;
        }

        .lp-access-note-icon {
          font-size: 15px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .lp-field {
          position: relative;
          margin-bottom: 14px;
        }

        .lp-input {
          width: 100%;
          background: #f8f7ff;
          border: 1.5px solid #e5e1f8;
          border-radius: 12px;
          padding: 14px 16px;
          color: #1a1033;
          font-size: 14.5px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .lp-input::placeholder { color: #b0a8cc; }

        .lp-input:focus {
          border-color: #7c3aed;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        .lp-input:hover:not(:focus) {
          border-color: #c4b5fd;
          background: #fff;
        }

        .with-eye { padding-right: 48px; }

        .lp-eye {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
          border-radius: 6px;
        }

        .lp-eye:hover { color: #7c3aed; }

        .lp-row-meta {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
          margin-bottom: 20px;
        }

        .lp-forgot {
          font-size: 12.5px;
          color: #7c3aed;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.15s;
        }

        .lp-forgot:hover { opacity: 0.75; text-decoration: underline; }

        .lp-btn-primary {
          position: relative;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 18px rgba(124, 58, 237, 0.38), 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .lp-btn-primary::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          animation: lp-shimmer 3s ease-in-out infinite;
        }

        @keyframes lp-shimmer {
          0%   { left: -100%; }
          60%  { left: 160%; }
          100% { left: 160%; }
        }

        .lp-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(124, 58, 237, 0.48), 0 1px 3px rgba(0,0,0,0.1);
        }

        .lp-btn-primary:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.3);
        }

        .lp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .lp-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        }

        .lp-divider-text {
          font-size: 12.5px;
          color: #9ca3af;
          white-space: nowrap;
          font-weight: 500;
        }

        .lp-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 13px 20px;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          color: #374151;
          font-size: 14.5px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .lp-btn-google:hover:not(:disabled) {
          background: #fafafa;
          border-color: #d1d5db;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .lp-btn-google:active:not(:disabled) { transform: translateY(0); }
        .lp-btn-google:disabled { opacity: 0.6; cursor: not-allowed; }
        .lp-btn-google svg { width: 19px; height: 19px; flex-shrink: 0; }

        .lp-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 11px 14px;
          margin-bottom: 14px;
          color: #dc2626;
          font-size: 13px;
          line-height: 1.5;
          animation: lp-fade-in 0.22s ease;
        }

        @keyframes lp-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-spinner {
          animation: lp-spin 0.75s linear infinite;
          display: inline-flex;
        }

        @keyframes lp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .lp-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .lp-google-denied {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 12px;
          color: #9a3412;
          font-size: 12px;
          line-height: 1.55;
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />

        <div className={`lp-card${mounted ? " visible" : ""}`}>
          {/* ── Left image panel ── */}
          <div className="lp-img-panel">
            <div
              className="lp-img-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={i} className={`lp-img-slide${activeSlide === i ? " active" : ""}`}>
                  <img src={slide.src} alt={`Slide ${i + 1}`} loading="eager" />
                  <div className="lp-img-overlay" />
                </div>
              ))}
            </div>

            <div className="lp-img-logo">
              <span className="lp-img-logo-dot" />
              Vistara Connect
            </div>

            <Link href="/" className="lp-back-btn">
              <ArrowLeft size={13} />
              Back
            </Link>

            {slides.map((slide, i) => (
              <div
                key={i}
                className={`lp-img-caption${activeSlide === i ? " visible" : ""}`}
                style={{ display: activeSlide === i ? undefined : "none" }}
              >
                {slide.caption.split("\n").map((line, j) => (
                  <span key={j}>{line}{j === 0 && <br />}</span>
                ))}
              </div>
            ))}

            <div className="lp-slide-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`lp-dot${activeSlide === i ? " active" : ""}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="lp-form-panel">
            <div className="lp-badge">
              <Sparkles size={12} />
              Member Portal
            </div>

            <h1 className="lp-heading">Welcome back 👋</h1>

            <p className="lp-subtext">
              Access is restricted to authorised club members only.
            </p>

            {/* Access info note */}
            <div className="lp-access-note">
              <span className="lp-access-note-icon">🔒</span>
              <span>
                This portal is for <strong>Super Administrator, President, Vice President</strong>, and{" "}
                <strong>Sub-Club Secretaries</strong> only. Sign in with your assigned credentials or your
                registered Google account.
              </span>
            </div>

            <form onSubmit={handleCredentialSignIn}>
              {error && (
                <div className="lp-error" role="alert">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div className="lp-field">
                <input
                  className="lp-input"
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(null); }}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="lp-field">
                <input
                  className={cn("lp-input", "with-eye")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <div className="lp-row-meta">
                <Link href="/forgot-password" className="lp-forgot">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="lp-btn-primary" disabled={isLoading}>
                <span className="lp-btn-inner">
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="lp-spinner" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in to dashboard"
                  )}
                </span>
              </button>
            </form>

            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or sign in with Google</span>
              <div className="lp-divider-line" />
            </div>

            <button
              type="button"
              className="lp-btn-google"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 size={17} className="lp-spinner" />
              ) : (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>

            {/* Subtle note for Google denied case */}
            {/* <div className="lp-google-denied">
              <span>ℹ️</span>
              <span>
                Google sign-in only works if your Google account has been pre-approved.
                Unregistered accounts will be rejected.
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
