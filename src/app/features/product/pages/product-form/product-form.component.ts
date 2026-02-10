import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductApi } from '../../../../core/api/product.api';
import { RawMaterialApi } from '../../../../core/api/raw-material.api';
import { RawMaterialResponse } from '../../../../core/models/raw-material';
import { ProductResponse, ProductRequest } from '../../../../core/models/product';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

type ProductRmVM = {
  rawMaterialId: number;
  rawMaterialName: string;
  quantityRequired: number;
};

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatIconModule, MatButtonModule, MatSnackBarModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productApi = inject(ProductApi);
  private rawApi = inject(RawMaterialApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  id: number | null = null;

  rawMaterialsCatalog: RawMaterialResponse[] = [];

  rawMaterials: ProductRmVM[] = [];
  displayedColumns = ['rawMaterialId', 'rawMaterialName', 'quantityRequired', 'actions'];

  form = this.fb.group({
    code: [null as any, [Validators.required]],
    name: ['', [Validators.required]],
    price: [null as any, [Validators.required, Validators.min(0)]]
  });

  rawMaterialIdCtrl = new FormControl<number | null>(null, { validators: [Validators.required] });
  qtyRequiredCtrl = new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.000001)] });

  ngOnInit() {
    this.rawApi.list(0, 500, 'name,asc').subscribe({
      next: (page) => this.rawMaterialsCatalog = page.content,
      error: () => this.rawMaterialsCatalog = []
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.productApi.getById(this.id).subscribe({
        next: (p: ProductResponse) => {
          this.form.patchValue({ code: p.code, name: p.name, price: p.price });

          this.rawMaterials = (p.rawMaterials ?? []).map(rm => ({
            rawMaterialId: rm.rawMaterialId,
            rawMaterialName: rm.rawMaterialName,
            quantityRequired: rm.quantityRequired
          }));
        }
      });
    }
  }

  addRawMaterial() {
    if (this.rawMaterialIdCtrl.invalid || this.qtyRequiredCtrl.invalid) return;

    const rawMaterialId = this.rawMaterialIdCtrl.value!;
    const quantityRequired = this.qtyRequiredCtrl.value!;

    const rm = this.rawMaterialsCatalog.find(x => x.id === rawMaterialId);
    const name = rm?.name ?? `RM ${rawMaterialId}`;

    const existing = this.rawMaterials.find(i => i.rawMaterialId === rawMaterialId);
    if (existing) {
      existing.quantityRequired = Number(existing.quantityRequired) + Number(quantityRequired);
      this.rawMaterials = [...this.rawMaterials];
    } else {
      this.rawMaterials = [...this.rawMaterials, { rawMaterialId, rawMaterialName: name, quantityRequired }];
    }

    this.rawMaterialIdCtrl.setValue(null);
    this.qtyRequiredCtrl.setValue(null);
  }

  removeRawMaterial(item: ProductRmVM) {
    this.rawMaterials = this.rawMaterials.filter(i => i.rawMaterialId !== item.rawMaterialId);
  }

  save() {
    if (this.form.invalid) return;

    const base = this.form.getRawValue();

    const payload: ProductRequest = {
      code: Number(base.code),
      name: String(base.name),
      price: Number(base.price),
      rawMaterials: this.rawMaterials.map(i => ({
        rawMaterialId: i.rawMaterialId,
        quantityRequired: Number(i.quantityRequired)
      }))
    };

    const request$ = this.id
      ? this.productApi.update(this.id, payload)
      : this.productApi.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(this.id ? 'Produto atualizado' : 'Produto cadastrado', 'OK', { duration: 2500 });
        this.router.navigate(['/product/list']);
      },
      error: () => this.snack.open('Erro ao salvar produto', 'OK', { duration: 2500 })
    });
  }

  cancel() {
    this.router.navigate(['/product/list']);
  }
}
