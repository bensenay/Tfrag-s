import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Work_Sans } from "next/font/google";
import { Entrance } from "@/components/storefront/Entrance";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "House of Polaris",
    template: "%s — House of Polaris",
  },
  description:
    "Olfactory stories drawn from wild earth, distant stars, and the hush between them.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${workSans.variable} ${cormorant.variable} antialiased`}
      >
        <body>
          <Entrance />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
