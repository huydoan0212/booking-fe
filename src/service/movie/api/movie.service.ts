import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {MovieApi} from '../model/movie.model';
import {ResponseResult} from '../../../app/shared/data-access/interface/response.type';
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

    return this.httpClient.get(`${environment.API_DOMAIN}/movie/search`, { params });
  }
  getMovieDetail(id: string | null) {
    return this.httpClient.get<ResponseResult<MovieApi.Response>>(`${environment.API_DOMAIN}/movie/${id}`)
  }
}
