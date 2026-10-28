import { useState } from 'react';
import { Star } from 'lucide-react';

const LABELS = ['', 'Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];

export default function ReviewForm({ onSubmit, onCancel }) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (author.trim().length < 2) e.author = 'Введите имя (минимум 2 символа).';
    if (!rating) e.rating = 'Поставьте оценку от 1 до 5.';
    if (text.trim().length < 10) e.text = 'Напишите отзыв (минимум 10 символов).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ author, rating, text });
  };

  const shown = hover || rating;

  return (
    <form className="review-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="rf-name">Ваше имя</label>
        <input id="rf-name" className="input" value={author} maxLength={40} onChange={(e) => setAuthor(e.target.value)} placeholder="Например, Айбек" autoComplete="given-name" />
        {errors.author && <span className="field-error">{errors.author}</span>}
      </div>

      <div className="field">
        <span className="field-label" id="rf-rating-label">
          Оценка
        </span>
        <div className="star-input" role="radiogroup" aria-labelledby="rf-rating-label" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} из 5`}
              className={n <= shown ? 'is-on' : ''}
              onMouseEnter={() => setHover(n)}
              onClick={() => setRating(n)}
            >
              <Star size={30} fill={n <= shown ? 'currentColor' : 'none'} />
            </button>
          ))}
          <span className="star-input-label">{LABELS[shown]}</span>
        </div>
        {errors.rating && <span className="field-error">{errors.rating}</span>}
      </div>

      <div className="field">
        <label htmlFor="rf-text">Текст отзыва</label>
        <textarea id="rf-text" className="textarea" value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} placeholder="Расскажите, что понравилось и что можно улучшить" />
        <div className="field-row">
          {errors.text ? <span className="field-error">{errors.text}</span> : <span />}
          <span className="muted small">{text.length} / 1000</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          Опубликовать
        </button>
      </div>
    </form>
  );
}
