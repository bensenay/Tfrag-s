import type { Metadata } from "next";

const policyEmail = "Houseofpolarisperfume@gmail.com";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for purchasing from the House of Polaris online store.",
};

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
                We currently ship to addresses in Canada and the United States only. A flat
                shipping rate of $13 CAD applies to every order. Orders ship within 3–8 days.
              </p>
              <p>
                Shipping and delivery estimates are not guarantees. Customers are responsible
                for providing a complete and accurate delivery address. For shipping questions,
                contact{" "}
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
                All purchases are final sale. We do not accept returns or exchanges, including
                for scent preference, except where required by law or as described below for
                damaged or incorrect orders.
              </p>
              <p>
                We review special cases individually. This does not create a general right to a
                return, exchange, or refund outside the rules stated here.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Refunds and damaged orders</h2>
            <div className="mt-4 space-y-4">
              <p>
                If an order arrives damaged or incorrect, contact us within 7 days of delivery
                with a photo and your order number, and we’ll replace or refund it.
              </p>
              <p>
                If tracking shows no delivery after 10 days, contact us and we’ll investigate
                with the carrier. Send damaged-order and lost-package requests to{" "}
                <a
                  className="inline-block whitespace-nowrap text-primary underline underline-offset-4"
                  href={`mailto:${policyEmail}`}
                >
                  [{policyEmail}]
                </a>
                . Approved refunds will be returned to the original payment method. Financial
                institutions may require additional processing time.
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
