import {SeatApi} from '../../seat/model/seat.model';
import {ShowTimeApi} from '../../showtime/model/showtime.model';
import {BookingApi} from '../../booking/model/booking.model';

export namespace TicketApi {
  export interface Request {
    showTimeId: string;
    price: number;
    ticketType: string;
    ticketStatus: string;
    seatId: string;
    bookingId: string;
  }

  export interface Response {
    id: string;
    ticketCode: string;
    price: number;
    ticketType: string;
    ticketStatus: string;
    seat: SeatApi.Response;
    // showTime: ShowTimeApi.Response;
    // booking: BookingApi.Response;
    createdAt: string;
  }
}
export namespace StartHold {
  export interface Request {
    showTimeId: string;
    userId: string;
  }
}
export namespace LockTicket {
  export interface Request {
    showTimeId: string;
    ticketId: string;
    userId: string;
  }
}

export namespace LockTicketRequest {
  export interface Request {
    showTimeId: string;
    ticketId: string;
    userId: string;
    price: number;
    seatLabel: string;
    seatType: string;
  }
}
export namespace UnlockTicketRequest {
  export interface Request {
    showTimeId: string;
    ticketId: string;
    userId: string;
  }
}
export namespace AllHoldInfo {
  export interface Response {
    heldTickets: HeldTicket[];
    otherHeldTickets: HeldTicket[];
    secondsRemaining: number;
  }
}
export interface HeldTicket {
  ticketId: string;
  price: number;
  seatLabel: string;
  seatType: string;
}
