import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { productById } from '../data/products.js';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { useToast } from './ToastContext.jsx';

const FavoritesContext = createContext(null);

function loadFavs() {
  const raw = loadJSON('favorites', []);
  return Array.isArray(raw) ? raw.filter((id) => productById.has(id)) : [];
}

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(loadFavs);
  const { notify } = useToast();

  useEffect(() => {
    saveJSON('favorites', ids);
  }, [ids]);

  // ref нужен, чтобы функция переключения оставалась стабильной и карточки не перерисовывались зря
  const idsRef = useRef(ids);
  idsRef.current = ids;

  const toggleFavorite = useCallback(
    (product) => {
      const was = idsRef.current.includes(product.id);
      setIds((list) => (list.includes(product.id) ? list.filter((id) => id !== product.id) : [product.id, ...list]));
      notify(was ? 'Товар удалён из избранного.' : 'Товар добавлен в избранное.', was ? 'info' : 'success');
    },
    [notify],
  );

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      products: ids.map((id) => productById.get(id)),
      isFavorite: (id) => ids.includes(id),
      toggleFavorite,
      clearFavorites: () => setIds([]),
    }),
    [ids, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
