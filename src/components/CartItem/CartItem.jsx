import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import ProductImage from '../ProductImage/ProductImage.jsx';
import { formatPrice } from '../../utils/format.js';

function CartItem({ item, onQty, onRemove }) {
  const { product: p, qty } = item;
  return (
    <li className="citem">
      <Link to={`/product/${p.id}`} className="citem-img">
        <ProductImage src={p.images[0]} alt={p.name} />
      </Link>
      <div className="citem-info">
        <div className="pcard-brand">{p.brand}</div>
        <Link to={`/product/${p.id}`} className="citem-title">
          {p.name}
        </Link>
        <div className="citem-unit">
          <span className="price-sm">{formatPrice(p.price)}</span>
          {p.oldPrice && <span className="price-old">{formatPrice(p.oldPrice)}</span>}
        </div>
      </div>
      <div className="qty" role="group" aria-label="Количество">
        <button type="button" onClick={() => onQty(p.id, qty - 1)} disabled={qty <= 1} aria-label="Уменьшить количество">
          <Minus size={16} />
        </button>
        <output aria-live="polite">{qty}</output>
        <button type="button" onClick={() => onQty(p.id, qty + 1)} disabled={qty >= p.stock} aria-label="Увеличить количество">
          <Plus size={16} />
        </button>
      </div>
      <div className="citem-total">{formatPrice(p.price * qty)}</div>
      <button type="button" className="icon-btn citem-remove" onClick={() => onRemove(p.id)} aria-label={`Удалить ${p.name} из корзины`}>
        <Trash2 size={19} />
      </button>
    </li>
  );
}

export default memo(CartItem);
