import type { Metadata } from "next";

const privacyEmail = "houseofpolaris-support@googlegroups.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How House of Polaris collects, uses, and protects customer information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-6 pb-28 pt-36 md:px-8 md:pt-44">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-12">
          <p className="eyebrow">House of Polaris</p>
          <h1 className="mt-5 font-serif text-5xl leading-none sm:text-6xl md:text-8xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-sm text-muted-foreground">Last updated: October 5, 2026</p>
          <p className="mt-8 max-w-2xl text-base leading-8 text-foreground/75">
            This policy explains how House of Polaris, a Quebec-based online fragrance store,
            handles personal information when you browse our website, create an account, contact
            us, or place an order.
          </p>
        </header>

        <div className="space-y-12 py-12 text-sm leading-8 text-muted-foreground md:text-base">
          <section>
            <h2 className="font-serif text-3xl text-foreground">Information we collect</h2>
            <p className="mt-4">
              We may collect your name, email address, shipping and billing address, account
              information, order details, customer-service messages, and technical information
              such as your IP address, browser type, device information, and website activity.
              Payment-card details are handled by Stripe and are not stored directly by House of
              Polaris.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">How we use information</h2>
            <p className="mt-4">
              We use personal information to operate the store, authenticate customers, process
              and deliver orders, send transactional emails, prevent fraud, provide support,
              maintain website security, and meet applicable legal and accounting obligations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Service providers</h2>
            <p className="mt-4">
              We share information only as needed with service providers that help run the store:
              Stripe processes payments; Clerk provides authentication; Resend delivers email;
              Supabase provides database infrastructure; and Vercel hosts and delivers the
              website. Each provider processes information under its own terms and privacy
              practices.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Cookies and similar technology</h2>
            <p className="mt-4">
              The website and its service providers may use essential cookies or similar storage
              to keep you signed in, preserve your cart, secure checkout, remember site state,
              and maintain core functionality. If optional analytics or advertising tools are
              added later, this policy and any required consent controls should be updated first.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Retention and protection</h2>
            <p className="mt-4">
              We retain information only as long as reasonably necessary for the purposes above,
              including legal, tax, fraud-prevention, and dispute-resolution requirements. We use
              reasonable safeguards, but no online service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Your privacy choices</h2>
            <p className="mt-4">
              You may ask to access, correct, or delete your personal information. Some records
              may need to be retained where required by law or for legitimate business purposes.
              To make a request, email{" "}
              <a
                className="inline-block whitespace-nowrap text-primary underline underline-offset-4"
                href={`mailto:${privacyEmail}`}
              >
                [{privacyEmail}]
              </a>
              . We may need to verify your identity before completing a request.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground">Changes to this policy</h2>
            <p className="mt-4">
              We may revise this policy as the store or applicable requirements change. The date
              above will be updated when a new version is posted.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
