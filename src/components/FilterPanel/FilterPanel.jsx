import { Star, RotateCcw } from 'lucide-react';
import { categories } from '../../data/categories.js';
import { DEFAULT_FILTERS } from '../../utils/catalog.js';

export default function FilterPanel({ filters, setFilters, brands, lockedCategory = false, onCategoryChange, resultCount }) {
  const patch = (obj) => setFilters((f) => ({ ...f, ...obj }));
  const toggleBrand = (b) =>
    setFilters((f) => ({ ...f, brands: f.brands.includes(b) ? f.brands.filter((x) => x !== b) : [...f.brands, b] }));

  return (
    <div className="filters">
      <div className="filters-head">
        <h2>Фильтры</h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFilters({ ...DEFAULT_FILTERS, category: filters.category })}>
          <RotateCcw size={15} /> Сбросить
        </button>
      </div>

      <section className="filter-group">
        <h3>Категория</h3>
        <select
          className="select"
          value={filters.category}
          onChange={(e) => {
            patch({ category: e.target.value, brands: [] });
            onCategoryChange?.(e.target.value);
          }}
          disabled={lockedCategory}
          aria-label="Категория"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </section>

      <section className="filter-group">
        <h3>Цена, сом</h3>
        <div className="price-range">
          <input className="input" type="number" inputMode="numeric" min="0" placeholder="От" value={filters.minPrice} onChange={(e) => patch({ minPrice: e.target.value })} aria-label="Минимальная цена" />
          <span aria-hidden="true">—</span>
          <input className="input" type="number" inputMode="numeric" min="0" placeholder="До" value={filters.maxPrice} onChange={(e) => patch({ maxPrice: e.target.value })} aria-label="Максимальная цена" />
        </div>
      </section>

      <section className="filter-group">
        <h3>Рейтинг</h3>
        <div className="rating-filter">
          {[0, 4, 4.5].map((r) => (
            <button key={r} type="button" className={`chip ${filters.minRating === r ? 'is-active' : ''}`} onClick={() => patch({ minRating: r })}>
              {r === 0 ? (
                'Любой'
              ) : (
                <>
                  <Star size={13} fill="currentColor" /> {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-group">
        <h3>Показывать</h3>
        <label className="check">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => patch({ inStock: e.target.checked })} />
          <span>Только в наличии</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={filters.onSale} onChange={(e) => patch({ onSale: e.target.checked })} />
          <span>Со скидкой</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={filters.isNew} onChange={(e) => patch({ isNew: e.target.checked })} />
          <span>Новинки</span>
        </label>
      </section>

      <section className="filter-group">
        <h3>
          Бренд {filters.brands.length > 0 && <span className="muted">({filters.brands.length})</span>}
        </h3>
        <div className="brand-list">
          {brands.map((b) => (
            <label key={b} className="check">
              <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggleBrand(b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </section>

      {resultCount != null && <p className="filters-result muted">Найдено: {resultCount}</p>}
    </div>
  );
}
