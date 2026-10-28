import { memo } from 'react';
import { Star } from 'lucide-react';

// Звёзды с поддержкой дробных значений (4.3 → 4 полные звезды и 30% пятой)
function Rating({ value, count, size = 16, showValue = true }) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    const fill = Math.max(0, Math.min(1, value - (i - 1)));
    return (
      <span key={i} className="rating-star" style={{ width: size, height: size }}>
        <Star size={size} className="rating-star-bg" aria-hidden="true" />
        <span className="rating-star-fill" style={{ width: `${fill * 100}%` }}>
          <Star size={size} fill="currentColor" aria-hidden="true" />
        </span>
      </span>
    );
  });
  return (
    <span className="rating" role="img" aria-label={`Рейтинг ${value} из 5${count != null ? `, отзывов: ${count}` : ''}`}>
      <span className="rating-stars">{stars}</span>
      {showValue && <span className="rating-value">{value.toFixed(1)}</span>}
      {count != null && <span className="rating-count">({count})</span>}
    </span>
  );
}

export default memo(Rating);
