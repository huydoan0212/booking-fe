import {SeatApi} from '../../seat/model/seat.model';

export namespace CinemaHallApi {
  export interface Request {
    name: string;               // Tên phòng chiếu
    screenType: string;         // Ví dụ: "2D", "3D", "IMAX"
    soundSystem: string;        // Ví dụ: "Dolby", "DTS"
    cinemaId: string;           // UUID dạng string
  }

  export interface Response {
    id: string;                 // UUID dạng string
    name: string;
    totalSeats: number;
    screenType: string;
    soundSystem: string;
    createdAt: string;          // ISO date string, ví dụ: "2025-06-01T09:30:00Z"
    seats: SeatApi.Response[];  // Sử dụng lại interface SeatApi.Response đã định nghĩa trước đó
  }
}
