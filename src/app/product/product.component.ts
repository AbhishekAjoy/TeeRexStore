import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { productModel } from './product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  @Output() productIdEmitter:EventEmitter<number> = new EventEmitter<number>()
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
  inStock: boolean = true;
  imgHeight: string = "212";
  
  ngOnInit(): void {
  }

  checkQuantity(product: productModel){

    console.log(product.quantity);
    if(product.quantity){
      console.log(product.name);
      this.productIdEmitter.emit(product.id);
    }
    else{
      this.inStock = false;
      console.log('Product Stock empty');
    }
  }
}
