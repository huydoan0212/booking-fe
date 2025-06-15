import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoryApi } from '../model/category.model';
import { environment } from '../../../environments/environment.development';
import { ResponseResult, Rows } from '../../../app/shared/data-access/interface/response.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this.http
      .get<ResponseResult<Rows<CategoryApi.Response[]>>>(`${environment.API_DOMAIN}/category/`)
      .pipe(map((res) => res.responseData));
  }
}
