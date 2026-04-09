import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../entities/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService {
  // 1. You MUST add http:// at the start
  private readonly baseUrl = 'http://127.0.0.1:8000'; // Laravel default is 8000, yours might be 8080
  private readonly apiUrl = `${this.baseUrl}/api`;

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items`);
  }

  addItem(item: FormData): Observable<Item> {
    // 2. Use the full URL here too
      return this.http.post<Item>(`${this.apiUrl}/items`, item);
  }

  getItemById(id: number): Observable<Item> {
    // 3. Match your Laravel route (e.g., /api/items/5 or /api/items?id=5)
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${id}`);
  }
}
