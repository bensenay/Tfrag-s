"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export function Entrance() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (window.sessionStorage.getItem("polaris-intro-seen") !== "true") {
        setVisible(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const dismiss = useCallback(() => {
    window.sessionStorage.setItem("polaris-intro-seen", "true");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;

    const timer = window.setTimeout(dismiss, 4300);
    return () => window.clearTimeout(timer);
  }, [dismiss, reducedMotion, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Skip introduction"
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-background"
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          initial={{ opacity: 1 }}
          onClick={dismiss}
        >
          <div className="starfield absolute inset-0" />
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="intro-moon absolute left-[67%] top-[31%] size-20 rounded-full md:size-28"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.65 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          />
          <motion.svg
            className="absolute left-[32%] top-[35%] h-[28vh] w-[38vw] overflow-visible"
            fill="none"
            viewBox="0 0 500 260"
          >
            <motion.path
              animate={{ opacity: 0.9, pathLength: 1 }}
              className="text-primary"
              d="M18 220 C100 152 139 226 191 166 C235 116 205 47 288 42 C362 37 399 109 475 57"
              initial={reducedMotion ? false : { opacity: 0, pathLength: 0 }}
              stroke="currentColor"
              strokeWidth="2"
              transition={{ delay: 0.65, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.svg>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 top-1/2 w-[min(62vw,320px)] -translate-x-1/2 -translate-y-1/2"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            transition={{ delay: 2.25, duration: 1 }}
          >
            <Image
              priority
              alt="House of Polaris"
              className="logo-invert h-auto w-full"
              height={2232}
              src="/images/house-of-polaris-logo.png"
              width={1700}
            />
          </motion.div>
          <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Enter anywhere
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
