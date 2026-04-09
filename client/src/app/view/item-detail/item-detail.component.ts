import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../Services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  quantity: number = 1;
  itemId: string = '';

  // Sample product data (in real app, fetch from service)
  product: any = {
    id: '1',
    name: 'Iphone 13',
    price: 253950,
    image: 'assets/phone/I13.jpeg',
    category: 'phone',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: 'Latest generation iPhone with A15 Bionic chip, stunning Super Retina XS display, and advanced dual camera system.',
    specs: [
      { label: 'Storage', value: '128GB' },
      { label: 'Display', value: '6.1" OLED' },
      { label: 'Camera', value: '12MP + 12MP' },
      { label: 'Battery', value: 'Up to 19 hours' }
    ],
    colors: ['Blue', 'Black', 'White', 'Gold'],
    warranty: '1 Year Apple Care'
  };

  constructor(private route: ActivatedRoute, private location: Location, private cartService: CartService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemId = params['id'];
      // In real app: fetch product details by ID from service
    });
  }

  addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
    Swal.fire('Added to Cart', `✓ Added ${this.quantity}x ${this.product.name} to your cart!`, 'success');
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  goBack() {
    this.location.back();
  }
}
