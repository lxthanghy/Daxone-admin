import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private API_URL = 'http://localhost:5000/api';
  constructor(private readonly http: HttpClient) {}
  getAll() {
    const url = `${this.API_URL}/suppliers`;
    return this.http.get<any>(url);
  }
  addSupplier(supplier: any): Observable<number> {
    const url = `${this.API_URL}/suppliers`;
    var body = JSON.stringify(supplier);
    return this.http.post<any>(url, body, httpOptions);
  }
}
