import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { productModel } from '../product/product.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() deleteItemEmitter:EventEmitter<number> = new EventEmitter<number>();
  @Input() item: productModel = {
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

  changeQuantity(){
    console.log('change');
  }
  deleteItem(id:number){
    this.deleteItemEmitter.emit(id);
  }
}
