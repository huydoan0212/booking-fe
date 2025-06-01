import {HttpClient, HttpContext} from '@angular/common/http';
import {TicketApi} from '../model/ticket.model';
import {REQUIRE_AUTH} from '../../../app/shared/utils/interceptor/interceptors';
import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class TicketService {
  constructor(private _http: HttpClient) {
  }
  getTicketByShowTimeId(showTimeId: string) {
    return this._http.get<TicketApi.Response[]>(`ticket/showTime/${showTimeId}`,
      {
        context: new HttpContext().set(REQUIRE_AUTH, false),
      })
  }
}
