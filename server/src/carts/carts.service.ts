import { Injectable } from '@nestjs/common';

@Injectable()
export class CartsService {
    private readonly carts: object[] = [{
        id: 'a',
        items: [{
            id: 'aa',
            name: 'test',
            price: 100.32,
            quantity: 2,
            description: 'test cart item'
        }]

    }];

    create(cart: object): any {
        // create cart with items
    }

    find(id: string): any {

    }

    findAll(): object[] {
        return this.carts;
    }

    addItemToCart(cartId: string, item: object): any {
        //
    }
}
