import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiMockService } from '../../../core/services/api-mock.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.scss'],
})
export class RecoverPassword implements OnInit, OnDestroy {
  step: 1 | 2 = 1;

  requestForm: FormGroup;
  confirmForm: FormGroup;

  loading = false;
  errorMsg: string | null = null;

  resetId: string | null = null;
  expiresAt = 0;
  resendAt = 0;

  expiresInSec = 0;
  resendInSec = 0;

  expired = false;

  private timer?: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiMockService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.confirmForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private startTimer(): void {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      const now = Date.now();
      this.expiresInSec = this.expiresAt ? Math.max(0, Math.ceil((this.expiresAt - now) / 1000)) : 0;
      this.resendInSec = this.resendAt ? Math.max(0, Math.ceil((this.resendAt - now) / 1000)) : 0;

      if (this.step === 2 && this.expiresAt > 0 && this.expiresInSec === 0) {
        if (!this.expired) {
          this.expired = true;
          this.errorMsg = 'Código expirado. Clique em "Reenviar código" ou "Trocar email".';
        }
      } else {
        this.expired = false;
      }

      this.cdr.detectChanges();
    }, 1000);
  }

  request(): void {
    this.errorMsg = null;

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    const { email } = this.requestForm.getRawValue();
    this.loading = true;

    this.api.requestPasswordReset(email)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res) => {
          this.step = 2;
          this.resetId = res.resetId;
          this.expiresAt = res.expiresAt;
          this.resendAt = res.resendAt;
          this.startTimer();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMsg = err?.message ?? 'Erro inesperado.';
          this.cdr.detectChanges();
        }
      });
  }

  resend(): void {
    if (!this.resetId) return;

    this.errorMsg = null;
    this.loading = true;

    this.api.resendResetCode(this.resetId).subscribe({
      next: (res) => {
        this.loading = false;
        this.resendAt = res.resendAt;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.message ?? 'Erro inesperado.';
      }
    });
  }

  confirm(): void {
    this.errorMsg = null;

    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    if (!this.resetId) {
      this.errorMsg = 'Reset inválido. Solicite novamente.';
      return;
    }

    const { code, password, confirm } = this.confirmForm.getRawValue();

    if (password !== confirm) {
      this.errorMsg = 'As senhas não conferem.';
      return;
    }

    this.loading = true;

    this.api.confirmPasswordReset(this.resetId, code, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.message ?? 'Erro inesperado.';
      }
    });
  }

  backToRequest(): void {
    this.step = 1;
    this.resetId = null;
    this.expiresAt = 0;
    this.resendAt = 0;
    this.confirmForm.reset();
    this.errorMsg = null;
  }

  get emailField() { return this.requestForm.get('email'); }
  get codeField() { return this.confirmForm.get('code'); }
  get passwordField() { return this.confirmForm.get('password'); }
}
