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

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.api.getById(this.id).subscribe({
        next: (rm) => this.form.patchValue({
          code: rm.code ?? 0,
          name: rm.name ?? '',
          stockQuantity: rm.stockQuantity ?? 0
        })
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();

    const request$ = this.id
      ? this.api.update(this.id, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(
          this.id ? 'Atualizado com sucesso' : 'Cadastrado com sucesso',
          'OK',
          { duration: 2500 }
        );
        this.router.navigate(['/raw-material/list']);
      },
      error: () => this.snack.open('Erro ao salvar', 'OK', { duration: 2500 })
    });
  }

  cancel() {
    this.router.navigate(['/raw-material/list']);
  }
}
