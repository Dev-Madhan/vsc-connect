"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const SERVER_ERROR_MESSAGES: Record<string, string> = {
  unauthorized:
    "Your account does not have dashboard access. Only authorised club members may sign in.",
};

interface LoginFormProps {
  error?: string;
}

export function LoginForm({ error: serverError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    serverError
      ? SERVER_ERROR_MESSAGES[serverError] ?? "An error occurred. Please try again."
      : null
  );
  const router = useRouter();

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
          setError("Invalid email or password. Please try again.");
        } else if (
          msg.toLowerCase().includes("not found") ||
          msg.toLowerCase().includes("user")
        ) {
          setError("No account found with that email/username.");
        } else {
          setError(msg || "Something went wrong. Please try again.");
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Unable to connect. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* ================= LEFT COLUMN: AUTH CARD (SolaceUI Auth Section One) ================= */}
        <div className="flex min-h-[760px] items-start rounded-md border border-black/20 bg-white px-6 py-12 sm:px-10 dark:border-white/10 dark:bg-[#0a0a0a] lg:min-h-0 lg:px-14 lg:py-20 xl:px-20">
          <div className="mx-auto w-full max-w-[590px]">
            {/* Header / Brand */}
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to VSC Connect</span>
              </Link>
              <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-[42px] lg:leading-[1.05] xl:text-[50px]">
                Sign in to account
              </h1>
              <p className="mt-3 text-lg leading-snug text-black/60 dark:text-white/55 sm:text-xl lg:text-2xl">
                Access your executive council dashboard
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2.5 rounded-[10px] border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-4 py-3 text-sm leading-relaxed text-red-600 dark:text-red-400"
              >
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* OAuth Sign-In Buttons */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="flex h-11 items-center justify-center gap-2.5 rounded-[10px] border border-black/25 bg-white px-3 text-sm leading-none text-black transition-colors hover:bg-black/[0.03] dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                {isGoogleLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
                      fill="#EB4335"
                    />
                  </svg>
                )}
                <span className="whitespace-nowrap font-medium">Sign in with Google</span>
              </button>

              {/* Apple / University SSO Button */}
              <button
                type="button"
                onClick={() => {
                  setError("University SSO is currently active for campus intranet.");
                }}
                disabled={isLoading || isGoogleLoading}
                className="flex h-11 items-center justify-center gap-2.5 rounded-[10px] border border-black/25 bg-white px-3 text-sm leading-none text-black transition-colors hover:bg-black/[0.03] dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                  <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
                </svg>
                <span className="whitespace-nowrap font-medium">Sign in with Apple</span>
              </button>
            </div>

            {/* SolaceUI Divider */}
            <div className="my-8 text-center text-lg font-medium text-black/60 dark:text-white/50">or</div>

            {/* Credential Form with SolaceUI Distinct Split/Floating Input Labels */}
            <form onSubmit={handleCredentialSignIn} className="space-y-4">
              {/* Username Input */}
              <label className="flex h-14 items-center justify-between gap-4 rounded-[10px] border border-black/25 bg-white px-5 text-base leading-none dark:border-white/15 dark:bg-white/5 focus-within:border-black dark:focus-within:border-white transition-colors">
                <input
                  type="text"
                  id="username"
                  required
                  placeholder="admin@vsc"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading || isGoogleLoading}
                  className="min-w-0 flex-1 truncate bg-transparent text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/35 font-medium"
                />
                <span className="shrink-0 text-black/70 dark:text-white/70 font-semibold text-sm">
                  Username
                </span>
              </label>

              {/* Password Input */}
              <label className="flex h-14 items-center justify-between gap-4 rounded-[10px] border border-black/25 bg-white px-5 text-base leading-none dark:border-white/15 dark:bg-white/5 focus-within:border-black dark:focus-within:border-white transition-colors relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={isLoading || isGoogleLoading}
                  className="min-w-0 flex-1 truncate bg-transparent text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/35 font-medium"
                />
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <span className="text-black/70 dark:text-white/70 font-semibold text-sm">
                    Password
                  </span>
                </div>
              </label>

              {/* Checkboxes & Policies */}
              <div className="space-y-3 pt-2 text-sm leading-5 text-black/60 dark:text-white/60">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-black/25 dark:border-white/30 text-black focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this device for 30 days</span>
                </label>

                <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                  By signing in, you agree to our{" "}
                  <Link href="/about" className="font-medium text-black/75 dark:text-white/75 underline underline-offset-2 hover:opacity-80">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/about" className="font-medium text-black/75 dark:text-white/75 underline underline-offset-2 hover:opacity-80">
                    Privacy Policy
                  </Link>.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="mt-6 flex h-13 w-full items-center justify-center rounded-[10px] border border-black/40 bg-black text-lg font-semibold text-white transition-all hover:bg-black/85 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85 active:scale-[0.99] disabled:opacity-60 shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Authenticating…
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: HERO BRAND BANNER (SolaceUI Black Hero) ================= */}
        <div className="relative flex min-h-[500px] lg:min-h-[720px] overflow-hidden rounded-md bg-black p-8 text-white sm:p-12 lg:min-h-0 border border-neutral-800">
          {/* Subtle background ambient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-[#050508]" />
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#5B50E5]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#003AF9]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            {/* Massive Heading from SolaceUI */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
                <span>VSC Central Operating System</span>
              </div>
              <h2 className="max-w-[620px] pt-0 text-4xl sm:text-6xl lg:pt-14 lg:text-[62px] lg:leading-[1] xl:text-[68px] font-medium tracking-[-0.05em] text-white">
                Think fast,<br />Build faster
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/60 max-w-md font-light leading-relaxed">
                Streamlining member directories, automated On-Duty approvals, and university event operations across all 7 wings.
              </p>
            </div>

            {/* Bottom Floating Pill CTA */}
            <div className="pt-10">
              <Link
                href="/"
                className="inline-flex h-12 max-w-full items-center gap-3 rounded-[10px] border border-white/25 px-5 text-sm sm:text-base font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white/50 hover:text-white hover:bg-white/5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <span className="truncate whitespace-nowrap">Explore Public Club Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
