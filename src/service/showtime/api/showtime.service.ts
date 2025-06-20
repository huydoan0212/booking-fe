import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ShowTimeApi } from '../model/showtime.model';
import { ResponseResult, Rows } from '../../../app/shared/data-access/interface/response.type';
import {MovieApi} from '../../movie/model/movie.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {CinemaHallApi} from '../../cinemaHall/model/cinemalHall.model';

@Injectable({
  providedIn: 'root',
})
export class ShowtimeService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  searchShowTime(
    movieId: string | undefined,
    page: number,
    take: number,
    location?: string,
    cinemaName?: string
  ) {
    // 1. Tính today và today + 7 ngày
    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    // 2. Chuyển thành ISO strings
    const isoToday = today.toISOString();
    const isoEnd = sevenDaysLater.toISOString();

    // 3. Xây dựng mảng các phần filter
    const filterParts: string[] = [
      `movie.id = '${movieId}'`,
      `showTime >= '${isoToday}'`,
      `showTime <= '${isoEnd}'`
    ];

    if (location) {
      filterParts.push(
        `cinemaHall.cinema.address like '%${location}%'`
      );
    }

    if (cinemaName) {
      filterParts.push(
        `cinemaHall.cinema.name like '%${cinemaName}%'`
      );
    }

    const filter = filterParts.join(' and ');

    // 4. Gửi request
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', 'ASC')
      .set('sortBy', 'showTime');

    return this.http.get<
      ResponseResult<Rows<ShowTimeApi.Response>>
    >(`${environment.API_DOMAIN}/show-time/search`, { params });
  }

  getShowTimeById(showTimeId: string | null){
    return this.http.get<ResponseResult<ShowTimeApi.Response>>
    (`${environment.API_DOMAIN}/show-time/${showTimeId}`);
  }

  getShowTimeByCinemaHallId(page: number, take: number, sortDirection: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection);

    return this.http.get(`${environment.API_DOMAIN}/show-time/search`, { params });
  }

  createShowtime(data: ShowTimeApi.Request): Observable<ResponseResult<ShowTimeApi.Request>> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ResponseResult<ShowTimeApi.Request>>(
      `${environment.API_DOMAIN}/show-time/`,
      data,
      { headers }
    );
  }
  getShowTimeId(id: string): Observable<ResponseResult<ShowTimeApi.Response>> {
    return this.http.get<ResponseResult<ShowTimeApi.Response>>(
      `${environment.API_DOMAIN}/show-time/${id}`
    );
  }

  updateShowtime(id: string, data: ShowTimeApi.Request) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.put(`${environment.API_DOMAIN}/show-time/${id}`, data, { headers });
  }
  deleteShowtime(Id: string): Observable<ResponseResult<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseResult<any>>(
      `${environment.API_DOMAIN}/show-time/${Id}`,
      { headers }
    );
  }


}
