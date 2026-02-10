import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink  } from '@angular/router';
import { ProductApi } from '../../../../core/api/product.api';
import { ProductResponse } from '../../../../core/models/product';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatSnackBarModule, RouterLink
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private api = inject(ProductApi);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatTable) table?: MatTable<ProductResponse>;

  searchId = new FormControl<string>('', { nonNullable: true });

  data: ProductResponse[] = [];
  displayedColumns = ['id','code','name','price','actions'];

  search() {
    const trimmed = this.searchId.value.trim();

    if (!trimmed) {
      this.loadPage();
      return;
    }

    const id = Number(trimmed);
    if (Number.isNaN(id)) {
      this.snack.open('Digite um ID numérico válido.', 'OK', { duration: 2500 });
      return;
    }

    this.api.getById(id).subscribe({
      next: (item) => {
        this.data = [item];
        this.table?.renderRows();
        this.cdr.detectChanges();
      },
      error: () => {
        this.data = [];
        this.table?.renderRows();
        this.cdr.detectChanges();
        this.snack.open('Nenhum registro encontrado para este ID.', 'OK', { duration: 2500 });
      }
    });
  }

  clearSearch() {
    this.searchId.setValue('');
    this.loadPage();
  }

  loadPage() {
    this.api.list(0, 10, 'name,asc').subscribe({
      next: page => this.data = page.content,
      error: () => this.data = []
    });
  }

  goEdit(row: ProductResponse) {
    this.router.navigate(['/product', 'edit', row.id]);
  }

  delete(row: ProductResponse) {
    if (!confirm(`Excluir produto ID ${row.id}?`)) return;

    this.api.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Excluído com sucesso', 'OK', { duration: 2500 });
        const currentSearch = this.searchId.value.trim();
        if (currentSearch) this.clearSearch();
        else this.loadPage();
      },
      error: () => this.snack.open('Erro ao excluir', 'OK', { duration: 2500 })
    });
  }
}
