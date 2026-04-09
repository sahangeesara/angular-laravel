import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../../Services/cart-api.service';
import { CartStateService } from '../../Services/cart-state.service';
import { ImageApiService } from '../../Services/image-api.service';
import { ItemApiService } from '../../Services/item-api.service';
import { Item } from '../../entities/Item';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {
  phones: Item[] = [];
  sliderImages: string[] = [];
  isLoading: boolean = true;

  constructor(
    private cartApi: CartApiService,
    private cartState: CartStateService,
    private imageApi: ImageApiService,
    private itemApi: ItemApiService
  ) {}

  ngOnInit() {
    // Fetch slider images
    this.imageApi.getImages('phone', 8).subscribe({
      next: (images) => this.sliderImages = images,
      error: () => console.warn('Slider images failed to load')
    });

    this.loadPhones();
  }

  loadPhones(): void {
    this.isLoading = true;
    this.itemApi.getItems().subscribe({
      next: (data: any) => {
        // Check if data is actually an array before filtering
        if (data && Array.isArray(data)) {
          this.phones = data.filter(item =>
            item.itemcode && item.itemcode.toUpperCase().startsWith('PH')
          );
        } else {
          // If Laravel sent {"message": "..."}, data is an object, not an array.
          console.error('Backend returned an error object instead of an array:', data);
          this.phones = [];
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
    if (!itemId) {
      Swal.fire('Error', 'Invalid phone ID.', 'error');
      return;
    }

    const item = this.phones.find(p => p.id === itemId);
    if (!item) return;

    this.cartApi.addToCart(itemId, 1).subscribe({
      next: (cart) => {
        this.cartState.setItemCount(cart.item_count);
        Swal.fire({
          title: 'Success!',
          text: `${item.itemname} added to cart`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
      },
      error: () => Swal.fire('Error', 'Failed to add item to cart.', 'error')
    });
  }
}
