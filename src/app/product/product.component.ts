import { Component, Input, OnInit } from '@angular/core';
import { productModel } from './product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  @Input() product: productModel = {
    "id": 0,
    "imageURL" :"",
    "name" :"",
    "type" :"",
    "price": 0,
    "currency": "",
    "color":  "",
    "gender" : "",
    "quantity" : 0,
  } 

  imgHeight: string = "212";
  
  ngOnInit(): void {
  }

}
