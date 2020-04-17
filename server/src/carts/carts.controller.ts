import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Cart } from './cart.interface';
import { CartDto, CartItemDto, CartItemDeleteDto } from './cart.dto';

@Controller('carts')
export class CartsController {

    constructor(private readonly cartsService: CartsService) { }

    @Get()
    carts(): Cart[] {
        console.log('carts');
        return this.cartsService.findAll();
    }

    @Get(':id')
    cart(@Param() params) {
        console.log('get a single cart', params.id);
        return this.cartsService.find(params.id);
    }

    @Get('checkout/:id')
    checkout(@Param() params) {
        console.log('checkout cart', params.id);
        return this.cartsService.checkout(params.id);
    }

    @Post()
    cartCreate(@Body() cart: CartDto) {
        console.log('cartCreate', cart);
        this.cartsService.create(cart);
    }

    @Post()
    itemAddToCart(@Body() cartItem: CartItemDto) {
        console.log('itemAddToCart', cartItem);
        this.cartsService.itemAddToCart(cartItem, cartItem.cart_id);
    }

    @Delete()
    itemRemoveFromCart(@Body() cartItemDeleteDto: CartItemDeleteDto) {
        console.log('itemRemoveFromCart', cartItemDeleteDto);
        const { itemId, cartId } = cartItemDeleteDto;
        this.cartsService.itemRemoveFromCart(itemId, cartId);
    }
}
