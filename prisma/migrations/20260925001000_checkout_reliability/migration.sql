ALTER TABLE "Order"
ADD COLUMN "checkoutKey" TEXT,
ADD COLUMN "stripeCheckoutUrl" TEXT,
ADD COLUMN "inventoryCommittedAt" TIMESTAMP(3),
ADD COLUMN "confirmationEmailSentAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Order_checkoutKey_key" ON "Order"("checkoutKey");
