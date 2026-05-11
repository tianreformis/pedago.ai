import crypto from "crypto";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface CreatePaymentParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}

interface PaymentResponse {
  token: string;
  redirect_url: string;
}

export async function createPaymentLink(params: CreatePaymentParams): Promise<PaymentResponse> {
  const { default: midtransClient } = await import("midtrans-client");

  const snap = new midtransClient.Snap({
    isProduction: MIDTRANS_IS_PRODUCTION,
    serverKey: MIDTRANS_SERVER_KEY,
  });

  const parameters: Record<string, any> = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
    },
    item_details: [
      {
        id: "subscription",
        name: "Langganan PedagoAI - RPP Pembelajaran Mendalam",
        price: params.amount,
        quantity: 1,
      },
    ],
    credit_card: {
      secure: true,
    },
    expiry: {
      unit: "day",
      duration: 1,
    },
    callbacks: {
      finish: `${APP_URL}/payment/finish`,
      unfinish: `${APP_URL}/payment/unfinish`,
      error: `${APP_URL}/payment/error`,
    },
  };

  const transaction = await snap.createTransaction(parameters);

  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  };
}

export async function verifyPaymentNotification(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): Promise<boolean> {
  const data = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`;
  const hash = crypto.createHash("sha512").update(data).digest("hex");
  return hash === signatureKey;
}

export function isPaymentSuccessful(status: string): boolean {
  return status === "capture" || status === "settlement";
}
