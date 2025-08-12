import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Auth } from '../../../services/auth';
import { AuthForm, AuthField } from '../../shared/auth-form/auth-form';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AuthForm,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(Auth);

  loading = false;

  loginForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loginFields: AuthField[] = [
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
  ];

  onSubmit(value: Record<string, unknown>): void {
    const email = value['email'];
    const password = value['password'];
    if (typeof email !== 'string' || typeof password !== 'string') {
      console.error('Invalid form payload');
      return;
    }
    this.loading = true;
    this._authService.login({ email, password }).subscribe({
      next: (res) => {
        console.log('login success', res);
      },
      error: (err) => {
        console.error('login error', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
