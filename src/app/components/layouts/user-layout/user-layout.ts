import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from '../../../services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss'
})
export class UserLayout {
  private readonly _auth = inject(Auth);
  private readonly _router = inject(Router);

  logout() {
    this._auth.logout().subscribe({
      next:()=>{
        console.log('logout success');
        this._router.navigate(['/login']);
      },
      error:(err)=>{
        console.error('logout error', err);
        this._router.navigate(['/login']);
      }
    });
  }

  dashboard() {
    this._router.navigate(['/user/dashboard']);
  }

  articles() {
    this._router.navigate(['/user/articles']);
  }
}
