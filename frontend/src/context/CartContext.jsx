import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import ApiClient from '../services/api';

const CartContext = createContext(null);

const STORAGE_CART_KEY = "zion_food_corner_cart";
const STORAGE_COUPON_KEY = "zion_applied_coupon";

export const CartProvider = ({ children }) => {
  // 1. Initial State from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COUPON_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Persist State Changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(STORAGE_COUPON_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(STORAGE_COUPON_KEY);
      }
    } catch (e) {
      console.warn("Could not save coupon to localStorage:", e);
    }
  }, [appliedCoupon]);

  // 3. Cart Calculations
  const itemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)), 0);
  }, [cartItems]);

  const gst = useMemo(() => {
    return subtotal > 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
  }, [subtotal]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 250 ? 0 : 25;
  }, [subtotal]);

  const packagingFee = useMemo(() => {
    return subtotal > 0 ? 15 : 0;
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;

    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
      return 0;
    }

    if (appliedCoupon.discountType === "percentage") {
      let calc = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && calc > appliedCoupon.maxDiscount) {
        calc = appliedCoupon.maxDiscount;
      }
      return Number(calc.toFixed(2));
    } else if (appliedCoupon.discountType === "fixed") {
      return Number(Math.min(appliedCoupon.value, subtotal).toFixed(2));
    }

    return 0;
  }, [appliedCoupon, subtotal]);

  const [deliveryTip, setDeliveryTip] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(1);

  const grandTotal = useMemo(() => {
    if (subtotal === 0) return 0;
    const total = subtotal - discount + gst + deliveryFee + packagingFee + (Number(deliveryTip) || 0);
    return Math.max(0, Number(total.toFixed(2)));
  }, [subtotal, discount, gst, deliveryFee, packagingFee, deliveryTip]);

  // 4. Cart Action Methods
  const addToCart = (item, quantity = 1) => {
    if (!item) return;
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
    const targetId = item.id || item._id;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => (i.id || i._id) === targetId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + qtyToAdd
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: targetId,
            _id: item._id || targetId,
            name: item.name,
            price: Number(item.price),
            image: item.image,
            categoryLabel: item.categoryLabel || item.category,
            isVeg: item.isVeg,
            quantity: qtyToAdd
          }
        ];
      }
    });
  };

  const updateQuantity = (itemId, deltaOrValue) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if ((item.id || item._id) === itemId) {
            let newQty;
            if (typeof deltaOrValue === "number" && (deltaOrValue === 1 || deltaOrValue === -1)) {
              newQty = (item.quantity || 1) + deltaOrValue;
            } else {
              newQty = parseInt(deltaOrValue, 10) || 1;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => (i.id || i._id) !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find((i) => (i.id || i._id) === itemId);
    return item ? item.quantity : 0;
  };

  // 5. Coupon Handling
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      throw new Error("Please enter a coupon code.");
    }
    const cleanCode = code.trim().toUpperCase();

    if (subtotal === 0) {
      throw new Error("Add items to your cart before applying a coupon.");
    }

    try {
      const res = await ApiClient.validateCoupon(cleanCode, subtotal);
      if (res && res.data) {
        setAppliedCoupon(res.data);
        return res.data;
      } else {
        throw new Error("Invalid coupon code.");
      }
    } catch (err) {
      // Fallback local verification if offline
      const localCoupon = {
        ZION50: { code: "ZION50", discountType: "percentage", value: 50, maxDiscount: 100, minOrder: 199, description: "50% OFF up to ₹100 on orders above ₹199" },
        WELCOME10: { code: "WELCOME10", discountType: "percentage", value: 10, maxDiscount: 50, minOrder: 99, description: "10% OFF on all orders above ₹99" },
        BIRYANI20: { code: "BIRYANI20", discountType: "fixed", value: 20, minOrder: 70, description: "₹20 OFF on Biryani orders above ₹70" }
      }[cleanCode];

      if (localCoupon) {
        if (subtotal < localCoupon.minOrder) {
          throw new Error(`Minimum order of ₹${localCoupon.minOrder} required for ${cleanCode}.`);
        }
        setAppliedCoupon(localCoupon);
        return localCoupon;
      }

      throw new Error(err.message || "Invalid coupon code.");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        appliedCoupon,
        itemCount,
        subtotal,
        gst,
        deliveryFee,
        packagingFee,
        discount,
        deliveryTip,
        setDeliveryTip,
        checkoutStep,
        setCheckoutStep,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
