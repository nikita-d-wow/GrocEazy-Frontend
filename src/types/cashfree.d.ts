declare module '@cashfreepayments/cashfree-js' {
    export interface CashfreeConfig {
        mode: 'sandbox' | 'production';
    }

    export interface CheckoutOptions {
        paymentSessionId: string;
        returnUrl?: string;
    }

    export interface Cashfree {
        checkout(options: CheckoutOptions): Promise<void>;
    }

    export function load(config: CashfreeConfig): Promise<Cashfree>;
}
