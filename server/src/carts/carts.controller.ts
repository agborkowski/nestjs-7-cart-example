import { Controller, Get, Param, Post, Body, Delete, Put, BadRequestException } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Cart } from './cart.interface';
import { CartDto, CartItemDto, CartItemDeleteDto } from './cart.dto';

@Controller('carts')
export class CartsController {

    constructor(private readonly cartsService: CartsService) { }

    @Get()
    carts(): Cart[] {
        return this.cartsService.findAll();
    }

    @Get(':id')
    cart(@Param() params) {
        return this.cartsService.find(params.id);
    }

    @Get('checkout/:id/currency/:currency')
    checkout(@Param() params) {
        return this.cartsService.checkout(params.id, params?.currency);
    }

    @Post()
    cartCreate(@Body() cart: CartDto) {
        if (!this.cartsService.create(cart)) {
            throw new BadRequestException();
        }
    }

    @Put('item')
    itemAddToCart(@Body() cartItem: CartItemDto) {
        if (!this.cartsService.itemAddToCart(cartItem, cartItem.cartId)) {
            throw new BadRequestException();
        }
    }

    @Delete('item')
    itemRemoveFromCart(@Body() cartItemDeleteDto: CartItemDeleteDto) {
        const { itemId, cartId } = cartItemDeleteDto;
        if (!this.cartsService.itemRemoveFromCart(itemId, cartId)) {
            throw new BadRequestException();
        }
    }
}
