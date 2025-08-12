import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { Token } from './token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly _http = inject(HttpClient);
  private readonly _tokenService = inject(Token);
  private readonly _url = environment.BACKEND_URL;

  login({ email, password }: { email: string; password: string }) {
    return this._http
      .post<{
        accessToken: string;
      }>(
        `${this._url}/auth/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        tap((res: { accessToken: string }) => {
          this._tokenService.setToken(res.accessToken);
        }),
      );
  }

  logout() {
    return this._http
      .delete(`${this._url}/auth/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          this._tokenService.removeToken();
        }),
      );
  }

  register(body: {
    username: string;
    email: string;
    fullname: string;
    password: string;
  }) {
    return this._http.post(`${this._url}/auth/register`, body, {
      withCredentials: true,
    });
  }
}
