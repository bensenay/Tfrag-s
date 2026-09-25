import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="spotlight-backdrop flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="eyebrow">Private access</p>
          <h1 className="mt-5 font-serif text-6xl">Welcome back.</h1>
        </div>
        <SignIn
          appearance={clerkAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/account"
        />
      </div>
    </div>
  );
}
