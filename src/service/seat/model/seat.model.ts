export namespace SeatApi {
  export interface Request {
    seatRow: string;              // Ví dụ: "A", "B", ..., "L"
    seatColumn: number;           // Ví dụ: 1, 2, ..., 14
    type: 'STANDARD' | 'VIP' | 'COUPLE';
    price: number;                // Giá tiền
    status: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'DISABLED'; // hoặc các status bạn định nghĩa
    cinemaHallId: string;         // UUID dưới dạng string
  }

  export interface Response {
    id: string;                   // UUID dạng string
    seatRow: string;
    seatColumn: number;
    type: 'STANDARD' | 'VIP' | 'COUPLE';
    price: number;
    status: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'DISABLED';
    createdAt: string;            // ISO 8601 string, ví dụ: "2025-06-01T09:30:00Z"
  }
}
