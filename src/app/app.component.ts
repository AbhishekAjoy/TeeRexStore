import { Component, createPlatform } from '@angular/core';
import { CatalogueService } from './services/catalogue.service';
import { productModel } from './product/product.model';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TeeRex Store';
  isProductPage: boolean = true;
  products: productModel[] = [];
  filteredProducts: productModel[] = [];
  cart:productModel[] = [];
  colors: string[] = [];
  genders: string[] = [];
  prices: number[] = [];
  types: string[] = [];
  minVal: number | null = null;
  maxVal: number | null = null;
  isFilterClicked: boolean = false;
  searchTerm: string | null = null;
  cartTotal:number = 0;
  myForm: FormGroup;

  constructor(
    private catalogueService: CatalogueService,
    private fb: FormBuilder
  ) {
    this.getProducts();

    this.myForm = this.fb.group({
      colors: this.fb.array([]),
      genders: this.fb.array([]),
      minPrice: this.fb.control(null),
      maxPrice: this.fb.control(null),
      types: this.fb.array([]),
    });
  }

  onChangeColor(color: string, e: EventTarget | null) {
    const colorFormArray = <FormArray>this.myForm.controls['colors'];

    const target = e as HTMLInputElement;
    if (target.checked) {
      colorFormArray.push(new FormControl(color));
    } else {
      let index = colorFormArray.controls.findIndex((x) => x.value == color);
      colorFormArray.removeAt(index);
    }
    this.applyFilters();
  }

  onChangeType(type: string, e: EventTarget | null) {
    const typeFormArray = <FormArray>this.myForm.controls['types'];

    const target = e as HTMLInputElement;
    if (target.checked) {
      typeFormArray.push(new FormControl(type));
    } else {
      let index = typeFormArray.controls.findIndex((x) => x.value == type);
      typeFormArray.removeAt(index);
    }
    this.applyFilters();
  }

  onChangeGender(gender: string, e: EventTarget | null) {
    const genderFormArray = <FormArray>this.myForm.controls['genders'];

    const target = e as HTMLInputElement;
    if (target.checked) {
      genderFormArray.push(new FormControl(gender));
    } else {
      let index = genderFormArray.controls.findIndex((x) => x.value == gender);
      genderFormArray.removeAt(index);
    }
    this.applyFilters();
  }

  onChangePrice() {
    const minPrice = <FormControl>this.myForm.controls['minPrice'];
    const maxPrice = <FormControl>this.myForm.controls['maxPrice'];

    if (this.minVal && this.maxVal && this.minVal > this.maxVal) {
      this.minVal = null;
      this.maxVal = null;
    }
    if (this.minVal) {
      minPrice.setValue(this.minVal);
    }
    if (this.maxVal) {
      maxPrice.setValue(this.maxVal);
    }

    this.applyFilters();
  }

  applyFilters(search?: string) {
    this.filteredProducts = this.products
      .filter((e) => {
        if (this.myForm.value.colors.length === 0) {
          return e;
        }
        return this.myForm.value.colors.includes(e.color);
      })
      .filter((e) => {
        if (this.myForm.value.types.length === 0) {
          return e;
        }
        return this.myForm.value.types.includes(e.type);
      })
      .filter((e) => {
        if (this.myForm.value.genders.length === 0) {
          return e;
        }
        return this.myForm.value.genders.includes(e.gender);
      })
      .filter((e) => {
        if (this.myForm.value.minPrice == null) {
          return e;
        }
        return e.price >= this.myForm.value.minPrice;
      })
      .filter((e) => {
        if (this.myForm.value.maxPrice == null) {
          return e;
        }
        return e.price <= this.myForm.value.maxPrice;
      });
  }
  getProducts() {
    this.catalogueService.getCatalogue().subscribe((data) => {
      this.products = data;
      this.getFilterOptions();
      this.filteredProducts = this.products;
    });
  }

  openFilters() {
    let filterCard = document.getElementsByClassName(
      'filterCard'
    )[0] as HTMLElement;
    if (this.isFilterClicked) {
      filterCard.style.display = 'none';
      this.isFilterClicked = false;
    } else {
      filterCard.style.display = 'block';
      this.isFilterClicked = true;
    }
  }

  searchProduct() {
    if (this.searchTerm) {
      this.applyFilters();
      let keywords = this.searchTerm.toLowerCase().split(' ');
      if (keywords.length === 0) {
        return;
      }

      let genderKey: string[] = [];
      let typeKey: string[] = [];
      let colorKey: string[] = [];
      for (const i of this.genders) {
        if (keywords.includes(i.toLowerCase())) {
          genderKey.push(i.toLowerCase());
        }
      }
      for (const j of this.types) {
        if (keywords.includes(j.toLowerCase())) {
          typeKey.push(j.toLowerCase());
        }
      }
      for (const k of this.colors) {
        if (keywords.includes(k.toLowerCase())) {
          colorKey.push(k.toLowerCase());
        }
      }

      this.filteredProducts = this.filteredProducts
        .filter((e) => {
          if (colorKey.length) {
            return colorKey.includes(e.color.toLowerCase());
          } else {
            return e;
          }
        })
        .filter((e) => {
          if (typeKey.length) {
            return typeKey.includes(e.type.toLowerCase());
          } else {
            return e;
          }
        })
        .filter((e) => {
          if (genderKey.length) {
            return genderKey.includes(e.gender.toLowerCase());
          } else {
            return e;
          }
        });
    }
  }

  addToCart(productId: number){
    let productIndex = this.products.findIndex((prod => prod.id == productId));
    this.products[productIndex].quantity -= 1;
    let newItem:productModel  = {
      "id": this.products[productIndex].id,
      "imageURL" :this.products[productIndex].imageURL,
      "name" :this.products[productIndex].name,
      "type" :this.products[productIndex].type,
      "price": this.products[productIndex].price,
      "currency": this.products[productIndex].currency,
      "color":  this.products[productIndex].color,
      "gender" : this.products[productIndex].gender,
      "quantity" : this.products[productIndex].quantity,
    } ;
    let cartIndex = this.cart.findIndex((prod => prod.id === newItem.id));
    if(cartIndex >= 0){
      this.cart[cartIndex].quantity += 1;
    }
    else{
      this.cart.push(newItem);
      cartIndex = this.cart.findIndex((prod => prod.id === newItem.id));
      this.cart[cartIndex].quantity = 1;
    }
  }
  getFilterOptions() {
    this.colors = [...new Set(this.products.map((item) => item.color))];
    this.genders = [...new Set(this.products.map((item) => item.gender))];
    this.prices = [...new Set(this.products.map((item) => item.price))].sort();
    this.types = [...new Set(this.products.map((item) => item.type))];
  }

  calcCartTotal():number{
    return this.cart.reduce((acc,item) =>{ return acc + item.price * item.quantity},0)
  }
  deleteItemInCart(productId:number){
    this.cart = this.cart.filter(function (e)  {return e.id !== productId});
    this.cartTotal = this.calcCartTotal();
  }
  openCartPage(){
    this.isProductPage = false;
    this.title = 'ShansTees';
    let cartBtn = document.getElementById('cartBtn');
    let shopCart = document.getElementById('shopCart');
    let backBtn = document.getElementById('backBtn');
    this.cartTotal = this.calcCartTotal();
    if(cartBtn && shopCart && backBtn){
      cartBtn.style.display = 'none';
      shopCart.style.display = 'block';
      backBtn.id = "backBtnEnabled";
    }
    if(this.cart.length === 0){

    }
  }
  openProductPage(){
    this.isProductPage = true;
    this.title = 'TeeRex Store';
    let cartBtn = document.getElementById('cartBtn');
    let shopCart = document.getElementById('shopCart');
    let backBtn = document.getElementById('backBtnEnabled');
    if(cartBtn && shopCart && backBtn){
      cartBtn.style.display = 'block';
      shopCart.style.display = 'none';
      backBtn.id = "backBtn";
    }
  }
}
