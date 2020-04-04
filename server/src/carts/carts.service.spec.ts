import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Cart, CartItem } from './cart.interface';

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
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('`findAll` method Should return initial carts array', () => {
    expect(service.findAll()).toEqual([cartA])
  })

  it('`create` method with given `bCart` should return 2 carts', () => {
    service.create(cartB);
    expect(service.findAll().length).toEqual(2);
    expect(service.findAll()).toEqual([cartA, cartB]);
  })

  it('`find` method with given cart id should return that cart', () => {
    expect(service.find('b')).toEqual(cartB)
  })

  const itemAddToCart: CartItem = {
    id: 'cc',
    name: 'testc',
    price: 104.32,
    quantity: 1,
    description: 'test cart b add item c'
  };

  it('`itemAddToCart` method Should add item to exists `b` cart', () => {
    const cartId = cartB.id;
    const itemAddedToCart = service.itemAddToCart(itemAddToCart, cartId)
    expect(itemAddedToCart).toEqual(true);
    expect(service.find(cartId).items.length).toEqual(2);
  })

  it('`itemRemoveFromCart` method Should remove item from exists `b` cart', () => {
    const cartId = cartB.id;
    const addItemToRemove = {
      ...itemAddToCart,
      id: 'dd'
    };
    const itemAddedToCart = service.itemAddToCart(addItemToRemove, cartId)
    expect(service.find(cartId).items.length).toEqual(3);
    expect(service.itemRemoveFromCart('dd', cartId)).toEqual(true);

  })

  it('`checkout` method Should calculate products in the cart', () => {
    expect(service.checkout(cartB.id)).toEqual({
      ...cartB,
      total: (cartB.items[0].quantity * cartB.items[0].price) + (cartB.items[1].quantity * cartB.items[1].price)
    })
  })
});
