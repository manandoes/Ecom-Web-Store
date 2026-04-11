const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return INR.format(num);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
}

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_RATE = 99;
export const EXPRESS_SHIPPING_RATE = 199;
export const COD_FEE = 49;

export function calculateShipping(
  subtotal: number,
  method: "standard" | "express"
): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD && method === "standard") {
    return 0;
  }
  return method === "express" ? EXPRESS_SHIPPING_RATE : STANDARD_SHIPPING_RATE;
}
