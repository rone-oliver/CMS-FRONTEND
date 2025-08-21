import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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

import { User, Article } from '../../../services/user.service';

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
  animations: [
    trigger('articleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
    ]),
    trigger('contentExpansion', [
      state('collapsed', style({ height: '100px', overflow: 'hidden' })),
      state('expanded', style({ height: '*', overflow: 'auto' })),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
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
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
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
