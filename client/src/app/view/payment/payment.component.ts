import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  // Add cart and total for display
  cartItems: { item: any, quantity: number }[] = [];
  subtotal: number = 0;
  shipping: number = 15000;
  grandTotal: number = 0;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCart();
    this.subtotal = this.cartService.getTotal();
    this.grandTotal = this.subtotal + this.shipping;
  }

  payNow() {
    // Placeholder: In real app, integrate payment gateway here
    alert('Payment successful! Thank you for your purchase.');
    this.cartService.clearCart();
    this.cartItems = [];
    this.subtotal = 0;
    this.grandTotal = 0;
  }
}
