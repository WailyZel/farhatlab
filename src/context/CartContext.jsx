import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { productById } from '../data/products.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { addedVerb, shortName } from '../utils/format.js';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

// В хранилище лежат только { id, qty } — актуальные цены и данные берутся из каталога
function loadCart() {
  const raw = loadJSON('cart', []);
  if (!Array.isArray(raw)) return [];
  return raw.filter((i) => i && productById.has(i.id) && i.qty > 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const { notify } = useToast();

  useEffect(() => {
    saveJSON('cart', items);
  }, [items]);

  const addToCart = useCallback(
    (product, qty = 1, { silent = false } = {}) => {
      if (product.stock <= 0) {
        notify('Товара нет в наличии.', 'error');
        return false;
      }
      setItems((list) => {
        const found = list.find((i) => i.id === product.id);
        if (found) {
          return list.map((i) => (i.id === product.id ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i));
        }
        return [...list, { id: product.id, qty: Math.min(product.stock, qty) }];
      });
      if (!silent) notify(`${shortName(product)} ${addedVerb(product)} в корзину.`);
      return true;
    },
    [notify],
  );

  const removeFromCart = useCallback((id) => setItems((list) => list.filter((i) => i.id !== id)), []);

  const setQty = useCallback((id, qty) => {
    const product = productById.get(id);
    if (!product) return;
    const next = Math.max(1, Math.min(product.stock, qty));
    setItems((list) => list.map((i) => (i.id === id ? { ...i, qty: next } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const detailed = items.map((i) => ({ ...i, product: productById.get(i.id) }));
    const count = detailed.reduce((s, i) => s + i.qty, 0);
    const subtotal = detailed.reduce((s, i) => s + (i.product.oldPrice || i.product.price) * i.qty, 0);
    const total = detailed.reduce((s, i) => s + i.product.price * i.qty, 0);
    return {
      items: detailed,
      count,
      subtotal,
      total,
      savings: subtotal - total,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      isInCart: (id) => items.some((i) => i.id === id),
    };
  }, [items, addToCart, removeFromCart, setQty, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
