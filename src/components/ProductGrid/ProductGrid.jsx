import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import ProductCard from '../ProductCard/ProductCard.jsx';

export default function ProductGrid({ products, columns = 'auto' }) {
  const { ids, toggleFavorite } = useFavorites();
  const { items, addToCart } = useCart();
  const favSet = new Set(ids);
  const cartSet = new Set(items.map((i) => i.id));

  return (
    <div className={`product-grid ${columns === 'compact' ? 'is-compact' : ''}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} isFavorite={favSet.has(p.id)} inCart={cartSet.has(p.id)} onToggleFavorite={toggleFavorite} onAddToCart={addToCart} />
      ))}
    </div>
  );
}
