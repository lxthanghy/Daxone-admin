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
  private API_URL = 'http://localhost:5000/api/suppliers';
  constructor(private readonly http: HttpClient) {}
  getAll() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }
  addSupplier(supplier: any): Observable<number> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(supplier);
    return this.http.post<any>(url, body, httpOptions);
  }
  getSupplier(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  updateSupplier(id: any, supplier: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(supplier);
    return this.http.put<any>(url, body, httpOptions);
  }
  deleteSupplier(id: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
