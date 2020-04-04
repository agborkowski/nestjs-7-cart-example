import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from './cart.interface';

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

    create(cart: Cart): boolean {
        this.carts.push(cart);
        return true;
    }

    find(id: string): any {
        return this.carts.find((cart: Cart) => cart.id === id);
    }

    findAll(): Cart[] {
        return this.carts;
    }

    itemAddToCart(item: CartItem, cartId: string): Cart | boolean {
        const cart = this.find(cartId);
        if (cart) {
            return (cart.items.push(item) > 0)
        }
        return false;

    }

    itemRemoveFromCart(itemId: string, cartId: string): Cart | boolean {
        const cart = this.find(cartId);
        if (cart) {
            const cartItemIndex = cart.items.findIndex((cartItem: CartItem) => cartItem.id === itemId)
            if (cartItemIndex !== -1) {
                cart.items.splice(cartItemIndex, 1);
                return true;
            }
            return false;
        }
        return false;
    }

    checkout(cartId: string): Cart | boolean {
        const cart = this.find(cartId);
        if (cart) {
            cart.total = cart.items.reduce((sum, cartItem: CartItem) => sum + (cartItem.price * cartItem.quantity), 0)
            return cart;
        }
        return false;
    }
}
