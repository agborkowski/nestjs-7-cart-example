export interface CartItem {
    readonly id: string
    readonly name: string
    readonly price: number
    readonly quantity: number
    readonly description: string
}

export interface Cart {
    readonly id: string
    readonly items: CartItem[]
}

export interface CartCheckout extends Cart {
    readonly total: number
}