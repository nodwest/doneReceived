---
name: dr-expo-testing
description: 'DoneReceived: тесты и проверка клиента. Use when asked to add or set up tests (jest-expo, React Native Testing Library), to write tests for a component, hook, query or flow, or to verify a finished UI change — including visual comparison with a Figma mockup — and to report which platforms were actually checked.'
---

# dr-expo-testing

Тест-раннер в проекте пока не настроен (`CLAUDE.md`, раздел «Команды»). Без явной задачи на настройку тестов зависимости не добавлять, а проверять изменения способами ниже.

## Если задача — настроить тесты

1. **Сначала** прочитать руководство Expo SDK 56 по unit-тестам: <https://docs.expo.dev/develop/unit-testing/>.
2. **Ставить через `npx expo install jest-expo jest @testing-library/react-native`** — так подберутся версии под SDK. Только npm, без yarn и без второго lock-файла.
3. **Добавить** скрипт `test` в `package.json`. Описать запуск в `CLAUDE.md` в разделе «Команды».
4. **Нативные модули мокать на границе:** secure-store, MMKV, clipboard, MapLibre. Логику компонента оставлять настоящей.

## Что тестировать

- **Действия пользователя:** нажатия, ввод, свайп, где это возможно.
- **Состояния экрана:** загрузка, ошибка, пусто, данные. И переходы между ними после ответа запроса.
- **Мутации:** что инвалидируется и что видно после ошибки. Для оптимистичных обновлений — откат.
- **Навигация:** куда ведёт действие, что происходит при `Stack.Protected` без сессии.
- **Переводы:** ключи в RU и EN.

## Пока тестов нет — как проверять

- `npx tsc --noEmit`, `npm run lint`, `npm run format:check`, `npm run lint:fsd`.
- Веб-сборку с dev-сервера (`npm run web`) открыть в браузере и пройти сценарий, включая ошибку. Если браузерные инструменты недоступны, подойдёт headless Chrome через протокол DevTools: скриншоты и замер положения элементов.
- **Макет:** сравнить скриншот реализации с Figma — размеры, цвета, состояния.

## Отчёт

Перечислить команды и их результат. Отдельно указать, какие платформы реально проверены — веб, iOS, Android — и что осталось непроверенным.
