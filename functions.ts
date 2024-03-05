export const increment = (value: number, amount = 60) => value + amount
export const decrement = (value: number, amount = 60) => value > amount ? value - amount : value
