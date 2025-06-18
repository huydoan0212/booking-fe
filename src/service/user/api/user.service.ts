import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {ResponseResult} from '../../../app/shared/data-access/interface/response.type';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http: HttpClient;

  constructor(http: HttpClient,
              private authService: AuthService
  ) {
    this.http = http;
  }

  searchUser(name: string = '', page: number, take: number, sortDirection: string): Observable<any> {
    const filter = name ? `name ~ '${name}'` : '';

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${environment.API_DOMAIN}/user/search`, {
      params,
      headers
    });
  }

  deleteUser(userId: string): Observable<ResponseResult<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ResponseResult<any>>(
      `${environment.API_DOMAIN}/user/${userId}`,
      { headers }
    );
  }
}
