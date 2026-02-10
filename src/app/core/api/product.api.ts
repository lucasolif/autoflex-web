import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Page } from '../models/page';
import { ProductRequest, ProductResponse } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductApi {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/product`;

  list(page = 0, size = 10, sort = 'name,asc') {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<Page<ProductResponse>>(this.base, { params });
  }

  getById(id: number) {
    return this.http.get<ProductResponse>(`${this.base}/${id}`);
  }

  create(payload: ProductRequest) {
    return this.http.post<ProductResponse>(this.base, payload);
  }

  update(id: number, payload: ProductRequest) {
    return this.http.put<ProductResponse>(`${this.base}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
