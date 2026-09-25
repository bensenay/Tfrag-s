import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatCad } from "@/lib/format";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Account",
  description: "View your House of Polaris order history.",
};

export default async function AccountPage() {
  const authContext = await getAuthContext();

  if (!authContext.isAuthenticated) redirect("/sign-in");

  const orders = authContext.email
    ? await prisma.order.findMany({
        where: authContext.isAdmin ? undefined : { customerEmail: authContext.email },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="spotlight-backdrop min-h-screen px-6 pb-28 pt-36 md:px-8 md:pt-44">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Private access</p>
        <h1 className="mt-5 font-serif text-6xl md:text-8xl">Welcome back.</h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          {authContext.email ?? "Your House of Polaris account"}
        </p>

        <div className="mt-16">
          <div className="flex items-end justify-between border-b border-border pb-5">
            <h2 className="font-serif text-4xl">Order history</h2>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length ? (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <article key={order.id} className="grid gap-6 py-8 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-primary">{order.status}</p>
                    <p className="mt-2 font-serif text-2xl">Order {order.id.slice(-8).toUpperCase()}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {order.createdAt.toLocaleDateString("en-CA", { dateStyle: "long" })}
                    </p>
                    <ul className="mt-5 space-y-2 text-sm text-foreground/75">
                      {order.items.map((item) => (
                        <li key={item.id}>{item.quantity} × {item.product.name}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-serif text-2xl text-primary">{formatCad(order.totalAmount)} CAD</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-serif text-4xl">No constellations charted yet.</p>
              <p className="mt-3 text-sm text-muted-foreground">Your completed orders will appear here.</p>
              <Link href="/shop" className="mt-8 inline-block text-[10px] uppercase tracking-[0.18em] text-primary underline underline-offset-8">
                Explore the collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
