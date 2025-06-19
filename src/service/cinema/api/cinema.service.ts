import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {CinemaApi} from '../model/cinema.model';
import {ResponseResult, Rows} from '../../../app/shared/data-access/interface/response.type';
import {REQUIRE_AUTH} from '../../../app/shared/utils/interceptor/interceptors';
import {map, Observable} from 'rxjs';
import {CategoryApi} from '../../category/model/category.model';
import {environment} from '../../../environments/environment.development';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  _http: HttpClient;

  constructor(_http: HttpClient,
              private authService: AuthService) {
    this._http = _http;
  }

  // getAllCinema() {
  //   return this._http.get<ResponseResult<CinemaApi.Response>>('cinema/', {
  //     context: new HttpContext().set(REQUIRE_AUTH, false)
  //   })
  // }
  getAllCinema(): Observable<any> {
    return this._http
      .get<ResponseResult<Rows<CategoryApi.Response[]>>>(`${environment.API_DOMAIN}/cinema/`)
      .pipe(map((res) => res.responseData));
  }

  getCinemaListPagination(page: number, take: number, searchString: string) {
    return this._http.get<ResponseResult<Rows<CinemaApi.Response[]>>>(
      `cinema/search?filter=name~%27${searchString}%27&page=${page}&take=${take}`,
      {
        context: new HttpContext().set(REQUIRE_AUTH, false),
      }
    )
  }

  getCinemaId(cinemaId: string) {
    return this._http.get<ResponseResult<CinemaApi.Response>>(
      `cinema/${cinemaId}`,
      {context: new HttpContext().set(REQUIRE_AUTH, false)}
    )
  }

  postCinema(CinemaFrom: CinemaApi.Request) {
    return this._http.post<ResponseResult<CinemaApi.Request>>(
      `cinema/`,
      CinemaFrom
    )
  }

  putCinema(CinemaFrom: CinemaApi.Request, cinemaId: string) {
    return this._http.put<ResponseResult<CinemaApi.Request>>(
      `cinema/${cinemaId}`,
      CinemaFrom
    );
  }

  deleteCinema(cinemaId: string): Observable<ResponseResult<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this._http.delete<ResponseResult<any>>(
      `${environment.API_DOMAIN}/cinema/${cinemaId}`,
      { headers }
    );
  }

  searchCinema(name: string = '', page: number, take: number, sortDirection: string): Observable<any> {
    const filter = name ? `name ~ '${name}'` : '';

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this._http.get(`${environment.API_DOMAIN}/cinema/search`, {params});
  }



}
