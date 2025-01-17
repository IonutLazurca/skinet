import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

  addItemToBasket(item: IProduct, quantity = 1) {
      const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
      let basket = this.getCurrentBasketValue();
      if (basket === null) {
        basket = this.createBasket();
      }
      basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);    
      this.setBasket(basket);
           
  }

  decreaseQty(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();    
    const findIndex = basket.items.findIndex(p => p.id === item.id);
    if (basket.items[findIndex].quantity > 1) {
      basket.items[findIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }    
  }

  increaseQty(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const findIndex = basket.items.findIndex(p => p.id === item.id);
    const limit = 15;
    if (basket.items[findIndex].quantity <= limit) {
      basket.items[findIndex].quantity++;
      this.setBasket(basket);
    } else {
      console.log('Maximum order limit per product has been reached');
    }
       
  }

  deleteQty(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const findIndex = basket.items.findIndex(p => p.id === item.id);
    if (basket.items.length < 2) {
      this.deleteBasket(basket);
    } else {
      basket.items.splice(findIndex, 1);
      this.setBasket(basket);
    }

  }

  private removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const findIndex = basket.items.findIndex(p => p.id === item.id);
    if (basket.items.length < 2) {
      console.log(basket.items.length);
      this.deleteBasket(basket);
    } else {
      basket.items.splice(findIndex, 1);
      this.setBasket(basket);
    }
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(c => c.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }


  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }


  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    };
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = shipping + subtotal; 

    this.basketTotalSource.next({shipping, subtotal, total});
  }

}
