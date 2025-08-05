import { useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productImg?: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // 초기값을 빈 배열로 설정

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.name === item.name);
      if (existingItem) {
        return prevItems.map(i =>
          i.name === item.name
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prevItems, item];
    });
  };

  const removeFromCart = (name: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== name));
  };

  // Calculate cartCount based on the total quantity of items in the cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    cartCount, // Add cartCount here
  };
}
