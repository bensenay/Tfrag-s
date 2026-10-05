import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authContext = await getAuthContext();

  if (!authContext.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!authContext.email) {
    return NextResponse.json(
      { error: "Authenticated user does not have a primary email" },
      { status: 400 },
    );
  }

  const rateLimit = await checkRateLimit({
    identifier: authContext.userId,
    limit: 60,
    namespace: "orders-read",
    request,
    window: "1 m",
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  const orders = await prisma.order.findMany({
    where: authContext.isAdmin
      ? undefined
      : {
          customerEmail: authContext.email,
        },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(
    { orders },
    { headers: rateLimit.headers },
  );
}
