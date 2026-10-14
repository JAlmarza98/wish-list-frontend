import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../core/runtime-config';
import { Observable } from 'rxjs';

export interface Invite {
  token: string;
  url: string;
}

export interface InvitePreview {
  groupId: string;
  groupName: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvitesService {
  private http = inject(HttpClient);
  private baseUrl = `${apiUrl()}/invites`;

  createInvite(groupId: string): Observable<Invite> {
    return this.http.post<Invite>(this.baseUrl, { groupId });
  }

  previewInvite(token: string): Observable<InvitePreview> {
    return this.http.get<InvitePreview>(`${this.baseUrl}/${token}`);
  }

  acceptInvite(token: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${token}/accept`, {});
  }
}
