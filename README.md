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

Android-проект уже подключён через **Capacitor**. Для сборки нужны Node.js/npm, JDK 21 и Android SDK (platform 35).

1. Установите зависимости: `npm install`.
2. Соберите и синхронизируйте приложение: `npm run android:sync`.
3. Создайте отладочный APK: `npm run android:build`.
4. APK появится в `android/app/build/outputs/apk/debug/app-debug.apk`.
5. Чтобы открыть нативный проект в Android Studio, выполните `npm run android:open`.

Для установки на устройство включите USB debugging и выполните `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`.
Перед публикацией в Google Play необходимо заменить временный идентификатор приложения `info.defenceline.app` на окончательный и настроить release-подпись.



---

## 📄 Лицензия

Проект распространяется под лицензией [MIT](https://www.google.com/search?q=LICENSE).

```

```