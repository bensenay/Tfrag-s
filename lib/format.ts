export const formatCad = (amountInCents: number) =>
  new Intl.NumberFormat("en-CA", {
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    style: "currency",
  }).format(amountInCents / 100);
