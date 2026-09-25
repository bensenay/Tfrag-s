import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { z } from "zod";

const productUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe")
      .optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    price: z.number().int().positive().optional(),
    imageUrl: z.string().trim().min(1).max(2048).optional(),
    scentNotes: z.array(z.string().trim().min(1).max(100)).max(30).optional(),
    stock: z.number().int().nonnegative().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one product field is required",
  });

const paramsSchema = z.object({
  id: z.string().trim().min(1),
});

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const requireAdmin = async () => {
  const authContext = await getAuthContext();

  if (!authContext.isAuthenticated) {
    return {
      authContext,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!authContext.isAdmin) {
    return {
      authContext,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { authContext, response: null };
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();

  if (authError.response) {
    return authError.response;
  }

  const rateLimit = await checkRateLimit({
    identifier: authError.authContext.userId,
    limit: 60,
    namespace: "admin-products",
    request,
    window: "1 m",
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  const params = paramsSchema.safeParse(await context.params);

  if (!params.success) {
    return NextResponse.json(
      { error: "Invalid product id", details: formatZodError(params.error) },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = productUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product input", details: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.update({
      where: {
        id: params.data.id,
      },
      data: parsed.data,
    });

    return NextResponse.json(
      { product },
      { headers: rateLimit.headers },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A product with that unique field already exists" },
        { status: 400 },
      );
    }

    throw error;
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdmin();

  if (authError.response) {
    return authError.response;
  }

  const rateLimit = await checkRateLimit({
    identifier: authError.authContext.userId,
    limit: 60,
    namespace: "admin-products",
    request,
    window: "1 m",
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  const params = paramsSchema.safeParse(await context.params);

  if (!params.success) {
    return NextResponse.json(
      { error: "Invalid product id", details: formatZodError(params.error) },
      { status: 400 },
    );
  }

  try {
    await prisma.product.delete({
      where: {
        id: params.data.id,
      },
    });

    return new NextResponse(null, {
      status: 204,
      headers: rateLimit.headers,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Product cannot be deleted because it belongs to an order" },
        { status: 400 },
      );
    }

    throw error;
  }
}
