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
  description: "Independent niche perfumes, handcrafted in Quebec.",
};

const introGateScript = `
  try {
    const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
    const hasSeenIntro = window.sessionStorage.getItem("polaris-intro-seen-v8") === "true";
    document.documentElement.dataset.intro = forceReplay || !hasSeenIntro ? "show" : "skip";
  } catch {
    document.documentElement.dataset.intro = "show";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${workSans.variable} ${cormorant.variable} antialiased`}
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: introGateScript }} />
        </head>
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
