import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {MovieApi} from '../model/movie.model';
import {ResponseResult} from '../../../app/shared/data-access/interface/response.type';
import {Observable} from 'rxjs';
import {ShowTimeApi} from '../../showtime/model/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient) {
  }

  getMovies(filter: string, page: number, take: number, sortBy: string): Observable<any>  {
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortBy', sortBy);

    return this.httpClient.get(`${environment.API_DOMAIN}/movie/search`, {params});
  }

  getMovieDetail(id: string | null) {
    return this.httpClient.get<ResponseResult<MovieApi.Response>>(`${environment.API_DOMAIN}/movie/${id}`)
  }

  searchMovies(name: string = '', page: number, take: number, sortDirection: string): Observable<any> {
    const filter = name ? `name ~ '${name}'` : '';

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.httpClient.get(`${environment.API_DOMAIN}/movie/search`, {params});
  }

  getMoviesByCategory(
    categoryId: string = '',
    page: number,
    take: number,
    sortDirection: string
  ): Observable<any> {
    const filter = categoryId ? `categories.id='${categoryId}'` : '';

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.httpClient.get(`${environment.API_DOMAIN}/movie/search`, {params});
  }
  deleteMovie(movieId: string): Observable<ResponseResult<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete<ResponseResult<any>>(
      `${environment.API_DOMAIN}/movie/${movieId}`,
      { headers }
    );
  }

}
