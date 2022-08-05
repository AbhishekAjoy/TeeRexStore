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

  imgHeight: string = "212";
  
  ngOnInit(): void {
  }

  checkQuantity(product: productModel){

    if(product.quantity){
      console.log(product.name);
      this.productIdEmitter.emit(product.id);
    }
    else{
      console.log('Product Stock empty');
    }
  }
}
