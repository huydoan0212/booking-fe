import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StompService } from '../../../app/service/stomp.service';
import { ResponseResult } from '../../../app/shared/data-access/interface/response.type';
import {
  TicketApi,
  AllHoldInfo,
  HeldTicket,
  LockTicketRequest,
  UnlockTicketRequest
} from '../model/ticket.model';
import { REQUIRE_AUTH } from '../../../app/shared/utils/interceptor/interceptors';

@Injectable({ providedIn: 'root' })
export class TicketService {
  constructor(
    private http: HttpClient,
    private stompService: StompService
  ) {}

  /**
   * Lấy danh sách vé. Nếu backend trả null, trả về mảng rỗng
   */
  getTicketByShowTimeId(showTimeId: string | null): Observable<TicketApi.Response[]> {
    return this.http
      .get<ResponseResult<TicketApi.Response[]>>(
        `${environment.API_DOMAIN}/ticket/showTime/${showTimeId}`,
        { context: new HttpContext().set(REQUIRE_AUTH, false) }
      )
      .pipe(
        map(res => res.responseData ?? [])
      );
  }

  /**
   * Lấy thông tin giữ ghế, ép non-null hoặc trả default nếu null
   */
  getUserHold(
    showtimeId: string,
    userId: string
  ): Observable<AllHoldInfo.Response> {
    return this.http
      .get<ResponseResult<AllHoldInfo.Response>>(
        `${environment.API_DOMAIN}/ticket/hold/${showtimeId}/user/${userId}`
      )
      .pipe(
        map(res => res.responseData ?? { heldTickets: [] as HeldTicket[], otherHeldTickets: [] as HeldTicket[], secondsRemaining: 0 })
      );
  }

  /**
   * Gửi lệnh lockSeat qua STOMP kèm price, seatLabel, seatType
   */
  sendLockSeat(req: { showTimeId: string; ticketId: string; userId: string }): Observable<boolean> {
    this.stompService.send('/app/lock-seat', {
      showTimeId: req.showTimeId,
      ticketId: req.ticketId,
      userId: req.userId,
      // price: req.price,
      // seatLabel: req.seatLabel,
      // seatType: req.seatType
    });
    return of(true);
  }

  /**
   * Gửi lệnh unlockSeat
   */
  sendUnlockSeat(req: { showTimeId: string; ticketId: string; userId: string }): Observable<boolean> {
    this.stompService.send('/app/unlock-seat', {
      showTimeId: req.showTimeId,
      ticketId: req.ticketId,
      userId: req.userId
    });
    return of(true);
  }


}
