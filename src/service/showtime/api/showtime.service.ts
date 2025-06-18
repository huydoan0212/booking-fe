import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ShowTimeApi } from '../model/showtime.model';
import { ResponseResult, Rows } from '../../../app/shared/data-access/interface/response.type';
import {MovieApi} from '../../movie/model/movie.model';

@Injectable({
  providedIn: 'root',
})
export class ShowtimeService {
  constructor(private http: HttpClient) {}

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
    return this.http.get<ResponseResult<ShowTimeApi.Response>>(`${environment.API_DOMAIN}/show-time/${showTimeId}`);
  }
}
