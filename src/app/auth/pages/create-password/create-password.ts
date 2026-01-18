import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiMockService } from '../../../core/services/api-mock.service';

@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-password.html',
  styleUrl: './create-password.scss',
})
export class CreatePassword {
  form: FormGroup;
  loading = false;
  errorMsg: string | null = null;

  get emailField(){return this.form.get('email');}
  get codeField(){return this.form.get('code');}
  get passwordField(){return this.form.get('password');}
  get confirmField(){return this.form.get('confirm');}

  constructor(
    private fb: FormBuilder,
    private api: ApiMockService,
    private router: Router
  ) {
    
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
    });
  }

  submit(): void{
    this.errorMsg = null;

    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const {email, code, password, confirm } = this.form.getRawValue();

    if(password !== confirm) {
      this.errorMsg = 'As senhas não conferem.';
      return;
    }

    this.loading = true;

    this.api.createPassword(email, code, password).subscribe({
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

}
