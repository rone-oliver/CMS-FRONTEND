import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly _articleUrl = `${environment.BACKEND_URL}/articles`;
  private readonly _http = inject(HttpClient);

  getAllArticles() {
    return this._http.get<Article[]>(`${this._articleUrl}`);
  }
}
