import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Item} from "../../entities/Item";
import {JarwisService} from "../../Services/jarwis.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogItemComponent} from "../../view/dialog-item/dialog-item.component";
import { TokenService } from '../../Services/token.service';


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']

})
export class PanelComponent  implements OnInit{
  name1: string = "Item";
  displayedColumns: string[] | undefined= [];

  itm:Item[]=[];

  items: any;
  item:any;
  formData = new FormData();
  imageUrl?: string = 'assets/default.png';
  file?: any;
  id?: any = null;
  isSystemUser: boolean = false;
  itemsForm = new FormGroup({
    itemName: new FormControl(
       "", [Validators.required,]
    ),
    itemPrice: new FormControl(
       "", [Validators.required,]
    ),
    itemCode: new FormControl(
      "", [Validators.required,]
    ),
    image: new FormControl(
       "", [Validators.required,]
    ),
  });
  get itemNameField(): FormControl {
    return this.itemsForm.controls.itemName as FormControl;
  }
  get itemPriceField(): FormControl {
    return this.itemsForm.controls.itemPrice as FormControl;
  }
  get itemCodeField(): FormControl {
    return this.itemsForm.controls.itemCode as FormControl;
  }

  get imageField(): FormControl {
    return this.itemsForm.controls.image as FormControl;
  }

  constructor(private Jarvis: JarwisService,
              private dialog: MatDialog,
              private tokenService: TokenService
  ) {
  }
  ngOnInit(): void {
    this.isSystemUser = this.tokenService.isSystemUser();
    this.loadALL();

  }

  async loadALL(): Promise<void>{
    this.displayedColumns =['itemname', 'itemprice', 'itemcode','delete-col', 'update-col'];
    this.items = await this.Jarvis.getItems();

  }
  update() {

  }


  clearForm() {
    this.imageUrl = 'assets/default.png';
    this.itemNameField.setValue("");
    this.itemCodeField.setValue("");
    this.itemPriceField.setValue("");
    // this.imageUrl = 'assets/default.png';
  }

  selectImage(e:any):void{
    this.file = e.target.files ? e.target.files[0] : '';

    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        // console.log(this.imageUrl)
      };
    }

  }



  async onSubmit() {

    this.formData = new FormData();
    if (!this.itemsForm.invalid) {
      try {


        let item = new Item();

        item.itemname = this.itemNameField.value;
        item.itemprice = this.itemPriceField.value;
        item.itemcode = this.itemCodeField.value;

        this.formData.append('image', this.file, this.file.name);
        this.formData.append('form', JSON.stringify(item));



        const dialogRef = this.dialog.open(DialogItemComponent, {
          width: '450px',
          data: {title: 'Save Item', message: 'Are you sure you want to Save this item?', systemData: item}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {

            // @ts-ignore
            let systems = this.Jarvis.saveItem(this.formData);
            this.loadALL();
            this.clearForm();
            // this.navigate();
          } else {
            console.log("No Action")
          }
        });


      } catch (e) {
        console.log(e)
        // @ts-ignore
        this._snackBar.open(e.error.text, '', {duration: 2000, horizontalPosition: "center", verticalPosition: "top"});
      }
    }

  }




 async select(id: number) {

  this.itm= await this.Jarvis.getById(id)
   this.handleResponse(this.itm)
  }

  delete(item:any) {

  }

  handleResponse(data: any) {
    // console.log("data", data[0])
    this.id = data[0].id;
    this.itemNameField.setValue(data[0].itemname);
    this.itemPriceField.setValue(data[0].itemprice);
    this.itemCodeField.setValue(data[0].itemcode);
    this.imageUrl =data[0].image_url
    console.log('image:',this.itm)


    // this.emailField.setValue(data[0].email);
    // this.numberField.setValue(data[0].number);
    // this.ageField.setValue(data[0].age);
    // this.addressField.setValue(data[0].address);
    // this.imageField.setValue(data[0].image);



  }

}
