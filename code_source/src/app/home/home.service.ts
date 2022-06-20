import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Applications, ApiResponse, ApiFilesResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private baseUrl: string = "http://localhost:8081/api";

  constructor(private httpClient: HttpClient) { }

  // GET
  getApps(): Observable<Applications[]> {
    return this.httpClient.get<Applications[]>(this.baseUrl + "/app");
  }

  getAppById(id: string): Observable<Applications> {
    let params = new HttpParams().set("id", id);
    return this.httpClient.get<Applications>(this.baseUrl + "/app", { params: params });
  }
  
  getAppByName(name: string): Observable<Applications> {
    let params = new HttpParams().set("name", name);
    return this.httpClient.get<Applications>(this.baseUrl + "/app", { params: params });
  }

  getAppNameById(id: string): Observable<ApiResponse> {
    let params = new HttpParams().set("id", id);
    return this.httpClient.get<ApiResponse>(this.baseUrl + "/name", { params: params });
  }

  getLogs(id: string): Observable<ApiResponse> {
    let params = new HttpParams().set("id", id);
    return this.httpClient.get<ApiResponse>(this.baseUrl + "/logs", { params: params, reportProgress: true });
  }

  // POST
  upload(id: string, file: File, type: string): Observable<HttpEvent<ApiFilesResponse>> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("id", id);
    formData.append("type", type);

    return this.httpClient.post<ApiFilesResponse>(this.baseUrl + "/upload", formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  create(name: string, ins: string, description: string): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(this.baseUrl + "/create", {
      name: name, ins: ins, description: description, status: "OFF"
    });
  }

  // PUT
  
  edit(id: string, name: string, ins: string, description: string, portFront: number,
    frontEnd: string, portBack: number, backEnd: string): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(this.baseUrl + "/edit", {
      id: id, name: name, ins: ins, description: description, portFront: portFront,
      frontEnd: frontEnd, portBack: portBack, backEnd: backEnd
    });
  }

  on(id: string): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(this.baseUrl + "/on", {
      id: id
    });
  }

  off(id: string): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(this.baseUrl + "/off", {
      id: id
    });
  }

  addFile(id: string, fileName: string, type: string): Observable<ApiFilesResponse> {
    return this.httpClient.put<ApiFilesResponse>(this.baseUrl + "/file", {
      id: id,
      fileName: fileName,
      type: type
    });
  }

  // DELETE

  delete(id: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(this.baseUrl + "/app", { body: { id: id } });
  }

  removeFile(id: string, fileName: string, type: string): Observable<ApiFilesResponse> {
    return this.httpClient.delete<ApiFilesResponse>(this.baseUrl + "/filebdd", {
      body: {
        id: id,
        fileName: fileName,
        type: type
      }
    });
  }

  deleteFile(id: string, fileName: string, type: string): Observable<ApiFilesResponse>{
    return this.httpClient.delete<ApiFilesResponse>(this.baseUrl + "/fileuploaded",{
      body: {
        id: id,
        fileName: fileName,
        type: type
      }
    });
  }
}
