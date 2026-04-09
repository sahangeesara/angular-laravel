import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../../Services/cart-api.service';
import { Cart, CartItem } from '../../entities/Cart';
import { CartStateService } from '../../Services/cart-state.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  error: string | null = null;

  constructor(private cartApi: CartApiService, private cartState: CartStateService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartApi.getCart().subscribe({
      next: cart => {
        this.cart = cart;
        this.cartState.setItemCount(cart.item_count);
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load cart.';
        this.loading = false;
      }
    });
  }

  removeFromCart(itemId: number) {
    this.loading = true;
    this.cartApi.removeCartItem(itemId).subscribe({
      next: cart => {
        this.cart = cart;
        this.cartState.setItemCount(cart.item_count);
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to remove item.';
        this.loading = false;
      }
    });
  }

  clearCart() {
    this.loading = true;
    this.cartApi.clearCart().subscribe({
      next: cart => {
        this.cart = cart;
        this.cartState.setItemCount(cart.item_count);
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to clear cart.';
        this.loading = false;
      }
    });
  }

  getTotal() {
    return this.cart ? this.cart.total_amount : 0;
  }
}
