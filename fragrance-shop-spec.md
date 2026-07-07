# Fragrance E-Commerce Website — Project Specification

## 1. Project Overview

**Client:** Friend's independent fragrance business
**Goal:** A full-stack e-commerce website allowing customers to browse, select, and purchase fragrances online, with secure payment processing, order tracking, and an admin panel for inventory/product management.

**Target audience:** Retail customers purchasing fragrances online, low-to-moderate initial traffic expected (small independent brand).

**Success criteria:**
- Customer can browse products, add to cart, and complete a secure checkout
- Friend (site owner) can add/edit/remove products and view/manage orders without needing code changes
- Site is fast, mobile-friendly, and secure
- Ongoing costs stay minimal until the business scales

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | Next.js 14 (App Router) | React framework, SSR/SSG, routing |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS + accessible prebuilt components |
| Language | TypeScript | Type safety across front and back end |
| Forms/validation | React Hook Form + Zod | Form handling and schema validation |
| State management | Zustand | Cart state management |
| Database | PostgreSQL (via Supabase) | Persistent data storage |
| ORM | Prisma | Type-safe database queries and schema migrations |
| Auth | Clerk | Hosted authentication (signup/login/session mgmt) |
| Payments | Stripe (Checkout + Webhooks) | Secure payment processing |
| Image hosting | Cloudinary (or Supabase Storage) | Product image storage/optimization |
| Email | Resend | Transactional emails (order confirmation, etc.) |
| Rate limiting | Upstash Redis | API abuse prevention |
| Hosting | Vercel | Frontend + API deployment |
| Version control | Git + GitHub | Source control |
| Domain registrar | Namecheap / Cloudflare | Domain name purchase |

---

## 3. Feature List

### Customer-facing
- Home page with featured products / brand story
- Shop/catalog page with all products, filter by scent notes (stretch goal)
- Individual product detail page (images, description, notes, price, stock)
- Shopping cart (add/remove/update quantity, persists across page loads)
- Secure checkout via Stripe
- Order confirmation page + confirmation email
- Account creation/login
- Order history page (past orders, status)

### Admin-facing (friend's side)
- Admin login (protected route)
- Add/edit/delete products
- Update stock levels
- View incoming orders and update order status (Pending → Paid → Shipped → Delivered)

### System/technical
- Secure secrets management (`.env.local`, never committed)
- Stripe webhook handling for payment confirmation
- Rate limiting on public API routes
- Responsive design (mobile/tablet/desktop)
- Basic SEO (meta tags, product schema markup — stretch goal)

---

## 4. Data Model (Prisma Schema Summary)

**Product**
- id, name, slug, description, price (cents), imageUrl, scentNotes[], stock, createdAt, updatedAt

**Order**
- id, customerEmail, customerName, status (enum), totalAmount, stripeSessionId, shippingAddress, createdAt, updatedAt

**OrderItem**
- id, orderId, productId, quantity, price (price at time of purchase)

*(User model handled by Clerk, not stored directly in our Postgres DB unless we need extended profile data later.)*

---

## 5. Repo / File Structure

```
fragrance-shop/
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── shop/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── products/
│   │   │       ├── page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   ├── sign-in/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── api/
│   │       ├── products/route.ts
│   │       ├── orders/route.ts
│   │       ├── checkout/route.ts
│   │       └── webhooks/stripe/route.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── product/
│   │   └── cart/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── stripe.ts
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   └── useCart.ts
│   ├── store/
│   │   └── cartStore.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
└── README.md
```

---

## 6. Estimated Costs (Services Only)

| Service | Free Tier | Paid Trigger |
|---|---|---|
| Vercel | Yes (low-moderate traffic) | $20/mo (Pro) |
| Supabase | Yes (500MB DB) | ~$25/mo |
| Clerk | Yes (10,000 MAU) | $25/mo+ |
| Stripe | No monthly fee | 2.9% + $0.30/transaction |
| Cloudinary | Yes (25GB) | ~$99/mo (high volume) |
| Resend | Yes (3,000 emails/mo) | $20/mo |
| Upstash Redis | Yes | ~$10/mo |
| Domain | — | ~$10-15/year |

