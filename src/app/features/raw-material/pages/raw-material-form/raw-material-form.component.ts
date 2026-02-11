import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RawMaterialApi } from '../../../../core/api/raw-material.api';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-raw-material-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSnackBarModule
  ],
  templateUrl: './raw-material-form.component.html',
  styleUrl: './raw-material-form.component.scss'
})
export class RawMaterialFormComponent {

  private fb = inject(NonNullableFormBuilder);
  private api = inject(RawMaterialApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  id: number | null = null;

  form = this.fb.group({
    code: [0, [Validators.required]],
    name: ['', [Validators.required]],
    stockQuantity: [0, [Validators.required]]
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);
      if (!Number.isNaN(id)) {
        this.id = id;

        this.api.getById(id).subscribe({
          next: (item) => {
            this.form.patchValue({
              code: item.code,
              name: item.name,
              stockQuantity: item.stockQuantity,
            });
          },
          error: () => {
            this.snack.open('Matéria-prima não encontrada.', 'OK', {
              duration: 2500,
              verticalPosition: 'top'
            });
            this.router.navigate(['/raw-material/list']);
          }
        });
      }
    }
  }

  onSave() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();

    const request$ = this.id
      ? this.api.update(this.id, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(
          this.id ? 'Atualizado com sucesso' : 'Cadastrado com sucesso',
          'OK', {
            duration: 2500,
            verticalPosition: 'top'
          }
        );
        this.router.navigate(['/raw-material/list']);
      },
      error: (err) => {
        const msg = err?.error?.message || (this.id ? 'Erro ao aturalizar matéria-prima' : 'Erro ao salvar matéria-prima');
        this.snack.open(msg, 'OK', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/raw-material/list']);
  }
}
