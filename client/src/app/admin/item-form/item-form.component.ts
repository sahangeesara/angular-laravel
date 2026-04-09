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
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private itemApi: ItemApiService) {
    this.itemForm = this.fb.group({
      itemname: ['', Validators.required],
      itemprice: ['', Validators.required],
      itemcode: ['', Validators.required],
      description: [''],
      image: [null]
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
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
    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }
    this.itemApi.addItem(formData).subscribe({
      next: () => {
        Swal.fire('Success', 'Item added successfully!', 'success');
        this.itemForm.reset();
        this.imageFile = null;
      },
      error: () => {
        Swal.fire('Error', 'Failed to add item.', 'error');
      }
    });
  }
}

