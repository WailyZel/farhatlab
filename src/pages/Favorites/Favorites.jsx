import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useSEO } from '../../hooks/useSEO.js'

export default function Favorites() {
  const { products, count, toggleFavorite } = useFavorites()
  useSEO('Избранное', 'Товары, которые вы добавили в избранное в FarhatLab.')

  const clearAll = () => [...products].forEach((p) => toggleFavorite(p))

  return (
    <div className="page container">
      <div className="page-head page-head-row">
        <div>
          <h1 className="page-title">Избранное</h1>
          <p className="page-subtitle">{count > 0 ? `Товаров в избранном: ${count}` : 'Здесь появятся товары, которые вам понравились'}</p>
        </div>
        {count > 0 && (
          <button type="button" className="btn btn-danger btn-sm" onClick={clearAll}>
            <Trash2 size={16} /> Очистить
          </button>
        )}
      </div>

      {count === 0 ? (
        <div className="empty empty-lg">
          <Heart size={56} strokeWidth={1.4} className="empty-icon" />
          <h2>Вы пока ничего не добавили в избранное.</h2>
          <p className="muted">Нажимайте на сердечко на карточке товара, чтобы сохранить его здесь.</p>
          <div className="empty-actions">
            <Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>
          </div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
