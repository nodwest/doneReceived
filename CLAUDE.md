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

Тест-раннер не настроен. Менеджер пакетов — npm, единственный lock-файл — `package-lock.json` (`yarn.lock` и `.yarnrc.yml` удалены по решению команды). Зависимости ставим через `npm ci` / `npx expo install <пакет>`; yarn не используем и второй lock-файл не создаём.

- `npm start` (`expo start`) — dev-сервер. Проект использует `expo-dev-client`, поэтому для нативного запуска нужен dev-билд, Expo Go не подойдёт (нативные модули: MapLibre, Reanimated 4, MMKV, secure-store).
- `npm run web` / `npm run ios` / `npm run android` — `ios` и `android` вызывают `expo run:*` и при первом запуске генерируют папки `ios/` и `android/`.
- `npm run lint` / `lint:fix` — `expo lint` (плоский конфиг ESLint 9: `eslint-config-expo` + Prettier как правило).
- `npm run format` / `format:check` — Prettier (одинарные кавычки, trailing commas, ширина 80).
- Проверка типов: `npx tsc --noEmit` (strict; `canvases/` и `obsidian-done/` исключены в `tsconfig.json`).
- Проверка архитектуры FSD: `npm run lint:fsd` (Steiger, конфиг в `steiger.config.ts`). Запускайте после изменений структуры `src/`.

## Архитектура

**Структура Feature-Sliced Design в `src/`**, алиасы заданы в tsconfig через `baseUrl: "src"`: `@app/*`, `@pages/*`, `@widgets/*`, `@features/*`, `@entities/*`, `@shared/*`. Слой может импортировать только слои ниже себя (`app` → `pages` → `widgets` → `features` → `entities` → `shared`), внутри слайса используйте относительные пути, а между слайсами — только публичный API (`index.ts`).

