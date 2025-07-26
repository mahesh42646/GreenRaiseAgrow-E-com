'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { profileAPI } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const prevUserId = useRef(null);
  const [merging, setMerging] = useState(false);

  // Load cart on mount and on logout
  useEffect(() => {
    const loadCart = async () => {
      if (merging) return; // Block loading while merging
      setLoading(true);
      try {
        if (user && user.userId) {
          // Logged in: load from backend
          const userCart = await profileAPI.getCart(user.userId);
          setCartItems(userCart);
        } else {
          // Guest: load from localStorage
          const storedCart = localStorage.getItem('cart');
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
        }
      } catch (err) {
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    if (!user || !user.userId || !merging) {
      loadCart();
    }
  }, [user, merging]);

  // Merge cart on login
  useEffect(() => {
    const mergeAndSyncCart = async () => {
      if (user && user.userId && !prevUserId.current) {
        setMerging(true);
        setLoading(true);
        // Get local cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        // Get backend cart
        let backendCart = [];
        try {
          backendCart = await profileAPI.getCart(user.userId);
        } catch (err) {
          backendCart = [];
        }
        // Merge logic: combine quantities for same productId
        const merged = [...backendCart];
        localCart.forEach(localItem => {
          const idx = merged.findIndex(item => item.productId === localItem.productId);
          if (idx >= 0) {
            merged[idx].quantity += Number(localItem.quantity) || 1;
          } else {
            merged.push({ ...localItem });
          }
        });
        // Save merged cart to backend
        for (const item of merged) {
          await profileAPI.addToCart(user.userId, {
            productId: item.productId,
            quantity: item.quantity
          });
        }
        setCartItems(merged);
        localStorage.removeItem('cart');
        setMerging(false);
        setLoading(false);
      }
      prevUserId.current = user ? user.userId : null;
    };
    mergeAndSyncCart();
    // eslint-disable-next-line
  }, [user && user.userId]);

  // Save cart to localStorage whenever it changes (for guests only)
  useEffect(() => {
    if (!loading && (!user || !user.userId)) {
      localStorage.setItem('cart', JSON.stringify(cartItems || []));
    }
  }, [cartItems, loading, user]);

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
      setCartItems(newCartItems);
      // Save to localStorage for guests
      if (!user || !user.userId) {
        localStorage.setItem('cart', JSON.stringify(newCartItems));
      }
      // If user is logged in, sync with backend
      if (user && user.userId) {
        try {
          await profileAPI.addToCart(user.userId, {
            productId: product.id,
            quantity: addQty
          });
        } catch (err) {
          setError('Failed to sync cart with backend');
        }
      }
      return true;
    } catch (err) {
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