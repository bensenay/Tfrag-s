import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe"),
  description: z.string().trim().min(1).max(5000),
  price: z.number().int().positive(),
  imageUrl: z.string().trim().min(1).max(2048),
  scentNotes: z.array(z.string().trim().min(1).max(100)).max(30),
  stock: z.number().int().nonnegative(),
});

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

export async function GET(request: Request) {
  const rateLimit = await checkRateLimit({
    limit: 120,
    namespace: "products-read",
    request,
    window: "1 m",
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(
    { products },
    { headers: rateLimit.headers },
  );
}

export async function POST(request: Request) {
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
    namespace: "admin-products",
    request,
    window: "1 m",
  });

  if (!rateLimit.success) {
    return rateLimit.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product input", details: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.create({
      data: parsed.data,
    });

    return NextResponse.json(
      { product },
      { status: 201, headers: rateLimit.headers },
    );
  } catch (error) {
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
