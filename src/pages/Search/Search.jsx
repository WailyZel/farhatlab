import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx'
import SortSelect from '../../components/SortSelect/SortSelect.jsx'
import { searchProducts } from '../../utils/search.js'
import { sortProducts } from '../../utils/catalog.js'
import { formatNumber, pluralize } from '../../utils/format.js'
import { useSEO } from '../../hooks/useSEO.js'

const PAGE_SIZE = 24

export default function Search() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim()
  const [sort, setSort] = useState('relevance')
  const [visible, setVisible] = useState(PAGE_SIZE)
  useSEO(q ? `Поиск: ${q}` : 'Поиск', 'Поиск по каталогу FarhatLab: название, бренд, категория и характеристики.')

  useEffect(() => {
    setVisible(PAGE_SIZE)
    setSort('relevance')
  }, [q])

  const results = useMemo(() => (q ? searchProducts(q) : []), [q])
  const sorted = useMemo(() => (sort === 'relevance' ? results : sortProducts(results, sort)), [results, sort])

  const sortValue = sort === 'relevance' ? 'popular' : sort

  return (
    <div className="page container">
      <div className="page-head">
        <h1 className="page-title">{q ? `Результаты поиска: «${q}»` : 'Поиск по каталогу'}</h1>
        <p className="page-subtitle">
          {q
            ? `Найдено: ${formatNumber(results.length)} ${pluralize(results.length, 'товар', 'товара', 'товаров')}`
            : 'Введите запрос в строку поиска вверху страницы: название, бренд, категорию или характеристику.'}
        </p>
      </div>

      {q && results.length > 0 && (
        <div className="toolbar toolbar-end">
          <SortSelect value={sortValue} onChange={setSort} />
        </div>
      )}

      {q && results.length === 0 && (
        <div className="empty empty-lg">
          <SearchX size={56} strokeWidth={1.4} className="empty-icon" />
          <h2>Ничего не найдено</h2>
          <p className="muted">Проверьте написание или попробуйте более общий запрос, например «SSD», «Logitech» или «RTX».</p>
          <div className="empty-actions">
            <Link to="/catalog" className="btn btn-primary">Открыть каталог</Link>
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <>
          <ProductGrid products={sorted.slice(0, visible)} />
          {visible < sorted.length && (
            <div className="load-more">
              <p className="muted">Показано {visible} из {sorted.length}</p>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Показать ещё
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
