# C4 — Семейный кошелёк · MVP

Экспорт диаграмм для GitHub, Notion, Mermaid Live Editor.

---

## Level 1 · System Context

```mermaid
flowchart LR
  Parent["👤 Родитель\nсоздаёт задачи, проверяет"]
  Child["👤 Ребёнок\nвыполняет задачи"]
  System["Семейный кошелёк\nMVP: виртуальные награды"]

  Parent -->|"регистрация, задачи, проверка"| System
  Child -->|"выполнение, баланс"| System
```

---

## Level 2 · Containers

```mermaid
flowchart TB
  subgraph System["Система «Семейный кошелёк»"]
    App["Мобильное приложение\nExpo · 2 роли UI"]
    ParentUI["Родитель UI\nзадачи, проверка"]
    ChildUI["Ребёнок UI\nсписок, «Я сделал!»"]
    API["API / Auth\nSupabase"]
    DB[("PostgreSQL\nсемьи, задачи, баланс")]

    App --> ParentUI
    App --> ChildUI
    App -->|"REST / Realtime"| API
    API -->|"SQL"| DB
  end
```

---

## Бизнес-процесс · 5 шагов

```mermaid
flowchart TD
  S1["1. Родитель регистрируется,\nдобавляет ребёнка"]
  S2["2. Создаёт задачу:\nназвание + сумма"]
  S3["3. Ребёнок жмёт\n«Я сделал!»"]
  S4["4. Родитель одобряет\nили отклоняет"]
  S5["5. Одобрено →\n+сумма на баланс ребёнка"]

  S1 --> S2 --> S3 --> S4 --> S5

  style S1 fill:#3FA26633,stroke:#3FA266
  style S2 fill:#3FA26633,stroke:#3FA266
  style S3 fill:#D0877033,stroke:#D08770
  style S4 fill:#3FA26633,stroke:#3FA266
  style S5 fill:#7BAFE933,stroke:#7BAFE9
```

---

## Жизненный цикл задачи

```mermaid
stateDiagram-v2
  [*] --> new: родитель создал
  new --> pending: ребёнок «Я сделал!»
  pending --> approved: родитель одобрил
  pending --> rejected: родитель отклонил
  rejected --> new: переделать
  approved --> [*]: balance += reward

  new: Новая
  pending: На проверке
  approved: Одобрена
  rejected: Отклонена
```

---

## Модель данных (MVP)

| Сущность | Описание | Ключевые поля |
|----------|----------|---------------|
| Family | семья | name, invite_code |
| User | пользователь | role: parent\|child, name, balance |
| Task | задача | title, reward, status, assigned_to |
| Transaction | операция | amount, type: earn, task_id |

---

## Бизнес-правила

1. Деньги **виртуальные** — реальная выплата вне приложения
2. Баланс меняется **только** после одобрения родителем
3. Отклонённая задача возвращается ребёнку на доработку
4. Один родитель + 1–3 ребёнка в MVP

---

## Шаг 1 · детализация

### 1a. Регистрация родителя
1. Email + пароль
2. Имя родителя
3. Создаётся Family
4. role = parent

### 1b. Добавление ребёнка
1. Имя + возраст
2. role = child
3. balance = 0
4. Привязка к Family

### 1c. Результат
1. Family с 1+ детьми
2. Семейный код для входа ребёнка
3. Готов к шагу 2
