import { Component, OnInit } from '@angular/core';
import { CartApiService } from '../../Services/cart-api.service';
import { CartStateService } from '../../Services/cart-state.service';
import { ImageApiService } from '../../Services/image-api.service';
import { ItemApiService } from '../../Services/item-api.service';
import { Item } from '../../entities/Item';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})

export class VehicleComponent implements OnInit {
  vehicles: Item[] = [];

  sliderImages: string[] = [];



  constructor(
    private cartApi: CartApiService,
    private cartState: CartStateService,
    private imageApi: ImageApiService,
    private itemApi: ItemApiService
  ) {}

  ngOnInit() {
    this.imageApi.getImages('car', 8).subscribe(images => {
      this.sliderImages = images;
    });
    this.itemApi.getItems().subscribe(items => {
      // Filter for vehicles by itemcode or category if available
      this.vehicles = items.filter(item => item.itemcode && item.itemcode.startsWith('VEH'));
    });
  }

  addToCartQuick(itemId: number | undefined) {
    if (typeof itemId !== 'number') {
      Swal.fire('Error', 'Invalid vehicle ID.', 'error');
      return;
    }
    const item = this.vehicles.find(v => v.id === itemId);
    if (!item) {
      Swal.fire('Error', 'Vehicle not found!', 'error');
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
