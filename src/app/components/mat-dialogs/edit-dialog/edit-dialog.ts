import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, of } from 'rxjs';

import { User, Article } from '../../../services/user.service';

interface EditDialogData {
  article?: Partial<Article>;
}

@Component({
  selector: 'app-edit-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-dialog.html',
  styleUrl: './edit-dialog.scss',
})
export class EditDialog {
  private readonly _fb = inject(FormBuilder);
  private readonly _user = inject(User);
  private readonly _ref =
    inject<MatDialogRef<EditDialog, Article | null>>(MatDialogRef);
  private readonly _data =
    inject<EditDialogData | undefined>(MAT_DIALOG_DATA, { optional: true }) ??
    {};

  loading = signal(false);
  error = signal<string | null>(null);
  isCreate = !this._data.article?.id;

  form = this._fb.nonNullable.group({
    title: [
      this._data.article?.title ?? '',
      [Validators.required, Validators.maxLength(120)],
    ],
    content: [this._data.article?.content ?? '', [Validators.required]],
  });

  cancel() {
    this._ref.close(null);
  }

  save() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    const title = this.form.controls.title.value;
    const content = this.form.controls.content.value;

    const request$ = this.isCreate
      ? this._user.createArticle({ title, content })
      : this._user.editArticle({
          ...(this._data.article as Article),
          title,
          content,
        });

    request$
      .pipe(
        catchError((err) => {
          console.error(
            this.isCreate
              ? 'Failed to create article'
              : 'Failed to edit article',
            err,
          );
          this.error.set(
            this.isCreate
              ? 'Failed to create article'
              : 'Failed to save changes',
          );
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        if (res) this._ref.close(res);
      });
  }
}
