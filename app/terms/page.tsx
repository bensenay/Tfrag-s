import type { Metadata } from "next";
import type { ReactNode } from "react";

const policyEmail = "Houseofpolarisperfume@gmail.com";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for purchasing from the House of Polaris online store.",
};

function PolicyMarker({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-primary/40 bg-primary/5 px-2 py-1 text-primary">
      [Owner review: {children}]
    </span>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-6 pb-28 pt-36 md:px-8 md:pt-44">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">House of Polaris</p>
          <h1 className="mt-5 font-serif text-5xl leading-none sm:text-6xl md:text-8xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-6 text-sm text-muted-foreground">Last updated: October 5, 2026</p>
          <p className="mt-8 max-w-2xl text-base leading-8 text-foreground/75">
            These terms apply when you use the House of Polaris website or purchase fragrance
            products from our Quebec-based online store.
          </p>
          <div className="mt-8 border border-primary/30 bg-card p-5 text-sm leading-7 text-foreground/75">
            Shipping, return, and refund details marked “Owner review” are placeholders and must
            be confirmed before the store launches publicly.
          </div>
        </header>

        <div className="space-y-12 py-12 text-sm leading-8 text-muted-foreground md:text-base">
          <section>
            <h2 className="font-serif text-3xl text-foreground">Products and availability</h2>
            <p className="mt-4">
              Product descriptions and photographs are provided as accurately as reasonably
              possible. Handmade elements, including bottle caps, naturally vary. Products are
              subject to availability, and we may limit quantities or cancel an order when an
              item is unavailable, incorrectly priced, or suspected to involve fraud.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Prices and payment</h2>
            <p className="mt-4">
              Prices are shown in Canadian dollars unless stated otherwise. Applicable taxes,
              shipping charges, and the final order total are shown during checkout. Payments are
              processed securely by Stripe. An order is accepted once payment is confirmed and an
              order confirmation is issued.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Shipping</h2>
            <div className="mt-4 space-y-4">
              <p>
                <PolicyMarker>confirm shipping destinations, rates, carriers, handling time, and estimated delivery windows</PolicyMarker>
              </p>
              <p>
                Delivery estimates are not guarantees. Customers are responsible for providing a
                complete and accurate delivery address. For shipping questions, contact{" "}
                <a
                  className="inline-block whitespace-nowrap text-primary underline underline-offset-4"
                  href={`mailto:${policyEmail}`}
                >
                  [{policyEmail}]
                </a>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Returns and exchanges</h2>
            <div className="mt-4 space-y-4">
              <p>
                <PolicyMarker>confirm the return window, eligibility conditions, whether opened fragrance can be returned, and who pays return shipping</PolicyMarker>
              </p>
              <p>
                Before returning anything, email{" "}
                <a
                  className="inline-block whitespace-nowrap text-primary underline underline-offset-4"
                  href={`mailto:${policyEmail}`}
                >
                  [{policyEmail}]
                </a>{" "}
                with your order number and the reason for the request. Unauthorized returns may
                not be accepted.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Refunds and damaged orders</h2>
            <div className="mt-4 space-y-4">
              <p>
                <PolicyMarker>confirm refund timing, original-shipping treatment, damaged-order evidence requirements, and lost-package procedure</PolicyMarker>
              </p>
              <p>
                Approved refunds will be returned to the original payment method. Financial
                institutions may require additional processing time. If an order arrives damaged
                or incorrect, contact{" "}
                <a
                  className="inline-block whitespace-nowrap text-primary underline underline-offset-4"
                  href={`mailto:${policyEmail}`}
                >
                  [{policyEmail}]
                </a>{" "}
                promptly with the order number and supporting photographs.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Acceptable use</h2>
            <p className="mt-4">
              You may not misuse the website, interfere with its security or operation, attempt
              unauthorized access, submit fraudulent orders, or use its content in violation of
              applicable law or House of Polaris intellectual-property rights.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Liability and applicable law</h2>
            <p className="mt-4">
              To the extent permitted by law, House of Polaris is not responsible for indirect or
              consequential losses arising from use of the website or products. Nothing in these
              terms limits rights or remedies that cannot legally be excluded. These terms are
              governed by the laws applicable in Quebec and Canada.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Contact</h2>
            <p className="mt-4">
              Questions about these terms may be sent to{" "}
              <a
                className="inline-block whitespace-nowrap text-primary underline underline-offset-4"
                href={`mailto:${policyEmail}`}
              >
                [{policyEmail}]
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
