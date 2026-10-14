import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { map, Observable } from 'rxjs';
import { Wish, Wishlist } from '@components/list/list.component';
import { mapWish } from './wish-mapper';

export interface WishlistShare {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/wishlists`;

  getMyWishlists(): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(this.baseUrl);
  }

  createWishlist(name: string): Observable<Wishlist> {
    return this.http.post<Wishlist>(this.baseUrl, { name });
  }

  renameWishlist(id: string, name: string): Observable<Wishlist> {
    return this.http.patch<Wishlist>(`${this.baseUrl}/${id}`, { name });
  }

  deleteWishlist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getWishes(wishlistId: string): Observable<Wish[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${wishlistId}/wishes`)
      .pipe(map((rows) => rows.map(mapWish)));
  }

  addWish(wishlistId: string, wish: { title: string; description?: string; url?: string }): Observable<Wish> {
    return this.http.post<any>(`${this.baseUrl}/${wishlistId}/wishes`, wish).pipe(map(mapWish));
  }

  getShares(wishlistId: string): Observable<WishlistShare[]> {
    return this.http.get<WishlistShare[]>(`${this.baseUrl}/${wishlistId}/shares`);
  }

  share(wishlistId: string, groupId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${wishlistId}/share`, { groupId });
  }

  unshare(wishlistId: string, groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${wishlistId}/share/${groupId}`);
  }
}
