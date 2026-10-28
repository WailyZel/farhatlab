import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Headset, RotateCcw, ShieldCheck, Sparkles, Truck, Zap, CreditCard } from 'lucide-react';
import { products } from '../../data/products.js';
import { categories, homeCategorySlugs, categoryBySlug } from '../../data/categories.js';
import { featuredReviews } from '../../data/reviews.js';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import CategoryCard from '../../components/CategoryCard/CategoryCard.jsx';
import Rating from '../../components/Rating/Rating.jsx';
import ProductImage from '../../components/ProductImage/ProductImage.jsx';
import { useSEO } from '../../hooks/useSEO.js';
import { formatDate, formatPrice } from '../../utils/format.js';
import { sortProducts } from '../../utils/catalog.js';

function Section({ title, subtitle, to, linkText = 'Смотреть все', children }) {
  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="section-link">
            {linkText} <ArrowRight size={17} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

const advantages = [
  { icon: ShieldCheck, title: 'Официальная гарантия', text: 'До 36 месяцев на комплектующие и периферию. Обслуживаем по гарантии в Бишкеке.' },
  { icon: Truck, title: 'Быстрая доставка', text: 'Курьером по Бишкеку в день заказа, по Кыргызстану — за 1–3 дня.' },
  { icon: BadgeCheck, title: 'Проверка перед отправкой', text: 'Тестируем каждую видеокарту, процессор и накопитель перед отгрузкой.' },
  { icon: CreditCard, title: 'Удобная оплата', text: 'Наличные, карта, перевод, рассрочка на крупные покупки.' },
  { icon: RotateCcw, title: '14 дней на возврат', text: 'Не подошло — вернём деньги или обменяем без лишних вопросов.' },
  { icon: Headset, title: 'Помощь в сборке', text: 'Подскажем совместимость и соберём конфигурацию под ваш бюджет.' },
];

export default function Home() {
  useSEO(null, null);

  const { popular, fresh, deals, top, hero } = useMemo(() => {
    const popular = sortProducts(products, 'popular').slice(0, 8);
    const fresh = sortProducts(products.filter((p) => p.isNew), 'new').slice(0, 8);
    const deals = sortProducts(products.filter((p) => p.discount > 0 && p.stock > 0), 'discount').slice(0, 8);
    const top = sortProducts(products.filter((p) => p.reviewCount >= 100), 'rating').slice(0, 8);
    const hero = products.find((p) => p.name.includes('RTX 5090') && p.brand === 'ASUS') || products[0];
    return { popular, fresh, deals, top, hero };
  }, []);

  const reviews = useMemo(() => featuredReviews(6), []);
  const counts = useMemo(() => {
    const m = {};
    for (const p of products) m[p.categorySlug] = (m[p.categorySlug] || 0) + 1;
    return m;
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-chip">
              <Sparkles size={15} /> Технологии для работы, игр и создания
            </span>
            <h1>
              Технологии для тех, кто <span className="gradient-text">собирает будущее.</span>
            </h1>
            <p className="hero-sub">Компьютерная техника, комплектующие и периферия для работы, игр и создания.</p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn btn-primary btn-lg">
                Перейти в каталог <ArrowRight size={18} />
              </Link>
              <Link to="/catalog?new=1" className="btn btn-secondary btn-lg">
                Смотреть новинки
              </Link>
            </div>
            <ul className="hero-stats">
              <li>
                <b>{products.length}+</b>
                <span>товаров в каталоге</span>
              </li>
              <li>
                <b>{categories.length}</b>
                <span>категорий техники</span>
              </li>
              <li>
                <b>24 мес.</b>
                <span>гарантия на технику</span>
              </li>
            </ul>
          </div>

          <Link to={`/product/${hero.id}`} className="hero-card" aria-label={`Открыть ${hero.name}`}>
            <span className="hero-card-tag">
              <Zap size={14} /> Топ недели
            </span>
            <div className="hero-card-img">
              <ProductImage src={hero.images[1]} alt={hero.name} priority />
            </div>
            <div className="hero-card-info">
              <span className="pcard-brand">{hero.brand}</span>
              <strong>{hero.name}</strong>
              <div className="hero-card-bottom">
                <span className="price">{formatPrice(hero.price)}</span>
                <Rating value={hero.rating} size={14} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      <Section title="Популярные категории" subtitle="Выберите раздел и найдите то, что нужно" to="/catalog" linkText="Весь каталог">
        <div className="category-grid">
          {homeCategorySlugs.map((slug) => (
            <CategoryCard key={slug} category={categoryBySlug[slug]} count={counts[slug]} />
          ))}
        </div>
      </Section>

      <Section title="Популярные товары" subtitle="То, что чаще всего выбирают наши покупатели" to="/catalog?sort=popular">
        <ProductGrid products={popular} />
      </Section>

      <Section title="Новинки" subtitle="Свежие поступления этого сезона" to="/catalog?new=1" linkText="Все новинки">
        <ProductGrid products={fresh} />
      </Section>

      <Section title="Лучшие скидки" subtitle="Выгодные предложения — пока товар есть в наличии" to="/catalog?sale=1&sort=discount" linkText="Все скидки">
        <ProductGrid products={deals} />
      </Section>

      <Section title="Высокий рейтинг" subtitle="Лучшие оценки покупателей" to="/catalog?sort=rating">
        <ProductGrid products={top} />
      </Section>

      <Section title="Отзывы покупателей" subtitle="Что говорят о нас и о товарах">
        <div className="testimonials">
          {reviews.map((r) => (
            <article key={r.id} className="testimonial">
              <Rating value={r.rating} size={16} showValue={false} />
              <p>«{r.text}»</p>
              <footer>
                <span className="avatar" aria-hidden="true">
                  {r.author.slice(0, 1)}
                </span>
                <div>
                  <strong>{r.author}</strong>
                  <Link to={`/product/${r.productId}`} className="muted small testimonial-link">
                    {r.productName}
                  </Link>
                </div>
                <time className="muted small" dateTime={r.date}>
                  {formatDate(r.date)}
                </time>
              </footer>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Почему FarhatLab" subtitle="Мы делаем покупку техники простой и безопасной">
        <div className="advantages">
          {advantages.map(({ icon: Icon, title, text }) => (
            <div key={title} className="advantage">
              <span className="advantage-icon">
                <Icon size={24} strokeWidth={1.7} />
              </span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="container">
        <div className="cta">
          <div>
            <h2>Соберите свой идеальный ПК</h2>
            <p>Выберите комплектующие, добавьте в корзину и получите заказ уже сегодня.</p>
          </div>
          <Link to="/catalog" className="btn btn-lg cta-btn">
            Начать выбор <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
