"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-muted/10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-5 h-full items-stretch">
          {/* ================= LEFT BRAND CARD (SolaceUI Signature Cobalt Card) ================= */}
          <div className="relative w-full lg:w-1/3 min-h-[340px] lg:min-h-[580px] overflow-hidden rounded-3xl bg-[#003AF9] flex flex-col justify-between p-8 sm:p-10 text-white shadow-xl">
            {/* SVG Fractal Noise Filter Background */}
            <svg
              className="absolute inset-0 w-full h-full opacity-90 pointer-events-none mix-blend-multiply z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <filter id="noiseFilterFooter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="4"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilterFooter)" />
            </svg>

            {/* Top Brand Logo */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2.5 text-white group">
                <div className="w-8 h-8 rounded-xl bg-white text-[#003AF9] flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
                  V
                </div>
                <span className="text-xl font-bold tracking-tight font-space-grotesk">
                  VSC Connect
                </span>
              </Link>
            </div>

            {/* Bottom Tagline & Social Icons */}
            <div className="relative z-10 space-y-6 mt-12 lg:mt-0">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Empowering Next-Gen Student Innovators
              </h3>

              {/* Social Icons Row */}
              <div className="flex flex-wrap items-center text-white/80 gap-4">
                {/* X / Twitter */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.46617 12.6219L14.625 19.5H22.2083L13.6955 8.14883L20.7783 0H17.9075L12.3641 6.3765L7.58333 0H0L8.13583 10.8496L0.6175 19.5H3.48833L9.46617 12.6219ZM15.7083 17.3333L4.33333 2.16667H6.5L17.875 17.3333H15.7083Z" fill="currentColor" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C20.663 0 21.2989 0.263392 21.7678 0.732233C22.2366 1.20107 22.5 1.83696 22.5 2.5V20C22.5 20.663 22.2366 21.2989 21.7678 21.7678C21.2989 22.2366 20.663 22.5 20 22.5H2.5C1.83696 22.5 1.20107 22.2366 0.732233 21.7678C0.263392 21.2989 0 20.663 0 20V2.5C0 1.83696 0.263392 1.20107 0.732233 0.732233C1.20107 0.263392 1.83696 0 2.5 0H20ZM19.375 19.375V12.75C19.375 11.6692 18.9457 10.6328 18.1815 9.86854C17.4172 9.10433 16.3808 8.675 15.3 8.675C14.2375 8.675 13 9.325 12.4 10.3V8.9125H8.9125V19.375H12.4V13.2125C12.4 12.25 13.175 11.4625 14.1375 11.4625C14.6016 11.4625 15.0467 11.6469 15.3749 11.9751C15.7031 12.3033 15.8875 12.7484 15.8875 13.2125V19.375H19.375ZM4.85 6.95C5.40695 6.95 5.9411 6.72875 6.33492 6.33492C6.72875 5.9411 6.95 5.40695 6.95 4.85C6.95 3.6875 6.0125 2.7375 4.85 2.7375C4.28973 2.7375 3.75241 2.96007 3.35624 3.35624C2.96007 3.75241 2.7375 4.28973 2.7375 4.85C2.7375 6.0125 3.6875 6.95 4.85 6.95ZM6.5875 19.375V8.9125H3.125V19.375H6.5875Z" fill="currentColor" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28.3333 14.1667C28.3333 6.34667 21.9867 0 14.1667 0C6.34667 0 0 6.34667 0 14.1667C0 21.0233 4.87333 26.7325 11.3333 28.05V18.4167H8.5V14.1667H11.3333V10.625C11.3333 7.89083 13.5575 5.66667 16.2917 5.66667H19.8333V9.91667H17C16.2208 9.91667 15.5833 10.5542 15.5833 11.3333V14.1667H19.8333V18.4167H15.5833V28.2625C22.7375 27.5542 28.3333 21.5192 28.3333 14.1667Z" fill="currentColor" />
                  </svg>
                </a>

                {/* Threads */}
                <a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.4167 6.92196C15.5768 0.0771293 9.25 0.505296 9.25 0.505296C9.25 0.505296 0.5 -0.0780373 0.5 10.9995C0.5 22.077 9.25 21.4948 9.25 21.4948C9.25 21.4948 14.451 21.8401 16.8333 16.9238C17.6115 14.7561 17.4167 10.422 9.83333 10.422C9.83333 10.422 6.33333 10.422 6.33333 13.3386C6.33333 14.4773 7.5 15.672 9.25 15.672C11 15.672 12.9495 14.4738 13.3333 12.172C14.5 5.17196 8.08333 4.58863 6.33333 7.5053" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.76667 0H16.5667C20.3 0 23.3333 3.03333 23.3333 6.76667V16.5667C23.3333 18.3613 22.6204 20.0824 21.3514 21.3514C20.0824 22.6204 18.3613 23.3333 16.5667 23.3333H6.76667C3.03333 23.3333 0 20.3 0 16.5667V6.76667C0 4.97204 0.712915 3.25091 1.98191 1.98191C3.25091 0.712915 4.97204 0 6.76667 0ZM6.53333 2.33333C5.41942 2.33333 4.35114 2.77583 3.56349 3.56349C2.77583 4.35114 2.33333 5.41942 2.33333 6.53333V16.8C2.33333 19.1217 4.21167 21 6.53333 21H16.8C17.9139 21 18.9822 20.5575 19.7699 19.7699C20.5575 18.9822 21 17.9139 21 16.8V6.53333C21 4.21167 19.1217 2.33333 16.8 2.33333H6.53333ZM17.7917 4.08333C18.1784 4.08333 18.5494 4.23698 18.8229 4.51047C19.0964 4.78396 19.25 5.15489 19.25 5.54167C19.25 5.92844 19.0964 6.29937 18.8229 6.57286C18.5494 6.84635 18.1784 7 17.7917 7C17.4049 7 17.034 6.84635 16.7605 6.57286C16.487 6.29937 16.3333 5.92844 16.3333 5.54167C16.3333 5.15489 16.487 4.78396 16.7605 4.51047C17.034 4.23698 17.4049 4.08333 17.7917 4.08333ZM11.6667 5.83333C13.2138 5.83333 14.6975 6.44792 15.7915 7.54188C16.8854 8.63584 17.5 10.1196 17.5 11.6667C17.5 13.2138 16.8854 14.6975 15.7915 15.7915C14.6975 16.8854 13.2138 17.5 11.6667 17.5C10.1196 17.5 8.63584 16.8854 7.54188 15.7915C6.44792 14.6975 5.83333 13.2138 5.83333 11.6667C5.83333 10.1196 6.44792 8.63584 7.54188 7.54188C8.63584 6.44792 10.1196 5.83333 11.6667 5.83333ZM11.6667 8.16667C10.7384 8.16667 9.84817 8.53542 9.19179 9.19179C8.53542 9.84817 8.16667 10.7384 8.16667 11.6667C8.16667 12.5949 8.53542 13.4852 9.19179 14.1415C9.84817 14.7979 10.7384 15.1667 11.6667 15.1667C12.5949 15.1667 13.4852 14.7979 14.1415 14.1415C14.7979 13.4852 15.1667 12.5949 15.1667 11.6667C15.1667 10.7384 14.7979 9.84817 14.1415 9.19179Z" fill="currentColor" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5133 3.29C13.716 2.37945 13.2765 1.2103 13.2767 0H9.67167V14.4667C9.64444 15.2497 9.31411 15.9916 8.75036 16.5357C8.18661 17.0799 7.43353 17.3838 6.65 17.3833C4.99333 17.3833 3.61667 16.03 3.61667 14.35C3.61667 12.3433 5.55333 10.8383 7.54833 11.4567V7.77C3.52333 7.23333 0 10.36 0 14.35C0 18.235 3.22 21 6.63833 21C10.3017 21 13.2767 18.025 13.2767 14.35V7.01167C14.7385 8.06149 16.4936 8.62475 18.2933 8.62167V5.01667C18.2933 5.01667 16.1 5.12167 14.5133 3.29Z" fill="currentColor" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-white transition-colors hover:scale-110 transform duration-150"
                >
                  <svg className="h-5 w-5" viewBox="0 0 29 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28.0501 3.13163C27.7206 1.8991 26.7497 0.928222 25.5172 0.59876C23.2832 -1.51787e-07 14.3244 0 14.3244 0C14.3244 0 5.36561 -1.51787e-07 3.13164 0.59876C1.8991 0.928222 0.928222 1.8991 0.59876 3.13163C0 5.36561 0 10.0271 0 10.0271C0 10.0271 0 14.6886 0.59876 16.9225C0.928222 18.1551 1.8991 19.126 3.13164 19.4554C5.36561 20.0542 14.3244 20.0542 14.3244 20.0542C14.3244 20.0542 23.2832 20.0542 25.5172 19.4554C26.7497 19.126 27.7206 18.1551 28.0501 16.9225C28.6488 14.6886 28.6488 10.0271 28.6488 10.0271C28.6488 10.0271 28.6488 5.36561 28.0501 3.13163ZM11.4595 14.3244V5.72977L18.9025 10.0271L11.4595 14.3244Z" fill="currentColor" />
                  </svg>
                </a>
              </div>

              <p className="text-xs text-white/70">
                &copy; {new Date().getFullYear()} VSC Connect. All rights reserved.
              </p>
            </div>
          </div>

          {/* ================= RIGHT CARD (4-Column Links + Newsletter) ================= */}
          <div className="w-full lg:w-2/3 rounded-3xl bg-card border border-border/80 p-8 sm:p-12 flex flex-col justify-between min-h-[500px] lg:min-h-[580px] shadow-sm">
            {/* 4-Column Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {/* Product */}
              <div className="flex flex-col space-y-5">
                <h4 className="text-[15px] font-bold text-foreground">Product</h4>
                <ul className="flex flex-col space-y-3 text-[13.5px] text-muted-foreground font-medium">
                  <li><Link className="hover:text-foreground transition-colors" href="/#features">Features</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/sub-clubs">Sub-Clubs</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/events">Events & Fests</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/projects">Projects Hub</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/gallery">Media Vault</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/calendar">Calendar</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div className="flex flex-col space-y-5">
                <h4 className="text-[15px] font-bold text-foreground">Resources</h4>
                <ul className="flex flex-col space-y-3 text-[13.5px] text-muted-foreground font-medium">
                  <li><Link className="hover:text-foreground transition-colors" href="/dashboard/od-documents">OD Generator</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/about">Club Handbook</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/recruitment">Auditions FAQ</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/about">Constitution</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/about">Brand Kit</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/contact">Help Desk</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-5">
                <h4 className="text-[15px] font-bold text-foreground">Company</h4>
                <ul className="flex flex-col space-y-3 text-[13.5px] text-muted-foreground font-medium">
                  <li><Link className="hover:text-foreground transition-colors" href="/about">About VSC</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/team">Leadership Council</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/recruitment">Core Recruitment</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/news">Press & Media</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/contact">Faculty Advisory</Link></li>
                  <li><Link className="hover:text-foreground transition-colors" href="/login">Portal Login</Link></li>
                </ul>
              </div>

              {/* Socials */}
              <div className="flex flex-col space-y-5">
                <h4 className="text-[15px] font-bold text-foreground">Socials</h4>
                <ul className="flex flex-col space-y-3 text-[13.5px] text-muted-foreground font-medium">
                  <li><a className="hover:text-foreground transition-colors" href="https://x.com" target="_blank" rel="noreferrer">X (Twitter)</a></li>
                  <li><a className="hover:text-foreground transition-colors" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                  <li><a className="hover:text-foreground transition-colors" href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
                  <li><a className="hover:text-foreground transition-colors" href="https://threads.net" target="_blank" rel="noreferrer">Threads</a></li>
                  <li><a className="hover:text-foreground transition-colors" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                  <li><a className="hover:text-foreground transition-colors" href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-3 mt-12 lg:mt-0 pt-8 border-t border-border/50">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-foreground">Newsletter</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get notified on campus auditions, hackathon registrations, and star night passes.
                </p>
              </div>

              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are subscribed to VSC campus alerts!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="flex-1 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#003AF9]/40 bg-muted/40 text-foreground border border-border/80 placeholder:text-muted-foreground transition-all"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
