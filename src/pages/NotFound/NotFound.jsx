import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { useSEO } from '../../hooks/useSEO.js'

export default function NotFound() {
  useSEO('Страница не найдена', 'Такой страницы нет в FarhatLab. Вернитесь на главную или откройте каталог.')
  return (
    <div className="page container">
      <div className="empty empty-lg">
        <SearchX size={56} strokeWidth={1.4} className="empty-icon" />
        <h1 className="page-title">404 — страница не найдена</h1>
        <p className="muted">Возможно, ссылка устарела или товар больше не продаётся.</p>
        <div className="empty-actions">
          <Link to="/" className="btn btn-primary">На главную</Link>
          <Link to="/catalog" className="btn btn-secondary">В каталог</Link>
        </div>
      </div>
    </div>
  )
}
