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

  getBookById(id: string): Observable<Book> {
    let params = new HttpParams().set("id", id);
    return this.httpClient.get<Book>(this.baseUrl + "/book", { params: params });
  }

  getBookByName(name: string): Observable<Book> {
    let params = new HttpParams().set("name", name);
    return this.httpClient.get<Book>(this.baseUrl + "/book", { params: params });
  }

  getContent(id: string): Observable<any> {
    let params = new HttpParams().set("id", id);
    return this.httpClient.get<any>(this.baseUrl + "/content", { params: params });
  }
  // POST

  create(name: string, auteur: string, description: string, livre: File, couverture: File | null): Observable<ApiResponse> {

    const formData = new FormData();

    formData.append("name", name);
    formData.append("auteur", auteur);
    formData.append("description", description);
    formData.append("livre", livre);
    if (couverture === null)
      formData.append("image", "non");
    else {
      formData.append("image", "oui");
      formData.append("couverture", couverture)
    }

    return this.httpClient.post<ApiResponse>(this.baseUrl + "/create", formData);
  }

  // PUT

  updateReadIndex(id: string, pageIndex: number, motIndex: number) {
    console.log("test");

    return this.httpClient.put(this.baseUrl + "/readindex", {
      id: id, motIndex: motIndex, pageIndex: pageIndex
    });
  }

  // DELETE

}
