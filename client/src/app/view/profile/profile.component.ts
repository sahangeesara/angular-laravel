import {Component, OnInit} from '@angular/core';
import {JarwisService} from "../../Services/jarwis.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {System} from "../../entities/system";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { TokenService } from '../../Services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  formData = new FormData();
  file?: any;
  id?: any = null;
  isSystemUser: boolean = false;
  isAdminUser: boolean = false;
  showDetails: boolean = false; // Controls visibility of details/form
  isProfileFilled: boolean = false;
  isEditMode: boolean = false;
  lastProfileData: any = null;

  accountsForm = new FormGroup({
    firstname: new FormControl(
      // "", [Validators.required,]
    ),
    lastname: new FormControl(
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
    this.isSystemUser = this.tokenService.isSystemUser();
    const token = this.tokenService.get();
    if (token) {
      const payload = this.tokenService.payload(token);
      console.log('JWT payload:', payload); // Debug: print payload
      // Admin detection: check for customer_type === 'admin'
      if (payload && payload.customer_type === 'admin') {
        this.isAdminUser = true;
        console.log('isAdminUser set to TRUE (customer_type)');
      } else {
        this.isAdminUser = false;
        console.log('isAdminUser set to FALSE');
      }
    }

    // Get email from JWT
    const payload = this.tokenService.payload(token);
    const email = payload?.email || '';
  }

  private normalizeSystemUserResponse(data: any): any {
    if (Array.isArray(data)) {
      return data[0];
    } else if (data && typeof data === 'object') {
      if (data.system) return data.system;
      if (data.data) return data.data;
      return data;
    }
    return null;
  }

  private mapSystemUser(user: any): any {
    if (!user) return null;
    return {
      firstname: user.firstname || user.first_name || '',
      lastname: user.lastname || user.last_name || '',
      email: user.email || '',
      number: user.number || user.phone || '',
      nic: user.nic || '',
      age: user.age || '',
      address: user.address || '',
    };
  }

  async onViewDetailsClick() {
    this.showDetails = true;
    this.isEditMode = false; // Form is readonly after loading
    console.log('Fetching account details...');

    // 2. Get the token and decode the payload
    const token = this.tokenService.get();
    if (!token) {
      Swal.fire('Error', 'Session expired. Please log in again.', 'error');
      return;
    }

    const payload = this.tokenService.payload(token);
    console.log('Decoded JWT payload:', payload);

    // 3. Extract email (This works because of your getJWTCustomClaims update)
    const email = payload?.email;

    if (!email) {
      // If you still see this alert, you MUST logout and login again to refresh the token
      Swal.fire({
        icon: 'warning',
        title: 'Token Outdated',
        text: 'Email not found in current session. Please log out and log back in to refresh your security token.',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      // 4. Fetch data from Laravel using JarwisService
      // Using toPromise() as in your original snippet, or convert to lastValueFrom(obs) for newer Angular
      const data = await this.Jarvis.getSystemByEmail(email).toPromise();
      console.log('API response:', data);

      // 5. Normalize and Map the data
      const userRaw = this.normalizeSystemUserResponse(data);
      const user = this.mapSystemUser(userRaw);

      if (user && (user.firstname || user.email)) {
        // 6. Fill the form fields safely using patchValue
        this.accountsForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          number: user.number,
          nic: user.nic,
          age: user.age,
          address: user.address
        });

        this.lastProfileData = { ...user }; // Save last loaded profile

        // Store the database ID for updates
        this.id = userRaw.id;
        this.isProfileFilled = true;
        this.isEditMode = false; // Ensure readonly after load

        console.log('Form successfully populated for:', user.email);
      } else {
        // If the email is in JWT but not in the 'systems' table yet
        Swal.fire('Information', 'No profile records found. Please fill in your details and Submit.', 'info');
        this.emailField.setValue(email); // Pre-fill email so they can register
        this.isProfileFilled = false;
        this.isEditMode = true; // Allow editing for new profile
        this.lastProfileData = null;
      }
    } catch (error) {
      console.error('Error fetching system user:', error);
      Swal.fire('Error', 'Failed to retrieve profile data from the server.', 'error');
      this.isProfileFilled = false;
      this.isEditMode = true; // Allow editing if error
      this.lastProfileData = null;
    }
  }

  // Update Method: enable edit mode
  enableEdit() {
    this.isEditMode = true;
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
            this.isProfileFilled = true;
            this.isEditMode = false; // Back to readonly after submit
            this.lastProfileData = { ...this.accountsForm.value }; // Save after submit
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



  }

  navigate(){
    this.router.navigateByUrl('/home');
  }
  clearForm(): void {
    this.ageField.setValue("");
    this.numberField.setValue("");
    this.lastnameField.setValue("");
    this.firstnameField.setValue("");
    this.emailField.setValue("");
    this.addressField.setValue("");
    this.nicField.setValue("");
    this.isEditMode = false; // Back to readonly after clear
  }

  cancelEdit(): void {
    if (this.lastProfileData) {
      this.accountsForm.patchValue(this.lastProfileData);
    }
    this.isEditMode = false;
  }
}
