import { CartApiService } from '../../Services/cart-api.service';
import { CartStateService } from '../../Services/cart-state.service';
import Swal from 'sweetalert2';
import { ImageApiService } from '../../Services/image-api.service';
import {Component, OnInit} from "@angular/core";
import { ItemApiService } from '../../Services/item-api.service';
import { Item } from '../../entities/Item';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showFiller = false;

  // Store product data for quick access
  products: Item[] = [];

  sliderImages: string[] = [];

  addingToCart = false;
  addCartError: string | null = null;

  constructor(
    private cartApi: CartApiService,
    private cartState: CartStateService,
    private imageApi: ImageApiService,
    private itemApi: ItemApiService
  ) {
    this.imageApi.getImages('car', 3).subscribe(carImages => {
      this.sliderImages = [...carImages];
    });
    this.imageApi.getImages('phone', 3).subscribe(phoneImages => {
      this.sliderImages = [...this.sliderImages, ...phoneImages];
    });
    this.imageApi.getImages('laptop', 3).subscribe(laptopImages => {
      this.sliderImages = [...this.sliderImages, ...laptopImages];
    });
  }

  ngOnInit() {
    this.itemApi.getItems().subscribe({
      next: items => this.products = items,
      error: () => this.products = []
    });
  }

  addToCartQuick(itemId: number) {
    const item = this.products.find(p => p.id === itemId);
    if (!item || item.id === undefined) {
      Swal.fire('Error', 'Item not found or missing ID!', 'error');
      return;
    }
    this.addingToCart = true;
    this.addCartError = null;
    this.cartApi.addToCart(item.id, 1).subscribe({
      next: cart => {
        this.addingToCart = false;
        this.cartState.setItemCount(cart.item_count);
        Swal.fire('Added to Cart', `✓ Added 1x ${item.itemname} to your cart!`, 'success');
      },
      error: err => {
        this.addingToCart = false;
        this.addCartError = 'Failed to add to cart.';
        Swal.fire('Error', 'Failed to add to cart.', 'error');
      }
    });
  }
}
