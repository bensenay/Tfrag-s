export const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isEmailAdmin = (email: string | null | undefined) =>
  Boolean(email && getAdminEmails().includes(email.toLowerCase()));

export const getUserPrimaryEmail = async (userId: string) => {
  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return user.primaryEmailAddress?.emailAddress ?? null;
};

export const getAuthContext = async () => {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    return {
      isAuthenticated: false as const,
      userId: null,
      email: null,
      isAdmin: false,
    };
  }

  const email = await getUserPrimaryEmail(userId);

  return {
    isAuthenticated: true as const,
    userId,
    email,
    isAdmin: isEmailAdmin(email),
  };
};
