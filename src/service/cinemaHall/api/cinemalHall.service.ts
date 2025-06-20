import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {CategoryApi} from '../../category/model/category.model';
import {AuthService} from '../../auth/auth.service';
import {CinemaApi} from '../../cinema/model/cinema.model';
import {CinemaHallApi} from '../model/cinemalHall.model';
import {ResponseResult} from '../../../app/shared/data-access/interface/response.type';

@Injectable({
  providedIn: 'root',
})
export class CinemaHallService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  searchCinemaHallByCinemaId(cinemaId: string, page: number, take: number, sortDirection: string): Observable<any> {
    const filter = `cinema.id = '${cinemaId}'`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection)
      .set('filter', filter);

    return this.http.get(`${environment.API_DOMAIN}/cinema-hall/search`, { params });
  }

  createCinemaHall(data: CinemaHallApi.Request): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${environment.API_DOMAIN}/cinema-hall/`, data, { headers });
  }

  getCinemaHallById(id: string): Observable<ResponseResult<CinemaHallApi.Response>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ResponseResult<CinemaHallApi.Response>>(`${environment.API_DOMAIN}/cinema-hall/${id}`, { headers });
  }

  deleteCinemaHall(Id: string): Observable<ResponseResult<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ResponseResult<any>>(
      `${environment.API_DOMAIN}/cinema-hall/${Id}`,
      { headers }
    );
  }


  updateCinemaHall(id: string, data: CinemaHallApi.Request) {
    const token = this.authService.getToken();
    console.log(id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.put(`${environment.API_DOMAIN}/cinema-hall/${id}`, data, { headers });
  }

}
