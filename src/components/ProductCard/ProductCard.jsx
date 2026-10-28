import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import Rating from '../Rating/Rating.jsx';
import ProductImage from '../ProductImage/ProductImage.jsx';
import { formatPrice } from '../../utils/format.js';

function ProductCard({ product, isFavorite, inCart, onToggleFavorite, onAddToCart }) {
  const p = product;
  const out = p.stock <= 0;
  const quick = Object.entries(p.specifications).slice(0, 3);

  return (
    <article className={`pcard ${out ? 'is-out' : ''}`}>
      <div className="pcard-media">
        <Link to={`/product/${p.id}`} className="pcard-img-link" aria-label={p.name} tabIndex={-1}>
          <ProductImage src={p.images[0]} alt={`${p.name} — ${p.category}`} />
        </Link>

        <div className="pcard-badges">
          {p.discount > 0 && <span className="badge badge-sale">−{p.discount}%</span>}
          {p.isNew && <span className="badge badge-new">Новинка</span>}
          {p.isPopular && <span className="badge badge-hit">Хит</span>}
        </div>

        <button
          type="button"
          className={`pcard-fav ${isFavorite ? 'is-active' : ''}`}
          onClick={() => onToggleFavorite(p)}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={isFavorite}
        >
          <Heart size={19} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        <div className="pcard-quick" aria-hidden="true">
          {quick.map(([k, v]) => (
            <div key={k} className="pcard-quick-row">
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="pcard-body">
        <div className="pcard-brand">{p.brand}</div>
        <h3 className="pcard-title">
          <Link to={`/product/${p.id}`}>{p.name}</Link>
        </h3>
        <Rating value={p.rating} count={p.reviewCount} size={14} />

        <div className="pcard-prices">
          <span className="price">{formatPrice(p.price)}</span>
          {p.oldPrice && <span className="price-old">{formatPrice(p.oldPrice)}</span>}
        </div>

        <div className="pcard-stock">
          {out ? <span className="stock-out">Нет в наличии</span> : p.stock <= 5 ? <span className="stock-low">Осталось {p.stock} шт.</span> : <span className="stock-in">В наличии</span>}
        </div>

        <button type="button" className={`btn btn-sm btn-block pcard-cart ${inCart ? 'is-in-cart' : 'btn-primary'}`} onClick={() => onAddToCart(p)} disabled={out}>
          {inCart ? <Check size={17} /> : <ShoppingCart size={17} />}
          {out ? 'Нет в наличии' : inCart ? 'В корзине · ещё' : 'В корзину'}
        </button>
      </div>
    </article>
  );
}

export default memo(ProductCard);
