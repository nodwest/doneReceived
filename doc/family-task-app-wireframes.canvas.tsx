import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Text,
  mergeStyle,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";
import type { CSSProperties, ReactElement } from "react";

type PhoneMode = "child" | "parent" | "shared";
type TaskIcon = "house" | "book" | "trash" | "dog" | "star";

type ScreenSpec = {
  id: string;
  title: string;
  subtitle: string;
  body: () => ReactElement;
};

function tint(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function TaskIconSvg({ kind, color, size = 20 }: { kind: TaskIcon; color: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: color };
  if (kind === "house") {
    return (
      <svg {...common}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    );
  }
  if (kind === "book") {
    return (
      <svg {...common}>
        <path d="M6 4h9a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2V4Zm0 0a2 2 0 0 0-2 2v14h11V6a2 2 0 0 0-2-2H6Zm4 4h5v2h-5V8Z" />
      </svg>
    );
  }
  if (kind === "trash") {
    return (
      <svg {...common}>
        <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM7 9h2v9H7V9Z" />
      </svg>
    );
  }
  if (kind === "dog") {
    return (
      <svg {...common}>
        <path d="M7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4 12a3 3 0 0 1 3-3h1.2a4 4 0 0 1 3.6 2.2l.7 1.4h1l.7-1.4A4 4 0 0 1 17.8 9H19a3 3 0 0 1 3 3v1H4v-1Zm2 3h12l-1.2 5H7.2L6 15Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3.5 14.6 9H21l-5.4 3.9 2.1 6.6L12 17.8 6.3 19.5l2.1-6.6L3 9h6.4L12 3.5Z" />
    </svg>
  );
}

function CoinBadge({ amount }: { amount: string }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 999,
        background: tint(theme.category.yellow, 0.22),
        border: `1px solid ${tint(theme.category.yellow, 0.45)}`,
      }}
    >
      <TaskIconSvg kind="star" color={theme.category.yellow} size={12} />
      <Text size="small" weight="medium" style={{ color: theme.category.yellow }}>
        {amount}
      </Text>
    </div>
  );
}

function FamilyIllustration() {
  const theme = useHostTheme();
  return (
    <svg width="100%" height="88" viewBox="0 0 220 88" aria-hidden>
      <rect x="78" y="34" width="64" height="42" rx="6" fill={tint(theme.category.orange, 0.35)} />
      <polygon points="74,36 110,12 146,36" fill={tint(theme.category.pink, 0.5)} />
      <rect x="102" y="52" width="16" height="24" rx="2" fill={tint(theme.category.orange, 0.55)} />
      <circle cx="52" cy="58" r="14" fill={tint(theme.category.blue, 0.45)} />
      <rect x="44" y="70" width="16" height="18" rx="8" fill={tint(theme.category.blue, 0.35)} />
      <circle cx="110" cy="56" r="12" fill={tint(theme.category.yellow, 0.5)} />
      <rect x="102" y="66" width="16" height="16" rx="8" fill={tint(theme.category.yellow, 0.35)} />
      <circle cx="162" cy="60" r="11" fill={tint(theme.category.green, 0.45)} />
      <rect x="154" y="70" width="16" height="16" rx="8" fill={tint(theme.category.green, 0.35)} />
    </svg>
  );
}

