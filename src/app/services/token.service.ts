import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly _tokenKey = 'accessToken';

  setToken(token: string): void {
    localStorage.setItem(this._tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this._tokenKey);
  }
}
