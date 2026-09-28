"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const navClass =
  "text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/65 transition-colors hover:text-primary";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const count = useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );

  return (
    <header className="fixed inset-x-0 top-0 z-40 max-w-full overflow-x-clip border-b border-border/45 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 min-w-0 max-w-[1440px] items-center justify-between px-4 sm:px-5 md:px-8">
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <Link href="/#top" className={navClass} aria-label="Home"><Home className="size-4" /></Link>
          <Link href="/#collection" className={navClass}>Collection</Link>
          <Link href="/#house" className={navClass}>The House</Link>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          className="p-2 text-foreground/70 md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>

        <Link
          href="/"
          className="absolute left-1/2 max-w-[48vw] -translate-x-1/2 truncate whitespace-nowrap font-serif text-xl italic text-foreground sm:text-2xl md:max-w-none md:text-3xl"
        >
          House of Polaris
        </Link>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2 md:gap-6">
          <Show when="signed-out">
            <Link href="/sign-in" className={`${navClass} hidden md:inline-flex`}>Account</Link>
            <Link href="/sign-in" className="p-2 text-foreground/70 md:hidden" aria-label="Account">
              <UserRound className="size-4" />
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/account" className={`${navClass} hidden md:inline-flex`}>Account</Link>
            <UserButton />
          </Show>
          <Link href="/cart" className={`${navClass} inline-flex items-center gap-2`}>
            <ShoppingBag className="size-4 md:hidden" />
            <span className="hidden md:inline">Cart</span>
            <span aria-label={`${count} items in cart`}>({count})</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 min-h-dvh bg-background p-6 md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <div className="flex justify-end">
              <button type="button" className="p-2" onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <nav className="flex min-h-[70vh] flex-col items-center justify-center gap-8 font-serif text-4xl">
              <Link href="/#top" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/#collection" onClick={() => setOpen(false)}>Collection</Link>
              <Link href="/#house" onClick={() => setOpen(false)}>The House</Link>
              <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
              <Link href="/cart" onClick={() => setOpen(false)}>Cart ({count})</Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
