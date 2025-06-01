import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Movie} from '../model/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient) {}

  getMovies(filter: string, page: number, take: number, sortBy: string) {
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortBy', sortBy);

    return this.httpClient.get(`${environment.API_DOMAIN}/api/movie/search`, { params });
  }
  getMovieDetail(id: string | null): Observable<Movie> {
    return this.httpClient.get<any>(`${environment.API_DOMAIN}/api/movie/${id}`)
      .pipe(
        map(res => res.responseData)
      );
  }



}
