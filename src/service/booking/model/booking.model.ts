import {TicketApi} from '../../ticket/model/ticket.model';

export namespace BookingApi {
  export interface Request {
    discountId: string;
    userId: string;
    ticketIds: string[]
  }

  export interface Response {
    id: string;
    bookingCode: string;
    totalPrice: number;
    finalPrice: number;
    discountId: string | null; // Có thể null nếu không áp dụng mã giảm giá
    userId: string;
    bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; // Enum giả định, sửa theo BE nếu khác
    paymentStatus: 'UNPAID' | 'PAID' | 'FAILED';          // Enum giả định, sửa theo BE nếu khác
    tickets: TicketApi.Response[];
    createdAt: string; // ISO Date string
  }
}
