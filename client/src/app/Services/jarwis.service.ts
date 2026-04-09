import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {System} from "../entities/system";
import {Item} from "../entities/Item";

@Injectable({
  providedIn: 'root'
})
export class JarwisService {
  private besUrl ='http://localhost:8000/api';
  constructor(private http:HttpClient) { }
  signup(data:any){
    return this.http.post(`${this.besUrl}/signup`,data);
  }
  login(data:any){
    return this.http.post(`${this.besUrl}/login`,data);
  }
  sendPasswordResetLink(data:any){
    return this.http.post(`${this.besUrl}/sendPasswordResetLink`,data);
  }
  changePassword(data: any){
    return this.http.post(`${this.besUrl}/resetPassword`,data);

  }
 async saveData(data: any){
    console.log(data.get('image'),"get")
    return this.http.post<System[]>(`${this.besUrl}/save`,data).toPromise();

  }
  async saveItem(data: any){
    console.log(data.get('image'),"get")
    return this.http.post<System[]>(`${this.besUrl}/saveItem`,data).toPromise();

  }
  async updateData(data: any){
    console.log(data);
    return this.http.post<System[]>(`${this.besUrl}/update`,data).toPromise();

  }

  searchData(data:any){
    return this.http.get(`${this.besUrl}/search?nic=`+data);

  }
  async getItems(){
    // console.log('it:',items);
    return this.http.get<Item[]>(`${this.besUrl}/items`) ;

  }

  async getById(data:any):Promise<Item[]>{
    // console.log('it:',items);
    // @ts-ignore
    return  this.http.get<Item[]>(`${this.besUrl}/item?id=`+ data).toPromise() ;

  }

  deleteData(data: any){
    return this.http.delete(`${this.besUrl}/delete`,data);
  }
  // For image preview to work with existing images, the backend should return a full image URL (e.g., http://localhost:8000/storage/...) in the 'image_url' property.
  getSystemByEmail(email: string) {
    return this.http.get<any>(`http://localhost:8000/api/system/by-email/${email}`);
  }
  // getData(data: any){
  //   return this.http.get(`${this.besUrl}/details`,data);
  //
  // }
}
