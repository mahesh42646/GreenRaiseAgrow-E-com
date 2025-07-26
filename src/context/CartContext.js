'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { profileAPI, productAPI } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const prevUserId = useRef(null);
  const [merging, setMerging] = useState(false);

  // Load cart on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (merging) return; // Block loading while merging
      setLoading(true);
      try {
        if (user && user.userId) {
          // Logged in: load from backend
          const userCart = await profileAPI.getCart(user.userId);
          
          // Fetch product details for each cart item
          const cartWithProducts = await Promise.all(
            userCart.map(async (item) => {
              try {
                const product = await productAPI.getProductById(item.productId);
                return {
                  ...item,
                  name: product.productName,
                  price: product.actualPrice,
                  image: product.productImage
                };
              } catch (err) {
                console.error(`Error fetching product ${item.productId}:`, err);
                return item; // Return item without product details if fetch fails
              }
            })
          );
          
          setCartItems(cartWithProducts);
        } else {
          // Not logged in: load from localStorage
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(localCart);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setError(error.message);
        // Fallback to localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(localCart);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.userId]);

  // Merge cart on login (only once when user first logs in)
  useEffect(() => {
    const mergeAndSyncCart = async () => {
      if (user && user.userId && !prevUserId.current) {
        setMerging(true);
        setLoading(true);
        
        try {
          // Get local cart
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          
          // Get backend cart
          let backendCart = [];
          try {
            backendCart = await profileAPI.getCart(user.userId);
          } catch (err) {
            console.error('Error fetching backend cart:', err);
            backendCart = [];
          }
          
          // Merge logic: use backend cart as base, add local items that don't exist in backend
          const merged = [...backendCart];
          localCart.forEach(localItem => {
            const existingItem = merged.find(item => item.productId === localItem.productId);
            if (!existingItem) {
              // Only add if item doesn't exist in backend - send only basic cart data
              merged.push({
                productId: localItem.productId,
                quantity: localItem.quantity
              });
            }
            // Don't add quantities - keep backend quantities as they are
          });
          
          // Sync merged cart to backend (only basic cart data)
          if (merged.length > 0) {
            await profileAPI.syncCart(user.userId, merged);
          }
          
          // Fetch product details for merged cart
          const mergedWithProducts = await Promise.all(
            merged.map(async (item) => {
              try {
                const product = await productAPI.getProductById(item.productId);
                return {
                  ...item,
                  name: product.productName,
                  price: product.actualPrice,
                  image: product.productImage
                };
              } catch (err) {
                console.error(`Error fetching product ${item.productId}:`, err);
                return item;
              }
            })
          );
          
          setCartItems(mergedWithProducts);
          
          // Clear localStorage after successful merge
          localStorage.removeItem('cart');
          
        } catch (error) {
          console.error('Error merging cart:', error);
          // Fallback: load backend cart without merging
          try {
            const backendCart = await profileAPI.getCart(user.userId);
            const cartWithProducts = await Promise.all(
              backendCart.map(async (item) => {
                try {
                  const product = await productAPI.getProductById(item.productId);
                  return {
                    ...item,
                    name: product.productName,
                    price: product.actualPrice,
                    image: product.productImage
                  };
                } catch (err) {
                  console.error(`Error fetching product ${item.productId}:`, err);
                  return item;
                }
              })
            );
            setCartItems(cartWithProducts);
          } catch (err) {
            console.error('Error loading backend cart:', err);
            setCartItems([]);
          }
        } finally {
          setMerging(false);
          setLoading(false);
        }
      }
      
      // Update prevUserId
      if (user && user.userId) {
        prevUserId.current = user.userId;
      } else {
        prevUserId.current = null;
      }
    };

    mergeAndSyncCart();
  }, [user?.userId]);

  // Save to localStorage when user logs out
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [user, cartItems]);

  // Helper function to normalize cart items
  const normalizeCartItems = (items) => {
    if (!Array.isArray(items)) return [];
    
    return items.filter(item => 
      item && 
      item.productId && 
      item.name && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number' &&
      item.price > 0 &&
      item.quantity > 0
    );
  };

  // Get cart total
  const getCartTotal = () => {
    const validItems = normalizeCartItems(cartItems);
    
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

  // Calculate cart totals
  const getCartTotals = () => {
    const validItems = normalizeCartItems(cartItems);
    
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

  // Add to cart
  const addToCart = async (product) => {
    try {
      const newItem = {
        productId: product.productId,
        quantity: 1,
        name: product.productName,
        price: product.actualPrice,
        image: product.productImage
      };

      if (user && user.userId) {
        // Logged in: add to backend (only basic cart data)
        await profileAPI.addToCart(user.userId, {
          productId: product.productId,
          quantity: 1
        });
        
        // Update local state
        setCartItems(prev => {
          const existing = prev.find(item => item.productId === product.productId);
          if (existing) {
            return prev.map(item => 
              item.productId === product.productId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prev, newItem];
          }
        });
      } else {
        // Not logged in: add to localStorage
        setCartItems(prev => {
          const existing = prev.find(item => item.productId === product.productId);
          if (existing) {
            return prev.map(item => 
              item.productId === product.productId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prev, newItem];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      if (user && user.userId) {
        // Logged in: update backend (only basic cart data)
        await profileAPI.updateCartItemQuantity(user.userId, { 
          productId, 
          quantity: newQuantity 
        });
      }
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      setError(error.message);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      if (user && user.userId) {
        // Logged in: remove from backend (only basic cart data)
        await profileAPI.removeFromCart(user.userId, { productId });
      }
      
      // Update local state
      setCartItems(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (user && user.userId) {
        // Logged in: clear backend
        await profileAPI.clearCart(user.userId);
      }
      
      // Clear local state
      setCartItems([]);
      
      // Clear localStorage
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
    }
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 