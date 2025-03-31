import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '../interface/response.type';
import { MediaUploadApi } from '../model/media-upload.model';
import { LocalStorage } from '../store';

@Injectable({
  providedIn: 'root',
})
export class MediaUploadService {
  constructor(private _http: HttpClient) {}

  uploadImage(formData: FormData, token: string) {
    let headers = new HttpHeaders();
    
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Authorization', `Bearer ${token}`)
   
    return this._http.post<ResponseResult<MediaUploadApi.Response>>(
        'https://gateway.dev.meu-solutions.com/skh-event/storage/api/v1.0/upload',
        formData,
        {
            headers: headers,
        }
    );
  }
}
