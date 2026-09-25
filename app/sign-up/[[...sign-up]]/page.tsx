import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div className="spotlight-backdrop flex min-h-screen items-center justify-center px-6 pb-24 pt-32">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="eyebrow">Private access</p>
          <h1 className="mt-5 font-serif text-6xl">Join the house.</h1>
        </div>
        <SignUp
          appearance={clerkAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/account"
        />
      </div>
    </div>
  );
}
