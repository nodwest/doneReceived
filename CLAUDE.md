# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Проект

«doneReceived» («Сделал-получил», в интерфейсе — «Kids Tasks») — приложение на Expo 56 / React Native 0.85. Родитель создаёт задачу с наградой, ребёнок отмечает её выполненной, родитель подтверждает, и деньги попадают на баланс ребёнка. Описание продукта лежит на русском в `obsidian-done/Сделал-получил/` (это хранилище Obsidian, оно исключено из ESLint). В `canvases/` лежат макеты и вайрфреймы, они тоже исключены из линтера.

Проект на ранней стадии: главный экран (`/`) — `ParentHomePage` (дашборд родителя), карта (`/map`, веб-виджет) и регистрация (`/registration`) — отдельные роуты. Виджет `task-short-view` пока нигде не используется.

## Коммиты

Формат из `obsidian-done/Сделал-получил/Соглашения.md`:

```
Название ветки(Название редактируемого файла)Описание изменений
```

Пример: `DR-Registration(registration)Шрифт`. Название ветки берите из `git branch --show-current`, в скобках указывайте изменяемый файл или модуль. Пробела после скобки в примере нет.

## Команды

Тест-раннер не настроен. Менеджер пакетов не определён: в репозитории лежат и `yarn.lock`, и `package-lock.json`, поля `packageManager` в `package.json` нет, а `.yarnrc.yml` задаёт `nodeLinker: node-modules`. Команда ещё не выбрала менеджер, поэтому пока ставим через `npx expo install --npm <пакет>` (обновляется только `package-lock.json`, `yarn.lock` не трогаем) и не создаём второй lock-файл. Если Expo или yarn изменили `yarn.lock`, откатите его (`git checkout yarn.lock`).

- `npm run lint` (`expo lint`) из-за `yarn.lock` пытается вызвать yarn и падает, поэтому линтим напрямую: `npx eslint app src`.
- `npm start` (`expo start`) — dev-сервер. Проект использует `expo-dev-client`, поэтому для нативного запуска нужен dev-билд, Expo Go не подойдёт (нативные модули: MapLibre, Reanimated 4, MMKV, secure-store).
- `npm run web` / `npm run ios` / `npm run android` — `ios` и `android` вызывают `expo run:*` и при первом запуске генерируют папки `ios/` и `android/`.
- `npm run lint` / `lint:fix` — `expo lint` (плоский конфиг ESLint 9: `eslint-config-expo` + Prettier как правило).
- `npm run format` / `format:check` — Prettier (одинарные кавычки, trailing commas, ширина 80; `prettier-plugin-tailwindcss` сортирует классы).
- Проверка типов: `npx tsc --noEmit` (strict; `canvases/` и `obsidian-done/` исключены в `tsconfig.json`).
- Проверка архитектуры FSD: `npm run lint:fsd` (Steiger, конфиг в `steiger.config.ts`). Запускайте после изменений структуры `src/`.

## Архитектура

**Структура Feature-Sliced Design в `src/`**, алиасы заданы в tsconfig через `baseUrl: "src"`: `@app/*`, `@pages/*`, `@widgets/*`, `@features/*`, `@entities/*`, `@shared/*`. Слой может импортировать только слои ниже себя (`app` → `pages` → `widgets` → `features` → `entities` → `shared`), внутри слайса используйте относительные пути, а между слайсами — только публичный API (`index.ts`).

- `app/` — слой FSD: `root-layout.tsx` (`RootLayout`: `Providers` + `Stack` из expo-router, импорт `app.css`), `providers/` (React Query), `styles/app.css` (подключается в `metro.config.js`).
- `pages/` — `parent-home` (главный экран родителя), `registration`, `map` (собирает виджеты).
- `widgets/` — `map` (карта), `task-short-view`, `home-header`, `home-summary`, `recent-activity`, `bottom-nav`.
- `features/` — `location` и `buses`: WebSocket-хуки в сегменте `model`; `create-task` (кнопка «Create Task»).
- `entities/` — `task` (типы и `RewardButton`), `user` (`User`, `Location`), `vehicle` (`Bus`), `activity` (`Activity`, `ActivityItem`).
- `shared/` — `ui` (UI-кит shadcn и иконки), `lib` (`cn()`, геолокация), `config` (`WS_URL`), `theme`, `mocks` (моковые данные).

