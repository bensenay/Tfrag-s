"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const INTRO_DURATION = 7000;
const INTRO_STORAGE_KEY = "polaris-intro-seen-v4";

export function Entrance() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true") {
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
                : { scale: [1, 1, 1.35], y: ["0vh", "0vh", "-72vh"] }
            }
            className="absolute inset-x-0 top-0 h-[180vh]"
            transition={{
              delay: 0.1,
              duration: 3.7,
              ease: [0.65, 0, 0.35, 1],
              times: [0, 0.48, 1],
            }}
          >
            <div className="starfield absolute inset-0" />
            <div className="intro-horizon absolute inset-x-0 top-[72vh] h-[76vh]" />

            <motion.div
              animate={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: [0, 1, 1, 0], scale: [0.82, 1, 1, 1.16] }
              }
              className="absolute left-1/2 top-[18vh] h-[clamp(190px,32vw,310px)] w-[clamp(270px,48vw,470px)] -translate-x-1/2"
              initial={false}
              transition={{
                duration: 3.45,
                ease: "easeInOut",
                times: [0, 0.16, 0.67, 1],
              }}
            >
              <div className="intro-moon absolute left-1/2 top-1/2 size-[clamp(78px,10vw,122px)] -translate-x-1/2 -translate-y-1/2 rounded-full" />

              <motion.svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible text-primary"
                fill="none"
                viewBox="0 0 470 300"
              >
                <motion.path
                  animate={reducedMotion ? undefined : { pathLength: 1, opacity: 1 }}
                  d="M8 205 C70 188 93 173 111 144 C75 101 90 48 137 26 C188 2 256 20 282 68 C308 117 278 177 224 191 C172 205 118 177 106 128 C95 83 127 39 178 34 C229 29 269 62 275 105 C282 153 317 177 376 164 C410 156 437 137 462 111"
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0.15 }}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.2"
                  transition={{ delay: 0.35, duration: 1.8, ease: "easeInOut" }}
                />
              </motion.svg>
            </motion.div>
          </motion.div>

          <motion.div
            animate={
              reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: [0, 0, 1, 1, 0],
                    scale: [0.82, 0.82, 1, 1, 0.98],
                    y: [42, 42, 0, 0, -8],
                  }
            }
            className="absolute left-1/2 top-[58%] w-[min(76vw,430px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden [clip-path:inset(18%_8%_31%_8%)]"
            initial={false}
            transition={{
              duration: 4.8,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.55, 0.7, 0.9, 1],
            }}
          >
            <Image
              priority
              alt=""
              aria-hidden="true"
              className="logo-invert h-auto w-full"
              height={2232}
              src="/images/house-of-polaris-logo.png"
              width={1700}
            />
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute left-1/2 top-[58%] w-[min(76vw,430px)] -translate-x-1/2 -translate-y-1/2"
            initial={
              reducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }
            }
            transition={{
              delay: reducedMotion ? 0 : 4.45,
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
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

          <motion.span
            animate={{ opacity: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.3em] text-muted-foreground"
            initial={{ opacity: 0 }}
            transition={{ delay: reducedMotion ? 0.4 : 5.15, duration: 0.8 }}
          >
            Enter anywhere
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
