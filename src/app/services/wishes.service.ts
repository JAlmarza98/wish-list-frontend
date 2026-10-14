import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../core/runtime-config';
import { map, Observable } from 'rxjs';
import { Wish } from '@components/list/list.component';
import { mapWish } from './wish-mapper';

@Injectable({
  providedIn: 'root'
})
export class WishesService {
  private http = inject(HttpClient);
  private baseUrl = `${apiUrl()}/wishes`;

  update(id: string, wish: { title: string; description?: string; url?: string }): Observable<Wish> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, wish).pipe(map(mapWish));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reserve(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reserve`, {});
  }

  unreserve(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/reserve`);
  }

  uploadImage(id: string, image: File): Observable<Wish> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<any>(`${this.baseUrl}/${id}/image`, formData).pipe(map(mapWish));
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/image`);
  }
}
