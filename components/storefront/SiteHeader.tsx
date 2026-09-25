"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/45 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-8">
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <Link href="/shop" className={navClass}>Collection</Link>
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
          className="absolute left-1/2 -translate-x-1/2 font-serif text-xl italic text-foreground md:text-2xl"
        >
          House of Polaris
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
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
              <Link href="/shop" onClick={() => setOpen(false)}>Collection</Link>
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