- `app/` — слой FSD: `root-layout.tsx` (`RootLayout`: `Providers` + `Stack` из expo-router, загрузка шрифтов Inter, `ToastHost`), `providers/` (React Query).
- `pages/` — `parent-home` (главный экран родителя), `tasks` (задания: вкладки All / Review, карточки или список; `?tab=review` открывает вкладку проверки; проп `scope`: `ChildTasksPage` на `/child/[id]/tasks` — задачи ребёнка со строкой «Emma's tasks» под шапкой, `ParentTasksPage` на `/parent/[id]/tasks` — активные задачи, созданные родителем, без вкладок, «George's tasks» по центру шапки; в обоих «назад» ведёт в профиль, в навбаре Family), `create-task` (`CreateTaskPage` и `EditTaskPage` — одна форма), `family` (вкладка Family: кнопка «+ Family member» с панелью кодов приглашения, карточки родителей и детей; тап по карточке — профиль, по чипу задач — его задачи; карточка «You» — владелец аккаунта — показывает те же счётчики, что главная, и ведёт на главную и вкладку Tasks; у второго родителя только его активные задачи — его задачи на проверке нам не видны), `parent-profile` (профиль родителя `/parent/[id]`: как у ребёнка, но плитки Rewards paid / Active tasks, итоги и награды — по задачам, которые он создал), `child-profile` (профиль ребёнка `/child/[id]`: шапка со статусом «дома», плитки Balance / задачи, итоги недели, последние награды, превью карты; данные — `childProfilesMock`, `useTasks`, `useOperations`), `wallet` (история операций: фильтр по детям, график-барабан по дням, итоги и список наград за выбранный день), `registration`, `map` (собирает виджеты).
- `widgets/` — `map` (большая карта `MapWeb` и превью `MapPreview` для профиля), `task-short-view`, `home-header`, `home-summary`, `recent-activity`, `bottom-nav`, `children-carousel`, `tasks-header`, `task-carousel`, `task-list`, `children-filter` (сегменты All / ребёнок), `operations-chart` (3D-столбики earned / missed по дням, лента листается барабаном, выбранный день по центру, сегодня последний), `day-summary` (заголовок периода и итоги earned / missed), `profile-header` (шапка профиля члена семьи: назад, имя и `PresenceBadge`, аватар), `add-member` (кнопка «+ Family member» ↔ панель с кодами приглашения для родителя и ребёнка).
- `features/` — `location` и `buses`: WebSocket-хуки в сегменте `model`; `create-task` (кнопка и форма задачи; с пропом `task` форма редактирует; мутации `useCreateTask` / `useUpdateTask` вызывают эндпоинты сущности и инвалидируют `taskKeys.all`); `review-task` (Reject / Approve и шторка с причиной отказа).
- `entities/` — `task` (типы `Task` и payload'ов, `TaskCard`, `TaskRow`, `RewardButton`; сегмент `api`: эндпоинты `fetchTasks` / `createTask` / `updateTask`, запрос `useTasks`, ключи `taskKeys`; у задачи есть автор `createdBy` (id родителя, на «сервере» — вошедший родитель); `filterTasks` / `countTasks` — по исполнителю или автору, общие для главной, Family и профилей), `operation` (`Operation`, `DayTotals`, `getHistoryDays` / `getDayTotals`, `OperationRow`, `KindCube`, цвета `OPERATION_KIND_COLORS`; сегмент `api`: `fetchOperations`, запрос `useOperations`, ключи `operationKeys`), `user` (`User`, `Location`, `Child`, `ChildProfile`, `ParentProfile`, роль `FamilyRole` и её цвета `ROLE_COLORS`, общие для профилей `Presence` и `GeoPoint`, `ChildCard`, `MemberCard`, `PresenceBadge`, `RoleIcon`, `RoleTint`), `family` (коды приглашения `InviteCodes`: эндпоинт `fetchInviteCodes`, запрос `useInviteCodes`, mock-server), `vehicle` (`Bus`), `activity` (`Activity`, `ActivityItem`).
- `shared/` — `ui` (UI-кит: `Button`, `Input`, `InputWithIcon`, `Label`, иконки, `BottomSheet`, `PillButton`, `RoundButton` (круглая кнопка: `md` в шапке, `sm` в карточке), `GradientButton` (широкая кнопка Create Task / + Family member), `SectionHeader` и `ScreenSection` (заголовок секции со ссылкой и секция с ним), `CopyableCode` (код с копированием и тостом), `HeaderAvatar`, `DateTimePickerSheet`, тосты), `lib` (геолокация, даты, `useNow`, `useTimeAgo`, `copyText` (буфер обмена через `expo-clipboard`), `withAlpha`, `useSnapCarousel` — общая логика каруселей), `config` (`WS_URL`), `theme`, `mocks` (моковые данные).

**Роутинг (Expo Router).** Файлы-роуты лежат в корневой папке `app/` (не путать со слоем FSD `src/app/`): `_layout.tsx`, `index.tsx` (`/`), `tasks.tsx` (`/tasks`), `create-task.tsx` и `edit-task.tsx` (`/edit-task?id=…`, оба открываются модалкой), `map.tsx` (`/map`), `registration.tsx` (`/registration`), `child/[id]/index.tsx` (профиль ребёнка) и `child/[id]/tasks.tsx` (его задачи), `parent/[id]/index.tsx` и `parent/[id]/tasks.tsx` (профиль родителя и его задачи) и прочие табы. Это тонкие реэкспорты страниц из `src/pages/*` (`export { XPage as default } from '@pages/x'`), никакой логики в них нет. Папка роутов задана плагином в `app.json`: `["expo-router", { "root": "./app" }]`. Без этого Expo Router брал бы `src/app` (она приоритетнее корневой `app/`) и принял бы за роуты `providers/`. `main` в `package.json` — `expo-router/entry`. Новый экран: страница в `src/pages/<name>`, реэкспорт в `app/<route>.tsx`. Навигация: переход «вглубь» (плитки главной, чипы на карточках, профили, задачи из профиля) — `router.push`, «назад» — `router.back()`, а если истории нет (открыли по ссылке) — на главную. Вкладки навбара переключаются через `router.dismissTo`: если вкладка уже в истории (Family → Tasks → Family), стек откатывается к ней, иначе она заменяет текущий экран; тап по подсвеченной вкладке на вложенном экране так же возвращает к её корню. Профили ребёнка и родителя собраны из одних частей: `profile-header`, `HomeSummary`, `DaySummary`, `ScreenSection`, `MapPreview`.

**Моки.** Пока нет бэкенда, данные для отрисовки берём из моков в `src/shared/mocks/` (один файл на предметную область: `parent.ts`, `summary.ts`, `activity.ts`, `tasks.ts`, `operations.ts`, `family.ts` (`childProfilesMock` и `parentProfilesMock`: баланс или выплаченное, статус «дома», координаты; `inviteCodesMock`; счётчики задач считаются по задачам, а не хранятся), `parent.ts` (`parentMock` — вошедший родитель, `coParentMock` — второй) (даты — «дней назад» от сегодня), всё реэкспортируется через `index.ts`; картинки — в `mocks/images/`). При вёрстке нового экрана или виджета создавайте там недостающие моки, если реальных данных нет. Моки лежат в `shared`, поэтому не импортируют типы из `entities`: используйте `as const` и структурную совместимость, а типы данных объявляйте в `entities/*/model`. Страница берёт моки из `@shared/mocks` и передаёт их в виджеты через props; сами виджеты моки не импортируют. Когда появится API, заменяем только источник данных на странице.

**Данные с «сервера» (задачи).** Для сущностей, которые придут с бэкенда, данные идут как с настоящим API: эндпоинты в `entities/<name>/api`, чтение через React Query (`useTasks`), запись через мутации в `features/*/model` с инвалидацией ключей. Пока бэкенда нет, эндпоинты ходят в `entities/task/api/mock-server.ts`: он хранит задачи в памяти (стартовые данные из `tasksMock`, живут до перезапуска). С API меняются только тела функций в `tasks-api.ts`, а `mock-server.ts` удаляется. Страницы берут такие данные через хук запроса, а не напрямую из моков.

**Стили — только `StyleSheet`.** Tailwind, NativeWind и shadcn из проекта убраны: `className` не работает (Babel и Metro его не обрабатывают), не добавляйте их обратно и не ставьте компоненты через `npx shadcn add`. Стили модулей лежат в файлах `*.styled.ts` (`export const styles = StyleSheet.create(...)`), значения берутся из палитры и шкал `src/shared/theme/theme.ts` (`theme.colors`, `theme.fonts`, `theme.fontSize`). Компоненты UI-кита в `src/shared/ui` держат `StyleSheet` в том же файле (как `pill-button.tsx`) и реэкспортируются из `index.ts`. Состояния наведения и нажатия делаются через функцию `style` у `Pressable`: react-native-web добавляет к `pressed` поле `hovered` (см. `Button`). Веб-специфичные свойства (`transition*`) задаются через `Platform.select` с приведением типа. `Label` построен на `@rn-primitives/label` (на вебе это настоящий `<label htmlFor>`). Доменные компоненты (например, `RewardButton`) в `shared/ui` не кладите — им место в `entities`.

**Зависимости, о которых стоит знать:**

- `expo-clipboard` — нативный модуль: после его установки нужен новый dev-билд (`npm run ios` / `npm run android`).
- `@tanstack/react-query`, `zustand`, `react-native-mmkv` и `expo-secure-store` установлены для данных, состояния и хранилища, но пока не подключены.
- `babel-preset-expo` имеет версию `^57`, а `expo` — `~56`. Учитывайте это, если появятся ошибки Babel или Metro.

**Виджет карты (`src/widgets/map`)** — карта есть только в вебе (`map.web.tsx`, DOM-версия `maplibre-gl`). `index.ts` экспортирует `./map` и `./ui/map-preview`: на iOS и Android Metro берёт `map.tsx` и `ui/mini-map.tsx` — заглушки без MapLibre, поэтому в нативный бандл библиотека не попадает. `MapPreview` (превью в профиле, высота 180) в вебе рисует неподвижную мини-карту (`ui/mini-map.web.tsx`), без WebGL2 остаётся фон-заглушка. Карта создаётся через `model/create-map.ts` (воркер + `MAP_STYLE`), общий для большой карты и превью. Нативный `@maplibre/maplibre-react-native` установлен, но не используется и больше не указан в плагинах `app.json` (там остался только `expo-secure-store`).

- `model/use-map.ts` создаёт карту MapLibre GL и подключает оверлей deck.gl `MapboxOverlay`; возвращает `mapRef` и `deckOverlayRef`. Воркер раздаётся из `public/maplibre/maplibre-gl-worker.mjs` (`setWorkerUrl('/maplibre/...')`), его версия должна совпадать с закреплённой `maplibre-gl` 6.10.0.
- `config/map-style.ts` собирает стиль из тематических модулей в `layers/` (base, land, water, buildings, roads, places, poi), каждый из которых реэкспортируется через `index.ts`.
- `layers/dynamic/` отвечает за живые данные: позиции пользователей идут через GeoJSON-источник `users`, который обновляет `updateUserLocation`; транспорт рисуется слоем deck.gl (`createVehiclesLayer`) и передаётся через `deckOverlayRef.setProps`.

**Данные в реальном времени:** `src/features/location` и `src/features/buses` открывают обычные WebSocket к локальному бэкенду (адрес `WS_URL` в `shared/config`, по умолчанию `ws://localhost:3001`, переопределяется `EXPO_PUBLIC_WS_URL`; сообщения вида `{ event, data }`). Бэкенда в этом репозитории нет. В эмуляторе Android `localhost` — это сам эмулятор (нужен `10.0.2.2`), на реальном устройстве нужен IP компьютера. `useLocationSocket` дополнительно запускает браузерную геолокацию и отправляет её от имени захардкоженного пользователя `user-1`. Доменные типы лежат в `entities/*/model`.

**Прочее:** плагин `react-native-reanimated/plugin` в `babel.config.js` должен оставаться последним; `userInterfaceStyle` зафиксирован как `light`.
