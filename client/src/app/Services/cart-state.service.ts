import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private itemCountSubject = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCountSubject.asObservable();

  setItemCount(count: number) {
    this.itemCountSubject.next(count);
  }

  getItemCount(): number {
    return this.itemCountSubject.value;
  }
}

