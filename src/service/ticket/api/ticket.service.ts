import {HttpClient, HttpContext} from '@angular/common/http';
import {LockTicket, StartHold, TicketApi} from '../model/ticket.model';
import {REQUIRE_AUTH} from '../../../app/shared/utils/interceptor/interceptors';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {map} from 'rxjs/operators';
import {ResponseResult} from '../../../app/shared/data-access/interface/response.type';
import {Observable} from 'rxjs';
import {StompService} from '../../../app/service/stomp.service';
@Injectable({
  providedIn: 'root',
})

export class TicketService {
  constructor(private _http: HttpClient, private stompService: StompService) {
  }
  getTicketByShowTimeId(showTimeId: string) {
    return this._http.get<ResponseResult<TicketApi.Response[]>>(`${environment.API_DOMAIN}/ticket/showTime/${showTimeId}`,
      {
        context: new HttpContext().set(REQUIRE_AUTH, false),
      })
      .pipe(map(result => result.responseData)
      )
  }
  startHold(req: StartHold.Request): Observable<void> {
    return this._http.post<void>(`${environment.API_DOMAIN}/ticket/start-hold`, req);
  }

  sendLockSeat(req: LockTicket.Request): void {
    console.log(req.showTimeId)
    this.stompService.send('/app/lock-seat', {
      showTimeId: req.showTimeId,
      ticketId: req.ticketId,
      userId: req.userId
    });
  }

  sendUnlockSeat(req: LockTicket.Request): void {
    this.stompService.send('/app/unlock-seat', {
      showtimeId: req.showTimeId,
      ticketId: req.ticketId,
      userId: req.userId
    });
  }
}
