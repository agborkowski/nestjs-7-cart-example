import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Cart, CartItem } from './cart.interface';
import { HttpModule } from '@nestjs/common';

describe('Given `CartsService`', () => {
  let service: CartsService;

  const sampleCartA: Cart = {
    id: 'a',
    items: [{
      id: 'aa',
      cartId: 'a',
      name: 'test',
      price: 100.32,
      quantity: 2,
      description: 'test cart item'
    }]
  };

  const sampleCartB: Cart = {
    id: 'b',
    items: [{
      id: 'bb',
      cartId: 'b',
      name: 'test item of b cart',
      price: 103.32,
      quantity: 3,
      description: 'test cart item 3'
    }]
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule], // @improvements can be mocked
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('`findAll` method should return initial carts array', () => {
    expect(service.findAll()).toEqual([sampleCartA])
  })

  const cartId: string = sampleCartB.id;

  it('`create` method with given `sampleCartB` should return 2 carts', () => {
    const create = service.create(JSON.parse(JSON.stringify(sampleCartB)));
    expect(create).toBe(true);
    expect(service.findAll().length).toEqual(2);
    expect(service.findAll()).toEqual([sampleCartA, sampleCartB]);
  })

  it('`create` method with given duplicated `sampleCartB` should return 2 carts', () => {
    const create = service.create(JSON.parse(JSON.stringify(sampleCartB)));
    expect(create).toBe(false);
    expect(service.findAll().length).toEqual(2);
    expect(service.findAll()).toEqual([sampleCartA, sampleCartB]);
  })

  it('`find` method with given cart id should return that cart', () => {
    expect(service.find(cartId)).toEqual(sampleCartB);
    expect(service.find(cartId) === sampleCartB).toEqual(false); // is there side effect
    expect(service.find(cartId).items === sampleCartB.items).toEqual(false); // is there side effect (shallow copy)
  })

  const itemAddToCartB: CartItem = {
    id: 'cc',
    cartId: 'b',
    name: 'testc',
    price: 104.32,
    quantity: 1,
    description: 'test cart b add item c'
  };

  it('`itemAddToCart` method should add item to exists `b` cart', () => {
    const itemAddedToCart = service.itemAddToCart(itemAddToCartB, cartId);
    expect(service.find(cartId) === sampleCartB).toEqual(false); // is there side effect
    expect(sampleCartB.items.length).toEqual(1);
    expect(itemAddedToCart).toBe(true);
    expect(service.find(cartId).items.length).toEqual(2);

  })

  it('`itemRemoveFromCart` method should remove item from exists `b` cart', () => {
    const addItemToRemove = {
      ...itemAddToCartB,
      id: 'dd'
    };
    service.itemAddToCart(addItemToRemove, cartId);
    expect(service.find(cartId).items.length).toEqual(3);
    expect(service.itemRemoveFromCart('dd', cartId)).toEqual(true);
    expect(service.find(cartId).items.length).toEqual(2);
  })

  it('`checkout` method should calculate products in the cart', async () => {
    let checkoutCart = await service.checkout(cartId);
    expect(service.find(cartId).items.length).toEqual(2);
    expect(checkoutCart.total).toEqual(414.28);

    service.itemAddToCart({ ...itemAddToCartB, id: 'c' }, cartId);
    expect(service.find(cartId).items.length).toEqual(3);

    checkoutCart = await service.checkout(cartId);
    expect(checkoutCart.total).toEqual(414.28 + (itemAddToCartB.price * itemAddToCartB.quantity));

    service.itemRemoveFromCart(itemAddToCartB.id, cartId);
    checkoutCart = await service.checkout(cartId);
    expect(checkoutCart.total).toEqual(414.28);
  })


  let lastHit: number = 0;
  it('`checkout` method with given currency `PLN` should get currencies from api and calculate products in the cart for `PLN` currency', async () => {
    // @improvements exclude it
    expect(service.getExchangeRates()?.timestamp).not.toBeDefined();
    await service.checkout(sampleCartB.id, 'PLN');
    expect(service.getExchangeRates().rates['PLN']).toBeDefined();
    await service.checkout(sampleCartB.id, 'PLN');
    expect(service.getExchangeRates()?.timestamp).toBeDefined();
    lastHit = service.getExchangeRates()?.timestamp;

    const checkoutCartPln = await service.checkout(sampleCartB.id, 'PLN');
    expect(checkoutCartPln.total).toBeGreaterThan(0);
    expect(lastHit === service.getExchangeRates()?.timestamp).toBe(true);
    const checkoutCartCad = await service.checkout(sampleCartB.id, 'CAD');
    expect(checkoutCartCad.total).toBeGreaterThan(0);
    expect(checkoutCartCad.total === checkoutCartPln.total).toBe(false);
  })

  it('`checkExchangeRates` with given uncached date should refresh exchange rates by hit to api', async () => {
    await service.checkExchangeRates(new Date(0), 'PLN');
    expect(lastHit === service.getExchangeRates()?.timestamp).toBe(false);
  })

  it('`checkExchangeRates` with given base currency and `PLN` and `CAD` method should return different rates`', async () => {
    expect(await service.checkExchangeRates(new Date(), 'EUR')).toBe(1);
    const plnRate = await service.checkExchangeRates(new Date(), 'PLN');
    const cadRate = await service.checkExchangeRates(new Date(), 'CAD');
    expect(plnRate === cadRate).toBe(false);
  })
});
