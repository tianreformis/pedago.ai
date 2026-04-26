import crypto from "crypto";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";
const MIDTRANS_MERCHANT_ID = process.env.MIDTRANS_MERCHANT_ID || "";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_BASE_URL = MIDTRANS_IS_PRODUCTION 
  ? "https://app.midtrans.com" 
  : "https://app.sandbox.midtrans.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function getBasicAuth(): string {
  return Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");
}

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
  const { orderId, amount, customerName, customerEmail } = params;
  
  const body = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customerName,
      email: customerEmail,
    },
    item_details: [
      {
        id: "subscription",
        name: "Langganan PedagoAI - RPP Pembelajaran Mendalam",
        price: amount,
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
    notification_url: `${APP_URL}/api/payment/webhook`,
  };

  const response = await fetch(`${MIDTRANS_BASE_URL}/v2/snap/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${getBasicAuth()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans error: ${response.status} - ${errorText}`);
  }

  return response.json();
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

export function getClientKey(): string {
  return MIDTRANS_CLIENT_KEY;
}