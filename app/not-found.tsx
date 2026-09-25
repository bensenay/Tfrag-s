import Link from "next/link";
import { primaryButtonClass } from "@/components/storefront/styles";

export default function NotFound() {
  return (
    <div className="spotlight-backdrop flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="eyebrow">Lost in the dark</p>
        <h1 className="mt-5 font-serif text-8xl">404</h1>
        <p className="mt-5 text-sm text-muted-foreground">This point of light could not be found.</p>
        <Link href="/" className={`${primaryButtonClass} mt-8`}>Return home</Link>
      </div>
    </div>
  );
}
