export interface CartDto {
    id: string
    items: CartItemDto[]
}

export interface CartItemDto {
    cart_id: string
    id: string
    name: string
    price: number
    quantity: number
    description: string
}

export interface CartItemDeleteDto {
    cartId: string
    itemId: string
}