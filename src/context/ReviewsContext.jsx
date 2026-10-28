import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage.js';
import { todayISO } from '../utils/format.js';
import { useToast } from './ToastContext.jsx';

const ReviewsContext = createContext(null);

function loadReviews() {
  const raw = loadJSON('reviews', []);
  return Array.isArray(raw) ? raw : [];
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(loadReviews);
  const { notify } = useToast();

  useEffect(() => {
    saveJSON('reviews', reviews);
  }, [reviews]);

  const addReview = useCallback(
    ({ productId, author, rating, text }) => {
      const review = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productId,
        author: author.trim(),
        rating,
        text: text.trim(),
        date: todayISO(),
        demo: false,
      };
      setReviews((list) => [review, ...list]);
      notify('Спасибо! Ваш отзыв опубликован.');
      return review;
    },
    [notify],
  );

  const value = useMemo(
    () => ({
      reviews,
      addReview,
      reviewsFor: (productId) => reviews.filter((r) => r.productId === productId),
    }),
    [reviews, addReview],
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export const useReviews = () => useContext(ReviewsContext);
