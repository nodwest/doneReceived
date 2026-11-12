# Навыки Codex для DoneReceived

Командная версия от 12 ноября 2026 года. Файл можно целиком передать агенту. Рекомендации охватывают разработку клиента и backend, дизайн, тестирование, безопасность и эксплуатацию на стеке DoneReceived.

Три навыка `expo-router`, `expo-data-fetching` и `expo-dev-client` покрывают базовую разработку клиента. Для полного цикла используйте остальные направления ниже. Агент выбирает подходящие навыки по текущей задаче.

## 1. Основа рекомендаций

| Область | Стек |
| --- | --- |
| Клиент | Expo SDK 56, React Native 0.85, React 19, TypeScript 6, Expo Router, Android/iOS/web |
| Архитектура | Feature-Sliced Design, Steiger, платформенные файлы |
| UI | StyleSheet, собственные токены темы, Inter, Reanimated 4, SVG, safe areas |
| Данные | TanStack Query 5, Zustand 5, MMKV 4, Expo SecureStore |
| Локализация | i18next, react-i18next, expo-localization |
| Карта | MapLibre GL JS, MapLibre React Native, deck.gl, Protomaps |
| Backend | Node.js 24, NestJS 12, TypeScript/ESM, Express, platform-ws |
| База | PostgreSQL, Drizzle ORM 0.45, Drizzle Kit 0.31, pg, SQL-миграции. CI использует PostgreSQL 18 |
| API и auth | Swagger/OpenAPI, class-validator, class-transformer, Passport, JWT, Argon2 |
| Серверные интеграции | Nodemailer/SMTP, Sharp, изображения и фоновые операции |
| Проверки | Backend Vitest, Supertest, Oxlint. Frontend ESLint, Prettier, Steiger |
| Эксплуатация | GitHub Actions, Nginx, VPS/systemd. Карты — Docker Compose, go-pmtiles, PMTiles/TileJSON/MVT |

Основа — манифесты и документация проекта. Перед задачей уточняйте версии по lockfile. NativeWind/Tailwind упоминаются в описании стека, но отсутствуют в текущем package.json клиента. Просмотренный UI использует StyleSheet и токены темы.

## 2. Expo Skills

Официальный пакет содержит следующие подходящие навыки. Основной набор рекомендуется команде клиента, остальные активируются по задачам.

| Приоритет | Точное имя | Назначение |
| --- | --- | --- |
| Основной | `expo-overview` | Общая точка входа |
| Основной | `expo-router` | Навигация |
| Основной | `expo-data-fetching` | Запросы и кэш |
| Основной | `expo-dev-client` | Development builds |
| Основной | `expo-native-ui` | Экраны |
| Основной | `expo-design-system` | Токены и компоненты |
| По задаче | `expo-animation` | Анимации и жесты |
| По задаче | `expo-project-structure` | Структура клиента |
| По задаче | `expo-upgrade` | Обновление SDK |
| По задаче | `expo-module` | Нативные модули |
| По задаче | `expo-examples` | Примеры интеграций |
| При выборе технологии | `expo-ui` | Компоненты @expo/ui |
| При выборе технологии | `expo-dom` | DOM внутри native |
| При использовании EAS | `eas-app-stores` | Выпуск |
| При использовании EAS | `eas-workflows` | CI/CD |
| При использовании EAS | `eas-update` | OTA |
| При использовании EAS | `eas-update-insights` | Проверка OTA |
| При использовании EAS | `eas-observe` | Наблюдаемость |
| При использовании EAS | `eas-simulator` | Облачные устройства |

