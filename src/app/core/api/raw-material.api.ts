import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Page } from '../models/page';
import { RawMaterialRequest, RawMaterialResponse } from '../models/raw-material';

@Injectable({ providedIn: 'root' })
export class RawMaterialApi {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/raw-material`;

  list(page = 0, size = 10, sort = 'name,asc') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<Page<RawMaterialResponse>>(this.base, { params });
  }

  getById(id: number) {
    return this.http.get<RawMaterialResponse>(`${this.base}/${id}`);
  }

  create(payload: RawMaterialRequest) {
    return this.http.post<RawMaterialResponse>(this.base, payload);
  }

  update(id: number, payload: RawMaterialRequest) {
    return this.http.put<RawMaterialResponse>(`${this.base}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
