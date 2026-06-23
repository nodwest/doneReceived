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
  computeDAGLayout,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";
import type { CSSProperties, ReactElement } from "react";

type ScreenSpec = { id: string; title: string; subtitle: string; body: () => ReactElement };

function tint(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  return `rgba(${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}, ${alpha})`;
}

function FamilyIllustration() {
  const theme = useHostTheme();
  return (
    <svg width="100%" height="96" viewBox="0 0 220 96" aria-hidden>
      <rect x="78" y="38" width="64" height="42" rx="6" fill={tint(theme.category.orange, 0.35)} />
      <polygon points="74,40 110,14 146,40" fill={tint(theme.category.pink, 0.5)} />
      <rect x="102" y="56" width="16" height="24" rx="2" fill={tint(theme.category.orange, 0.55)} />
      <circle cx="52" cy="62" r="14" fill={tint(theme.category.blue, 0.45)} />
      <rect x="44" y="74" width="16" height="18" rx="8" fill={tint(theme.category.blue, 0.35)} />
      <circle cx="110" cy="60" r="12" fill={tint(theme.category.yellow, 0.5)} />
      <rect x="102" y="70" width="16" height="16" rx="8" fill={tint(theme.category.yellow, 0.35)} />
      <circle cx="162" cy="64" r="11" fill={tint(theme.category.green, 0.45)} />
      <rect x="154" y="74" width="16" height="16" rx="8" fill={tint(theme.category.green, 0.35)} />
    </svg>
  );
}

function StepDots({ current, total = 4 }: { current: number; total?: number }) {
  const theme = useHostTheme();
  return (
    <Row gap={6} justify="center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === current ? 20 : 8,
            height: 8,
            borderRadius: 4,
            background: i + 1 <= current ? theme.category.green : theme.fill.quaternary,
          }}
        />
      ))}
    </Row>
  );
}

function Field({
  label,
  value,
  placeholder,
  filled,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  filled?: boolean;
}) {
  const theme = useHostTheme();
  return (
    <Stack gap={4}>
      <Text size="small" tone="secondary">
        {label}
      </Text>
      <div
        style={{
          height: 44,
          borderRadius: 12,
          border: `1.5px solid ${filled ? theme.category.green : theme.stroke.secondary}`,
          background: filled ? tint(theme.category.green, 0.08) : theme.fill.tertiary,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
        }}
      >
        <Text size="small" tone={filled || value ? "primary" : "tertiary"}>
          {value ?? placeholder ?? ""}
        </Text>
      </div>
    </Stack>
  );
}

