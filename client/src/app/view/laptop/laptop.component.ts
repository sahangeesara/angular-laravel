import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../../Services/cart-api.service';
import { CartStateService } from '../../Services/cart-state.service';
import { ImageApiService } from '../../Services/image-api.service';
import { ItemApiService } from '../../Services/item-api.service';
import { Item } from '../../entities/Item';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.scss']
})
export class LaptopComponent implements OnInit {
  laptops: Item[] = [];

  sliderImages: string[] = [];
  isLoading: boolean = true;


  constructor(
    private cartApi: CartApiService,
    private cartState: CartStateService,
    private imageApi: ImageApiService,
    private itemApi: ItemApiService
  ) {}

  ngOnInit() {
    this.imageApi.getImages('laptop', 8).subscribe(images => {
      this.sliderImages = images;
    });
  this.loadLaptop();
  }
  loadLaptop(): void {
    this.isLoading = true;
    this.itemApi.getItems().subscribe({
      next: (data: any) => {
        // Check if data is actually an array before filtering
        if (data && Array.isArray(data)) {
          this.laptops = data.filter((item: Item) =>
            item.itemcode && item.itemcode.toUpperCase().startsWith('LTP')
          );
        } else {
          // If Laravel sent {"message": "..."}, data is an object, not an array.
          console.error('Backend returned an error object instead of an array:', data);
          this.laptops = [];
          Swal.fire('Error', data.message || 'Server returned invalid data format', 'error');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('HTTP Communication Error:', err);
        this.isLoading = false;
        Swal.fire('Connection Error', 'Check if Laravel is running and migrations are done.', 'error');
      }
    });
  }
  addToCartQuick(itemId: number | undefined) {
    if (typeof itemId !== 'number') {
      Swal.fire('Error', 'Invalid laptop ID.', 'error');
      return;
    }
    const item = this.laptops.find(l => l.id === itemId);
    if (!item) {
      Swal.fire('Error', 'Laptop not found!', 'error');
      return;
    }
    this.cartApi.addToCart(item.id!, 1).subscribe({
      next: cart => {
        this.cartState.setItemCount(cart.item_count);
        Swal.fire('Added to Cart', `✓ Added 1x ${item.itemname} to your cart!`, 'success');
      },
      error: err => {
        Swal.fire('Error', 'Failed to add to cart.', 'error');
      }
    });
  }
}