function PhoneFrame({
  title,
  subtitle,
  children,
  mode = "shared",
  navItems,
}: {
  title: string;
  subtitle: string;
  children: ReactElement;
  mode?: PhoneMode;
  navItems?: string[];
}) {
  const theme = useHostTheme();
  const isChild = mode === "child";
  const isParent = mode === "parent";

  const headerColor = isChild
    ? theme.category.orange
    : isParent
      ? theme.category.green
      : theme.category.pink;

  const frame: CSSProperties = {
    width: 260,
    minHeight: isChild ? 440 : 420,
    borderRadius: isChild ? 24 : 16,
    border: `2px solid ${isChild ? tint(theme.category.yellow, 0.45) : theme.stroke.secondary}`,
    background: isChild ? tint(theme.category.yellow, 0.06) : theme.bg.editor,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const statusBar: CSSProperties = {
    height: isChild ? 36 : 28,
    padding: "6px 12px",
    background: isChild ? headerColor : isParent ? tint(headerColor, 0.28) : tint(headerColor, 0.22),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const content: CSSProperties = {
    padding: isChild ? 14 : 12,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: isChild ? 10 : 8,
  };

  const defaultNav =
    mode === "child"
      ? ["Задачи", "Кошелёк", "Мечта"]
      : mode === "parent"
        ? ["Дом", "Задачи", "Дети"]
        : ["Главная", "Вход", "Семья"];

  const nav: CSSProperties = {
    borderTop: `1px solid ${theme.stroke.tertiary}`,
    padding: isChild ? "10px 6px" : "8px 6px",
    display: "flex",
    justifyContent: "space-around",
    background: isChild ? tint(theme.category.yellow, 0.1) : theme.bg.chrome,
  };

  const statusTextColor = isChild ? theme.text.onAccent : theme.text.primary;

  return (
    <Stack gap={6} style={{ alignItems: "stretch" }}>
      <Stack gap={2}>
        <Text weight="medium">{title}</Text>
        <Text tone="secondary" size="small">
          {subtitle}
        </Text>
      </Stack>
      <div style={frame}>
        <div style={statusBar}>
          <Text size="small" style={{ color: statusTextColor }}>
            9:41
          </Text>
          <Text size="small" weight="medium" style={{ color: statusTextColor }}>
            {isChild ? "Привет, Маша!" : title}
          </Text>
          <Text size="small" style={{ color: statusTextColor }}>
            ...
          </Text>
        </div>
        <div style={content}>{children}</div>
        <div style={nav}>
          {(navItems ?? defaultNav).map((item, index) => (
            <span key={item}>
              <Text
                size="small"
                weight={index === 0 ? "medium" : undefined}
                style={{
                  color: index === 0 && isChild ? theme.category.orange : undefined,
                }}
              >
                {item}
              </Text>
            </span>
          ))}
        </div>
      </div>
    </Stack>
  );
}

function WireBlock({
  label,
  height = 32,
  filled,
  dashed,
  rounded,
}: {
  label: string;
  height?: number;
  filled?: boolean;
  dashed?: boolean;
  rounded?: boolean;
}) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        height,
        borderRadius: rounded ? 14 : 8,
        border: dashed
          ? `1px dashed ${theme.stroke.secondary}`
          : `1px solid ${theme.stroke.tertiary}`,
        background: filled ? theme.fill.secondary : theme.fill.tertiary,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        width: "100%",
      }}
    >
      <Text size="small" tone={filled ? "primary" : "secondary"}>
        {label}
      </Text>
    </div>
  );
}

