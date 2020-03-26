import { Injectable } from '@nestjs/common';
import { Cart, CartItem, CartItemCheckout } from './cart.interface';

@Injectable()
export class CartsService {
    private readonly carts: Cart[] = [{
        id: 'a',
        items: [{
            id: 'aa',
            name: 'test',
            price: 100.32,
            quantity: 2,
            description: 'test cart item'
        }]

    }];

    create(cart: Cart): void {
        this.carts.push(cart)
    }

    find(id: string): Cart | false {
        if (this.carts.length !== 0) {
            return this.carts.filter((cart: Cart) => cart.id === id)[0] as Cart
        }
        return false;
    }

    findAll(): Cart[] {
        return this.carts;
    }

    itemAddToCart(item: object, cartId: string): boolean {
        let cart = this.find(cartId)[0];
        if (cart.length !== 0) {
            cart.items.push({
                id: 'bb',
                name: 'test bb',
                price: 500.32,
                quantity: 2,
                description: 'test cart b item'
            })
            return true;
        }
        return false;

    }

    itemRemoveFromCart(item: object, cartId: string): any {
        //
    }

    checkout(cartId: string): object {
        return {
            id: 'a',
            items: [{
                id: 'aa',
                name: 'test',
                price: 100.32,
                quantity: 2,
                total: 200.64,
                description: 'test cart item'
            }]
        };
    }
}
