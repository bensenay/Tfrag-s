"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  add: (productId: string) => void;
  change: (productId: string, amount: number) => void;
  clear: () => void;
  remove: (productId: string) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId) =>
        set((state) => {
          const existing = state.lines.find(
            (line) => line.productId === productId,
          );

          return {
            lines: existing
              ? state.lines.map((line) =>
                  line.productId === productId
                    ? { ...line, quantity: line.quantity + 1 }
                    : line,
                )
              : [...state.lines, { productId, quantity: 1 }],
          };
        }),
      change: (productId, amount) =>
        set((state) => ({
          lines: state.lines
            .map((line) =>
              line.productId === productId
                ? { ...line, quantity: Math.max(0, line.quantity + amount) }
                : line,
            )
            .filter((line) => line.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.productId !== productId),
        })),
    }),
    {
      name: "polaris-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
