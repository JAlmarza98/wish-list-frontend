import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Group, GroupDetail } from '@components/groups/groups.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/groups`;

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl);
  }

  createGroup(name: string): Observable<Group> {
    return this.http.post<Group>(this.baseUrl, { name });
  }

  getGroupInfo(id: string): Observable<GroupDetail> {
    return this.http.get<GroupDetail>(`${this.baseUrl}/${id}`);
  }
}
