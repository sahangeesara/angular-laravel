import { Component, OnInit } from '@angular/core';
import { ItemApiService } from '../../Services/item-api.service';
import { Item } from '../../entities/Item';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss']
})
export class ItemTableComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error: string | null = null;

  constructor(private itemApi: ItemApiService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.itemApi.getItems().subscribe({
      next: items => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load items.';
        this.loading = false;
      }
    });
  }

  editItem(item: Item) {
    // TODO: Implement edit logic (e.g., open dialog or emit event)
    alert('Edit feature coming soon!');
  }

  deleteItem(item: Item) {
    if (item.id != null) {
      if (confirm(`Are you sure you want to delete item "${item.itemname}"?`)) {
        this.itemApi.deleteItem(item.id).subscribe({
          next: () => {
            this.items = this.items.filter(i => i.id !== item.id);
          },
          error: () => {
            alert('Failed to delete item.');
          }
        });
      }
    } else {
      alert('Invalid item ID.');
    }
  }
}
