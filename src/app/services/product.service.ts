import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL = 'http://localhost:5000/api/products';
  constructor(private readonly http: HttpClient) {}
  pagination(data: any): Observable<any> {
    const url = `${this.API_URL}/pagination`;
    var body = JSON.stringify(data);
    return this.http.post<any>(url, body, httpOptions);
  }
  addProduct(product: any): Observable<number> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(product);
    return this.http.post<any>(url, body, httpOptions);
  }
  getEdit(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}/edit`;
    return this.http.get<any>(url);
  }
  getDetail(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}/detail`;
    return this.http.get<any>(url);
  }
  getDataSelectSupplier(): Observable<any> {
    const url = `${this.API_URL}/data-select-supplier`;
    return this.http.get<any>(url);
  }
  getDataSelectProductCategory(): Observable<any> {
    const url = `${this.API_URL}/data-select-product-category`;
    return this.http.get<any>(url);
  }
  updateProduct(id: any, product: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(product);
    return this.http.put<any>(url, body, httpOptions);
  }
  deleteProduct(id: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