**Роутинг (Expo Router).** Файлы-роуты лежат в корневой папке `app/` (не путать со слоем FSD `src/app/`): `_layout.tsx`, `index.tsx` (`/`), `map.tsx` (`/map`), `registration.tsx` (`/registration`). Это тонкие реэкспорты страниц из `src/pages/*` (`export { XPage as default } from '@pages/x'`), никакой логики в них нет. Папка роутов задана плагином в `app.json`: `["expo-router", { "root": "./app" }]`. Без этого Expo Router брал бы `src/app` (она приоритетнее корневой `app/`) и принял бы за роуты `providers/` и `styles/`. `main` в `package.json` — `expo-router/entry`. Новый экран: страница в `src/pages/<name>`, реэкспорт в `app/<route>.tsx`.

**Моки.** Пока нет бэкенда, данные для отрисовки берём из моков в `src/shared/mocks/` (один файл на предметную область: `parent.ts`, `summary.ts`, `activity.ts`, всё реэкспортируется через `index.ts`; картинки — в `mocks/images/`). При вёрстке нового экрана или виджета создавайте там недостающие моки, если реальных данных нет. Моки лежат в `shared`, поэтому не импортируют типы из `entities`: используйте `as const` и структурную совместимость, а типы данных объявляйте в `entities/*/model`. Страница берёт моки из `@shared/mocks` и передаёт их в виджеты через props; сами виджеты моки не импортируют. Когда появится API, заменяем только источник данных на странице.

**UI-кит и shadcn.** Компоненты shadcn лежат в `src/shared/ui` (плоско, как их кладёт CLI), `cn()` — в `src/shared/lib/utils.ts`. Пути задаёт `components.json` (`aliases` указывают на `@shared/...`), поэтому `npx shadcn add ...` / CLI Reusables добавляет компоненты прямо туда. Доменные компоненты (например, `RewardButton`) в `shared/ui` не кладите — им место в `entities`.

**Стили смешанные.** NativeWind v4 + Tailwind 3 (CSS-переменные темы в `app.css`, в Babel задан `jsxImportSource: 'nativewind'`, Metro обёрнут в `withNativeWind`) используются вместе с обычными объектами `StyleSheet` в файлах `*.styled.ts`, которые берут цвета из захардкоженной палитры `src/shared/theme/theme.ts` (например, `src/pages/registration`). Придерживайтесь того способа, который уже используется в модуле. UI-компоненты построены на `@rn-primitives/*`, `class-variance-authority` и `cn()` и реэкспортируются из `src/shared/ui/index.ts`.

**Зависимости, о которых стоит знать:**

- Установлены и `expo-linear-gradient`, и `react-native-linear-gradient`; в коде используется Expo-версия.
- `@tanstack/react-query`, `zustand`, `react-native-mmkv` и `expo-secure-store` установлены для данных, состояния и хранилища, но пока не подключены.
- `babel-preset-expo` имеет версию `^57`, а `expo` — `~56`. Учитывайте это, если появятся ошибки Babel или Metro.

**Виджет карты (`src/widgets/map`)** — только веб (`map.web.tsx`, DOM-версия `maplibre-gl`, наружу отдаётся через `index.ts`). Нативный `@maplibre/maplibre-react-native` установлен, но не используется и больше не указан в плагинах `app.json` (там остался только `expo-secure-store`).

- `model/use-map.ts` создаёт карту MapLibre GL и подключает оверлей deck.gl `MapboxOverlay`; возвращает `mapRef` и `deckOverlayRef`. Воркер раздаётся из `public/maplibre/maplibre-gl-worker.mjs` (`setWorkerUrl('/maplibre/...')`), его версия должна совпадать с закреплённой `maplibre-gl` 6.10.0.
- `config/map-style.ts` собирает стиль из тематических модулей в `layers/` (base, land, water, buildings, roads, places, poi), каждый из которых реэкспортируется через `index.ts`.
- `layers/dynamic/` отвечает за живые данные: позиции пользователей идут через GeoJSON-источник `users`, который обновляет `updateUserLocation`; транспорт рисуется слоем deck.gl (`createVehiclesLayer`) и передаётся через `deckOverlayRef.setProps`.

**Данные в реальном времени:** `src/features/location` и `src/features/buses` открывают обычные WebSocket к локальному бэкенду (адрес `WS_URL` в `shared/config`, по умолчанию `ws://localhost:3001`, переопределяется `EXPO_PUBLIC_WS_URL`; сообщения вида `{ event, data }`). Бэкенда в этом репозитории нет. В эмуляторе Android `localhost` — это сам эмулятор (нужен `10.0.2.2`), на реальном устройстве нужен IP компьютера. `useLocationSocket` дополнительно запускает браузерную геолокацию и отправляет её от имени захардкоженного пользователя `user-1`. Доменные типы лежат в `entities/*/model`.

**Прочее:** плагин `react-native-reanimated/plugin` в `babel.config.js` должен оставаться последним; `userInterfaceStyle` зафиксирован как `light`.
