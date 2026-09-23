"use client";

import React, { useState, useEffect } from "react";

interface SvgMaskLoaderProps {
  /** Optional callback fired when animation finishes */
  onComplete?: () => void;
  /** Optional delay before zoom begins (in ms, default: 450) */
  startDelay?: number;
}

export function SvgMaskLoader({
  onComplete,
  startDelay = 450,
}: SvgMaskLoaderProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Lock scroll during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Trigger zoom expansion after brief initial presentation
    const timerStart = setTimeout(() => {
      setIsAnimating(true);
    }, startDelay);

    // Complete and unmount after full animation sequence (450ms delay + 1600ms expansion + buffer)
    const timerFinish = setTimeout(() => {
      setIsFinished(true);
      document.body.style.overflow = originalOverflow;
      onComplete?.();
    }, startDelay + 1750);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timerFinish);
      document.body.style.overflow = originalOverflow;
    };
  }, [startDelay, onComplete]);

  if (isFinished) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .vsc-mask-intro-curtain {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          background: radial-gradient(
            ellipse 120% 100% at 50% 50%,
            #181920 0%,
            #0f1015 35%,
            #070709 70%,
            #020203 100%
          );
          z-index: 99999;
          pointer-events: auto;
          will-change: mask-size, -webkit-mask-size, opacity;
          transform: translateZ(0);

          -webkit-mask-image: linear-gradient(#000 0 0), url("/vsc-monogram.svg");
          mask-image: linear-gradient(#000 0 0), url("/vsc-monogram.svg");
          -webkit-mask-position: center, 50% 50%;
          mask-position: center, 50% 50%;
          -webkit-mask-repeat: no-repeat, no-repeat;
          mask-repeat: no-repeat, no-repeat;
          -webkit-mask-composite: xor;
          mask-composite: exclude;

          -webkit-mask-size: 100% 100%, clamp(200px, 25vw, 360px) auto;
          mask-size: 100% 100%, clamp(200px, 25vw, 360px) auto;

          opacity: 1;
        }

        .vsc-mask-intro-curtain.animating {
          -webkit-mask-size: 100% 100%, 1600vw auto;
          mask-size: 100% 100%, 1600vw auto;
          opacity: 0;
          pointer-events: none;
          transition: 
            mask-size 1.55s cubic-bezier(0.76, 0, 0.24, 1) 0.1s,
            -webkit-mask-size 1.55s cubic-bezier(0.76, 0, 0.24, 1) 0.1s,
            opacity 0.55s cubic-bezier(0.76, 0, 0.24, 1) 1.25s;
        }
      `,
        }}
      />

      <div
        aria-hidden="true"
        className={`vsc-mask-intro-curtain ${isAnimating ? "animating" : ""}`}
      />
    </>
  );
}
