import { CommonModule } from '@angular/common';
import { Component,NgZone, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private zone = inject(NgZone);

  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    const payload = this.form.getRawValue();

    this.auth.login(payload as any).subscribe({
      next: (response) => {
        this.loading = false;
        this.auth.setToken(response.accessToken);

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const target = returnUrl && returnUrl !== '/login' ? returnUrl : '/raw-material/list';

        this.router.navigateByUrl(target);
      },
      error: () => {
        this.loading = false;
        this.error = 'Usuário ou senha inválidos.';
      },
    });
  }
}
