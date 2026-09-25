import { sendOrderConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type PaidCheckout = {
  customerEmail: string;
  customerName: string;
  orderId: string;
  shippingAddress: string;
  stripeSessionId: string;
};

export class InventoryConflictError extends Error {
  constructor(productId: string) {
    super(`Insufficient inventory for product ${productId}`);
    this.name = "InventoryConflictError";
  }
}

export const settlePaidCheckout = async (checkout: PaidCheckout) => {
  const order = await prisma.$transaction(async (tx) => {
    const committedAt = new Date();
    const transition = await tx.order.updateMany({
      where: {
        id: checkout.orderId,
        stripeSessionId: checkout.stripeSessionId,
        inventoryCommittedAt: null,
        status: { in: ["PENDING", "PAID"] },
      },
      data: {
        status: "PAID",
        customerEmail: checkout.customerEmail,
        customerName: checkout.customerName,
        shippingAddress: checkout.shippingAddress,
        inventoryCommittedAt: committedAt,
      },
    });

    if (transition.count === 1) {
      const items = await tx.orderItem.findMany({
        where: { orderId: checkout.orderId },
      });

      for (const item of items) {
        const inventoryUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (inventoryUpdate.count !== 1) {
          throw new InventoryConflictError(item.productId);
        }
      }
    }

    const settledOrder = await tx.order.findFirst({
      where: {
        id: checkout.orderId,
        stripeSessionId: checkout.stripeSessionId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!settledOrder) {
      throw new Error("Stripe checkout does not match an order");
    }

    if (!settledOrder.inventoryCommittedAt) {
      throw new Error("Order is not eligible for paid fulfillment");
    }

    return settledOrder;
  });

  if (!order.confirmationEmailSentAt) {
    await sendOrderConfirmation(order);
    await prisma.order.updateMany({
      where: {
        id: order.id,
        confirmationEmailSentAt: null,
      },
      data: {
        confirmationEmailSentAt: new Date(),
      },
    });
  }

  return order;
};

export const cancelPendingCheckout = async (
  orderId: string,
  stripeSessionId: string,
) =>
  prisma.order.updateMany({
    where: {
      id: orderId,
      stripeSessionId,
      status: "PENDING",
      inventoryCommittedAt: null,
    },
    data: {
      status: "CANCELLED",
    },
  });