**Starting cost: ~$0-15/month** (domain only) + Stripe's per-transaction fee.
**At scale: ~$50-100/month** combined, still excluding Stripe fees.

---

## 7. Eight-Week Build Timeline

### Week 1 — Foundation & Setup
- Initialize Next.js project (TypeScript, Tailwind, App Router)
- Set up Git repo + GitHub, confirm `.gitignore` excludes secrets
- Set up Supabase project + Prisma connection
- Define and push initial Prisma schema (Product, Order, OrderItem)
- Seed sample product data
- Set up project file structure (`components/`, `lib/`, `hooks/`, etc.)

**Deliverable:** Working local dev environment, DB connected, sample data in place.

### Week 2 — Core UI & Layout
- Build shared layout components (Navbar, Footer)
- Set up Tailwind theme (colors, fonts, spacing matching brand)
- Install and configure shadcn/ui components
- Build Home page (hero section, featured products, brand story)
- Set up responsive design foundation (mobile-first breakpoints)

**Deliverable:** Home page live locally, consistent design system in place.

### Week 3 — Product Catalog & Detail Pages
- Build `/shop` catalog page — fetch products from DB, display in grid
- Build individual product detail page (`/shop/[slug]`)
- Add product images (placeholder or real, via Cloudinary if ready)
- Implement basic filtering/sorting (by scent notes or price — optional stretch)

**Deliverable:** Customers can browse all products and view individual product pages.

### Week 4 — Cart Functionality
- Set up Zustand store for cart state
- Build Cart page (view items, update quantity, remove items)
- Add "Add to Cart" functionality from product pages
- Persist cart state across page reloads (localStorage-backed Zustand)

**Deliverable:** Fully functional cart, though checkout not yet connected.

### Week 5 — Authentication
- Integrate Clerk (sign-up, sign-in, session management)
- Protect account/order history routes
- Set up middleware for route protection (customer vs admin routes)
- Build basic Account page (view profile, order history placeholder)

**Deliverable:** Users can create accounts, log in, and access protected pages.

### Week 6 — Payments & Checkout
- Set up Stripe account (test mode)
- Build checkout API route (creates Stripe Checkout session)
- Build Stripe webhook handler (`/api/webhooks/stripe`) to confirm payment and update Order status in DB
- Build Checkout success/cancel pages
- Send order confirmation email via Resend on successful payment

**Deliverable:** End-to-end purchase flow working in Stripe test mode.

### Week 7 — Admin Panel
- Build protected `/admin` routes (Clerk role-based or email allowlist check)
- Product management UI: add/edit/delete products, update stock
- Order management UI: view orders, update order status
- Basic validation and error handling across admin forms

**Deliverable:** Friend can manage products and orders without touching code.

### Week 8 — Security, Polish & Launch
- Add rate limiting (Upstash Redis) on public API routes
- Full security review: env vars, webhook signature verification, input validation everywhere
- Cross-browser and mobile testing
- Performance pass (image optimization, loading states, error boundaries)
- Switch Stripe to live mode, connect real domain, final deploy to Vercel
- Post-launch checklist: test a real transaction end-to-end, verify emails send, confirm admin panel works in production

**Deliverable:** Live, secure, production-ready site with a completed real transaction test.

---

## 8. Post-Launch Maintenance Checklist (Recurring)

- [ ] Monthly: run `npm audit`, update dependencies as needed
- [ ] Monthly: check Supabase DB isn't approaching free tier limits
- [ ] As needed: friend adds/updates products via admin panel
- [ ] Periodically: verify checkout flow and emails still work after any dependency updates
- [ ] Watch Supabase free-tier auto-pause if site goes inactive for 7+ days
