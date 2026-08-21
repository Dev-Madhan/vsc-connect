"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const result = await authClient.signIn.email({ email, password });
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
          setError("No account found with that email.");
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
    <div className={cn("bg-[#FAFAFA] font-inter grid min-h-screen w-full px-4", className)} {...props}>
      <div className="m-auto w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-space-grotesk text-3xl sm:text-4xl font-bold tracking-tight text-[#262626]">Welcome back</h1>
          <p className="mt-2 text-sm font-medium text-[#71717A]">
            Access is restricted to <br className="block sm:hidden" /> authorised club members only.
          </p>
        </div>
        <Card className="mt-6 p-8 bg-white border border-[#E4E4E7] rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleCredentialSignIn} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] leading-relaxed text-red-600"
              >
                <AlertCircle size={15} className="mt-px shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-[#262626]">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
                disabled={isLoading || isGoogleLoading}
                className="bg-[#FAFAFA] border-[#E4E4E7] text-[#262626] placeholder:text-[#A1A1AA] rounded-[10px] focus-visible:border-[#5B50F5] focus-visible:ring-[#C7D2FF]"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-[#262626]">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="bg-[#FAFAFA] border-[#E4E4E7] text-[#262626] placeholder:text-[#A1A1AA] rounded-[10px] focus-visible:border-[#5B50F5] focus-visible:ring-[#C7D2FF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading || isGoogleLoading}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center rounded-md p-1 text-[#A1A1AA] transition-colors hover:text-[#262626]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#5B50F5] text-white rounded-[10px] hover:bg-[#4F45D9] transition-colors shadow-none" disabled={isLoading || isGoogleLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Signing in…
                </>
              ) : (
                "Sign in to dashboard"
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <hr className="flex-1 border-[#E4E4E7]" />
            <span className="text-xs font-medium text-[#71717A]">or continue with</span>
            <hr className="flex-1 border-[#E4E4E7]" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="bg-white border border-[#E4E4E7] text-[#262626] rounded-[10px] hover:bg-[#FAFAFA] shadow-none"
            >
              {isGoogleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 mr-2"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
              )}
              <span>Google</span>
            </Button>
          </div>
        </Card>


      </div>
    </div>
  );
}
