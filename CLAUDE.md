# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Проект

«doneReceived» («Сделал-получил», в интерфейсе — «Kids Tasks») — приложение на Expo 56 / React Native 0.85. Родитель создаёт задачу с наградой, ребёнок отмечает её выполненной, родитель подтверждает, и деньги попадают на баланс ребёнка. Описание продукта лежит на русском в `obsidian-done/Сделал-получил/` (это хранилище Obsidian, оно исключено из ESLint). В `canvases/` лежат макеты и вайрфреймы, они тоже исключены из линтера.

Проект на ранней стадии: `App.tsx` сейчас рендерит страницу `Registration` и веб-виджет `MapWeb` рядом друг с другом. `TaskShortView` импортирован, но не используется.

## Команды

Тест-раннер не настроен. Менеджер пакетов не определён: в репозитории лежат и `yarn.lock`, и `package-lock.json`, поля `packageManager` в `package.json` нет, а `.yarnrc.yml` задаёт `nodeLinker: node-modules`. Перед установкой или добавлением зависимостей уточняйте у пользователя и не создавайте второй lock-файл.

- `npm start` (`expo start`) — dev-сервер. Проект использует `expo-dev-client`, поэтому для нативного запуска нужен dev-билд, Expo Go не подойдёт (нативные модули: MapLibre, Reanimated 4, MMKV, secure-store).
- `npm run web` / `npm run ios` / `npm run android` — `ios` и `android` вызывают `expo run:*` и при первом запуске генерируют папки `ios/` и `android/`.
- `npm run lint` / `lint:fix` — `expo lint` (плоский конфиг ESLint 9: `eslint-config-expo` + Prettier как правило).
- `npm run format` / `format:check` — Prettier (одинарные кавычки, trailing commas, ширина 80; `prettier-plugin-tailwindcss` сортирует классы).
- Проверка типов: `npx tsc --noEmit` (strict).

## Архитектура

**Структура Feature-Sliced Design в `src/`**, алиасы заданы в tsconfig через `baseUrl: "src"`: `@app/*`, `@pages/*`, `@widgets/*`, `@features/*`, `@entities/*`, `@shared/*`. На что обратить внимание:
- Папка страниц переименована в `src/pages/` и совпадает с алиасом `@pages/*`, но `App.tsx` может ещё импортировать её по старому пути `./src/page/registration`; используйте `@pages/registration`. Для `@entities` папки пока нет.
- Алиас `@features/*` → `src/features/` теперь совпадает с папкой, но `map.web.tsx` может по-прежнему импортировать эти хуки по относительному пути.
- `@app/*` → `src/app/` — это UI-кит в стиле shadcn (`components/ui`, `lib/utils.ts` с `cn()`), а не инициализация приложения.

**Стили смешанные.** NativeWind v4 + Tailwind 3 (CSS-переменные темы в `app.css`, в Babel задан `jsxImportSource: 'nativewind'`, Metro обёрнут в `withNativeWind`) используются вместе с обычными объектами `StyleSheet` в файлах `*.styled.ts`, которые берут цвета из захардкоженной палитры `src/shared/theme/theme.ts` (например, `src/pages/registration`). Придерживайтесь того способа, который уже используется в модуле. `components.json` — конфиг CLI React Native Reusables / shadcn (алиасы указывают на `@app/...`). UI-компоненты построены на `@rn-primitives/*`, `class-variance-authority` и `cn()` и реэкспортируются из `src/app/components`.

**Зависимости, о которых стоит знать:**
- Установлены и `expo-linear-gradient`, и `react-native-linear-gradient`; в коде используется Expo-версия.
- `@tanstack/react-query`, `zustand`, `react-native-mmkv` и `expo-secure-store` установлены для данных, состояния и хранилища, но пока не подключены.
- `babel-preset-expo` имеет версию `^57`, а `expo` — `~56`. Учитывайте это, если появятся ошибки Babel или Metro.

**Виджет карты (`src/widgets/map`)** — только веб (`map.web.tsx`, DOM-версия `maplibre-gl`). Нативный `@maplibre/maplibre-react-native` установлен, но не используется и больше не указан в плагинах `app.json` (там остался только `expo-secure-store`).
- `hooks/use-map.ts` создаёт карту MapLibre GL и подключает оверлей deck.gl `MapboxOverlay`; возвращает `mapRef` и `deckOverlayRef`. Воркер раздаётся из `public/maplibre/maplibre-gl-worker.mjs` (`setWorkerUrl('/maplibre/...')`), его версия должна совпадать с закреплённой `maplibre-gl` 6.10.0.
- `config/map-style.ts` собирает стиль из тематических модулей в `layers/` (base, land, water, buildings, roads, places, poi), каждый из которых реэкспортируется через `index.ts`.
- `layers/dynamic/` отвечает за живые данные: позиции пользователей идут через GeoJSON-источник `users`, который обновляет `updateUserLocation`; транспорт рисуется слоем deck.gl (`createVehiclesLayer`) и передаётся через `deckOverlayRef.setProps`.

**Данные в реальном времени:** `src/features/location` и `src/features/pikas` открывают обычные WebSocket к локальному бэкенду (`ws://localhost:3001`, сообщения вида `{ event, data }`). Бэкенда в этом репозитории нет. В эмуляторе Android `localhost` — это сам эмулятор (нужен `10.0.2.2`), на реальном устройстве нужен IP компьютера. `useLocationSocket` дополнительно запускает браузерную геолокацию и отправляет её от имени захардкоженного пользователя `user-1`. Общие типы лежат в `src/shared/lib/types`.

**Прочее:** плагин `react-native-reanimated/plugin` в `babel.config.js` должен оставаться последним; `userInterfaceStyle` зафиксирован как `light`.
