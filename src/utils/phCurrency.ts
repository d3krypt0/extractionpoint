export const formatPhp = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPhpPlain = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export interface TaxAndDiscountCalculation {
  subtotalGross: number;
  discountType: 'senior_pwd' | 'promo' | 'none';
  discountAmount: number;
  vatableSales: number;
  vatAmount: number;
  vatExemptSales: number;
  totalPayable: number;
}

/**
 * Calculates Philippine Tax (12% VAT) and discounts (Senior Citizen / PWD 20% + VAT Exemption)
 * according to Philippine Republic Acts RA 9994 and RA 10754.
 */
export const calculatePhilippineTaxesAndDiscounts = (
  grossAmount: number,
  discountType: 'senior_pwd' | 'promo' | 'none' = 'none',
  promoDiscountPercent: number = 0
): TaxAndDiscountCalculation => {
  if (discountType === 'senior_pwd') {
    // Under RA 9994/10754:
    // 1. Remove 12% VAT: Net of VAT = Gross / 1.12
    const vatExemptSales = grossAmount / 1.12;
    // 2. Apply 20% discount on the net amount
    const discountAmount = vatExemptSales * 0.20;
    const totalPayable = vatExemptSales - discountAmount;
    
    return {
      subtotalGross: grossAmount,
      discountType: 'senior_pwd',
      discountAmount: Math.round(discountAmount * 100) / 100,
      vatableSales: 0,
      vatAmount: 0,
      vatExemptSales: Math.round(vatExemptSales * 100) / 100,
      totalPayable: Math.round(totalPayable * 100) / 100,
    };
  } else if (discountType === 'promo' && promoDiscountPercent > 0) {
    const discountAmount = grossAmount * (promoDiscountPercent / 100);
    const discountedTotal = grossAmount - discountAmount;
    const vatableSales = discountedTotal / 1.12;
    const vatAmount = discountedTotal - vatableSales;
    
    return {
      subtotalGross: grossAmount,
      discountType: 'promo',
      discountAmount: Math.round(discountAmount * 100) / 100,
      vatableSales: Math.round(vatableSales * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      vatExemptSales: 0,
      totalPayable: Math.round(discountedTotal * 100) / 100,
    };
  } else {
    const vatableSales = grossAmount / 1.12;
    const vatAmount = grossAmount - vatableSales;
    
    return {
      subtotalGross: grossAmount,
      discountType: 'none',
      discountAmount: 0,
      vatableSales: Math.round(vatableSales * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      vatExemptSales: 0,
      totalPayable: Math.round(grossAmount * 100) / 100,
    };
  }
};

export const generateReceiptNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EXT-OR-${dateStr}-${randomNum}`;
};

export const generateGCashReference = (): string => {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let ref = '';
  for (let i = 0; i < 9; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MP-${ref}`;
};
