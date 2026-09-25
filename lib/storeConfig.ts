const configuredCurrency = process.env.STORE_CURRENCY?.trim().toLowerCase();

if (configuredCurrency && !/^[a-z]{3}$/.test(configuredCurrency)) {
  throw new Error("STORE_CURRENCY must be a three-letter ISO currency code");
}

export const storeCurrency = configuredCurrency ?? "cad";
export const storeName = process.env.STORE_NAME?.trim() || "House of Polaris";

export const formatCurrency = (amountInCents: number) =>
  new Intl.NumberFormat("en-CA", {
    currency: storeCurrency.toUpperCase(),
    style: "currency",
  }).format(amountInCents / 100);
