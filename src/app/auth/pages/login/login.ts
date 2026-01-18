import { Component, ChangeDetectorRef } from '@angular/core';
import{Router, RouterModule}  from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ApiMockService } from '../../../core/services/api-mock.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form: FormGroup;
  loading = false;
  errorMsg: string | null=null;

  get emailField(){ return this.form.get('email');}
  get passwordField(){ return this.form.get('password');}
  
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private apiMock: ApiMockService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.apiMock.seedUser('teste@ez.com', '12345678');
  
  }

  submit(): void{
    this.errorMsg = null;

    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const{email, password} = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.message ?? 'Erro inesperado';
        this.cdr.detectChanges();
      }
    });
  }
}
