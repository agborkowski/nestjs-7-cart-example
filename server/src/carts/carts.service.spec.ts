import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Cart, CartItem } from './cart.interface';
import { HttpModule } from '@nestjs/common';

describe('Given `CartsService`', () => {
  let service: CartsService;

  const cartA: Cart = {
    id: 'a',
    items: [{
      id: 'aa',
      name: 'test',
      price: 100.32,
      quantity: 2,
      description: 'test cart item'
    }]
  };

  const cartB: Cart = {
    id: 'b',
    items: [{
      id: 'bb',
      name: 'test item of b cart',
      price: 103.32,
      quantity: 3,
      description: 'test cart item 3'
    }]
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule], // @improvements mock it ;)
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('`findAll` method should return initial carts array', () => {
    expect(service.findAll()).toEqual([cartA])
  })

  const cartId: string = cartB.id;

  it('`create` method with given `bCart` should return 2 carts', () => {
    service.create(cartB);
    expect(service.findAll().length).toEqual(2);
    expect(service.findAll()).toEqual([cartA, cartB]);
  })

  it('`find` method with given cart id should return that cart', () => {
    expect(service.find(cartId)).toEqual(cartB)
  })

  const itemAddToCart: CartItem = {
    id: 'cc',
    name: 'testc',
    price: 104.32,
    quantity: 1,
    description: 'test cart b add item c'
  };

  it('`itemAddToCart` method should add item to exists `b` cart', () => {
    const itemAddedToCart = service.itemAddToCart(itemAddToCart, cartId);
    expect(cartB.items.length).toEqual(1); // prevent mutation test
    expect(itemAddedToCart).toBe(true);
    expect(service.find(cartId).items.length).toEqual(2);

  })

  it('`itemRemoveFromCart` method should remove item from exists `b` cart', () => {
    const addItemToRemove = {
      ...itemAddToCart,
      id: 'dd'
    };
    service.itemAddToCart(addItemToRemove, cartId)
    expect(service.find(cartId).items.length).toEqual(3);
    expect(service.itemRemoveFromCart('dd', cartId)).toEqual(true);
    expect(service.find(cartId).items.length).toEqual(2);
  })

  it('`checkout` method should calculate products in the cart', async () => {
    //console.log(await service.checkout(cartId), cartB);
    // expect().toEqual({
    //   ...cartB,
    //   total: (cartB.items[0].quantity * cartB.items[0].price) + (cartB.items[1].quantity * cartB.items[1].price)

    // })
  })

  let lastHit: number = 0;
  it('`checkout` method with given currency `PLN` should get currencies from api and calculate products in the cart for `PLN` currency', async () => {
    // @improvements exclude it
    expect(service.getExchangeRates()?.timestamp).not.toBeDefined();
    await service.checkout(cartB.id, 'PLN');
    expect(service.getExchangeRates().rates['PLN']).toBeDefined();
    await service.checkout(cartB.id, 'PLN');
    expect(service.getExchangeRates()?.timestamp).toBeDefined();
    lastHit = service.getExchangeRates()?.timestamp;
    const checkoutCart = await service.checkout(cartB.id, 'PLN');
    expect(lastHit === service.getExchangeRates()?.timestamp).toBe(true);
    ////console.log('cartBTotalInBaseCurrency KLKURWKHKJLSHKFJDASKJFKJASHFKLJ', cartBTotalInBaseCurrency);
    // check
    //expect(cartBTotalInBaseCurrency === checkoutCart).toBe(false);

  })

  it('`checkExchangeRates` with given uncached date should refresh exchange rates by hit to api', async () => {
    //console.log('lastHit', lastHit);
    await service.checkExchangeRates(new Date(0), 'PLN')
    //console.log('new hit', service.getExchangeRates()?.timestamp);
    expect(lastHit === service.getExchangeRates()?.timestamp).toBe(false);
  })
});
