'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { profileAPI } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load cart items on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // If user is logged in, get cart from API
          try {
            const userCart = await profileAPI.getCart(user.userId);
            setCartItems(userCart);
          } catch (err) {
            console.error('Error loading cart from API:', err);
            // If API fails, try to get from localStorage
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
              setCartItems(JSON.parse(storedCart));
            }
          }
        } else {
          // If no user, get cart from localStorage
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          }
        }
      } catch (err) {
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems || []));
    }
  }, [cartItems, loading]);

  // Get cart total
  const getCartTotal = () => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const validItems = items.filter(item => 
      item && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number' &&
      item.price > 0 &&
      item.quantity > 0
    );
    return validItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };
  
  // Get cart count
  const getCartCount = () => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const validItems = items.filter(item => 
      item && 
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );
    return validItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
  };

  // Add item to cart
  const addToCart = async (product) => {
    try {
      console.log('Adding to cart:', product);
      console.log('Current cart items:', cartItems);
      
      // Ensure cartItems is an array
      const currentCart = Array.isArray(cartItems) ? cartItems : [];
      
      // Check if product already exists in cart
      const existingItemIndex = currentCart.findIndex(item => item.productId === product.id);
      
      let newCartItems;
      const addQty = Number(product.quantity) > 0 ? Number(product.quantity) : 1;
      
      if (existingItemIndex >= 0) {
        // Increase quantity if product already in cart
        newCartItems = currentCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      } else {
        // Add new product to cart
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: addQty,
          addedAt: new Date().toISOString()
        };
        newCartItems = [...currentCart, newItem];
      }
      
      console.log('New cart items:', newCartItems);
      setCartItems(newCartItems);
      
      // If user is logged in, sync with backend
      if (user) {
        try {
          await profileAPI.addToCart(user.userId, {
            productId: product.id,
            quantity: addQty
          });
        } catch (err) {
          console.error('Error syncing cart with backend:', err);
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      return false;
    }
  };

  // Update item quantity
  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      // Ensure cartItems is an array
      const currentCart = Array.isArray(cartItems) ? cartItems : [];
      
      if (quantity <= 0) {
        removeFromCart(productId);
        return true;
      }
      
      const updatedCart = currentCart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      
      setCartItems(updatedCart);
      
      // If user is logged in, sync with backend
      if (user) {
        try {
          await profileAPI.updateCartItemQuantity(user.userId, {
            productId: productId,
            quantity: quantity
          });
        } catch (err) {
          console.error('Error updating cart item quantity:', err);
          setError('Failed to update cart item quantity');
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      setError('Failed to update cart item quantity');
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      // Ensure cartItems is an array
      const currentCart = Array.isArray(cartItems) ? cartItems : [];
      
      const updatedCart = currentCart.filter(item => item.productId !== productId);
      setCartItems(updatedCart);
      
      // If user is logged in, sync with backend
      if (user) {
        try {
          await profileAPI.removeFromCart(user.userId, {
            productId: productId
          });
        } catch (err) {
          console.error('Error removing from cart:', err);
          setError('Failed to remove item from cart');
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setCartItems([]);
      
      // If user is logged in, sync with backend
      if (user) {
        try {
          await profileAPI.clearCart(user.userId);
        } catch (err) {
          console.error('Error clearing cart:', err);
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    // Ensure cartItems is an array before using reduce
    const items = Array.isArray(cartItems) ? cartItems : [];
    
    // Filter valid items and ensure proper number conversion
    const validItems = items.filter(item => 
      item && 
      item.productId && 
      item.name && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number' &&
      item.price > 0 &&
      item.quantity > 0
    );
    
    const subtotal = validItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
    
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shippingCost;
    
    return {
      subtotal,
      shippingCost,
      total,
      itemCount: validItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0)
    };
  };

  return (
    <CartContext.Provider value={{ 
      cartItems: Array.isArray(cartItems) ? cartItems : [], 
      loading, 
      addToCart, 
      updateCartItemQuantity,
      removeFromCart, 
      clearCart,
      getCartTotals,
      getCartTotal,
      getCartCount,
      error
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 