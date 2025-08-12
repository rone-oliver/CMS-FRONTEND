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

  getArticlesOfUser() {
    return this._http.get<Article[]>(`${this._articleUrl}/me`);
  }

  getArticleById(id: string) {
    return this._http.get<Article>(`${this._articleUrl}/${id}`);
  }

  editArticle(article: Article) {
    return this._http.patch<Article>(`${this._articleUrl}/${article.id}`, {
      title: article.title,
      content: article.content,
    });
  }

  deleteArticle(id: string) {
    return this._http.delete<{success: boolean}>(`${this._articleUrl}/${id}`);
  }

  createArticle(article: Omit<Article, 'id' | 'createdAt'>) {
    return this._http.post<Article>(`${this._articleUrl}`, article);
  }
}
