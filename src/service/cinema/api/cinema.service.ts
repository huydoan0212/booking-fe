import {Injectable} from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {CinemaApi} from '../model/cinema.model';

import * as querystring from 'querystring';
import {ResponseResult, Rows} from '../../../app/shared/data-access/interface/response.type';
import {REQUIRE_AUTH} from '../../../app/shared/utils/interceptor/interceptors';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  _http: HttpClient;

  constructor(_http: HttpClient) {
  }

  getAllCinema() {
    return this._http.get<ResponseResult<CinemaApi.Response>>('cinema/', {
      context: new HttpContext().set(REQUIRE_AUTH, false)
    })
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

  deleteCinema(cinemaId: string){
    return this._http.delete<ResponseResult<any>>(
      `cinema/${cinemaId}`
    )
  }
}
