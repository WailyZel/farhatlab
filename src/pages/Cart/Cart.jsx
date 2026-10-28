import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ShoppingCart, Trash2 } from 'lucide-react'
import CartItem from '../../components/CartItem/CartItem.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatNumber, formatPrice, pluralize } from '../../utils/format.js'
import { useSEO } from '../../hooks/useSEO.js'

function CheckoutForm({ total, onCancel, onDone }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (name.trim().length < 2) next.name = 'Введите имя.'
    if (phone.replace(/\D/g, '').length < 9) next.phone = 'Введите корректный номер телефона.'
    setErrors(next)
    if (Object.keys(next).length === 0) onDone(name.trim())
  }

  return (
    <form className="review-form" onSubmit={submit} noValidate>
      <p className="muted">Это демо-магазин: оплата не подключена, заказ нигде не сохраняется.</p>
      <div className="field">
        <label htmlFor="co-name">Имя</label>
        <input id="co-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="co-phone">Телефон</label>
        <input id="co-phone" className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+996 555 00 00 00" autoComplete="tel" />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>
      <div className="co-total"><span>К оплате</span><b>{formatPrice(total)}</b></div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn-primary">Подтвердить заказ</button>
      </div>
    </form>
  )
}

export default function Cart() {
  const { items, count, subtotal, total, savings, setQty, removeFromCart, clearCart } = useCart()
  const { notify } = useToast()
  const [checkout, setCheckout] = useState(false)
  const [done, setDone] = useState(null)
  useSEO('Корзина', 'Корзина покупок FarhatLab: состав заказа, скидки и итоговая сумма.')

  const finish = (name) => {
    setCheckout(false)
    setDone({ name, total })
    clearCart()
    notify('Заказ оформлен (демо).')
  }

  if (done) {
    return (
      <div className="page container">
        <div className="empty empty-lg">
          <CheckCircle2 size={60} strokeWidth={1.4} className="empty-icon is-success" />
          <h1 className="page-title">Спасибо за заказ, {done.name}!</h1>
          <p className="muted">Сумма заказа: {formatPrice(done.total)}. Менеджер свяжется с вами в течение 15 минут. Это демонстрационный магазин — реальный заказ не создан.</p>
          <div className="empty-actions">
            <Link to="/catalog" className="btn btn-primary">Продолжить покупки</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty empty-lg">
          <ShoppingCart size={56} strokeWidth={1.4} className="empty-icon" />
          <h1 className="page-title">Корзина пуста</h1>
          <p className="muted">Добавьте товары из каталога — они появятся здесь.</p>
          <div className="empty-actions">
            <Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page container">
      <div className="page-head page-head-row">
        <div>
          <h1 className="page-title">Корзина</h1>
          <p className="page-subtitle">{formatNumber(count)} {pluralize(count, 'товар', 'товара', 'товаров')}</p>
        </div>
        <button type="button" className="btn btn-danger btn-sm" onClick={clearCart}>
          <Trash2 size={16} /> Очистить корзину
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            <CartItem key={item.id} item={item} onQty={setQty} onRemove={removeFromCart} />
          ))}
        </ul>

        <aside className="cart-summary" aria-label="Итого">
          <h2>Ваш заказ</h2>
          <dl>
            <div><dt>Товары ({count})</dt><dd>{formatPrice(subtotal)}</dd></div>
            {savings > 0 && <div className="is-saving"><dt>Скидка</dt><dd>−{formatPrice(savings)}</dd></div>}
            <div><dt>Доставка по Бишкеку</dt><dd>Бесплатно</dd></div>
          </dl>
          <div className="cart-total"><span>Итого</span><b>{formatPrice(total)}</b></div>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => setCheckout(true)}>Оформить заказ</button>
          <Link to="/catalog" className="btn btn-ghost btn-block"><ArrowLeft size={17} /> Продолжить покупки</Link>
        </aside>
      </div>

      <Modal open={checkout} onClose={() => setCheckout(false)} title="Оформление заказа">
        <CheckoutForm total={total} onCancel={() => setCheckout(false)} onDone={finish} />
      </Modal>
    </div>
  )
}
