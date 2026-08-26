import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

  return NextResponse.json({ orders });
}
