import { useState } from 'react'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import { useSEO } from '../../hooks/useSEO.js'

const info = [
  { icon: Phone, title: 'Телефон', text: '+996 (555) 00-00-00' },
  { icon: Mail, title: 'Email', text: 'hello@farhatlab.example' },
  { icon: MapPin, title: 'Адрес', text: 'Бишкек, Кыргызстан (демо-адрес)' },
  { icon: Clock, title: 'Режим работы', text: 'Пн–Сб: 10:00–19:00, Вс: выходной' },
]

export default function Contacts() {
  const { notify } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  useSEO('Контакты', 'Контакты магазина FarhatLab: телефон, email, адрес и форма обратной связи.')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Введите имя.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Введите корректный email.'
    if (form.message.trim().length < 10) next.message = 'Сообщение слишком короткое.'
    setErrors(next)
    if (Object.keys(next).length) return
    setForm({ name: '', email: '', message: '' })
    notify('Сообщение отправлено (демо). Спасибо!')
  }

  return (
    <div className="page container">
      <div className="page-head">
        <h1 className="page-title">Контакты</h1>
        <p className="page-subtitle">Напишите нам — поможем с выбором и ответим на вопросы.</p>
      </div>

      <div className="contacts-layout">
        <ul className="contact-cards">
          {info.map(({ icon: Icon, title, text }) => (
            <li key={title} className="contact-card">
              <span className="advantage-icon"><Icon size={22} strokeWidth={1.7} /></span>
              <div>
                <strong>{title}</strong>
                <p className="muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <form className="contact-form review-form" onSubmit={submit} noValidate>
          <h2>Форма обратной связи</h2>
          <div className="field">
            <label htmlFor="c-name">Имя</label>
            <input id="c-name" className="input" value={form.name} onChange={set('name')} autoComplete="name" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" className="input" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="c-msg">Сообщение</label>
            <textarea id="c-msg" className="textarea" value={form.message} onChange={set('message')} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary"><Send size={17} /> Отправить</button>
        </form>
      </div>
    </div>
  )
}
