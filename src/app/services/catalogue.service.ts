import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { productModel } from '../product/product.model';
@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  private CATALOGUE_URL =  "https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json ";
  constructor(private http: HttpClient) { }

  getCatalogue(): Observable<productModel[]>{

    return this.http.get<productModel[]>(this.CATALOGUE_URL);

  }
}
