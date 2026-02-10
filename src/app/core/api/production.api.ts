import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProductionSuggestionResponse } from '../models/production';

@Injectable({ providedIn: 'root' })
export class ProductionApi {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/production`;

  suggestions() {
    return this.http.get<ProductionSuggestionResponse>(`${this.base}/suggestions`);
  }
}
