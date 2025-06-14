export namespace DiscountApi {
  export interface Request {
    code: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'; // Enum giả định, chỉnh theo BE nếu khác
    discountValue: number;
    startDate: string; // ISO string format
    endDate: string;
    usageLimit: number;
  }

  export interface Response {
    id: string;
    code: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    usageLimit: number;
    startDate: string;
    endDate: string;
    createdAt: string;
  }
}
