import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CinemaHallService {
  constructor(private http: HttpClient) {}
  searchCinemaHallByCinemaId(cinemaId: string, page: number, take: number, sortDirection: string): Observable<any> {
    const filter = `cinema.id = '${cinemaId}'`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection)
      .set('filter', filter);

    return this.http.get(`${environment.API_DOMAIN}/cinema-hall/search`, { params });
  }

}
