export interface CartItem {
    readonly id: string
    readonly name: string
    readonly price: number
    readonly quantity: number
    readonly description: string
}

export interface CartItemCheckout extends CartItem {
    readonly total: number
}

export interface Cart {
    readonly id: string
    readonly items: CartItem[] | CartItemCheckout[]
}