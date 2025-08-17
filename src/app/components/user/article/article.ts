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
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { User, Article as ArticleModel } from '../../../services/user.service';
import { ConfirmationDialog } from '../../mat-dialogs/confirmation-dialog/confirmation-dialog';
import { EditDialog } from '../../mat-dialogs/edit-dialog/edit-dialog';

@Component({
  selector: 'app-article',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article {
  private readonly _user = inject(User);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialog = inject(MatDialog);

  loading = signal(true);
  error = signal<string | null>(null);
  article = signal<ArticleModel | null>(null);

  constructor() {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Invalid article id');
      this.loading.set(false);
      return;
    }

    this._user
      .getArticleById(id)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError((err) => {
          console.error('Failed to load article', err);
          this.error.set('Failed to load article');
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((a) => this.article.set(a));
  }

  back() {
    this._router.navigate(['/user', 'articles']).catch(console.error);
  }

  edit() {
    const a = this.article();
    if (!a) return;
    const ref = this._dialog.open(EditDialog, {
      data: { article: a },
      width: '640px',
      disableClose: true,
    });
    ref
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res: ArticleModel | null | undefined) => {
        if (res) this.article.set(res);
      });
  }

  delete() {
    const a = this.article();
    if (!a?.id) return;
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
              this._router.navigate(['/user', 'articles']).catch(console.error);
            }
          });
      });
  }
}
