export const MONTHLY_PRICE = 30000;
export const YEARLY_PRICE = 330000;

export const PRICING = {
  monthly: { amount: MONTHLY_PRICE, label: "Bulanan", durationMonths: 1 },
  yearly: { amount: YEARLY_PRICE, label: "Tahunan", durationMonths: 12 },
} as const;

export type PlanType = keyof typeof PRICING;
