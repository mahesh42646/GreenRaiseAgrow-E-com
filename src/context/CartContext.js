'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { profileAPI, productAPI, clearCacheForEndpoint } from '../services/api';

const CartContext = createContext();

// Product cache to avoid repeated API calls
const productCache = new Map();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const prevUserId = useRef(null);
  const [merging, setMerging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cached function to get product details
  const getProductDetails = useCallback(async (productId) => {
    if (productCache.has(productId)) {
      return productCache.get(productId);
    }
    
    try {
      console.log(`Fetching product details for ID: ${productId}`);
      const product = await productAPI.getProductById(productId);
      console.log(`Product data received:`, product);
      
      const productData = {
        name: product.productName,
        price: product.actualPrice,
        image: product.productImage
      };
      productCache.set(productId, productData);
      return productData;
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      return null;
    }
  }, []);

  // Batch fetch product details
  const getProductDetailsBatch = useCallback(async (productIds) => {
    const uniqueIds = [...new Set(productIds)];
    const results = await Promise.allSettled(
      uniqueIds.map(id => getProductDetails(id))
    );
    
    const productMap = new Map();
    uniqueIds.forEach((id, index) => {
      if (results[index].status === 'fulfilled' && results[index].value) {
        productMap.set(id, results[index].value);
      }
    });
    
    return productMap;
  }, [getProductDetails]);

  // Load cart on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (merging) return; // Block loading while merging
      setLoading(true);
      try {
        if (user && user.userId) {
          console.log('Loading cart for user:', user.userId);
          // Logged in: load from backend
          const userCart = await profileAPI.getCart(user.userId);
          console.log('Backend cart data:', userCart);
          
          if (userCart.length > 0) {
            // Batch fetch product details
            const productIds = userCart.map(item => item.productId);
            console.log('Product IDs to fetch:', productIds);
            const productMap = await getProductDetailsBatch(productIds);
            console.log('Product details map:', productMap);
            
            // Merge cart items with product details
            const cartWithProducts = userCart.map(item => {
              const productDetails = productMap.get(item.productId);
              return {
                ...item,
                ...(productDetails || {})
              };
            });
            
            console.log('Final cart with products:', cartWithProducts);
            setCartItems(cartWithProducts);
          } else {
            setCartItems([]);
          }
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
        setIsInitialized(true);
      }
    };

    loadCart();
  }, [user?.userId, getProductDetailsBatch]);

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
          
          if (merged.length > 0) {
            // Batch fetch product details for merged cart
            const productIds = merged.map(item => item.productId);
            const productMap = await getProductDetailsBatch(productIds);
            
            // Merge cart items with product details
            const mergedWithProducts = merged.map(item => {
              const productDetails = productMap.get(item.productId);
              return {
                ...item,
                ...(productDetails || {})
              };
            });
            
            setCartItems(mergedWithProducts);
          } else {
            setCartItems([]);
          }
          
          // Clear localStorage after successful merge
          localStorage.removeItem('cart');
          
        } catch (error) {
          console.error('Error merging cart:', error);
          // Fallback: load backend cart without merging
          try {
            const backendCart = await profileAPI.getCart(user.userId);
            if (backendCart.length > 0) {
              const productIds = backendCart.map(item => item.productId);
              const productMap = await getProductDetailsBatch(productIds);
              
              const cartWithProducts = backendCart.map(item => {
                const productDetails = productMap.get(item.productId);
                return {
                  ...item,
                  ...(productDetails || {})
                };
              });
              setCartItems(cartWithProducts);
            } else {
              setCartItems([]);
            }
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
  }, [user?.userId, getProductDetailsBatch]);

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
      console.log('Adding to cart:', product);
      console.log('Current user:', user);
      
      const newItem = {
        productId: product.productId,
        quantity: 1,
        name: product.productName,
        price: product.actualPrice,
        image: product.productImage
      };

      if (user && user.userId) {
        console.log('Adding to backend cart for user:', user.userId);
        // Logged in: add to backend (only basic cart data)
        await profileAPI.addToCart(user.userId, {
          productId: product.productId,
          quantity: 1
        });
        
        console.log('Successfully added to backend cart');
        
        // Clear cart cache to ensure fresh data
        clearCacheForEndpoint(`/profile/${user.userId}/cart`);
        
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
        
        // Reload cart from backend to ensure consistency
        setTimeout(async () => {
          try {
            const userCart = await profileAPI.getCart(user.userId);
            if (userCart.length > 0) {
              const productIds = userCart.map(item => item.productId);
              const productMap = await getProductDetailsBatch(productIds);
              
              const cartWithProducts = userCart.map(item => {
                const productDetails = productMap.get(item.productId);
                return {
                  ...item,
                  ...(productDetails || {})
                };
              });
              
              setCartItems(cartWithProducts);
            }
          } catch (err) {
            console.error('Error reloading cart:', err);
          }
        }, 500);
      } else {
        console.log('Adding to localStorage cart');
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
        
        // Clear cart cache to ensure fresh data
        clearCacheForEndpoint(`/profile/${user.userId}/cart`);
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
        
        // Clear cart cache to ensure fresh data
        clearCacheForEndpoint(`/profile/${user.userId}/cart`);
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
        
        // Clear cart cache to ensure fresh data
        clearCacheForEndpoint(`/profile/${user.userId}/cart`);
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
    isInitialized,
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