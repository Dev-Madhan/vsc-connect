"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

// Human-readable messages for server-side error codes passed via ?error= query param
const SERVER_ERROR_MESSAGES: Record<string, string> = {
  unauthorized:
    "Your account does not have dashboard access. Only authorised club members may sign in.",
};

interface LoginFormProps extends React.ComponentProps<"div"> {
  /** Error code from the server (e.g. "unauthorized") */
  error?: string;
}

export function LoginForm({
  className,
  error: serverError,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    serverError ? (SERVER_ERROR_MESSAGES[serverError] ?? "An error occurred. Please try again.") : null
  );
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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
  }, [slides.length]);

  const handleCredentialSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.signIn.username({ username, password });
      if (result.error) {
        const msg = result.error.message ?? "";
        if (
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("credentials") ||
          msg.toLowerCase().includes("password")
        ) {
          setError("Invalid username or password. Please try again.");
        } else if (
          msg.toLowerCase().includes("not found") ||
          msg.toLowerCase().includes("user")
        ) {
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
    <div className={cn("w-full h-full", className)}>
      {/* ── Page wrapper ── */}
      <div className="font-dm-sans relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f4ff] via-[#faf5ff] to-[#f0fdf4] p-6">

        {/* Card */}
        <div
          className={cn(
            "relative z-10 flex h-[90vh] min-h-[580px] max-h-[700px] w-full max-w-[980px] overflow-hidden rounded-[28px] border border-white/95 bg-white/88 backdrop-blur-xl",
            "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.98] opacity-0"
          )}
        >
          {/* ── Left image panel ── */}
          <div className="relative hidden flex-[0_0_44%] overflow-hidden rounded-l-[22px] md:block">
            {/* Slider track */}
            <div
              className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={i} className="relative h-full w-full flex-[0_0_100%]">
                  <img
                    src={slide.src}
                    alt={`Slide ${i + 1}`}
                    loading="eager"
                    className={cn(
                      "block h-full w-full object-cover transition-transform duration-[8000ms] ease-in-out",
                      activeSlide === i ? "scale-105" : "scale-100"
                    )}
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(15,10,40,0.25) 0%, rgba(15,10,40,0.08) 35%, rgba(10,5,30,0.65) 100%)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Logo */}
            <div className="font-space-grotesk absolute left-[26px] top-[26px] flex items-center gap-2 text-[17px] font-bold tracking-wide text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
              <span className="animate-lp-pulse-dot h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
              Vistara Connect
            </div>

            {/* Captions */}
            {slides.map((slide, i) => (
              <div
                key={i}
                className={cn(
                  "font-space-grotesk absolute bottom-16 left-7 right-7 text-2xl font-bold leading-[1.35] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-500 ease-in-out",
                  activeSlide === i
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2.5 opacity-0"
                )}
              >
                {slide.caption.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && <br />}
                  </span>
                ))}
              </div>
            ))}

            {/* Slide dots */}
            <div className="absolute bottom-[26px] left-7 flex gap-[7px]">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-1 rounded-sm border-none p-0 transition-[background,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    activeSlide === i
                      ? "w-10 bg-white"
                      : "w-6 bg-white/35"
                  )}
                />
              ))}
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="flex flex-1 flex-col justify-center overflow-y-auto px-8 py-11 md:px-12 md:py-[44px]">

            {/* Staggered children */}
            <h1 className="font-space-grotesk animate-lp-slide-up mb-1.5 text-center text-[30px] font-extrabold leading-[1.2] tracking-[-0.6px] text-[#0f0a1e] opacity-0 [animation-delay:0.15s]">
              Welcome back
            </h1>

            <p className="animate-lp-slide-up mb-6 text-center text-[13px] leading-relaxed text-gray-500 opacity-0 [animation-delay:0.22s]">
              Access is restricted to authorised club members only.
            </p>

            <form onSubmit={handleCredentialSignIn} className="animate-lp-slide-up opacity-0 [animation-delay:0.29s]">
              {error && (
                <div
                  role="alert"
                  className="animate-lp-fade-in mb-3.5 flex items-start gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] leading-relaxed text-red-600"
                >
                  <AlertCircle size={15} className="mt-px shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div className="relative mb-3.5">
                <input
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
                  className="font-dm-sans w-full rounded-xl border-[1.5px] border-[#e5e1f8] bg-[#f8f7ff] px-4 py-3.5 text-[14.5px] text-[#1a1033] outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-[#b0a8cc] hover:border-violet-300 hover:bg-white focus:border-violet-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)] disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div className="relative mb-3.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="font-dm-sans w-full rounded-xl border-[1.5px] border-[#e5e1f8] bg-[#f8f7ff] py-3.5 pl-4 pr-12 text-[14.5px] text-[#1a1033] outline-none transition-[border-color,background,box-shadow] duration-200 placeholder:text-[#b0a8cc] hover:border-violet-300 hover:bg-white focus:border-violet-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)] disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                  className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center rounded-md p-1 text-gray-400 transition-colors duration-150 hover:text-violet-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="mb-5 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[12.5px] font-medium text-violet-600 transition-opacity duration-150 hover:underline hover:opacity-75"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="font-dm-sans relative mb-5 w-full overflow-hidden rounded-xl border-none px-4 py-3.5 text-[15px] font-semibold text-white transition-[transform,box-shadow,opacity] duration-200 before:absolute before:inset-y-0 before:-left-full before:w-[60%] before:-skew-x-[20deg] before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:animate-lp-shimmer hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,58,237,0.48)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                  boxShadow: "0 4px 18px rgba(124,58,237,0.38), 0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in to dashboard"
                  )}
                </span>
              </button>
            </form>

            {/* Divider + Google button — temporarily disabled */}
            {/* 
            <div className="animate-lp-slide-up mb-4 flex items-center gap-3.5 opacity-0 [animation-delay:0.36s]">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="text-[12.5px] font-medium whitespace-nowrap text-gray-400">
                or sign in with Google
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="font-dm-sans animate-lp-slide-up flex w-full items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-gray-200 bg-white px-5 py-3 text-[14.5px] font-semibold text-gray-700 opacity-0 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-[background,border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-gray-300 hover:bg-gray-50 hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 [animation-delay:0.43s]"
            >
              {isGoogleLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[19px] w-[19px] shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
