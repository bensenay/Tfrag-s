"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const INTRO_DURATION = 6800;
const INTRO_STORAGE_KEY = "polaris-intro-seen-v7";

export function Entrance() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
      if (
        forceReplay ||
        window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true"
      ) {
        setVisible(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const dismiss = useCallback(() => {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(
      dismiss,
      reducedMotion ? 2200 : INTRO_DURATION,
    );
    return () => window.clearTimeout(timer);
  }, [dismiss, reducedMotion, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Skip introduction"
          className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-background"
          exit={{ opacity: 0, transition: { duration: 0.75 } }}
          initial={{ opacity: 1 }}
          onClick={dismiss}
        >
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : { scale: [1, 1.28], y: ["0vh", "-78vh"] }
            }
            className="absolute inset-x-0 top-0 h-[180vh]"
            transition={{
              delay: 1.45,
              duration: 2.55,
              ease: [0.65, 0, 0.35, 1],
            }}
          >
            <div className="starfield absolute inset-0" />
            <div className="intro-horizon absolute inset-x-0 top-[72vh] h-[76vh]" />
          </motion.div>

          <motion.div
            animate={
              reducedMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : {
                    opacity: [0, 0, 1, 1],
                    scale: [0.92, 0.92, 1.025, 1],
                    y: [22, 22, -3, 0],
                  }
            }
            className="absolute left-1/2 top-[58%] w-[min(76vw,430px)] -translate-x-1/2 -translate-y-1/2"
            initial={false}
            transition={{
              duration: reducedMotion ? 0 : 5.9,
              ease: [0.22, 1, 0.36, 1],
              times: reducedMotion ? undefined : [0, 0.68, 0.88, 1],
            }}
          >
            <Image
              priority
              unoptimized
              alt="House of Polaris"
              className="logo-invert h-auto w-full"
              height={2232}
              src="/images/house-of-polaris-logo.png"
              width={1700}
            />
          </motion.div>

          <motion.span
            animate={{ opacity: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.3em] text-muted-foreground"
            initial={{ opacity: 0 }}
            transition={{ delay: reducedMotion ? 0.4 : 5.45, duration: 0.65 }}
          >
            Enter anywhere
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
