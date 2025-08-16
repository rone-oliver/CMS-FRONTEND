import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { User, Article } from '../../../services/user';
import { ConfirmationDialog } from '../../mat-dialogs/confirmation-dialog/confirmation-dialog';
import { EditDialog } from '../../mat-dialogs/edit-dialog/edit-dialog';

@Component({
  selector: 'app-articles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class UserArticles {
  private readonly _user = inject(User);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _dialog = inject(MatDialog);

  loading = signal(true);
  error = signal<string | null>(null);
  articles = signal<Article[]>([]);

  constructor() {
    this._user
      .getArticlesOfUser()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError((err) => {
          if (err?.status === 404) {
            this.error.set(null);
            return of([] as Article[]);
          }
          console.error('Failed to load your articles', err);
          this.error.set(err?.error?.message ?? 'Failed to load your articles');
          return of([] as Article[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((arts) => this.articles.set(arts));
  }

  onView(a: Article) {
    this._router.navigate(['/user', 'articles', a.id]).catch(console.error);
  }

  onEdit(a: Article) {
    const ref = this._dialog.open(EditDialog, {
      data: { article: a },
      width: '640px',
      disableClose: true,
    });
    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res: Article | null | undefined) => {
        if (!res) return;
        const updated = this.articles().map((it) =>
          it.id === res.id ? res : it,
        );
        this.articles.set(updated);
      });
  }

  onCreate() {
    const ref = this._dialog.open(EditDialog, {
      width: '640px',
      disableClose: true,
    });
    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res: Article | null | undefined) => {
        if (!res) return;
        this.articles.set([res, ...this.articles()]);
      });
  }

  onDelete(a: Article) {
    const ref = this._dialog.open(ConfirmationDialog, {
      data: {
        title: 'Delete article?',
        message: `Are you sure you want to delete "${a.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
      width: '400px',
      disableClose: true,
    });
    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.loading.set(true);
        this._user
          .deleteArticle(a.id)
          .pipe(
            takeUntilDestroyed(this._destroyRef),
            catchError((err) => {
              console.error('Failed to delete article', err);
              this.error.set('Failed to delete article');
              return of(null);
            }),
            finalize(() => this.loading.set(false)),
          )
          .subscribe((res) => {
            if (res && res.success) {
              this.articles.set(this.articles().filter((it) => it.id !== a.id));
            }
          });
      });
  }
}
