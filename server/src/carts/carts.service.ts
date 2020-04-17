import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
import { Cart, CartCheckout, CartItem } from './cart.interface';

interface ExchangeRates {
    rates: object
    date: Date
    timestamp?: number
}

@Injectable()
export class CartsService {
    private carts: Cart[] = [{
        id: 'a',
        items: [{
            id: 'aa',
            cartId: 'a',
            name: 'test',
            price: 100.32,
            quantity: 2,
            description: 'test cart item'
        }]

    }];

    private readonly baseCurrency = 'EUR';

    private exchangeRates: ExchangeRates;

    constructor(private httpService: HttpService) { }

    create(cart: Cart): boolean {
        const findExistsCart = this.find(cart.id);
        if (findExistsCart?.id !== cart.id) {
            this.carts.push(cart);
            return true;
        }
        return false;
    }

    find(id: string): any {
        return { ... this.carts.find((cart: Cart) => cart.id === id) };
    }

    findAll(): Cart[] {
        return this.carts;
    }

    itemAddToCart(item: CartItem, cartId: string): Cart | boolean {
        const cart: Cart = this.find(cartId);
        if (cart) {
            const cartItemIndex = cart.items.findIndex((cartItem: CartItem) => cartItem.id === item.id)
            if (cartItemIndex === -1) {
                cart.items.push(item);
                return true;
            }
        }
        return false;

    }

    itemRemoveFromCart(itemId: string, cartId: string): Cart | boolean {
        const cart: Cart = this.find(cartId);
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

    async checkout(cartId: string, currency: string = this.baseCurrency): Promise<CartCheckout> {
        const cart: CartCheckout = this.find(cartId);
        let currencyRate = await this.checkExchangeRates(new Date(), currency);

        cart.total = cart.items.reduce(
            (sum, cartItem: CartItem) =>
                (sum + (cartItem.price * cartItem.quantity)) * currencyRate
            , 0)

        return cart;
    }

    public async checkExchangeRates(date: Date, currency = ''): Promise<number> {
        const checkDate = date.setHours(0, 0, 0, 0);
        let currencyRate = 1;

        const isExchangeRatesCached = (
            this.exchangeRates?.rates &&
            (checkDate === this.exchangeRates?.timestamp)
        );

        if (currency !== this.baseCurrency) {
            if (isExchangeRatesCached) {
                return this.exchangeRates['rates'][currency];
            }
            this.exchangeRates = {
                ...await (await this.httpService.get('https://api.exchangeratesapi.io/latest').toPromise()).data as ExchangeRates,
                timestamp: checkDate
            }
            return this.exchangeRates['rates'][currency];
        }
        return currencyRate;
    }

    public getExchangeRates() {
        return this.exchangeRates;
    }
}
