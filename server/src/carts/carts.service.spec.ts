import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';

describe('Given CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a example cart array', () => {
    expect(service.findAll()).toEqual([{
      id: 'a',
      items: [{
        id: 'aa',
        name: 'test',
        price: 100.32,
        quantity: 2,
        description: 'test cart item'
      }]

    }])
  });
});
