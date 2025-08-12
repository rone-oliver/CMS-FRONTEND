import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Auth } from '../../../services/auth';
import { AuthForm, AuthField } from '../../shared/auth-form/auth-form';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, AuthForm],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss'],
})
export class Registration {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(Auth);

  loading = false;

  registrationForm: FormGroup = this._fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    fullname: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  registrationFields: AuthField[] = [
    { key: 'username', label: 'Username', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'fullname', label: 'Full name', type: 'text' },
    { key: 'password', label: 'Password', type: 'password' },
  ];

  onSubmit(value: Record<string, unknown>): void {
    const username = value['username'];
    const email = value['email'];
    const fullname = value['fullname'];
    const password = value['password'];
    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof fullname !== 'string' ||
      typeof password !== 'string'
    ) {
      console.error('Invalid form payload');
      return;
    }
    this.loading = true;
    this._authService
      .register({ username, email, fullname, password })
      .subscribe({
        next: (res) => {
          console.log('registration success', res);
        },
        error: (err) => {
          console.error('registration error', err);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
