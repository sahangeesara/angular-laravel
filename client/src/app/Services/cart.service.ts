import { Injectable } from '@angular/core';
import { Item } from '../entities/Item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: { item: Item, quantity: number }[] = [];

  getCart() {
    return this.items;
  }

  addToCart(item: Item, quantity: number = 1) {
    const found = this.items.find(i => i.item.id === item.id);
    if (found) {
      found.quantity += quantity;
    } else {
      this.items.push({ item, quantity });
    }
  }

  removeFromCart(itemId: number) {
    this.items = this.items.filter(i => i.item.id !== itemId);
  }

  clearCart() {
    this.items = [];
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + (Number(i.item.itemprice) * i.quantity), 0);
  }
}

