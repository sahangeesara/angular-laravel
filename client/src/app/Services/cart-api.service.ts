import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../entities/Cart';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private apiUrl = '/api/cart'; // Adjust if your API prefix is different

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}`);
  }

  addToCart(item_id: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, { item_id, quantity });
  }

  updateCartItem(item_id: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${item_id}`, { quantity });
  }

  removeCartItem(item_id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${item_id}`);
  }

  clearCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/clear`, {});
  }
}

