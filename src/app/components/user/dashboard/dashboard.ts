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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, of } from 'rxjs';

import { User, Article } from '../../../services/user';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _user = inject(User);
  private readonly _destroyRef = inject(DestroyRef);

  loading = signal(true);
  error = signal<string | null>(null);
  articles = signal<Article[]>([]);

  expanded = signal<ReadonlySet<string>>(new Set());

  isExpanded(id: string): boolean {
    return this.expanded().has(id);
  }

  toggleExpanded(id: string): void {
    const next = new Set(this.expanded());
    next.has(id) ? next.delete(id) : next.add(id);
    this.expanded.set(next);
  }

  constructor() {
    this._user
      .getAllArticles()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError((err) => {
          console.error('Failed to load articles', err);
          this.error.set(err.error.message || 'Failed to load articles.');
          return of<Article[]>([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((arts) => this.articles.set(arts));
  }
}
