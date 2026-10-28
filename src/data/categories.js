// Категории каталога.
// specLabels — подписи характеристик в том порядке, в котором значения заданы в data/catalog/*.js
export const categories = [
  { slug: 'gpu', name: 'Видеокарты', short: 'GPU', tagline: 'Графика для игр и рендера', icon: 'Microchip', noun: 'видеокарта', purpose: 'игр, рендера и работы с нейросетями', specLabels: ['Видеопамять', 'Интерфейс', 'Видеовыходы', 'Дополнительное питание'] },
  { slug: 'cpu', name: 'Процессоры', short: 'CPU', tagline: 'AMD Ryzen и Intel Core', icon: 'Cpu', noun: 'процессор', purpose: 'игровых и рабочих сборок', specLabels: ['Сокет', 'Ядра / потоки', 'Частота и кэш', 'TDP'] },
  { slug: 'motherboards', name: 'Материнские платы', short: 'Motherboards', tagline: 'AM5, AM4, LGA1700, LGA1851', icon: 'CircuitBoard', noun: 'материнская плата', purpose: 'сборки производительного ПК', specLabels: ['Сокет', 'Чипсет', 'Форм-фактор', 'Память'] },
  { slug: 'ram', name: 'Оперативная память', short: 'RAM', tagline: 'DDR4 и DDR5 для ПК', icon: 'MemoryStick', noun: 'комплект оперативной памяти', purpose: 'игр, монтажа и многозадачности', specLabels: ['Объём', 'Тип', 'Частота', 'Тайминги'] },
  { slug: 'ssd', name: 'SSD', short: 'SSD', tagline: 'NVMe и SATA накопители', icon: 'Database', noun: 'твердотельный накопитель', purpose: 'быстрой загрузки системы и хранения проектов', specLabels: ['Объём', 'Интерфейс', 'Скорость чтения', 'Скорость записи'] },
  { slug: 'hdd', name: 'HDD', short: 'HDD', tagline: 'Ёмкие диски для хранения', icon: 'HardDrive', noun: 'жёсткий диск', purpose: 'архивов, NAS и видеонаблюдения', specLabels: ['Объём', 'Скорость вращения', 'Кэш', 'Форм-фактор'] },
  { slug: 'psu', name: 'Блоки питания', short: 'PSU', tagline: 'От 550 до 1200 Вт', icon: 'Plug', noun: 'блок питания', purpose: 'стабильной работы мощной системы', specLabels: ['Мощность', 'Сертификат', 'Модульные кабели', 'Разъёмы'] },
  { slug: 'cases', name: 'Корпуса', short: 'Cases', tagline: 'ATX, Micro-ATX, Mini-ITX', icon: 'Box', noun: 'корпус', purpose: 'сборки с хорошим охлаждением', specLabels: ['Типоразмер', 'Материал', 'Вентиляторы', 'Боковая панель'] },
  { slug: 'monitors', name: 'Мониторы', short: 'Monitors', tagline: 'IPS, VA и OLED до 240 Гц', icon: 'Monitor', noun: 'монитор', purpose: 'игр, работы и творчества', specLabels: ['Диагональ', 'Матрица и разрешение', 'Частота обновления', 'Время отклика'] },
  { slug: 'keyboards', name: 'Клавиатуры', short: 'Keyboards', tagline: 'Механические и беспроводные', icon: 'Keyboard', noun: 'клавиатура', purpose: 'комфортной печати и игр', specLabels: ['Тип', 'Переключатели', 'Подключение', 'Раскладка'] },
  { slug: 'mice', name: 'Мыши', short: 'Mice', tagline: 'Игровые и офисные модели', icon: 'Mouse', noun: 'мышь', purpose: 'точного управления в играх и работе', specLabels: ['Тип', 'Сенсор', 'Разрешение', 'Подключение'] },
  { slug: 'headsets', name: 'Наушники', short: 'Headsets', tagline: 'Гарнитуры и наушники', icon: 'Headphones', noun: 'гарнитура', purpose: 'игр, звонков и музыки', specLabels: ['Тип', 'Подключение', 'Драйверы', 'Микрофон'] },
  { slug: 'microphones', name: 'Микрофоны', short: 'Microphones', tagline: 'Для стримов и подкастов', icon: 'Mic', noun: 'микрофон', purpose: 'стримов, подкастов и звонков', specLabels: ['Тип', 'Диаграмма направленности', 'Интерфейс', 'Частотный диапазон'] },
  { slug: 'webcams', name: 'Веб-камеры', short: 'Webcams', tagline: 'Full HD и 4K', icon: 'Webcam', noun: 'веб-камера', purpose: 'видеозвонков и стримов', specLabels: ['Разрешение', 'Частота кадров', 'Угол обзора', 'Автофокус'] },
  { slug: 'routers', name: 'Wi-Fi роутеры', short: 'Networking', tagline: 'Wi-Fi 6/7, Mesh, MikroTik', icon: 'Wifi', noun: 'роутер', purpose: 'стабильной домашней и офисной сети', specLabels: ['Стандарт Wi-Fi', 'Скорость', 'Порты', 'Диапазоны'] },
  { slug: 'accessories', name: 'Кабели и аксессуары', short: 'Accessories', tagline: 'Кабели, хабы, коврики', icon: 'Cable', noun: 'аксессуар', purpose: 'подключения и удобной работы', specLabels: ['Тип', 'Длина / размер', 'Стандарт', 'Применение'] },
]

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]))

// Категории, показываемые крупными карточками на главной
export const homeCategorySlugs = ['gpu', 'cpu', 'ram', 'ssd', 'monitors', 'keyboards', 'mice', 'headsets', 'routers', 'accessories']
