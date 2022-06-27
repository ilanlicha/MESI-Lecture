import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, ApiResponse, ApiFilesResponse, Content } from './interfaces';

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

  getContent(name: string): Observable<ApiResponse> {
    let params = new HttpParams().set("name", name);
    return this.httpClient.get<ApiResponse>(this.baseUrl + "/content", { params: params });
  }
  // POST

  create(name: string, auteur: string, description: string, contenu: string, couverture: File | null): Observable<ApiResponse> {

    const formData = new FormData();

    formData.append("name", name);
    formData.append("auteur", auteur);
    formData.append("description", description);
    formData.append("contenu", contenu);
    if (couverture === null)
      formData.append("image", "non");
    else {
      formData.append("image", "oui");
      formData.append("couverture", couverture)
    }

    return this.httpClient.post<ApiResponse>(this.baseUrl + "/create", formData);


    // return this.httpClient.post<ApiResponse>(this.baseUrl + "/create", {
    //   name: name, auteur: auteur, description: description, contenu: contenu, couverture: couverture
    // });
  }

  // PUT

  // DELETE

}
