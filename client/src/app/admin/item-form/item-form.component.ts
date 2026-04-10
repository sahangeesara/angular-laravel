import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemApiService } from '../../Services/item-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent {
  itemForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private itemApi: ItemApiService) {
    this.itemForm = this.fb.group({
      itemname: ['', Validators.required],
      itemprice: ['', Validators.required],
      itemcode: ['', Validators.required],
      description: ['']
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onClear() {
    this.itemForm.reset();
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.itemForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('itemname', this.itemForm.value.itemname);
    formData.append('itemprice', this.itemForm.value.itemprice);
    formData.append('itemcode', this.itemForm.value.itemcode);
    formData.append('description', this.itemForm.value.description);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.itemApi.addItem(formData).subscribe({
      next: () => {
        Swal.fire('Success', 'Item added successfully!', 'success');
        this.itemForm.reset();
        this.selectedFile = null;
      },
      error: () => {
        Swal.fire('Error', 'Failed to add item.', 'error');
      }
    });
  }
}
