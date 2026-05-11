declare module "midtrans-client" {
  export class Snap {
    constructor(config: { isProduction: boolean; serverKey: string });
    createTransaction(parameters: Record<string, any>): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }
}
