import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MovieApi} from '../../movie/model/movie.model';
import {Observable} from 'rxjs';
import {ResponseResult} from '../../../app/shared/data-access/interface/response.type';
import {environment} from '../../../environments/environment.development';
import {BookingApi} from '../model/booking.model';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  // createBooking

  createBooking(data: BookingApi.Request): Observable<ResponseResult<BookingApi.Response>> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<ResponseResult<BookingApi.Response>>(
      `${environment.API_DOMAIN}/booking/`,
      data,
      { headers }
    );
  }

  payment(bookingId: string): Observable<ResponseResult<BookingApi.ResponseUrl>> {
    // Không kèm Authorization header
    const params = new HttpParams().set('booking', bookingId);
    return this.httpClient.post<ResponseResult<BookingApi.ResponseUrl>>(
      `${environment.API_DOMAIN}/payment/`,
      null,               // body = null vì dùng query param
      { params }
    );
  }

}
