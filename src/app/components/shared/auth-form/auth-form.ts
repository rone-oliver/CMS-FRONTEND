import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type AuthFieldKey = 'username' | 'email' | 'fullname' | 'password';
export interface AuthField {
  key: AuthFieldKey;
  label: string;
  type?: 'text' | 'email' | 'password';
}

@Component({
  selector: 'app-auth-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.scss',
})
export class AuthForm {
  form = input.required<FormGroup>();
  fields = input<AuthField[]>([]);
  title = input<string>('');
  submitLabel = input<string>('Submit');
  loading = input<boolean>(false);

  submitted = output<Record<string, unknown>>();

  onSubmit(): void {
    const fg = this.form();
    fg.markAllAsTouched();
    if (fg.valid) {
      this.submitted.emit(fg.value as Record<string, unknown>);
    }
  }
}
