import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap, ZoomIn } from 'lucide-react'
import { productById, products } from '../../data/products.js'
import { categoryBySlug } from '../../data/categories.js'
import Rating from '../../components/Rating/Rating.jsx'
import ProductImage from '../../components/ProductImage/ProductImage.jsx'
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx'
import ReviewList from '../../components/ReviewList/ReviewList.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import NotFound from '../NotFound/NotFound.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useReviews } from '../../context/ReviewsContext.jsx'
import { ratingStats } from '../../data/reviews.js'
import { formatPrice } from '../../utils/format.js'
import { useSEO } from '../../hooks/useSEO.js'

function Gallery({ product }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(null)
  const [lightbox, setLightbox] = useState(false)
  const images = product.images

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="gallery">
      <div
        className={`gallery-main ${zoom ? 'is-zoom' : ''}`}
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        aria-label="Увеличить изображение"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setLightbox(true)}
      >
        <img
          key={index}
          className="gallery-img"
          src={images[index]}
          alt={`${product.name} — фото ${index + 1}`}
          width="600"
          height="600"
          style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
        <span className="gallery-zoom-hint"><ZoomIn size={16} /> Наведите для увеличения</span>
        <div className="pcard-badges">
          {product.discount > 0 && <span className="badge badge-sale">−{product.discount}%</span>}
          {product.isNew && <span className="badge badge-new">Новинка</span>}
          {product.isPopular && <span className="badge badge-hit">Хит</span>}
        </div>
      </div>
      <div className="gallery-thumbs">
        {images.map((src, i) => (
          <button key={i} type="button" className={`gallery-thumb ${i === index ? 'is-active' : ''}`} onClick={() => setIndex(i)} aria-label={`Фото ${i + 1}`} aria-pressed={i === index}>
            <ProductImage src={src} alt="" />
          </button>
        ))}
      </div>
      <Modal open={lightbox} onClose={() => setLightbox(false)} title={product.name}>
        <img className="lightbox-img" src={images[index]} alt={product.name} />
      </Modal>
    </div>
  )
}

function ProductView({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { reviews } = useReviews()
  const [qty, setQty] = useState(1)

  const category = categoryBySlug[product.categorySlug]
  const out = product.stock <= 0
  const stats = useMemo(() => ratingStats(product, reviews.filter((r) => r.productId === product.id)), [product, reviews])
  const fav = isFavorite(product.id)

  const similar = useMemo(
    () =>
      products
        .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
        .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
        .slice(0, 4),
    [product],
  )

  useSEO(product.name, `${product.name} — ${formatPrice(product.price)}. ${product.description.slice(0, 120)}`)

  const buyNow = () => {
    if (addToCart(product, qty, { silent: true })) navigate('/cart')
  }

  return (
    <div className="page container product-page">
      <nav className="breadcrumbs" aria-label="Навигация">
        <Link to="/">Главная</Link> <span>/</span> <Link to="/catalog">Каталог</Link> <span>/</span>{' '}
        <Link to={`/category/${category.slug}`}>{category.name}</Link> <span>/</span> <span>{product.name}</span>
      </nav>

      <div className="product-top">
        <Gallery key={product.id} product={product} />

        <div className="product-info">
          <span className="pcard-brand">{product.brand}</span>
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating-row">
            <Rating value={stats.average} count={stats.total} size={18} />
            <a href="#reviews" className="muted small">Читать отзывы</a>
          </div>

          <div className="product-prices">
            <span className="price price-lg">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice)}</span>}
            {product.discount > 0 && <span className="badge badge-sale">−{product.discount}%</span>}
          </div>

          <p className={`product-stock ${out ? 'stock-out' : product.stock <= 5 ? 'stock-low' : 'stock-in'}`}>
            {out ? 'Нет в наличии' : product.stock <= 5 ? `Осталось всего ${product.stock} шт.` : `В наличии (${product.stock} шт.)`}
          </p>

          <p className="product-lead">{product.description}</p>

          <div className="product-buy">
            <div className="qty" role="group" aria-label="Количество">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1 || out} aria-label="Уменьшить количество"><Minus size={16} /></button>
              <output aria-live="polite">{qty}</output>
              <button type="button" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock || out} aria-label="Увеличить количество"><Plus size={16} /></button>
            </div>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => addToCart(product, qty)} disabled={out}>
              <ShoppingCart size={19} /> В корзину
            </button>
            <button type="button" className={`btn btn-lg btn-secondary fav-btn ${fav ? 'is-active' : ''}`} onClick={() => toggleFavorite(product)} aria-pressed={fav} aria-label={fav ? 'Убрать из избранного' : 'В избранное'}>
              <Heart size={19} fill={fav ? 'currentColor' : 'none'} /> <span className="fav-btn-text">{fav ? 'В избранном' : 'В избранное'}</span>
            </button>
          </div>
          <button type="button" className="btn btn-secondary btn-lg btn-block" onClick={buyNow} disabled={out}>
            <Zap size={19} /> Купить сейчас
          </button>

          <ul className="product-perks">
            <li><Truck size={20} /><div><strong>Доставка</strong><span className="muted">Бишкек — в день заказа, по Кыргызстану 1–3 дня. Бесплатно от 10 000 сом.</span></div></li>
            <li><ShieldCheck size={20} /><div><strong>Гарантия</strong><span className="muted">{product.specifications['Гарантия']} официальной гарантии производителя.</span></div></li>
            <li><RotateCcw size={20} /><div><strong>Возврат</strong><span className="muted">14 дней на обмен или возврат без объяснения причин.</span></div></li>
          </ul>
        </div>
      </div>

      <section className="product-section" aria-labelledby="specs-title">
        <h2 id="specs-title">Характеристики</h2>
        <table className="specs">
          <tbody>
            {Object.entries(product.specifications).map(([k, v]) => (
              <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="product-section" aria-labelledby="desc-title">
        <h2 id="desc-title">Описание</h2>
        <p className="product-desc">{product.description}</p>
      </section>

      <ReviewList product={product} />

      {similar.length > 0 && (
        <section className="product-section" aria-labelledby="similar-title">
          <h2 id="similar-title">Похожие товары</h2>
          <ProductGrid products={similar} />
        </section>
      )}
    </div>
  )
}

export default function Product() {
  const { id } = useParams()
  const product = productById.get(Number(id))
  if (!product) return <NotFound />
  // key сбрасывает количество и галерею при переходе к другому товару
  return <ProductView key={product.id} product={product} />
}
