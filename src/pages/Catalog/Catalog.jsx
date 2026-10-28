import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '../../data/products.js';
import { categories, categoryBySlug } from '../../data/categories.js';
import { DEFAULT_FILTERS, applyFilters, countActiveFilters, sortProducts } from '../../utils/catalog.js';
import FilterPanel from '../../components/FilterPanel/FilterPanel.jsx';
import SortSelect from '../../components/SortSelect/SortSelect.jsx';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import NotFound from '../NotFound/NotFound.jsx';
import { useSEO } from '../../hooks/useSEO.js';
import { formatNumber, pluralize } from '../../utils/format.js';

const PAGE_SIZE = 24;

function CatalogView({ slug }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const category = slug ? categoryBySlug[slug] : null;

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    category: slug || '',
    isNew: params.get('new') === '1',
    onSale: params.get('sale') === '1',
  }));
  const [sort, setSort] = useState(() => params.get('sort') || 'popular');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);

  useSEO(category ? category.name : 'Каталог', category ? `${category.name} в FarhatLab: ${category.tagline.toLowerCase()}. Цены в сомах, гарантия и быстрая доставка.` : 'Каталог FarhatLab: видеокарты, процессоры, мониторы, периферия и другая компьютерная техника.');

  // при смене фильтров или сортировки возвращаемся к первой «странице»
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filters, sort]);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  const brands = useMemo(() => {
    const src = filters.category ? products.filter((p) => p.categorySlug === filters.category) : products;
    return [...new Set(src.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));
  }, [filters.category]);

  const filtered = useMemo(() => sortProducts(applyFilters(products, filters), sort), [filters, sort]);
  const shown = filtered.slice(0, visible);
  const active = countActiveFilters(filters);

  const onCategoryChange = (value) => navigate(value ? `/category/${value}` : '/catalog');

  const panel = <FilterPanel filters={filters} setFilters={setFilters} brands={brands} onCategoryChange={onCategoryChange} resultCount={filtered.length} />;

  return (
    <div className="page container">
      <nav className="breadcrumbs" aria-label="Навигация">
        <Link to="/">Главная</Link> <span>/</span> {category ? <><Link to="/catalog">Каталог</Link> <span>/</span> <span>{category.name}</span></> : <span>Каталог</span>}
      </nav>

      <div className="page-head">
        <h1 className="page-title">{category ? category.name : 'Каталог'}</h1>
        <p className="page-subtitle">{category ? category.tagline : 'Вся техника и периферия FarhatLab'}</p>
      </div>

      <div className="category-pills" role="list">
        <Link to="/catalog" className={`chip ${!slug ? 'is-active' : ''}`} role="listitem">
          Все
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className={`chip ${slug === c.slug ? 'is-active' : ''}`} role="listitem">
            {c.name}
          </Link>
        ))}
      </div>

      <div className="catalog-layout">
        <aside className="catalog-aside">{panel}</aside>

        <div className="catalog-main">
          <div className="toolbar">
            <button type="button" className="btn btn-secondary btn-sm toolbar-filter-btn" onClick={() => setDrawer(true)}>
              <SlidersHorizontal size={16} /> Фильтры{active > 0 && ` (${active})`}
            </button>
            <span className="muted toolbar-count">
              {formatNumber(filtered.length)} {pluralize(filtered.length, 'товар', 'товара', 'товаров')}
            </span>
            <SortSelect value={sort} onChange={setSort} />
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <h2>Ничего не найдено</h2>
              <p className="muted">Попробуйте изменить или сбросить фильтры.</p>
              <button type="button" className="btn btn-primary" onClick={() => setFilters({ ...DEFAULT_FILTERS, category: filters.category })}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={shown} />
              {visible < filtered.length && (
                <div className="load-more">
                  <p className="muted">
                    Показано {shown.length} из {filtered.length}
                  </p>
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Показать ещё
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {drawer && (
        <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setDrawer(false)}>
          <aside className="drawer drawer-filters" aria-label="Фильтры">
            <div className="drawer-head">
              <strong>Фильтры</strong>
              <button type="button" className="icon-btn" onClick={() => setDrawer(false)} aria-label="Закрыть фильтры">
                <X size={22} />
              </button>
            </div>
            <div className="drawer-scroll">{panel}</div>
            <div className="drawer-foot">
              <button type="button" className="btn btn-primary btn-block" onClick={() => setDrawer(false)}>
                Показать {formatNumber(filtered.length)} {pluralize(filtered.length, 'товар', 'товара', 'товаров')}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function Catalog() {
  const { category } = useParams();
  if (category && !categoryBySlug[category]) return <NotFound />;
  // key сбрасывает состояние фильтров при переходе между категориями
  return <CatalogView key={category || 'all'} slug={category} />;
}
