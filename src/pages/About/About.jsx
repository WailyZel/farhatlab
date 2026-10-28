import { Link } from 'react-router-dom'
import { Cpu, HeartHandshake, ShieldCheck, Zap } from 'lucide-react'
import { products } from '../../data/products.js'
import { categories } from '../../data/categories.js'
import { useSEO } from '../../hooks/useSEO.js'

const values = [
  { icon: Cpu, title: 'Только проверенная техника', text: 'Работаем с официальными дистрибьюторами и тестируем ключевые комплектующие перед отправкой.' },
  { icon: ShieldCheck, title: 'Честная гарантия', text: 'Гарантия до 36 месяцев и понятные условия обмена и возврата без скрытых пунктов.' },
  { icon: Zap, title: 'Быстро и удобно', text: 'Быстрая доставка, понятный каталог и удобные фильтры — от выбора до заказа за пару минут.' },
  { icon: HeartHandshake, title: 'Помогаем выбрать', text: 'Подскажем совместимость комплектующих и поможем собрать конфигурацию под ваш бюджет.' },
]

export default function About() {
  useSEO('О магазине', 'FarhatLab — магазин компьютерной техники и периферии. Технологии для работы, игр и создания.')
  return (
    <div className="page container">
      <div className="page-head">
        <h1 className="page-title">О магазине FarhatLab</h1>
        <p className="page-subtitle">Технологии для работы, игр и создания.</p>
      </div>

      <div className="about-lead">
        <p>
          FarhatLab — магазин компьютерной техники для тех, кто собирает, обновляет и создаёт. В каталоге {products.length} товаров в {categories.length} категориях: от видеокарт и процессоров до роутеров, микрофонов и кабелей.
        </p>
        <p className="muted">
          Важно: это демонстрационный проект. Товары, цены и отзывы вымышлены и созданы для показа возможностей интерфейса — оформить реальный заказ здесь нельзя.
        </p>
      </div>

      <div className="advantages">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="advantage">
            <span className="advantage-icon"><Icon size={24} strokeWidth={1.7} /></span>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
          </div>
        ))}
      </div>

      <div className="cta">
        <div>
          <h2>Готовы собрать свой ПК?</h2>
          <p>Откройте каталог и выберите комплектующие под ваши задачи.</p>
        </div>
        <Link to="/catalog" className="btn btn-lg cta-btn">В каталог</Link>
      </div>
    </div>
  )
}
