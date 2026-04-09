import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {
  private readonly API_KEY = 'YOUR_PEXELS_API_KEY'; // Replace with your Pexels API key
  private readonly BASE_URL = 'https://api.pexels.com/v1/search';

  constructor(private http: HttpClient) {}

  getImages(query: string, perPage: number = 8): Observable<string[]> {
    const headers = new HttpHeaders({
      Authorization: this.API_KEY
    });
    const url = `${this.BASE_URL}?query=${encodeURIComponent(query)}&per_page=${perPage}`;
    return this.http.get<any>(url, { headers }).pipe(
      map(res => res.photos.map((photo: any) => photo.src.landscape))
    );
  }
}