function WireButton({
  label,
  primary,
  kid,
  color,
}: {
  label: string;
  primary?: boolean;
  kid?: boolean;
  color?: string;
}) {
  const theme = useHostTheme();
  const bg = primary ? (color ?? (kid ? theme.category.orange : theme.accent.primary)) : theme.fill.secondary;
  return (
    <div
      style={{
        height: kid ? 48 : 36,
        borderRadius: kid ? 16 : 10,
        background: bg,
        border: primary ? "none" : `1px solid ${theme.stroke.secondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        size={kid ? "body" : "small"}
        weight="medium"
        style={{ color: primary ? theme.text.onAccent : theme.text.primary }}
      >
        {label}
      </Text>
    </div>
  );
}

function ParentTaskRow({
  title,
  reward,
  status,
  childName,
}: {
  title: string;
  reward: string;
  status: "new" | "pending" | "done";
  childName?: string;
}) {
  const theme = useHostTheme();
  const statusLabel =
    status === "new" ? "Новая" : status === "pending" ? "Проверка" : "Готово";
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 10,
        border: `1px solid ${theme.stroke.tertiary}`,
        background: theme.fill.tertiary,
      }}
    >
      <Row align="center" justify="space-between">
        <Stack gap={2}>
          <Text size="small" weight="medium">
            {title}
          </Text>
          <Row gap={6} align="center">
            <Text size="small" tone="secondary">
              {reward}
            </Text>
            {childName ? (
              <Text size="small" style={{ color: theme.category.pink }}>
                {childName}
              </Text>
            ) : null}
          </Row>
        </Stack>
        <Pill tone={status === "done" ? "success" : status === "pending" ? "warning" : "neutral"} size="sm">
          {statusLabel}
        </Pill>
      </Row>
    </div>
  );
}

function KidTaskRow({
  title,
  reward,
  status,
  icon,
}: {
  title: string;
  reward: string;
  status: "new" | "pending" | "done";
  icon: TaskIcon;
}) {
  const theme = useHostTheme();
  const iconColor =
    icon === "house"
      ? theme.category.orange
      : icon === "book"
        ? theme.category.blue
        : icon === "dog"
          ? theme.category.green
          : theme.category.pink;
  const cardBg =
    status === "done"
      ? tint(theme.category.green, 0.12)
      : status === "pending"
        ? tint(theme.category.yellow, 0.12)
        : tint(theme.category.orange, 0.1);

  return (
    <div
      style={{
        padding: 14,
        borderRadius: 16,
        border: `1px solid ${tint(iconColor, 0.35)}`,
        background: cardBg,
      }}
    >
      <Row align="center" gap={10}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: tint(iconColor, 0.2),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <TaskIconSvg kind={icon} color={iconColor} size={20} />
        </div>
        <Stack gap={4} style={{ flex: 1 }}>
          <Text weight="medium">{title}</Text>
          <CoinBadge amount={reward} />
        </Stack>
        <Pill tone={status === "done" ? "success" : status === "pending" ? "warning" : "neutral"} size="sm">
          {status === "new" ? "Жду" : status === "pending" ? "Ждём" : "Ура!"}
        </Pill>
      </Row>
    </div>
  );
}

function ParentBalanceCard({ amount, label }: { amount: string; label: string }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: tint(theme.category.green, 0.12),
        border: `1px solid ${tint(theme.category.green, 0.3)}`,
      }}
    >
      <Text size="small" tone="secondary">
        {label}
      </Text>
      <Text weight="medium" style={{ fontSize: 22, lineHeight: "28px" }}>
        {amount}
      </Text>
    </div>
  );
}

function KidBalanceCard({ amount, label }: { amount: string; label: string }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        background: tint(theme.category.yellow, 0.18),
        border: `2px solid ${tint(theme.category.yellow, 0.4)}`,
        textAlign: "center",
      }}
    >
      <Text size="small" tone="secondary">
        {label}
      </Text>
      <Text weight="medium" style={{ fontSize: 32, lineHeight: "38px", color: theme.category.orange }}>
        {amount}
      </Text>
    </div>
  );
}

function GoalProgress({ title, current, target }: { title: string; current: number; target: number }) {
  const theme = useHostTheme();
  const pct = Math.round((current / target) * 100);
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 18,
        background: tint(theme.category.pink, 0.12),
        border: `1px solid ${tint(theme.category.pink, 0.3)}`,
      }}
    >
      <Row align="center" justify="space-between">
        <Text size="small" weight="medium">
          {title}
        </Text>
        <Text size="small" tone="secondary">
          {current} / {target} ₽
        </Text>
      </Row>
      <div
        style={{
          marginTop: 10,
          height: 14,
          borderRadius: 999,
          background: theme.fill.quaternary,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: theme.category.pink,
          }}
        />
      </div>
      <Text size="small" tone="tertiary" style={{ marginTop: 6 }}>
        Ещё {target - current} ₽ до мечты
      </Text>
    </div>
  );
}

function ChildAvatar({ name, color }: { name: string; color: string }) {
  const theme = useHostTheme();
  return (
    <Row gap={10} align="center">
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: tint(color, 0.35),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text size="small" weight="medium" style={{ color }}>
          {name.slice(0, 1)}
        </Text>
      </div>
      <Stack gap={2}>
        <Text size="small" weight="medium">
          {name}
        </Text>
      </Stack>
    </Row>
  );
}

function ScreenGallery({
  title,
  screens,
  mode,
}: {
  title: string;
  screens: ScreenSpec[];
  mode: PhoneMode;
}) {
  const [active, setActive] = useCanvasState(`tab-${title}`, screens[0]?.id ?? "");
  const current = screens.find((s) => s.id === active) ?? screens[0];

  return (
    <Stack gap={12}>
      <H2>{title}</H2>
      <Row gap={6} wrap>
        {screens.map((screen) => (
          <span key={screen.id}>
            <Button
              variant={active === screen.id ? "primary" : "ghost"}
              onClick={() => setActive(screen.id)}
            >
              {screen.title}
            </Button>
          </span>
        ))}
      </Row>
      {current ? (
        <PhoneFrame title={current.title} subtitle={current.subtitle} mode={mode}>
          {current.body()}
        </PhoneFrame>
      ) : null}
    </Stack>
  );
}

export default function FamilyTaskAppWireframes() {
  const theme = useHostTheme();

  const sharedScreens: ScreenSpec[] = [
    {
      id: "welcome",
      title: "Приветствие",
      subtitle: "Тёплый вход — выбор роли в семье",
      body: () => (
        <Stack gap={10} style={{ justifyContent: "center", flex: 1 }}>
          <FamilyIllustration />
          <Stack gap={4} style={{ alignItems: "center", textAlign: "center" }}>
            <Text weight="medium">Семейный кошелёк</Text>
            <Text size="small" tone="secondary">
              Задачи, награды и мечты — вместе
            </Text>
          </Stack>
          <WireButton label="Я родитель" primary color={theme.category.green} />
          <WireButton label="Я ребёнок" kid color={theme.category.orange} />
          <Text size="small" tone="tertiary" style={{ textAlign: "center" }}>
            Уже есть семья? Войти
          </Text>
        </Stack>
      ),
    },
    {
      id: "login",
      title: "Вход",
      subtitle: "Email или семейный код",
      body: () => (
        <Stack gap={10}>
          <WireBlock label="Email" rounded />
          <WireBlock label="Пароль" rounded />
          <WireButton label="Войти" primary />
          <Divider />
          <WireBlock label="Семейный код (для планшета ребёнка)" dashed rounded />
          <WireButton label="Присоединиться по коду" />
        </Stack>
      ),
    },
    {
      id: "setup",
      title: "Наша семья",
      subtitle: "Родитель добавляет детей",
      body: () => (
        <Stack gap={10}>
          <WireBlock label="Название: Семья Ивановых" filled rounded />
          <Text size="small" tone="secondary">
            Дети
          </Text>
          <WireBlock label="Маша, 10 лет" filled rounded />
          <WireBlock label="Петя, 7 лет" filled rounded />
          <WireBlock label="+ Добавить ребёнка" dashed height={44} rounded />
          <Spacer />
          <WireButton label="Продолжить" primary color={theme.category.green} />
        </Stack>
      ),
    },
  ];

  const parentScreens: ScreenSpec[] = [
    {
      id: "parent-home",
      title: "Дом родителя",
      subtitle: "Обзор семьи и очередь проверок",
      body: () => (
        <Stack gap={8}>
          <Text size="small" tone="secondary">
            Доброе утро! Сегодня 3 задачи
          </Text>
          <ParentBalanceCard amount="450 ₽" label="Накоплено детям" />
          <Text size="small" weight="medium">
            Ждут проверки (2)
          </Text>
          <ParentTaskRow title="Уроки сделаны" reward="+100 ₽" status="pending" childName="Маша" />
          <ParentTaskRow title="Вынести мусор" reward="+50 ₽" status="pending" childName="Петя" />
          <Text size="small" weight="medium">
            На сегодня
          </Text>
          <ParentTaskRow title="Убрать комнату" reward="+80 ₽" status="new" childName="Маша" />
          <WireButton label="+ Новая задача" primary color={theme.category.green} />
        </Stack>
      ),
    },
    {
      id: "create-task",
      title: "Новая задача",
      subtitle: "Создать и назначить награду",
      body: () => (
        <Stack gap={8}>
          <WireBlock label="Название задачи" rounded />
          <WireBlock label="Награда: 100 ₽" filled rounded />
          <WireBlock label="Кому: Маша" filled rounded />
          <Row gap={6} wrap>
            <Pill tone="info" size="sm" active>
              Один раз
            </Pill>
            <Pill tone="neutral" size="sm">
              Каждый день
            </Pill>
            <Pill tone="neutral" size="sm">
              Каждую неделю
            </Pill>
          </Row>
          <WireBlock label="Подсказка для ребёнка (необязательно)" height={48} rounded />
          <Row gap={6}>
            <Text size="small" tone="secondary">
              Нужно фото
            </Text>
            <Spacer />
            <Pill tone="success" size="sm">
              Да
            </Pill>
          </Row>
          <Spacer />
          <WireButton label="Создать задачу" primary color={theme.category.green} />
        </Stack>
      ),
    },
    {
      id: "review",
      title: "Проверка",
      subtitle: "Одобрить или попросить переделать",
      body: () => (
        <Stack gap={8}>
          <ParentTaskRow title="Уроки сделаны" reward="+100 ₽" status="pending" childName="Маша" />
          <WireBlock label="Фото от ребёнка" height={100} dashed rounded />
          <Text size="small" tone="secondary">
            Маша отметила в 16:42
          </Text>
          <WireBlock label="Комментарий (необязательно)" height={40} rounded />
          <Row gap={8}>
            <div style={{ flex: 1 }}>
              <WireButton label="Переделать" />
            </div>
            <div style={{ flex: 1 }}>
              <WireButton label="Молодец!" primary color={theme.category.green} />
            </div>
          </Row>
        </Stack>
      ),
    },
    {
      id: "children",
      title: "Дети",
      subtitle: "Балансы и быстрые действия",
      body: () => (
        <Stack gap={8}>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: `1px solid ${tint(theme.category.pink, 0.3)}`,
              background: tint(theme.category.pink, 0.08),
            }}
          >
            <Row align="center" justify="space-between">
              <Stack gap={2}>
                <ChildAvatar name="Маша" color={theme.category.pink} />
                <Text size="small" tone="secondary">
                  Баланс: 320 ₽
                </Text>
              </Stack>
              <Button variant="ghost">Выплатить</Button>
            </Row>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: `1px solid ${tint(theme.category.blue, 0.3)}`,
              background: tint(theme.category.blue, 0.08),
            }}
          >
            <Row align="center" justify="space-between">
              <Stack gap={2}>
                <ChildAvatar name="Петя" color={theme.category.blue} />
                <Text size="small" tone="secondary">
                  Баланс: 130 ₽
                </Text>
              </Stack>
              <Button variant="ghost">Выплатить</Button>
            </Row>
          </div>
          <WireButton label="Записать трату (−30 ₽)" />
        </Stack>
      ),
    },
    {
      id: "payout",
      title: "Выплата",
      subtitle: "Отметить, что деньги отданы",
      body: () => (
        <Stack gap={8}>
          <ParentBalanceCard amount="320 ₽" label="Баланс Маши" />
          <WireBlock label="Сумма выплаты" filled rounded />
          <WireBlock label="Заметка: карманные на субботу" rounded />
          <Callout tone="info">
            После выплаты виртуальный баланс обнуляется. Наличные или перевод — отдельно, по договорённости.
          </Callout>
          <Spacer />
          <WireButton label="Деньги отданы" primary color={theme.category.green} />
        </Stack>
      ),
    },
  ];

  const childScreens: ScreenSpec[] = [
    {
      id: "child-home",
      title: "Мои задачи",
      subtitle: "Главный экран ребёнка",
      body: () => (
        <Stack gap={10}>
          <KidBalanceCard amount="320 ₽" label="Мои деньги" />
          <Row gap={6} wrap>
            <Pill tone="success" size="sm" active>
              Серия 3 дня
            </Pill>
            <Pill tone="info" size="sm">
              Помощник недели
            </Pill>
          </Row>
          <GoalProgress title="Мечта: кино с друзьями" current={320} target={500} />
          <Text size="small" weight="medium">
            Сегодня
          </Text>
          <KidTaskRow title="Убрать комнату" reward="+80 ₽" status="new" icon="house" />
          <KidTaskRow title="Сделать уроки" reward="+100 ₽" status="pending" icon="book" />
          <KidTaskRow title="Выгулять собаку" reward="+50 ₽" status="done" icon="dog" />
        </Stack>
      ),
    },
    {
      id: "task-detail",
      title: "Задача",
      subtitle: "Отметить выполнение",
      body: () => (
        <Stack gap={10}>
          <Row gap={10} align="center">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: tint(theme.category.orange, 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TaskIconSvg kind="house" color={theme.category.orange} size={24} />
            </div>
            <Stack gap={4}>
              <Text weight="medium">Убрать комнату</Text>
              <CoinBadge amount="+80 ₽" />
            </Stack>
          </Row>
          <Text size="small" tone="secondary">
            Подсказка от мамы: игрушки — в коробку
          </Text>
          <WireBlock label="Нажми, чтобы добавить фото" height={120} dashed rounded />
          <Spacer />
          <WireButton label="Я сделал!" primary kid color={theme.category.orange} />
        </Stack>
      ),
    },
    {
      id: "wallet",
      title: "Кошелёк",
      subtitle: "История заработка и трат",
      body: () => (
        <Stack gap={8}>
          <KidBalanceCard amount="320 ₽" label="Сейчас у меня" />
          <Text size="small" weight="medium">
            История
          </Text>
          <WireBlock label="+50 ₽ — Выгулял собаку" filled rounded height={40} />
          <WireBlock label="+100 ₽ — Уроки (ждём проверки)" rounded height={40} />
          <WireBlock label="−30 ₽ — Сок" rounded height={40} />
          <WireBlock label="+80 ₽ — Комната (выплачено)" rounded height={40} />
        </Stack>
      ),
    },
    {
      id: "goal",
      title: "Копилка мечты",
      subtitle: "Откладываем на большую цель",
      body: () => (
        <Stack gap={10}>
          <Text weight="medium">Кино с друзьями</Text>
          <GoalProgress title="До мечты осталось" current={320} target={500} />
          <WireBlock label="Положить в копилку: 50 ₽" rounded />
          <WireButton label="Отложить в копилку" primary kid color={theme.category.pink} />
          <Text size="small" tone="tertiary">
            Чем больше копишь — тем ближе мечта
          </Text>
        </Stack>
      ),
    },
  ];

  const flowSteps = [
    "Родитель создаёт задачу с наградой",
    "Ребёнок видит её на главном экране",
    "Ребёнок нажимает «Я сделал!» (+ фото)",
    "Родителю приходит: «Проверь, пожалуйста»",
    "Одобрение — баланс растёт",
    "Выплата — реальные деньги, баланс обнуляется",
  ];

  return (
    <Stack gap={24}>
      <Stack gap={6}>
        <H1>Семейный кошелёк — wireframes MVP</H1>
        <Text tone="secondary">
          Тёплый семейный дизайн: спокойный интерфейс для родителей и яркий, крупный — для детей.
          Переключайте вкладки в каждом разделе, чтобы посмотреть экраны.
        </Text>
      </Stack>

      <Card>
        <CardHeader>Как это работает</CardHeader>
        <CardBody>
          <Grid columns={3} gap={12}>
            {flowSteps.map((step, index) => (
              <div
                key={step}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: tint(theme.category.yellow, index % 2 === 0 ? 0.08 : 0.04),
                  border: `1px solid ${theme.stroke.tertiary}`,
                }}
              >
                <Text size="small" tone="secondary">
                  Шаг {index + 1}
                </Text>
                <Text size="small">{step}</Text>
              </div>
            ))}
          </Grid>
        </CardBody>
      </Card>

      <Grid columns={2} gap={24} align="start">
        <ScreenGallery title="Общие (вход)" screens={sharedScreens} mode="shared" />
        <ScreenGallery title="Родитель" screens={parentScreens} mode="parent" />
      </Grid>

      <Grid columns={2} gap={24} align="start">
        <ScreenGallery title="Ребёнок" screens={childScreens} mode="child" />
        <Stack gap={12}>
          <H2>Навигация и детали</H2>
          <Card>
            <CardBody>
              <Stack gap={10}>
                <Stack gap={4}>
                  <H3>Меню родителя</H3>
                  <Text size="small" tone="secondary">
                    Дом (обзор + проверки) / Задачи (все + создать) / Дети (балансы + выплаты) / Настройки
                  </Text>
                </Stack>
                <Divider />
                <Stack gap={4}>
                  <H3>Меню ребёнка</H3>
                  <Text size="small" tone="secondary">
                    Задачи (список на сегодня) / Кошелёк (история) / Мечта (копилка) / Я (профиль)
                  </Text>
                </Stack>
                <Divider />
                <Stack gap={4}>
                  <H3>Уведомления</H3>
                  <Text size="small" tone="secondary">
                    Ребёнку: «Новая задача: вынести мусор (+50 ₽)». Родителю: «Маша ждёт проверки».
                    Ребёнку: «Ура! +100 ₽ за уроки» или «Попробуй ещё раз: полки тоже протри».
                  </Text>
                </Stack>
                <Divider />
                <Stack gap={4}>
                  <H3>Стиль по ролям</H3>
                  <Text size="small" tone="secondary">
                    Родитель: зелёные акценты, спокойные карточки, имена детей цветными аватарами.
                    Ребёнок: оранжево-жёлтая шапка, крупный баланс, монетки-награды, иконки задач,
                    скругления 16–24px, кнопки 48px высотой.
                  </Text>
                </Stack>
                <Divider />
                <Stack gap={4}>
                  <H3>После MVP</H3>
                  <Text size="small" tone="secondary">
                    Анимации наград, больше значков, шаблоны «Утро» и «Выходные», семейная доска на планшете.
                  </Text>
                </Stack>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Список экранов</CardHeader>
            <CardBody style={mergeStyle({ padding: 0 })}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["#", "Экран", "Роль", "Приоритет"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          borderBottom: `1px solid ${theme.stroke.tertiary}`,
                          color: theme.text.secondary,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "Приветствие", "Общий", "P0"],
                    ["2", "Вход", "Общий", "P0"],
                    ["3", "Наша семья", "Родитель", "P0"],
                    ["4", "Дом родителя", "Родитель", "P0"],
                    ["5", "Новая задача", "Родитель", "P0"],
                    ["6", "Проверка", "Родитель", "P0"],
                    ["7", "Дети", "Родитель", "P1"],
                    ["8", "Выплата", "Родитель", "P1"],
                    ["9", "Мои задачи", "Ребёнок", "P0"],
                    ["10", "Задача", "Ребёнок", "P0"],
                    ["11", "Кошелёк", "Ребёнок", "P1"],
                    ["12", "Копилка мечты", "Ребёнок", "P2"],
                  ].map(([num, screen, role, priority]) => (
                    <tr key={num}>
                      <td style={{ padding: "8px 12px", fontSize: 12 }}>{num}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12 }}>{screen}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12 }}>{role}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12 }}>{priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Stack>
      </Grid>
    </Stack>
  );
}
