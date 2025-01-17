import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket$: Observable<IBasket>;

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    
  }
  
  onDecrease(item: IBasketItem) {
    this.basketService.decreaseQty(item);
  }

  onIncrease(item: IBasketItem) {
    this.basketService.increaseQty(item);
  }

  onDelete(item: IBasketItem) {
    this.basketService.deleteQty(item);
  }



}
