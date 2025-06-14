import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {ShowTimeApi} from '../model/showtime.model';
@Injectable({
  providedIn: 'root',
})
export class ShowtimeService{
  constructor(private  http: HttpClient,
              private router: Router) {
  }
  searchShowTime(movieId: string, page: number, take: number) {
    const filter = `showTime.movie.id = '${movieId}'`;
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', 'ASC');

    return this.http.get<{
      message: string,
      responseData: { rows: ShowTimeApi.Response[] }
    }>(`${environment.API_DOMAIN}/api/ticket/search`, { params });
  }

}
