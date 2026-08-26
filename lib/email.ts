import type { Prisma } from "@prisma/client";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL ?? "Tfrag <onboarding@resend.dev>";

export const hasResendApiKey = Boolean(resendApiKey);

export const resend = new Resend(resendApiKey ?? "re_missing");

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

const formatCurrency = (amountInCents: number) =>
  currencyFormatter.format(amountInCents / 100);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getOrderLines = (order: OrderWithItems) =>
  order.items.map((item) => {
    const lineTotal = item.price * item.quantity;

    return {
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      lineTotal,
    };
  });

const buildTextEmail = (order: OrderWithItems) => {
  const lines = getOrderLines(order)
    .map(
      (item) =>
        `${item.quantity} x ${item.name} - ${formatCurrency(item.lineTotal)}`,
    )
    .join("\n");

  return [
    `Thanks for your order${order.customerName ? `, ${order.customerName}` : ""}.`,
    "",
    `Order ID: ${order.id}`,
    "",
    "Order summary:",
    lines,
    "",
    `Total: ${formatCurrency(order.totalAmount)}`,
  ].join("\n");
};

const buildHtmlEmail = (order: OrderWithItems) => {
  const rows = getOrderLines(order)
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(item.lineTotal)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div>
      <p>Thanks for your order${order.customerName ? `, ${escapeHtml(order.customerName)}` : ""}.</p>
      <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
      <table cellpadding="6" cellspacing="0" border="1">
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="left">Qty</th>
            <th align="left">Price</th>
            <th align="left">Line total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>Total:</strong> ${formatCurrency(order.totalAmount)}</p>
    </div>
  `;
};

export const sendOrderConfirmation = async (order: OrderWithItems) => {
  if (!hasResendApiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  if (!order.customerEmail) {
    throw new Error("Order is missing a customer email");
  }

  const { error } = await resend.emails.send(
    {
      from: fromEmail,
      to: order.customerEmail,
      subject: `Order confirmation ${order.id}`,
      html: buildHtmlEmail(order),
      text: buildTextEmail(order),
    },
    {
      idempotencyKey: `order-confirmation-${order.id}`,
    },
  );

  if (error) {
    throw new Error(error.message);
  }
};
