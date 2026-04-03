/**
 * Marketly Paystack Integration Utility
 */

export const initializePaystack = (config: {
  email: string;
  amount: number;
  metadata?: any;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) => {
  // @ts-ignore
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dummy_key',
    email: config.email,
    amount: config.amount * 100, // Paystack uses kobo/cents
    currency: 'USD',
    ref: 'MKT-' + Math.floor((Math.random() * 1000000000) + 1),
    metadata: config.metadata,
    callback: function(response: any) {
      config.onSuccess(response.reference);
    },
    onClose: function() {
      config.onClose();
    }
  });
  handler.openIframe();
};

export const verifyPaymentOnServer = async (reference: string) => {
  // In production, this would call a Firebase Cloud Function
  console.log('Verifying payment reference:', reference);
  return { success: true };
};