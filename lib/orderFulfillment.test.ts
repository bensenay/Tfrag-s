import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendOrderConfirmation: vi.fn(),
  orderFindFirst: vi.fn(),
  orderItemFindMany: vi.fn(),
  orderUpdateMany: vi.fn(),
  productUpdateMany: vi.fn(),
  confirmationUpdateMany: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendOrderConfirmation: mocks.sendOrderConfirmation,
}));

vi.mock("@/lib/prisma", () => {
  const tx = {
    order: {
      findFirst: mocks.orderFindFirst,
      updateMany: mocks.orderUpdateMany,
    },
    orderItem: {
      findMany: mocks.orderItemFindMany,
    },
    product: {
      updateMany: mocks.productUpdateMany,
    },
  };

  return {
    prisma: {
      $transaction: vi.fn((callback) => callback(tx)),
      order: {
        updateMany: mocks.confirmationUpdateMany,
      },
    },
  };
});

import { settlePaidCheckout } from "@/lib/orderFulfillment";

const checkout = {
  customerEmail: "customer@example.com",
  customerName: "Polaris Customer",
  orderId: "order-1",
  shippingAddress: "{}",
  stripeSessionId: "cs_test_1",
};

const order = {
  id: "order-1",
  confirmationEmailSentAt: null,
  inventoryCommittedAt: new Date(),
  items: [],
};

describe("paid checkout settlement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.orderFindFirst.mockResolvedValue(order);
    mocks.orderItemFindMany.mockResolvedValue([
      { productId: "product-1", quantity: 2 },
    ]);
    mocks.productUpdateMany.mockResolvedValue({ count: 1 });
    mocks.confirmationUpdateMany.mockResolvedValue({ count: 1 });
  });

  it("decrements inventory and sends one confirmation for a new payment", async () => {
    mocks.orderUpdateMany.mockResolvedValue({ count: 1 });

    await settlePaidCheckout(checkout);

    expect(mocks.productUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { stock: { decrement: 2 } },
        where: expect.objectContaining({ stock: { gte: 2 } }),
      }),
    );
    expect(mocks.sendOrderConfirmation).toHaveBeenCalledOnce();
    expect(mocks.confirmationUpdateMany).toHaveBeenCalledOnce();
  });

  it("does not decrement inventory or resend email after settlement", async () => {
    mocks.orderUpdateMany.mockResolvedValue({ count: 0 });
    mocks.orderFindFirst.mockResolvedValue({
      ...order,
      confirmationEmailSentAt: new Date(),
    });

    await settlePaidCheckout(checkout);

    expect(mocks.productUpdateMany).not.toHaveBeenCalled();
    expect(mocks.sendOrderConfirmation).not.toHaveBeenCalled();
  });

  it("retries an email that failed after inventory was committed", async () => {
    mocks.orderUpdateMany.mockResolvedValue({ count: 0 });

    await settlePaidCheckout(checkout);

    expect(mocks.productUpdateMany).not.toHaveBeenCalled();
    expect(mocks.sendOrderConfirmation).toHaveBeenCalledOnce();
  });
});