function PrimaryBtn({ label, color }: { label: string; color?: string }) {
  const theme = useHostTheme();
  const bg = color ?? theme.category.green;
  return (
    <div
      style={{
        height: 48,
        borderRadius: 14,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text size="small" weight="medium" style={{ color: theme.text.onAccent }}>
        {label}
      </Text>
    </div>
  );
}

function GhostBtn({ label }: { label: string }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        height: 44,
        borderRadius: 12,
        border: `1.5px dashed ${theme.stroke.secondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text size="small" tone="secondary">
        {label}
      </Text>
    </div>
  );
}

function ChildCard({
  name,
  age,
  color,
  selected,
}: {
  name: string;
  age: number;
  color: string;
  selected?: boolean;
}) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: `2px solid ${selected ? color : theme.stroke.tertiary}`,
        background: selected ? tint(color, 0.12) : theme.fill.tertiary,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: tint(color, 0.35),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text weight="medium" style={{ color }}>
          {name[0]}
        </Text>
      </div>
      <Stack gap={2}>
        <Text size="small" weight="medium">
          {name}
        </Text>
        <Text size="small" tone="secondary">
          {age} лет
        </Text>
      </Stack>
      {selected ? (
        <div style={{ marginLeft: "auto" }}>
          <Pill active size="sm">
            добавлен
          </Pill>
        </div>
      ) : null}
    </div>
  );
}

function PhoneFrame({
  title,
  step,
  children,
}: {
  title: string;
  step?: number;
  children: ReactElement;
}) {
  const theme = useHostTheme();
  return (
    <Stack gap={6}>
      <Stack gap={2}>
        <Text weight="medium">{title}</Text>
        {step ? <StepDots current={step} /> : null}
      </Stack>
      <div
        style={{
          width: 272,
          minHeight: 480,
          borderRadius: 20,
          border: `2px solid ${theme.stroke.secondary}`,
          background: theme.bg.editor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 32,
            padding: "6px 14px",
            background: tint(theme.category.green, 0.2),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text size="small" tone="secondary">
            9:41
          </Text>
          <Text size="small" weight="medium">
            Семейный кошелёк
          </Text>
          <Text size="small" tone="secondary">
            ···
          </Text>
        </div>
        <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {children}
        </div>
      </div>
    </Stack>
  );
}

function QrCodeMock({ size = 140 }: { size?: number }) {
  const theme = useHostTheme();
  const cell = size / 7;
  const pattern = [
    [1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 1],
    [1, 1, 0, 0, 1, 1, 1],
  ];
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        background: theme.bg.elevated,
        border: `1.5px solid ${theme.stroke.secondary}`,
        display: "inline-flex",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {pattern.flatMap((row, y) =>
          row.map((on, x) =>
            on ? (
              <rect
                key={`${x}-${y}`}
                x={x * cell + 1}
                y={y * cell + 1}
                width={cell - 2}
                height={cell - 2}
                fill={theme.text.primary}
                rx={1}
              />
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}

function ModeTabs({
  active,
  onChange,
  tabs,
}: {
  active: string;
  onChange: (id: string) => void;
  tabs: { id: string; label: string }[];
}) {
  const theme = useHostTheme();
  return (
    <Row gap={0}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              height: 36,
              border: "none",
              cursor: "pointer",
              borderRadius: tab.id === tabs[0].id ? "10px 0 0 10px" : "0 10px 10px 0",
              background: isActive ? theme.category.green : theme.fill.tertiary,
              color: isActive ? theme.text.onAccent : theme.text.secondary,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </Row>
  );
}

function AddChildScreenBody() {
  const theme = useHostTheme();
  const [mode, setMode] = useCanvasState("addchild-mode", "manual");

  if (mode === "qr") {
    return (
      <Stack gap={12} style={{ alignItems: "center" }}>
        <Stack gap={4} style={{ width: "100%" }}>
          <Text weight="medium">QR для ребёнка</Text>
          <Text size="small" tone="secondary">
            Ребёнок сканирует и сразу попадает в семью
          </Text>
        </Stack>
        <ModeTabs
          active={mode}
          onChange={setMode}
          tabs={[
            { id: "manual", label: "Вручную" },
            { id: "qr", label: "QR-код" },
          ]}
        />
        <QrCodeMock />
        <Text size="small" tone="secondary" style={{ textAlign: "center" }}>
          Семья Ивановых · код IVAN-7K2M
        </Text>
        <div
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            background: tint(theme.category.orange, 0.1),
            border: `1px solid ${tint(theme.category.orange, 0.3)}`,
          }}
        >
          <Text size="small" weight="medium">
            На телефоне ребёнка:
          </Text>
          <Text size="small" tone="secondary">
            1. «Я ребёнок»
            <br />
            2. «Сканировать QR-код»
            <br />
            3. Ввести имя — готово
          </Text>
        </div>
        <Row gap={8} style={{ width: "100%" }}>
          <div style={{ flex: 1 }}>
            <GhostBtn label="Скопировать код" />
          </div>
          <div style={{ flex: 1 }}>
            <PrimaryBtn label="Поделиться QR" color={theme.category.blue} />
          </div>
        </Row>
        <Text size="small" tone="tertiary" style={{ textAlign: "center" }}>
          или добавьте ребёнка вручную →
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap={12}>
      <Stack gap={4}>
        <Text weight="medium">Кого добавим?</Text>
        <Text size="small" tone="secondary">
          Минимум одного ребёнка для старта
        </Text>
      </Stack>
      <ModeTabs
        active={mode}
        onChange={setMode}
        tabs={[
          { id: "manual", label: "Вручную" },
          { id: "qr", label: "QR-код" },
        ]}
      />
      <Field label="Имя ребёнка" placeholder="Маша" />
      <Field label="Возраст" placeholder="10 лет" />
      <Row gap={8}>
        {[theme.category.yellow, theme.category.orange, theme.category.green, theme.category.pink].map(
          (c, i) => (
            <div
              key={c}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: tint(c, 0.45),
                border: i === 0 ? `2px solid ${c}` : "2px solid transparent",
              }}
            />
          ),
        )}
      </Row>
      <Text size="small" tone="tertiary">
        Цвет аватара
      </Text>
      <Divider />
      <GhostBtn label="У ребёнка есть телефон? Показать QR-код" />
      <Spacer />
      <PrimaryBtn label="Добавить ребёнка" color={theme.category.orange} />
    </Stack>
  );
}

function ChildScanQrScreenBody() {
  const theme = useHostTheme();
  return (
    <Stack gap={12}>
      <Stack gap={4}>
        <Text weight="medium">Сканируй QR-код</Text>
        <Text size="small" tone="secondary">
          Попроси родителя показать код в приложении
        </Text>
      </Stack>
      <div
        style={{
          flex: 1,
          minHeight: 200,
          borderRadius: 16,
          border: `2px dashed ${theme.category.orange}`,
          background: tint(theme.category.orange, 0.06),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <svg width={48} height={48} viewBox="0 0 24 24" fill={theme.category.orange}>
          <path d="M4 4h4v4H4V4Zm12 0h4v4h-4V4ZM4 16h4v4H4v-4Zm13-1h2v2h-2v-2ZM4 10h2v2H4v-2Zm8 0h2v2h-2v-2Zm4 4h2v2h-2v-2Zm-4 0h2v2h-2v-2Zm4-8h2v2h-2V6Zm0 8h2v2h-2v-2ZM10 6H8v2h2V6Zm0 8H8v2h2v-2Zm4-4h2v2h-2v-2Z" />
        </svg>
        <Text size="small" tone="secondary" style={{ textAlign: "center" }}>
          Наведи камеру на QR-код
        </Text>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 12,
            border: `2px solid ${theme.category.orange}`,
          }}
        />
      </div>
      <GhostBtn label="Ввести код вручную" />
    </Stack>
  );
}

function ScreenGallery({ screens }: { screens: ScreenSpec[] }) {
  const [active, setActive] = useCanvasState("step1-screen", screens[0]?.id ?? "");
  const current = screens.find((s) => s.id === active) ?? screens[0];
  const idx = screens.findIndex((s) => s.id === active);

  return (
    <Stack gap={14}>
      <Row gap={6} wrap>
        {screens.map((s) => (
          <span key={s.id}>
            <Button variant={active === s.id ? "primary" : "ghost"} onClick={() => setActive(s.id)}>
              {s.title}
            </Button>
          </span>
        ))}
      </Row>
      {current ? (
        <Grid columns={2} gap={16} align="start">
          <PhoneFrame title={current.subtitle} step={idx >= 0 ? idx + 1 : undefined}>
            {current.body()}
          </PhoneFrame>
          <Card>
            <CardHeader>UX-заметки</CardHeader>
            <CardBody>
              <Stack gap={8}>{notes[current.id]?.() ?? null}</Stack>
            </CardBody>
          </Card>
        </Grid>
      ) : null}
    </Stack>
  );
}

const notes: Record<string, () => ReactElement> = {
  welcome: () => (
    <>
      <Callout tone="info">Две ветки: родитель создаёт семью, ребёнок сканирует QR</Callout>
      <Text size="small" tone="secondary">
        «Я ребёнок» → экран 4b (камера + QR). Альтернатива — ввод кода IVAN-7K2M вручную.
      </Text>
    </>
  ),
  register: () => (
    <>
      <Text size="small" weight="medium">
        Минимум полей
      </Text>
      <Text size="small" tone="secondary">
        Имя, email, пароль — без лишних вопросов. Валидация inline под полем.
      </Text>
    </>
  ),
  family: () => (
    <>
      <Text size="small" weight="medium">
        Название семьи
      </Text>
      <Text size="small" tone="secondary">
        «Семья Ивановых» — используется в приветствиях. Можно пропустить и подставить фамилию из
        имени родителя.
      </Text>
    </>
  ),
  addchild: () => (
    <>
      <Text size="small" weight="medium">
        Два способа добавить ребёнка
      </Text>
      <Text size="small" tone="secondary">
        Вручную — имя + возраст на устройстве родителя. QR — ребёнок сканирует на своём телефоне,
        вводит только имя. Переключатель вкладок «Вручную / QR-код».
      </Text>
      <Callout tone="info">
        QR содержит invite_code семьи. После скана ребёнок создаёт профиль с balance = 0.
      </Callout>
    </>
  ),
  childscan: () => (
    <>
      <Text size="small" weight="medium">
        Экран ребёнка (ветка «Я ребёнок»)
      </Text>
      <Text size="small" tone="secondary">
        Камера через expo-camera / expo-barcode-scanner. Fallback — ввод кода IVAN-7K2M вручную.
      </Text>
    </>
  ),
  children: () => (
    <>
      <Text size="small" weight="medium">
        Список детей
      </Text>
      <Text size="small" tone="secondary">
        Можно добавить до 3 детей в MVP. Редактирование — тап по карточке. Удаление — свайп или
        иконка.
      </Text>
    </>
  ),
  done: () => (
    <>
      <Callout tone="info">Семейный код — главный артеfact шага 1</Callout>
      <Text size="small" tone="secondary">
        Родитель копирует код → ребёнок вводит на планшете. Кнопка «Поделиться» через системный
        share sheet.
      </Text>
    </>
  ),
};

export default function Step1OnboardingDesign() {
  const theme = useHostTheme();

  const screens: ScreenSpec[] = [
    {
      id: "welcome",
      title: "1. Приветствие",
      subtitle: "Выбор роли",
      body: () => (
        <Stack gap={12} style={{ justifyContent: "center", flex: 1 }}>
          <FamilyIllustration />
          <Stack gap={4} style={{ textAlign: "center", alignItems: "center" }}>
            <Text weight="medium" style={{ fontSize: 18 }}>
              Семейный кошелёк
            </Text>
            <Text size="small" tone="secondary">
              Задачи, награды и мечты — вместе
            </Text>
          </Stack>
          <PrimaryBtn label="Я родитель — создать семью" />
          <GhostBtn label="Я ребёнок — сканировать QR или код" />
          <Text size="small" tone="tertiary" style={{ textAlign: "center" }}>
            Уже есть аккаунт? Войти
          </Text>
        </Stack>
      ),
    },
    {
      id: "register",
      title: "2. Регистрация",
      subtitle: "Данные родителя",
      body: () => (
        <Stack gap={12}>
          <Stack gap={4}>
            <Text weight="medium">Создайте аккаунт</Text>
            <Text size="small" tone="secondary">
              Вы будете управлять задачами и наградами
            </Text>
          </Stack>
          <Field label="Ваше имя" value="Анна" filled />
          <Field label="Email" value="anna@mail.ru" filled />
          <Field label="Пароль" value="••••••••" filled />
          <Spacer />
          <PrimaryBtn label="Далее" />
        </Stack>
      ),
    },
    {
      id: "family",
      title: "3. Семья",
      subtitle: "Название семьи",
      body: () => (
        <Stack gap={12}>
          <Stack gap={4}>
            <Text weight="medium">Как назовём семью?</Text>
            <Text size="small" tone="secondary">
              Так дети увидят название в приложении
            </Text>
          </Stack>
          <Field label="Название семьи" value="Семья Ивановых" filled />
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              background: tint(theme.category.pink, 0.1),
              border: `1px solid ${tint(theme.category.pink, 0.3)}`,
            }}
          >
            <Text size="small" tone="secondary">
              Превью: «Привет из Семьи Ивановых!»
            </Text>
          </div>
          <Spacer />
          <PrimaryBtn label="Далее" />
        </Stack>
      ),
    },
    {
      id: "addchild",
      title: "4. Ребёнок",
      subtitle: "Вручную или QR-код",
      body: () => <AddChildScreenBody />,
    },
    {
      id: "childscan",
      title: "4b. Скан QR",
      subtitle: "Экран ребёнка",
      body: () => <ChildScanQrScreenBody />,
    },
    {
      id: "children",
      title: "5. Дети",
      subtitle: "Список + ещё ребёнок",
      body: () => (
        <Stack gap={10}>
          <Text weight="medium">Ваша семья</Text>
          <ChildCard name="Маша" age={10} color={theme.category.yellow} selected />
          <ChildCard name="Петя" age={7} color={theme.category.green} selected />
          <GhostBtn label="+ Добавить ещё ребёнка" />
          <Spacer />
          <PrimaryBtn label="Готово — перейти в приложение" />
        </Stack>
      ),
    },
    {
      id: "done",
      title: "6. Готово",
      subtitle: "Семья создана",
      body: () => (
        <Stack gap={12} style={{ alignItems: "center", textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: tint(theme.category.green, 0.25),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={32} height={32} viewBox="0 0 24 24" fill={theme.category.green}>
              <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" />
            </svg>
          </div>
          <Stack gap={4}>
            <Text weight="medium">Семья готова!</Text>
            <Text size="small" tone="secondary">
              Маша и Петя добавлены. Теперь создайте первую задачу.
            </Text>
          </Stack>
          <div
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              background: tint(theme.category.blue, 0.12),
              border: `1.5px solid ${tint(theme.category.blue, 0.35)}`,
            }}
          >
            <Row gap={12} align="center">
              <QrCodeMock size={72} />
              <Stack gap={4} style={{ flex: 1, textAlign: "left" }}>
                <Text size="small" tone="secondary">
                  Семейный код
                </Text>
                <Text weight="medium" style={{ fontSize: 18, letterSpacing: 2 }}>
                  IVAN-7K2M
                </Text>
                <Text size="small" tone="tertiary">
                  QR или код — для входа ребёнка
                </Text>
              </Stack>
            </Row>
            <Row gap={8} style={{ marginTop: 10 }}>
              <div style={{ flex: 1 }}>
                <GhostBtn label="Скопировать" />
              </div>
              <div style={{ flex: 1 }}>
                <PrimaryBtn label="Поделиться" color={theme.category.blue} />
              </div>
            </Row>
          </div>
          <PrimaryBtn label="Создать первую задачу" />
          <Text size="small" tone="tertiary">
            или перейти на главный экран
          </Text>
        </Stack>
      ),
    },
  ];

  const flowLabels: Record<string, string> = {
    welcome: "Привет",
    register: "Аккаунт",
    family: "Семья",
    addchild: "Ребёнок",
    childscan: "Скан QR",
    children: "Список",
    done: "Готово",
  };

  const flowNodes = [
    { id: "welcome" },
    { id: "register" },
    { id: "family" },
    { id: "addchild" },
    { id: "childscan" },
    { id: "children" },
    { id: "done" },
  ];

  const flowLayout = computeDAGLayout({
    nodes: flowNodes,
    edges: [
      { from: "welcome", to: "register" },
      { from: "welcome", to: "childscan" },
      { from: "register", to: "family" },
      { from: "family", to: "addchild" },
      { from: "addchild", to: "children" },
      { from: "childscan", to: "children" },
      { from: "children", to: "done" },
    ],
    direction: "horizontal",
    nodeWidth: 88,
    nodeHeight: 36,
    nodeGap: 10,
    rankGap: 48,
    padding: 8,
  });

  const tokens = [
    { label: "Радиус карточек", value: "14px" },
    { label: "Радиус телефона", value: "20px" },
    { label: "Кнопка primary", value: "48px высота" },
    { label: "Акцент родителя", value: "green #1F8A65" },
    { label: "Акцент детей", value: "yellow / orange" },
    { label: "Шаги", value: "4 точки прогресса" },
  ];

  return (
    <Stack gap={28}>
      <Stack gap={6}>
        <H1>Шаг 1 MVP · Регистрация + ребёнок</H1>
        <Text tone="secondary">
          7 экранов: онбординг родителя + скан QR у ребёнка. На экране 4 — вкладки «Вручную /
          QR-код».
        </Text>
      </Stack>

      <Card>
        <CardHeader>Flow · 7 экранов (2 ветки)</CardHeader>
        <CardBody>
          <svg width={flowLayout.width} height={flowLayout.height + 20} style={{ display: "block" }}>
            {flowLayout.edges.map((e) => (
              <line
                key={`${e.from}-${e.to}`}
                x1={e.sourceX}
                y1={e.sourceY}
                x2={e.targetX}
                y2={e.targetY}
                stroke={theme.stroke.primary}
                strokeWidth={1.5}
                markerEnd="url(#flow-arrow)"
              />
            ))}
            <defs>
              <marker id="flow-arrow" markerWidth="8" markerHeight={6} refX={7} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={theme.stroke.primary} />
              </marker>
            </defs>
            {flowLayout.nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect
                  width={88}
                  height={36}
                  rx={8}
                  fill={theme.fill.secondary}
                  stroke={theme.category.green}
                  strokeWidth={1.5}
                />
                <text
                  x={44}
                  y={22}
                  textAnchor="middle"
                  fill={theme.text.primary}
                  fontSize={10}
                  fontWeight={600}
                >
                  {flowLabels[n.id]}
                </text>
              </g>
            ))}
          </svg>
        </CardBody>
      </Card>

      <ScreenGallery screens={screens} />

      <Grid columns={2} gap={20} align="start">
        <Card>
          <CardHeader>Design tokens · шаг 1</CardHeader>
          <CardBody>
            <Stack gap={6}>
              {tokens.map((t) => (
                <Row key={t.label} justify="space-between">
                  <Text size="small" tone="secondary">
                    {t.label}
                  </Text>
                  <Text size="small" weight="medium">
                    {t.value}
                  </Text>
                </Row>
              ))}
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Данные после шага 1</CardHeader>
          <CardBody>
            <Stack gap={8}>
              {[
                ["Family", "name, invite_code: IVAN-7K2M"],
                ["User (parent)", "name, email, role=parent"],
                ["User (child)", "name, age, avatar_color, balance=0"],
              ].map(([entity, fields]) => (
                <div
                  key={entity}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: theme.fill.tertiary,
                    border: `1px solid ${theme.stroke.tertiary}`,
                  }}
                >
                  <Text size="small" weight="medium">
                    {entity}
                  </Text>
                  <Text size="small" tone="secondary">
                    {fields}
                  </Text>
                </div>
              ))}
              <Divider />
              <H3>Следующий шаг MVP</H3>
              <Text size="small" tone="secondary">
                Родитель создаёт первую задачу (название + сумма) → ребёнок входит по коду и видит
                её.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}
