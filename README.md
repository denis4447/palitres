# 🎨 Palitres

**Конструктор цветовых палитр с экспортом в JSON, CSS и Figma**

[![GitHub](https://img.shields.io/badge/GitHub-Pages-blue?style=flat-square)]([https://denis4447.github.io/palitres](https://denis4447.github.io/palitres/))
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Возможности

- 🎯 **Генерация палитр** — случайная или по выбранной цветовой гармонии
- 🌈 **7 типов гармоний**:
  - Комплементарная
  - Аналоговая
  - Триадная
  - Квадратная
  - Монохромная
  - Разделённо-комплементарная
  - Тетрадная
- ✏️ **Редактирование цветов** — HEX, RGB, HSL форматы
- 💾 **Автосохранение** — LocalStorage браузера
- 📤 **Экспорт** — JSON, CSS-переменные, Figma Design Tokens
- 📥 **Импорт** — загрузка палитр из JSON
- 🎨 **Glassmorphism дизайн** — современный матовый стеклянный UI

---

## 🚀 Быстрый старт

### Онлайн-версия

Откройте приложение на **[GitHub Pages]([https://denis4447.github.io/palitres](https://denis4447.github.io/palitres/))**

### Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/denis4447/palitres.git
cd palitres
```

2. Откройте `index.html` в любом браузере

Или используйте локальный сервер:
```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve
```

---

## 📖 Как использовать

### Генерация палитры

1. Выберите тип гармонии из выпадающего списка
2. Нажмите **«Сгенерировать»**
3. Для случайной гармонии выберите «Случайная»

### Работа с цветами

- **Клик на карточку** — скопировать HEX в буфер
- **✏️** — редактировать цвет (HEX/RGB/HSL, название, тип)
- **🗑️** — удалить цвет
- **«Добавить цвет»** — добавить новый случайный цвет

### Экспорт

| Формат | Описание |
|--------|----------|
| **JSON** | Палитра с метаданными (название, цвета, тип) |
| **CSS** | CSS-переменные для `:root` |
| **Figma** | Design Tokens для плагина Figma Tokens |

### Импорт

1. Нажмите **«Загрузить JSON»**
2. Выберите файл с палитрой в формате JSON

---

## 📁 Структура проекта

```
palitres/
├── index.html          # HTML-разметка
├── css/
│   └── style.css       # Стили (glassmorphism)
├── js/
│   ├── color.js        # Утилиты цветов (конвертация, гармонии)
│   ├── storage.js      # LocalStorage + экспорт/импорт
│   └── app.js          # Основная логика приложения
├── README.md           # Документация
└── ui_design.jpg       # UI-референс
```

---

## 🛠 Технологии

- **HTML5** — семантическая разметка
- **CSS3** — переменные, backdrop-filter, grid/flexbox
- **Vanilla JavaScript (ES6+)** — без зависимостей
- **LocalStorage API** — хранение данных
- **File API** — импорт/экспорт файлов

---

## 🎨 Цветовые гармонии

| Гармония | Описание | Цветов |
|----------|----------|--------|
| Комплементарная | Противоположные цвета на круге | 2 |
| Аналоговая | Соседние цвета | 3 |
| Триадная | Равноудалённые цвета (треугольник) | 3 |
| Квадратная | 4 цвета на равном расстоянии | 4 |
| Монохромная | Оттенки одного цвета | 5 |
| Разделённо-комплементарная | Базовый + 2 соседних к комплементу | 3 |
| Тетрадная | Прямоугольная схема | 4 |

---

## 🔧 Развёртывание на GitHub Pages

1. Создайте репозиторий на GitHub
2. Запушьте файлы проекта:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/palitres.git
git push -u origin main
```

3. Включите GitHub Pages:
   - **Settings** → **Pages**
   - Source: `main` branch, `/ (root)`
   - Сохраните

4. Приложение доступно по адресу:
   `https://USERNAME.github.io/palitres/`

---

## 📄 Лицензия

MIT License — см. файл [LICENSE](LICENSE)

---

## 🤝 Вклад

Pull Request'ы приветствуются! Для серьёзных изменений сначала создайте Issue.

---

## 📬 Контакты

- **GitHub**: [@denis4447](https://github.com/denis4447)

---

<div align="center">

**Made with ❤️ by denchik**

[⬆️ Вернуться к началу](#-palitres)

</div>
