import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, finalize, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { User, Article } from '../../../services/user';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _user = inject(User);
  private readonly _destroyRef = inject(DestroyRef);

  loading = signal(true);
  error = signal<string | null>(null);
  articles = signal<Article[]>([]);

  constructor() {
    this._user
      .getAllArticles()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError((err) => {
          console.error('Failed to load articles', err);
          this.error.set('Failed to load articles.');
          return of<Article[]>([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((arts) => this.articles.set(arts));
  }
}