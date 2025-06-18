import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoryApi } from '../model/category.model';
import { environment } from '../../../environments/environment.development';
import { ResponseResult, Rows } from '../../../app/shared/data-access/interface/response.type';
import {AuthService} from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getAllCategories(): Observable<any> {
    return this.http
      .get<ResponseResult<Rows<CategoryApi.Response[]>>>(`${environment.API_DOMAIN}/category/`)
      .pipe(map((res) => res.responseData));
  }

  searchCategory(name: string = '', page: number, take: number, sortDirection: string): Observable<any> {
    const filter = name ? `name ~ '${name}'` : '';

    let params = new HttpParams()
      .set('page', page.toString())
      .set('take', take.toString())
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get(`${environment.API_DOMAIN}/category/search`, {params});
  }

  deleteCategory(categoryId: string): Observable<ResponseResult<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ResponseResult<any>>(
      `${environment.API_DOMAIN}/category/${categoryId}`,
      {headers}
    );
  }





}
