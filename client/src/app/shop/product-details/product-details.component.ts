import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketItem } from 'src/app/shared/models/basket';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService,
              private basketService: BasketService,
              private activatedRoute: ActivatedRoute,
              private bcService: BreadcrumbService ) {
                this.bcService.set('@productDetails', '');
               }

  ngOnInit() {
    this.loadProduct();    
  }

  loadProduct() {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe((product) => {
      this.product = product;
      this.bcService.set('@productDetails', product.name);
    }, error => {
      console.log(error);
    });
  }

  addItemToCart() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQty() {
    if (this.quantity <= 15) {
      this.quantity++;
    } else {
      this.quantity = 15;
    }      
  }

  decrementQty() {
    if (this.quantity > 1) {
      this.quantity--;
    } else {
      this.quantity = 1;
    }
}

  

}
