import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionApi } from '../../../../core/api/production.api';
import { ProductionSuggestionResponse } from '../../../../core/models/production';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef, ViewChild } from '@angular/core'
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-production-suggestion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule,
    MatTableModule
  ],
  templateUrl: './production-suggestion.component.html',
  styleUrl: './production-suggestion.component.scss'
})
export class ProductionSuggestionComponent {
  private api = inject(ProductionApi);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatTable) table?: MatTable<any>; //

  loading = false;
  data: ProductionSuggestionResponse | null = null;
  error = '';

  displayedColumns = ['productId', 'productCode', 'productName', 'unitPrice', 'quantityToProduce', 'totalValue'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.data = null;

    this.api.suggestions().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;

        Promise.resolve().then(() => {
          this.table?.renderRows();
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.error = 'Erro ao buscar sugestão de produção.';
        this.loading = false;
        Promise.resolve().then(() => this.cdr.detectChanges());
      }
    });
  }
}
