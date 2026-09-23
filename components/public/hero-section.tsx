"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function HeroSection() {
  // Toggle between exact SkiperUI demo text and VSC Connect branding
  const [useVscBranding, setUseVscBranding] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Outer border container matching the exact framing of the screenshot */}
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 h-[100dvh] min-h-[540px] max-h-[960px] flex flex-col">
        <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl border border-neutral-300/80 dark:border-neutral-800 shadow-2xl bg-black">

          {/* 1. TOP VIEWPORT: HERO IMAGE */}
          <div className="relative w-full flex-1 min-h-0 bg-black overflow-hidden">
            <img src="/hero.png" alt="Hero" className="h-full w-full object-cover object-center select-none" />
          </div>

          {/* 2. BOTTOM VIEWPORT: EDITORIAL WARM IVORY CARD */}
          <div className="w-full shrink-0 bg-[#F5F5F0] text-[#121212] px-4 sm:px-8 md:px-12 pt-3 sm:pt-4 pb-3 sm:pb-4 select-none flex flex-col justify-between border-t border-neutral-900">

            {/* MASSIVE EDGE-TO-EDGE TYPOGRAPHY */}
            <div className="w-full overflow-hidden py-0.5 sm:py-1">
              <motion.h1
                onClick={() => setUseVscBranding(!useVscBranding)}
                title="Click to toggle text between skiperui.com and vsc-connect.com"
                whileHover={{ scale: 1.006 }}
                transition={{ duration: 0.2 }}
                className="w-full text-center font-bold tracking-tighter leading-[0.85] text-[#121212] cursor-pointer text-[5.8vw] sm:text-[5.5vw] md:text-[5.2vw]"
              >
                {useVscBranding ? "VISTARA STUDENT COUNCIL" : "VISTARA STUDENT COUNCIL"}
              </motion.h1>
            </div>

            {/* EDITORIAL 4-COLUMN MONOSPACE FOOTER METADATA */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-6 pt-2.5 sm:pt-3.5 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#121212] leading-tight">

              {/* Left Group */}
              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-8 sm:gap-14 md:gap-20">
                <div>
                  <p className="font-semibold">
                    {useVscBranding ? "COIMBATORE, INDIA" : "PUNJAB, INDIA"}
                  </p>
                  <p className="text-neutral-600">AND ONLINE</p>
                </div>
                <div>
                  <p className="font-semibold">
                    {useVscBranding ? "ACADEMIC YEAR 2025" : "SEP 1, 2025"}
                  </p>
                  <p className="text-neutral-600">
                    {useVscBranding ? "KUMARAGURU TECH" : "THE MOOSA PIND"}
                  </p>
                </div>
              </div>

              {/* Right Group */}
              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-8 sm:gap-14 md:gap-20 text-left sm:text-right">
                <div>
                  <p className="font-semibold">
                    {useVscBranding ? "7 SUB-CLUBS" : "ONILNE"}
                  </p>
                  <p className="text-neutral-600">
                    {useVscBranding ? "OPEN ACCESS" : "FREE"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">
                    {useVscBranding ? "STUDENT PASSES" : "IN PERSON TICKETS"}
                  </p>
                  <p className="text-neutral-600">
                    {useVscBranding ? "VERIFIED OD" : "$600"}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
