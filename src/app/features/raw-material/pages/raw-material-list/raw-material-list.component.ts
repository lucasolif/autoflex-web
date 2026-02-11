import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { RawMaterialApi } from '../../../../core/api/raw-material.api';
import { RawMaterialResponse } from '../../../../core/models/raw-material';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import {ProductResponse} from '../../../../core/models/product';

@Component({
  selector: 'app-raw-material-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatSnackBarModule, RouterLink
  ],
  templateUrl: './raw-material-list.component.html',
  styleUrl: './raw-material-list.component.scss'
})
export class RawMaterialListComponent {
  private api = inject(RawMaterialApi);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatTable) table?: MatTable<ProductResponse>;

  searchId = new FormControl<string>('', { nonNullable: true });

  data: RawMaterialResponse[] = [];
  displayedColumns = ['id', 'code', 'name', 'stockQuantity', 'actions'];

  onCearch() {
    const trimmed = this.searchId.value.trim();

    if (!trimmed) {
      this.onLoadPage();
      return;
    }

    const id = Number(trimmed);
    if (Number.isNaN(id)) {
      this.snack.open('Digite um ID numérico válido.', 'OK', {
        duration: 2500,
        verticalPosition: 'top' });
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
        this.snack.open('Nenhum registro encontrado para este ID.', 'OK', {
          duration: 2500,
          verticalPosition: 'top' });
      }
    });
  }

  onClearSearch() {
    this.searchId.setValue('');
    this.onLoadPage();
  }

  onLoadPage() {
    this.api.list(0, 10, 'name,asc').subscribe({
      next: page => this.data = page.content,
      error: () => this.data = []
    });
  }

  goEdit(row: RawMaterialResponse) {
    this.router.navigate(['/raw-material', 'edit', row.id]);
  }

  onCommitFocus() {
    (document.activeElement as HTMLElement | null)?.blur();
  }

  onDelete(row: RawMaterialResponse) {
    if (!confirm(`Excluir matéria-prima ID ${row.id}?`)) return;

    this.api.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Excluído com sucesso','OK', {
          duration: 2500,
          verticalPosition: 'top'
        });
        const currentSearch = this.searchId.value.trim();
        if (currentSearch) this.onClearSearch();
        else this.onLoadPage();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erro ao excluir';
        this.snack.open(msg, 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }
}
