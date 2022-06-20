import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, ApiResponse, ApiFilesResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private baseUrl: string = "http://localhost:8081/api";

  constructor(private httpClient: HttpClient) { }

  // GET

  getBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.baseUrl + "/book");
  }

  getBookByName(name: string): Observable<Book> {
    let params = new HttpParams().set("name", name);
    return this.httpClient.get<Book>(this.baseUrl + "/book", { params: params });
  }

  // POST

  create(name: string, auteur: string, description: string, contenu: string): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + "/create", {
      name: name, auteur: auteur, description: description, contenu: contenu
    });
  }

  // PUT

  // DELETE

}
