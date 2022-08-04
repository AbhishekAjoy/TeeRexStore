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
  products: productModel[] = [];
  filteredProducts: productModel[] = [];
  colors: string[] = [];
  genders: string[] = [];
  prices: number[] = [];
  types: string[] = [];
  minVal: number | null = null;
  maxVal: number | null = null;

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

  applyFilters() {
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

  openFilters(){
    let filterCard = document.getElementsByClassName('filterCard')[0] as HTMLElement;
    filterCard.style.display = 'block';
  }
  getFilterOptions() {
    this.colors = [...new Set(this.products.map((item) => item.color))];
    this.genders = [...new Set(this.products.map((item) => item.gender))];
    this.prices = [...new Set(this.products.map((item) => item.price))].sort();
    this.types = [...new Set(this.products.map((item) => item.type))];
  }
}
