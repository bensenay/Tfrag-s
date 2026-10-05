import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { z } from "zod";

const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

const orderUpdateSchema = z
  .object({
    status: orderStatusSchema,
  })
  .strict();

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authContext = await getAuthContext();

  if (!authContext.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!authContext.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = await checkRateLimit({
    identifier: authContext.userId,
    limit: 60,
    namespace: "admin-orders",
    request,
    window: "1 m",
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  const params = paramsSchema.safeParse(await context.params);

  if (!params.success) {
    return NextResponse.json(
      { error: "Invalid order id", details: formatZodError(params.error) },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = orderUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order input", details: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const order = await prisma.order.update({
      where: {
        id: params.data.id,
      },
      data: {
        status: parsed.data.status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(
      { order },
      { headers: rateLimit.headers },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    throw error;
  }
}
