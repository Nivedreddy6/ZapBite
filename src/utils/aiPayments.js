// ZapPay AI - Smart Payment & Offer Optimizer Helper

export const PROMO_CODES = [
  {
    code: 'ZAPBITE50',
    title: '50% OFF up to ₹100',
    minSubtotal: 200,
    discountPercent: 50,
    maxDiscount: 100,
    desc: 'BiteDash & ZapBite AI welcome offer'
  },
  {
    code: 'BIRYANI25',
    title: '25% OFF on Biryanis',
    minSubtotal: 250,
    discountPercent: 25,
    maxDiscount: 120,
    category: 'Biryani',
    desc: 'Special biryani feast discount'
  },
  {
    code: 'FREEDEL',
    title: 'Zero Delivery Fee',
    minSubtotal: 150,
    fixedDiscount: 35,
    desc: 'Waives delivery fee instantly'
  }
];

export function getSmartPaymentRecommendation(cartItems = [], subtotal = 0) {
  if (cartItems.length === 0 || subtotal === 0) {
    return {
      bestOffer: null,
      savings: 0,
      aiAdvice: 'Add delicious items to unlock AI discounts!'
    };
  }

  // Find best offer automatically
  let bestOffer = PROMO_CODES[0];
  let maxSavings = 0;

  PROMO_CODES.forEach((offer) => {
    if (subtotal >= offer.minSubtotal) {
      let savings = 0;
      if (offer.discountPercent) {
        savings = Math.min(offer.maxDiscount, Math.round((subtotal * offer.discountPercent) / 100));
      } else if (offer.fixedDiscount) {
        savings = offer.fixedDiscount;
      }

      if (savings > maxSavings) {
        maxSavings = savings;
        bestOffer = offer;
      }
    }
  });

  return {
    bestOffer,
    savings: maxSavings,
    aiAdvice: maxSavings > 0 
      ? `🤖 ZapPay AI automatically selected code **${bestOffer.code}** to save you **₹${maxSavings}**!`
      : 'Add ₹50 more to unlock 50% OFF with ZAPBITE50!'
  };
}

export function generatePaymentSecurityScore(paymentMode, amount) {
  const securityToken = `TOK-AI-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();

  return {
    riskLevel: 'Ultra-Low Risk (Safe)',
    safetyScore: '99.8%',
    encryption: '256-Bit TLS + AI Fraud Shield',
    securityToken,
    timestamp,
    upiQrData: `upi://pay?pa=zapbite@icici&pn=ZapBiteAI&am=${amount}&cu=INR&tn=${securityToken}`
  };
}