Для Codex авторы рекомендуют плагин `expo` из каталога OpenAI. Команда из инструкции — `codex plugin add expo@openai-curated`. В desktop используйте Plugins. Плагин включает конфигурацию Expo MCP. EAS-сервисы могут требовать аккаунта и подходящего тарифа. [Expo Skills и установка](https://github.com/expo/skills).

Скилл структуры применяйте с учётом FSD. @expo/ui и DOM используйте при выборе этих технологий для конкретной функции. SDK-обновления выполняйте отдельной задачей с проверкой native builds. До написания Expo-кода читайте [документацию SDK 56](https://docs.expo.dev/versions/v56.0.0/).

## 3. React Native и архитектура компонентов

| Готовый скилл Vercel | Когда нужен | Результат |
| --- | --- | --- |
| `vercel-react-native-skills` | Реализация и ревью RN | Проверки списков, изображений, рендеров, safe areas, клавиатуры, Reanimated и платформенных API |
| `vercel-composition-patterns` | Развитие общих компонентов | Понятные props, композиция и состояние с сохранением public API и границ FSD |

Подключайте выборочно из [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills). Для оптимизации фиксируйте воспроизводимый сценарий и измерения до/после на сопоставимых сборках.

## 4. Создание дизайна и перенос в код

Следующие навыки подтверждены в каталоге Figma текущего окружения. В другом агенте названия могут иметь префикс `figma:`. Доступ к внешнему файлу проверяется через аккаунт участника.

| Скилл | Для чего нужен |
| --- | --- |
| `figma-create-new-file` | Новый файл Design или FigJam |
| `figma-use` | Чтение и редактирование элементов |
| `figma-generate-design` | Создание и обновление экранов |
| `figma-generate-library` | Токены, переменные и варианты компонентов |
| `figma-design-to-code` | Реализация макета средствами React Native |
| `figma-code-connect` | Связь компонента макета с кодом |
| `figma-spec` | Спецификации в Figma |
| `figma-generate-diagram` | Сценарии, состояния и архитектура |
| `figma-use-motion`, `figma-implement-motion` | Движение в макете и перенос подходящего поведения в код |
| `imagegen` | Иллюстрации и растровые ассеты |

Дизайн должен включать состояния loading, empty, error, disabled и success. Проверяйте маленькие экраны, длинные строки RU/EN, системный размер шрифта, клавиатуру, VoiceOver/TalkBack, web-фокус, контраст и зоны нажатия. Учитывайте настройку уменьшения движения.

Используйте существующие цвета, типографику, интервалы и радиусы. При переносе из Figma сверяйте поддержку layout, шрифтов и эффектов на целевых платформах. Завершайте визуальным сравнением реализации и макета.

## 5. Backend и PostgreSQL

### Готовые навыки

| Скилл | Источник и статус | Ограничения применения |
| --- | --- | --- |
| `nestjs-best-practices` | Сторонний скилл Kadajett, SKILL.md проверен | Адаптировать к NestJS 12, ESM, Drizzle, Vitest и модульному монолиту |
| `drizzle` | Официальный скилл Drizzle, инструкция для Drizzle Kit RC | Проверить совместимость с установленными ORM 0.45 / Kit 0.31 до подключения |

NestJS-скилл содержит правила модулей, DI, ошибок, безопасности, API, производительности и тестирования. Новые абстракции, repository-слои и события должны быть обоснованы задачей. [Исходник nestjs-best-practices](https://github.com/Kadajett/agent-nestjs-skills/blob/main/skills/nestjs-best-practices/SKILL.md).

Официальная инструкция Drizzle описывает RC-пакеты и `drizzle-kit skills`. Поддержка этой команды текущим Kit 0.31 не подтверждена. Обновление ORM требует отдельной задачи. До проверки совместимости применяйте workflow ниже. [Drizzle agent skills](https://orm.drizzle.team/docs/cockroach/drizzle-kit-skills).

### Проектные навыки

Имена `dr-*` далее обозначают собственные навыки DoneReceived. Все 20 SKILL.md созданы в пользовательском каталоге Codex на компьютере автора. Другие участники могут воспроизвести их по этому файлу через skill-creator. Статус локального подключения приведён в разделе 13.

| Навык | Триггер | Действия и результат |
| --- | --- | --- |
| `dr-nestjs-api` | Новый endpoint или изменение API | Модуль, DI, DTO, runtime-валидация, guard, ресурсные права, сервис, ошибки и OpenAPI согласованы |
| `dr-api-contracts` | Изменение взаимодействия клиента и API | Сверить JSON/multipart, nullable-поля, суммы, даты, pagination, ошибки, Retry-After и клиентские типы |
| `dr-drizzle-postgres` | Схема, миграция или запрос | Проверить SQL, ограничения, индексы, старые данные, транзакции, блокировки и восстановление. Для медленных запросов использовать EXPLAIN в подходящей тестовой среде |
| `dr-transaction-review` | Связанные записи, балансы, одноразовые операции | Определить инварианты и порядок блокировок. Проверить гонку, повтор, частичный сбой и отсутствие двойного эффекта |
| `dr-realtime` | Клиентский или серверный WebSocket | Контракт сообщений, auth, reconnect/backoff, истечение токена, очистка подписок, лимиты, медленный получатель и устаревшие данные |
| `dr-media-email-jobs` | Sharp, загрузки, SMTP, фоновые операции | Ограничения файлов, декодирование, метаданные, доступ и очистка. Таймауты SMTP, повторы и сбои. Повторный запуск jobs и несколько экземпляров API |
| `dr-code-review` | Перед завершением изменения | Проверить реальные вызовы, совместимость, ошибочные пути и регрессии. Каждое замечание содержит место в коде и воспроизводимый сценарий |

Источники для workflow — [NestJS](https://docs.nestjs.com/), [Drizzle](https://orm.drizzle.team/docs/overview), [PostgreSQL 18](https://www.postgresql.org/docs/18/). Агент открывает нужные разделы под версии задачи.

## 6. Безопасность

### Готовые скиллы OpenAI

| Скилл | Когда применять | Результат |
| --- | --- | --- |
| `security-best-practices` | Явная задача на security review или безопасную реализацию | Проверка JS/TS и доступных framework-guidelines, приоритеты и исправления |
| `security-threat-model` | Явная задача на модель угроз | Активы, границы доверия, атаки и меры с привязкой к коду |
| `security-ownership-map` | Анализ ответственности за чувствительный код | Карта по Git-истории и риски недостаточного числа сопровождающих |

Исходники определяют триггеры и зависимости. JS/TS-проверки дополняйте native storage и разрешениями. [Best practices](https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices), [Threat model](https://github.com/openai/skills/tree/main/skills/.curated/security-threat-model), [Ownership map](https://github.com/openai/skills/tree/main/skills/.curated/security-ownership-map).

### Проектный навык `dr-mobile-api-security`

Применять к изменениям авторизации, доступа, хранения, загрузки и передачи данных.

- Проверить права на конкретный ресурс, принадлежность семье/аккаунту и чужие идентификаторы.
- Проверить JWT, expiry, refresh rotation/reuse, параллельные 401, logout и отзыв устройства.
- Проверить пароли, одноразовые коды, лимиты попыток и утечку существования аккаунта.
- Проверить SecureStore, MMKV и web storage, очистку кэша по аккаунту и восстановление из backup. Оценить XSS для web-сессии.
- Проверить HTTPS/WSS, EXPO_PUBLIC-переменные, deep links, разрешения камеры/фото/геолокации и минимизацию данных.
- Для web проверить CORS и XSS. При cookie-auth проверить CSRF и параметры cookie.
- Проверить SQL-параметризацию, runtime-валидацию, раскрытие полей и изменение защищённых полей.
- Для файлов проверить объём, число пикселей, декодирование, EXIF, права и очистку. При серверной загрузке внешних URL проверить SSRF.
- Проверить логи, crash reports и артефакты CI на утечку токенов, координат, фото и персональных данных.
- Проверить зависимости, секреты, контейнеры и права CI. Каждую находку связать с кодом, сценарием, серьёзностью и повторной проверкой.

Для мобильной части использовать категории хранения, auth, сети, платформы и приватности [OWASP MASVS](https://mas.owasp.org/MASVS/).

Для последующей настройки CI рассмотреть Gitleaks, Dependabot или эквивалент, CodeQL либо Semgrep и Trivy. Это исполняемые инструменты проверки секретов, зависимостей, кода и контейнеров. Их доступность, условия использования и правила проверяются при настройке. Security skill помогает проверить применимость результатов к приложению.

## 7. Тестирование и качество

| Уровень | Навык | Инструменты и результат |
| --- | --- | --- |
| Backend unit/API | `dr-backend-testing` — проектный | Существующие Vitest/Supertest. Валидация, доступ, бизнес-ветвления, миграции и транзакции на отдельной PostgreSQL |
| Клиентские компоненты | `dr-expo-testing` — проектный | Настроить Jest + jest-expo + React Native Testing Library под SDK 56. Проверять взаимодействия, навигацию и состояния данных |
| Web-проверка через агента | Готовый `playwright` | Управление браузером, скриншоты и трассировка |
| Web E2E в CI | `dr-web-e2e` — проектный | Playwright Test, повторяемые сценарии и артефакты падений |
| Native E2E | `dr-native-e2e` — проектный | Maestro на собранном приложении и устройстве/эмуляторе |
| Визуальная проверка | Figma + `dr-expo-testing` | Макет, состояния, экраны разных размеров, RU/EN и доступность |
| Нагрузка | `dr-performance` — проектный | HTTP/WS, БД, память и задержки под согласованной нагрузкой в тестовой среде |

Скилл playwright использует CLI и Bash-wrapper. На Windows проверить подходящую оболочку или доступный способ вызова CLI. Постоянные Playwright Test тесты настраиваются отдельной задачей. [Скилл OpenAI](https://github.com/openai/skills/tree/main/skills/.curated/playwright), [Playwright Test](https://playwright.dev/docs/intro).

Expo публикует руководство по jest-expo и пример Maestro. Версии зависимостей и совместимость сборок нужно проверить при настройке. Локальная iOS-сборка требует macOS/Xcode. Браузерная проверка даёт результат только для web-сценария. [Unit testing Expo](https://docs.expo.dev/develop/unit-testing/), [Maestro в Expo](https://docs.expo.dev/eas/workflows/examples/e2e-tests/).

Текущие команды:

- Backend — `yarn lint`, `yarn test`, `yarn build`, `yarn test:e2e`. Последняя команда включает сборку и требует отдельного `TEST_DATABASE_URL`.
- Frontend — скрипты `lint`, `format:check`, `lint:fsd`. Проверку типов и тестовые скрипты добавить в задаче настройки тестирования. На дату сверки test-скрипт отсутствует.
- Использовать package manager репозитория и lockfile. Backend фиксирует Yarn 4, клиент содержит package-lock.json.

Для исправления ошибки сначала воспроизведите её. Выбирайте проверки по затронутым сценариям и риску. Для важных операций включайте повтор, отказ, сетевой сбой и конкурентный вызов. В результате указывайте команды, статус и непроверенные платформы.

## 8. Данные клиента, локализация и карты

| Проектный навык | Обязательное содержание |
| --- | --- |
| `dr-client-state` | Query keys, invalidation, retry, отмена, optimistic update/rollback и очистка по аккаунту. Zustand для UI, MMKV для некритичных данных, SecureStore/web storage по платформе. Для offline определить синхронизацию и конфликты |
| `dr-i18n-accessibility` | RU/EN, plural forms, даты/время/числа, длинные строки, диктор, фокус, dynamic type, reduced motion |
| `dr-maps-location` | MapLibre web/native, Protomaps-стиль, deck.gl на web, координаты, атрибуция, слои, lifecycle, reconnect, актуальность позиции, разрешения и батарея |
| `dr-device-integrations` | Фото/камера, deep links, уведомления и background APIs при добавлении функции. Проверять разрешения, native-конфигурацию, development build и платформенные ограничения |

Пуши и фоновая геолокация требуют отдельной реализации с проверкой SDK-пакетов. Отличайте планируемую интеграцию от установленной зависимости.

## 9. GitHub, CI/CD и эксплуатация

| Скилл или workflow | Применение |
| --- | --- |
| GitHub plugin / GitHub CLI | Репозиторий, PR, проверки и журналы |
| `gh-fix-ci` | Упавшие GitHub Actions checks. Исходный skill предусматривает согласование плана исправления |
| `gh-address-comments` | Разбор и исправление выбранных комментариев PR |
| `dr-release-ops` — проектный | Миграции, конфигурация, TLS/WS proxy, readiness, systemd/Docker, backup/restore и откат |
| `dr-observability` — проектный | Логи без секретов, correlation ID, ошибки, latency, пул БД, WS, SMTP/jobs и диагностические инструкции |
| `dr-map-service-ops` — проектный | PMTiles, Range 206, TileJSON/MVT, CORS, стиль, ресурсы импорта, контрольные суммы и восстановление |

GitHub-сценариям нужны доступ к репозиторию и зависимости скриптов, включая gh/Python. [gh-fix-ci](https://github.com/openai/skills/tree/main/skills/.curated/gh-fix-ci), [gh-address-comments](https://github.com/openai/skills/tree/main/skills/.curated/gh-address-comments).

Для выпуска проверять порядок миграции/запуска, совместимость данных, readiness и восстановление. Пробные миграции и тесты выполнять на отдельной среде. Работа с production определяется явной задачей пользователя и правилами проекта.

## 10. Подключение командой

1. Проверить доступные навыки в своём агенте.
2. Для клиента подключить Expo. Для дизайна — Figma. Для RN-ревью — vercel-react-native-skills и vercel-composition-patterns. Для браузера — playwright. В репозитории Vercel соответствующие каталоги называются react-native-skills и composition-patterns.
3. Для безопасности подключить security-best-practices и security-threat-model. Ownership map использовать по задаче на ответственность команды.
4. Для backend оценить nestjs-best-practices и применять workflow текущего Drizzle/PostgreSQL. Официальный drizzle подключать после проверки версии Kit.
5. Для PR/CI подключить GitHub и нужные GitHub Skills.
6. Повторяемые dr-* оформить отдельными SKILL.md через доступный skill-creator. Готовые навыки устанавливать через доступный skill-installer либо по инструкции автора.
7. Проверить обнаружение и пробный вызов навыка. Зафиксировать источник и версию/commit для воспроизводимости.

Пример запроса на установку:

```text
Используй skill-installer для установки
https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices
Проверь зависимости и обнаружение навыка в моём агенте.
```

Файл передаёт рабочие инструкции на текущий чат. Постоянное подключение требует установки плагина или SKILL.md в поддерживаемое агентом место. Наличие каталога не доказывает успешный вызов навыка. Фактические проверки текущей установки перечислены в разделе 13.

## 11. Сообщение агенту

> Используй этот файл как руководство по стеку DoneReceived. Прочитай применимые AGENTS.md и проверь версии из package.json и lockfile. Для Expo SDK 56 используй versioned docs. Определи доступные скиллы для моей задачи и загрузи их инструкции. Учитывай FSD, компоненты и токены, NestJS-модули, Drizzle и принятые инструменты тестирования.
>
> Если нужный навык недоступен, выполни его workflow из файла по официальной документации установленной версии. Имена dr-* обозначают локальные навыки DoneReceived. При задаче на настройку окружения проверь их наличие, создай недостающие через skill-creator и сообщи место установки.
>
> Для изменения API, данных, auth или UI определи критерии приёмки и проверки. Учитывай ошибки, старые данные, повтор и конкурентность. Проверь затронутые платформы. Обновляй документацию при изменении описанного поведения. В результате перечисли изменения, выполненные проверки и ограничения.

## 12. Проверка полноты

| Область | Покрытие |
| --- | --- |
| Expo, Router, native builds и SDK | Expo Skills |
| RN, TypeScript, FSD, UI и анимации | Expo, Vercel, правила репозитория |
| Query, Zustand, MMKV, SecureStore | expo-data-fetching, dr-client-state |
| i18next и доступность | dr-i18n-accessibility |
| Дизайн и компоненты | Figma, expo-design-system |
| NestJS, DTO, OpenAPI | nestjs-best-practices, dr-nestjs-api, dr-api-contracts |
| Drizzle, SQL и транзакции | dr-drizzle-postgres, dr-transaction-review |
| Auth и приватность | Security Skills, dr-mobile-api-security |
| WS, карты и геолокация | dr-realtime, dr-maps-location |
| Sharp, SMTP и jobs | dr-media-email-jobs |
| Unit, integration, web/native E2E | Раздел 7 |
| CI/CD, Nginx, VPS, Docker, PMTiles | Раздел 9 |

Проверены текущий файл, манифесты, описание стека, доступный каталог и указанные исходники готовых навыков. По сравнению с прежней версией добавлены полноценные направления backend, безопасности, тестирования, локализации, производительности и эксплуатации. Совместимость Drizzle RC и доступ к внешним сервисам требуют проверки в окружении участника.

## 13. Фактическое подключение на компьютере автора

Установлено 12 ноября 2026 года в `C:/Users/Vishnya/.codex/skills`. Все 48 новых навыков обнаружены локальным Codex через `skills/list`, включены и прошли проверку SKILL.md без ошибок.

| Набор | Количество | Подтверждение |
| --- | --- | --- |
| Expo/EAS из официального репозитория | 19 | Включают все имена из раздела 2 |
| Vercel React Native и composition | 2 | Фактические имена — vercel-react-native-skills и vercel-composition-patterns |
| NestJS | 1 | nestjs-best-practices |
| OpenAI Security, Playwright и GitHub | 6 | Три security-скилла, playwright, gh-fix-ci, gh-address-comments |
| Проектные DoneReceived | 20 | Все dr-* из таблиц созданы и включены |

Дополнительно установлен плагин `expo@openai-curated`. Его версия каталога содержит более старый набор имён, поэтому 19 нужных Expo/EAS-навыков установлены напрямую из официального репозитория. В этой версии плагина MCP-конфигурация отсутствовала. Expo MCP отдельно добавлен по официальному адресу `https://mcp.expo.dev/mcp`, включён и успешно авторизован пользователем.

Доступ к Figma и GitHub подтверждён запросами профиля через подключённые инструменты. Figma-навыки, imagegen, skill-creator и skill-installer уже были доступны в сеансе.

Зафиксированные источники установки:

- Expo Skills — `a9e5bd3fa00b4e61f632e43f85da73aee1942582`.
- Vercel Agent Skills — `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`.
- Kadajett NestJS Skills — `3986e0cede33958e000f959031cbee0cd83c2941`.
- OpenAI Skills — `49f948faa9258a0c61caceaf225e179651397431`.

Для скриптов создано отдельное Python-окружение `C:/Users/Vishnya/.codex/tools/donereceived-python/Scripts/python.exe` с PyYAML 6.0.3 и networkx 3.7. Проверен запуск помощника security-ownership-map. Проверен запуск Playwright CLI через `npx.cmd --yes --package @playwright/cli playwright-cli --help`.

GitHub CLI 2.103.3 установлен в `C:/Users/Vishnya/.codex/tools/github-cli/bin/gh.exe`. Вход в CLI ещё не выполнен. Подключённый GitHub-плагин уже авторизован, а для сценариев, которым обязательно нужен gh, потребуется отдельный `gh auth login`. В четыре навыка с локальными помощниками добавлены инструкции с реальными Windows-путями и способом запуска.

Официальный RC-скилл Drizzle отложен из-за несовпадения с версией проекта. Для текущего стека подключён dr-drizzle-postgres. Навыки настройки Jest, Maestro, Playwright Test и CI-сканеров готовы к использованию; сами тестовые контуры и сканеры в приложения этой установкой не добавлялись.

Проверка установки подтверждает корректность файлов и обнаружение навыков. Прогон всех их сценариев на приложении, устройствах и production-инфраструктуре не выполнялся. Новые навыки доступны Codex со следующего сообщения. У каждого участника команды собственная установка и авторизация сервисов.

