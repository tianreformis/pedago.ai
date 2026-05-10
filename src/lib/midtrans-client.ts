export function getClientKey(): string {
  return process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
}

export function getSnapUrl(): string {
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  return isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
}
