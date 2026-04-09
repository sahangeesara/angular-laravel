import {Component, OnInit} from '@angular/core';
import {JarwisService} from "../../Services/jarwis.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {System} from "../../entities/system";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { TokenService } from '../../Services/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  formData = new FormData();
  imageUrl?: string = 'assets/default.png';
  file?: any;
  id?: any = null;
  isSystemUser: boolean = false;

  accountsForm = new FormGroup({
    firstname: new FormControl(
      // "", [Validators.required,]
    ),
    lastname: new FormControl(
      // "", [Validators.required,]
    ),
    image: new FormControl(
      // "", [Validators.required,]
    ),
    age: new FormControl(
      // "", [Validators.required,]
    ),
    number: new FormControl(
      // "", [Validators.required,]
    ),
    address: new FormControl(
      // "", [Validators.required,]
    ),
    nic: new FormControl(
      // "", [Validators.required,]
    ),
    email: new FormControl(
      // "", [Validators.required,]
    ),
  });


  get firstnameField(): FormControl {
    return this.accountsForm.controls.firstname as FormControl;
  }

  get lastnameField(): FormControl {
    return this.accountsForm.controls.lastname as FormControl;
  }


  get imageField(): FormControl {
    return this.accountsForm.controls.image as FormControl;
  }

  get ageField(): FormControl {
    return this.accountsForm.controls.age as FormControl;
  }

  get numberField(): FormControl {
    return this.accountsForm.controls.number as FormControl;
  }


  get addressField(): FormControl {
    return this.accountsForm.controls.address as FormControl;
  }

  get emailField(): FormControl {
    return this.accountsForm.controls.email as FormControl;
  }

  get nicField(): FormControl {
    return this.accountsForm.controls.nic as FormControl;
  }


;

  searchsForm = new FormGroup({
    searchnic: new FormControl(

    ),
  });

  get searchnicField(): FormControl {
    return this.searchsForm.controls.searchnic as FormControl;
  }


  constructor(private Jarvis: JarwisService,
              private router: Router,
              private dialog: MatDialog,
              private tokenService: TokenService
  ) {
  }


  async ngOnInit() {

    const btnUp =  document.getElementById('btnUpdate')  as HTMLInputElement;
    btnUp.disabled  = true;

    const btnDele =  document.getElementById('btnDelete')  as HTMLInputElement;
    btnDele.disabled  = true;

    const btnSub =  document.getElementById('btnSubmit')  as HTMLInputElement;
    btnSub.disabled  = false;

    this.isSystemUser = this.tokenService.isSystemUser();

    // Get email from JWT
    const token = this.tokenService.get();
    let email = '';
    if (token) {
      const payload = this.tokenService.payload(token);
      email = payload?.email || '';
    }
    if (email) {
      // Fetch system user details by email
      try {
        const data = await this.Jarvis.getSystemByEmail(email).toPromise();
        if (data) {
          // Fill the form fields with the fetched data
          this.firstnameField.setValue(data.firstname || '');
          this.lastnameField.setValue(data.lastname || '');
          this.emailField.setValue(data.email || '');
          this.numberField.setValue(data.number || '');
          this.nicField.setValue(data.nic || '');
          this.ageField.setValue(data.age || '');
          this.addressField.setValue(data.address || '');
          this.imageUrl = data.image_url || 'assets/default.png';
        }
      } catch (e) {
        // handle error (e.g., user not found)
      }
    }
  }

  //Data submit method
  async onSubmit() {

    this.formData = new FormData();
    if (!this.accountsForm.invalid) {
      try {


        let system = new System();

        system.firstname = this.firstnameField.value;
        system.lastname = this.lastnameField.value;
        system.email = this.emailField.value;
        system.number = this.numberField.value;
        system.nic = this.nicField.value;
        system.age = this.ageField.value;
        system.address = this.addressField.value;

        this.formData.append('image', this.file, this.file.name);
        this.formData.append('form', JSON.stringify(system));



        const dialogRef = this.dialog.open(DialogComponent, {
          width: '450px',
          data: {title: 'Save Item', message: 'Are you sure you want to Save this item?', systemData: system}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {

            // @ts-ignore
            let systems = this.Jarvis.saveData(this.formData);
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

// update Method
  update() {

    this.formData = new FormData();

    if (!this.accountsForm.invalid) {
      try {


        let system = new System();

        system.id = this.id;
        system.firstname = this.firstnameField.value;
        system.lastname = this.lastnameField.value;
        system.email = this.emailField.value;
        system.number = this.numberField.value;
        system.nic = this.nicField.value;
        system.age = this.ageField.value;
        system.address = this.addressField.value;



        this.formData.append('image', this.file, this.file.name);
        this.formData.append('form', JSON.stringify(system));



        const dialogRef = this.dialog.open(DialogComponent, {
          width: '450px',
          data: {title: 'Update Item', message: 'Are you sure you want to Update this item?', systemData: system}
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {

            // @ts-ignore
            let systems = this.Jarvis.updateData(this.formData);
            this.clearForm();
            this.navigate();
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

  delete() {
    let system = new System();

    // system.id=this.id;
    // this.formData.append('form[id]', system);

    console.log(system.id=this.id);

  }

  search() {

    this.Jarvis.searchData(this.searchnicField.value).subscribe(
      data => this.handleResponse(data),

    );

    const btnSub =  document.getElementById('btnSubmit')  as HTMLInputElement;
    btnSub.disabled  = true;
  }


  handleError(error: { error: { errors: []; }; }) {
    Object.keys(error.error.errors).forEach(key => {
      // @ts-ignore
      this.error[key] = error.error.errors[key];
    });
  }

  handleResponse(data: any) {
    console.log("data", data[0])
    this.id = data[0].id;
    this.firstnameField.setValue(data[0].firstname);
    this.lastnameField.setValue(data[0].lastname);
    this.nicField.setValue(data[0].nic);
    this.emailField.setValue(data[0].email);
    this.numberField.setValue(data[0].number);
    this.ageField.setValue(data[0].age);
    this.addressField.setValue(data[0].address);
    this.imageUrl =data[0].image_url



  }

  navigate(){
    this.router.navigateByUrl('/home');
  }
  clearForm(): void {
    this.imageUrl = 'assets/default.png';
    this.ageField.setValue("");
    this.numberField.setValue("");
    this.lastnameField.setValue("");
    this.firstnameField.setValue("");
    this.emailField.setValue("");
    this.addressField.setValue("");
    this.nicField.setValue("");

  }

  selectImage(e: any): void {
    this.file = e.target.files ? e.target.files[0] : '';
    if (this.file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;

      };
    }

  }



}

