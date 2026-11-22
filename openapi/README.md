# Calendar API contract

`calendar.json` — календарный срез OpenAPI, который генерирует backend:

```bash
# в ../doneReceived-backend
yarn openapi:generate
```

Затем скопируйте `../doneReceived-backend/openapi/calendar.json` сюда и
перегенерируйте типы:

```bash
npm run openapi:types
```

`src/entities/family-event/api/generated/calendar.ts` создан
`openapi-typescript@7.13.0`; правки в нём не сохраняются. Версия инструмента
зафиксирована в `package.json`, потому что `openapi-typescript` 7.x заявляет
peer `typescript@^5`, а проект использует TypeScript 6. Генерация запускается
через `npx` с точной версией, а готовый файл лежит в репозитории: сборка
приложения от codegen не зависит.
