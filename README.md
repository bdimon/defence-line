```markdown
# Defense Line Aggregator

Агрегатор новостей и публикаций с украинских информационных ресурсов и блогов (Defense Line, МИГ, АрміяInform, Українский Тиждень и др.), построенный на **Ionic Framework** и **Angular**.

Приложение работает с публичным REST API WordPress напрямую, загружая статьи, категории, комментарии и медиафайлы.

## 🚀 Технологический стек

* **Фреймворк:** [Ionic 8](https://ionicframework.com/) / [Angular 19](https://angular.dev/)
* **Язык:** TypeScript 5.6
* **Стилизация:** SCSS
* **Сборщик:** Angular CLI
* **Связь с API:** Angular `HttpClient` + RxJS

---

## 🛠️ Установка и запуск

### Предварительные требования

Убедитесь, что у вас установлена **Node.js** (версии `18.x`, `20.x` или `22.x`) и менеджер пакетов `npm`.

### 1. Клонирование репозитория

```bash
git clone [https://github.com/bdimon/defence-line.git](https://github.com/bdimon/defence-line.git)
cd defence-line

```

### 2. Установка зависимостей

```bash
npm install

```

### 3. Запуск в режиме разработки

Для запуска локального dev-сервера выполните:

```bash
npx ng serve
# или при использовании Ionic CLI:
npx ionic serve

```

Приложение будет доступно по адресу: `http://localhost:4200` (или `http://localhost:8100`).

---

## 📂 Структура проекта

```text
src/
├── app/
│   ├── services/
│   │   └── wp.service.ts    # Сервис работы с WordPress REST API (посты, категории, комментарии)
│   ├── types/               # TypeScript интерфейсы и типы данных (WpPost, WpCategory и др.)
│   ├── home/                # Главная страница ленты новостей
│   └── app.component.ts     # Корневой компонент
├── assets/                  # Иконки, изображения и статические ресурсы
├── theme/                   # Глобальные стили и CSS-переменные Ionic
└── main.ts                  # Точка входа в приложение

```

---

## 🌐 Подключенные источники

Приложение поддерживает переключение между несколькими новостными ресурсами:

* Defense Line
* Олег Пономарь
* Тверезо
* Факты
* Український Тиждень
* НБН
* МИГ
* АрміяInform
* Днепр Час
* MediaPort
* Главное

---

## 📱 Сборка под мобильные устройства (Capacitor)

Если вы планируете собирать приложение под Android или iOS с помощью **Capacitor**:

1. Инициализируйте Capacitor в проекте:
```bash
npx cap init "Defense Line" "com.defenseline.app"

```


2. Добавьте целевые платформы:
```bash
npx cap add android
npx cap add ios

```


3. Сберите проект и синхронизируйте файлы:
```bash
npm run build
npx cap sync

```


4. Откройте проект в Android Studio или Xcode:
```bash
npx cap open android
npx cap open ios

```



---

## 📄 Лицензия

Проект распространяется под лицензией [MIT](https://www.google.com/search?q=LICENSE).

```

```