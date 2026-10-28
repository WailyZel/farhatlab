import { useMemo, useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import Rating from '../Rating/Rating.jsx';
import Modal from '../Modal/Modal.jsx';
import ReviewForm from '../ReviewForm/ReviewForm.jsx';
import { useReviews } from '../../context/ReviewsContext.jsx';
import { demoReviewsByProduct, ratingStats } from '../../data/reviews.js';
import { formatDate, formatNumber, pluralize } from '../../utils/format.js';

const PAGE = 5;

export default function ReviewList({ product }) {
  const { reviews, addReview } = useReviews();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE);

  const userReviews = useMemo(() => reviews.filter((r) => r.productId === product.id), [reviews, product.id]);
  const all = useMemo(() => [...userReviews, ...(demoReviewsByProduct.get(product.id) || [])], [userReviews, product.id]);
  const stats = useMemo(() => ratingStats(product, userReviews), [product, userReviews]);

  const handleSubmit = ({ author, rating, text }) => {
    addReview({ productId: product.id, author, rating, text });
    setOpen(false);
    setVisible((v) => Math.max(v, PAGE));
  };

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews-head">
        <h2 id="reviews-title">Отзывы покупателей</h2>
        <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
          <MessageSquarePlus size={18} /> Оставить отзыв
        </button>
      </div>

      <div className="reviews-layout">
        <aside className="reviews-summary">
          <div className="reviews-avg">{stats.average.toFixed(1)}</div>
          <Rating value={stats.average} size={20} showValue={false} />
          <p className="muted">
            {formatNumber(stats.total)} {pluralize(stats.total, 'отзыв', 'отзыва', 'отзывов')}
          </p>
          <ul className="dist">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = stats.distribution[star];
              const pct = stats.total ? (n / stats.total) * 100 : 0;
              return (
                <li key={star}>
                  <span className="dist-star">{star} ★</span>
                  <span className="dist-bar" aria-hidden="true">
                    <span style={{ width: `${pct}%` }} />
                  </span>
                  <span className="dist-n">{formatNumber(n)}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="reviews-list">
          {all.slice(0, visible).map((r) => (
            <article key={r.id} className="review">
              <header className="review-head">
                <span className="avatar" aria-hidden="true">
                  {r.author.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <strong>{r.author}</strong>
                  {!r.demo && <span className="badge badge-you">Ваш отзыв</span>}
                  <div>
                    <Rating value={r.rating} size={15} showValue={false} />
                  </div>
                </div>
                <time className="muted review-date" dateTime={r.date}>
                  {formatDate(r.date)}
                </time>
              </header>
              <p>{r.text}</p>
            </article>
          ))}
          {visible < all.length && (
            <button type="button" className="btn btn-secondary" onClick={() => setVisible((v) => v + PAGE)}>
              Показать ещё отзывы
            </button>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Оставить отзыв">
        <p className="muted modal-sub">{product.name}</p>
        <ReviewForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
