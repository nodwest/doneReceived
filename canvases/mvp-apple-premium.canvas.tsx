import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  H3,
  Row,
  Spacer,
  Stack,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";
import type { CSSProperties, ReactElement } from "react";

type FamilyTheme = {
  id: string;
  name: string;
  mood: string;
  accent: string;
  accentSoft: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  success: string;
  reward: string;
  reject: string;
  photoWash: string;
};

const PHOTOS = {
  welcome: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=640&q=85&fit=crop",
  register: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=640&q=85&fit=crop",
  qrMoment: "https://images.unsplash.com/photo-1609220136736-443bbaeb08c0?w=640&q=85&fit=crop",
  childScan: "https://images.unsplash.com/photo-1503454537845-ef5489cf7827?w=640&q=85&fit=crop",
  createTask: "https://images.unsplash.com/photo-1581578731544-c64695cc6952?w=640&q=85&fit=crop",
  cleanRoom: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=640&q=85&fit=crop",
  takeTrash: "https://images.unsplash.com/photo-1532996122724-e3c354a0fab6?w=640&q=85&fit=crop",
  approval: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=640&q=85&fit=crop",
  balance: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=640&q=85&fit=crop",
  childHappy: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=640&q=85&fit=crop",
};

const THEMES: FamilyTheme[] = [
  {
    id: "sky-harbor",
    name: "Небесная гавань",
    mood: "Спокойствие",
    accent: "#007AFF",
    accentSoft: "#E8F2FF",
    bg: "#F5F5F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    text: "#1D1D1F",
    textMuted: "#86868B",
    success: "#34C759",
    reward: "#FF9F0A",
    reject: "#FF3B30",
    photoWash: "rgba(0,122,255,0.12)",
  },
  {
    id: "forest-glade",
    name: "Лесная поляна",
    mood: "Природа",
    accent: "#30B0C7",
    accentSoft: "#E8F6F8",
    bg: "#F5F5F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    text: "#1D1D1F",
    textMuted: "#86868B",
    success: "#34C759",
    reward: "#FF9F0A",
    reject: "#FF3B30",
    photoWash: "rgba(48,176,199,0.14)",
  },
  {
    id: "peach-dusk",
    name: "Месечный день",
    mood: "Уют",
    accent: "#BF5AF2",
    accentSoft: "#F5E8FC",
    bg: "#F5F5F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    text: "#1D1D1F",
    textMuted: "#86868B",
    success: "#34C759",
    reward: "#FF9F0A",
    reject: "#FF3B30",
    photoWash: "rgba(191,90,242,0.12)",
  },
  {
    id: "sea-breeze",
    name: "Морской бриз",
    mood: "Свежесть",
    accent: "#32ADE6",
    accentSoft: "#E8F5FC",
    bg: "#F5F5F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    text: "#1D1D1F",
    textMuted: "#86868B",
    success: "#34C759",
    reward: "#FF9F0A",
    reject: "#FF3B30",
    photoWash: "rgba(50,173,230,0.12)",
  },
  {
    id: "honey-milk",
    name: "Мёд и молоко",
    mood: "Дом",
    accent: "#FF9500",
    accentSoft: "#FFF4E5",
    bg: "#F5F5F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    text: "#1D1D1F",
    textMuted: "#86868B",
    success: "#34C759",
    reward: "#FF9F0A",
    reject: "#FF3B30",
    photoWash: "rgba(255,149,0,0.12)",
  },
  {
    id: "twilight-tale",
    name: "Пониебов",
    mood: "Мечта",
    accent: "#5E5CE6",
    accentSoft: "#EDEDFC",
    bg: "#F5F5F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    text: "#1D1D1F",
    textMuted: "#86868B",
    success: "#34C759",
    reward: "#FF9F0A",
    reject: "#FF3B30",
    photoWash: "rgba(94,92,230,0.12)",
  },
];

type ScreenId = "welcome" | "register" | "qr" | "scan" | "task" | "child" | "approve" | "balance";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "welcome", label: "Приветствие" },
  { id: "register", label: "Регистрация" },
  { id: "qr", label: "QR ребёнка" },
  { id: "scan", label: "Скан" },
  { id: "task", label: "Задача" },
  { id: "child", label: "Ребёнок" },
  { id: "approve", label: "Одобрение" },
  { id: "balance", label: "Баланс" },
];

const appleFont = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

function tint(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  return `rgba(${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}, ${alpha})`;
}

function Photo({
  src,
  height,
  radius = 0,
  wash,
}: {
  src: string;
  height: number | string;
  radius?: number;
  wash?: string;
}) {
  return (
    <div style={{ position: "relative", height, borderRadius: radius, overflow: "hidden" }}>
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {wash ? (
        <div style={{ position: "absolute", inset: 0, background: wash, pointerEvents: "none" }} />
      ) : null}
    </div>
  );
}

function HeroPhoto({
  src,
  title,
  subtitle,
  theme,
  tall,
}: {
  src: string;
  title: string;
  subtitle: string;
  theme: FamilyTheme;
  tall?: boolean;
}) {
  return (
    <div style={{ margin: "-16px -16px 0", position: "relative" }}>
      <Photo src={src} height={tall ? 168 : 140} wash={theme.photoWash} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "20px 18px 16px",
          background: "rgba(0,0,0,0.42)",
        }}
      >
        <div style={{ fontFamily: appleFont, fontSize: 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.4 }}>
          {title}
        </div>
        <div style={{ fontFamily: appleFont, fontSize: 12, color: "rgba(255,255,255,0.88)", marginTop: 4 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function AppleLabel({ children, theme }: { children: string; theme: FamilyTheme }) {
  return (
    <div style={{ fontFamily: appleFont, fontSize: 11, fontWeight: 500, color: theme.textMuted, letterSpacing: 0.2 }}>
      {children}
    </div>
  );
}

function AppleField({ label, value, theme }: { label: string; value: string; theme: FamilyTheme }) {
  return (
    <Stack gap={6}>
      <AppleLabel theme={theme}>{label}</AppleLabel>
      <div
        style={{
          height: 48,
          borderRadius: 14,
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily: appleFont,
          fontSize: 15,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </Stack>
  );
}

function AppleBtn({
  label,
  theme,
  variant = "primary",
  small,
}: {
  label: string;
  theme: FamilyTheme;
  variant?: "primary" | "secondary" | "ghost";
  small?: boolean;
}) {
  const styles: Record<string, CSSProperties> = {
    primary: { background: theme.accent, color: "#FFFFFF" },
    secondary: { background: theme.accentSoft, color: theme.accent },
    ghost: { background: "transparent", color: theme.accent, border: `1px solid ${theme.border}` },
  };
  return (
    <div
      style={{
        height: small ? 44 : 52,
        borderRadius: small ? 22 : 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: appleFont,
        fontSize: small ? 14 : 16,
        fontWeight: 600,
        letterSpacing: -0.2,
        ...styles[variant],
      }}
    >
      {label}
    </div>
  );
}

function RewardPill({ amount, theme }: { amount: string; theme: FamilyTheme }) {
  return (
    <span
      style={{
        padding: "5px 12px",
        borderRadius: 999,
        background: tint(theme.reward, 0.14),
        color: theme.reward,
        fontFamily: appleFont,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {amount}
    </span>
  );
}

function PhotoTaskRow({
  photo,
  title,
  reward,
  theme,
  active,
}: {
  photo: string;
  title: string;
  reward: string;
  theme: FamilyTheme;
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 10,
        borderRadius: 18,
        background: theme.surface,
        border: `1px solid ${active ? tint(theme.accent, 0.35) : theme.border}`,
      }}
    >
      <Photo src={photo} height={56} radius={14} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: appleFont, fontSize: 14, fontWeight: 600, color: theme.text }}>{title}</div>
        <div style={{ fontFamily: appleFont, fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
          {active ? "Готова к выполнению" : "В очереди"}
        </div>
      </div>
      <RewardPill amount={reward} theme={theme} />
    </div>
  );
}

function QrCard({ theme }: { theme: FamilyTheme }) {
  const cell = 8;
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
        padding: 20,
        borderRadius: 24,
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 2 }}>
        {pattern.flatMap((row, y) =>
          row.map((on, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: cell,
                height: cell,
                borderRadius: 2,
                background: on ? theme.text : "transparent",
              }}
            />
          )),
        )}
      </div>
      <div style={{ fontFamily: appleFont, fontSize: 13, fontWeight: 600, color: theme.textMuted, letterSpacing: 3 }}>
        IVAN-7K2M
      </div>
    </div>
  );
}

function iPhone({
  theme,
  label,
  children,
  role,
}: {
  theme: FamilyTheme;
  label: string;
  children: ReactElement;
  role: "parent" | "child";
}) {
  return (
    <Stack gap={8}>
      <Text size="small" weight="medium">
        {label}
      </Text>
      <div
        style={{
          width: 276,
          borderRadius: 48,
          border: "3px solid #1D1D1F",
          background: "#1D1D1F",
          padding: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderRadius: 40,
            background: theme.bg,
            overflow: "hidden",
            minHeight: 520,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ width: 96, height: 28, borderRadius: 20, background: "#000000" }} />
            <div
              style={{
                position: "absolute",
                right: 18,
                top: 14,
                fontFamily: appleFont,
                fontSize: 11,
                fontWeight: 600,
                color: theme.text,
              }}
            >
              9:41
            </div>
          </div>
          <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {children}
          </div>
          <div
            style={{
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 6,
            }}
          >
            <div style={{ width: 120, height: 4, borderRadius: 2, background: theme.border }} />
          </div>
        </div>
      </div>
      <Text size="small" tone="secondary">
        {role === "parent" ? "Родитель" : "Ребёнок"} · {theme.name}
      </Text>
    </Stack>
  );
}

function WelcomeScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={16} style={{ flex: 1 }}>
      <HeroPhoto
        src={PHOTOS.welcome}
        title="Семейный кошелёк"
        subtitle="Задачи. Награды. Вместе."
        theme={theme}
        tall
      />
      <Stack gap={8}>
        <AppleBtn label="Я родитель" theme={theme} />
        <AppleBtn label="Я ребёнок" theme={theme} variant="secondary" />
      </Stack>
      <div style={{ textAlign: "center", fontFamily: appleFont, fontSize: 13, color: theme.accent }}>
        Войти в аккаунт
      </div>
    </Stack>
  );
}

function RegisterScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14}>
      <HeroPhoto src={PHOTOS.register} title="Добро пожаловать" subtitle="Создайте аккаунт родителя" theme={theme} />
      <AppleField label="Имя" value="Анна" theme={theme} />
      <AppleField label="Email" value="anna@mail.ru" theme={theme} />
      <AppleField label="Пароль" value="••••••••" theme={theme} />
      <Spacer />
      <AppleBtn label="Продолжить" theme={theme} />
    </Stack>
  );
}

function QrScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14}>
      <Photo src={PHOTOS.qrMoment} height={100} radius={20} wash={theme.photoWash} />
      <Stack gap={4}>
        <div style={{ fontFamily: appleFont, fontSize: 20, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
          Подключите ребёнка
        </div>
        <div style={{ fontFamily: appleFont, fontSize: 13, color: theme.textMuted, lineHeight: 1.45 }}>
          Покажите QR-код. Ребёнок сканирует и вводит имя — готово за полминуты.
        </div>
      </Stack>
      <QrCard theme={theme} />
      <Row gap={10}>
        <div style={{ flex: 1 }}>
          <AppleBtn label="Скопировать" theme={theme} variant="ghost" small />
        </div>
        <div style={{ flex: 1 }}>
          <AppleBtn label="Поделиться" theme={theme} small />
        </div>
      </Row>
    </Stack>
  );
}

function ScanScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14}>
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden" }}>
        <Photo src={PHOTOS.childScan} height={200} wash={theme.photoWash} />
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: `2px solid rgba(255,255,255,0.9)`,
            borderRadius: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: 16,
            background: "rgba(0,0,0,0.5)",
            fontFamily: appleFont,
            fontSize: 13,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Наведи на QR родителя
        </div>
      </div>
      <AppleBtn label="Ввести код вручную" theme={theme} variant="ghost" />
    </Stack>
  );
}

function CreateTaskScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14}>
      <Photo src={PHOTOS.createTask} height={88} radius={20} wash={theme.photoWash} />
      <div style={{ fontFamily: appleFont, fontSize: 20, fontWeight: 700, color: theme.text }}>Новая задача</div>
      <AppleField label="Название" value="Убрать комнату" theme={theme} />
      <AppleField label="Награда" value="80 ₽" theme={theme} />
      <div
        style={{
          padding: 14,
          borderRadius: 18,
          background: theme.accentSoft,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily: appleFont, fontSize: 13, color: theme.text }}>Маша получит</div>
        <RewardPill amount="+80 ₽" theme={theme} />
      </div>
      <Spacer />
      <AppleBtn label="Создать" theme={theme} />
    </Stack>
  );
}

function ChildTasksScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14}>
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden" }}>
        <Photo src={PHOTOS.childHappy} height={110} wash={theme.photoWash} />
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 14,
            padding: "14px 16px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ fontFamily: appleFont, fontSize: 11, color: theme.textMuted }}>Баланс</div>
          <div style={{ fontFamily: appleFont, fontSize: 28, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
            240 ₽
          </div>
        </div>
      </div>
      <div style={{ fontFamily: appleFont, fontSize: 17, fontWeight: 700, color: theme.text }}>Задачи</div>
      <PhotoTaskRow photo={PHOTOS.cleanRoom} title="Убрать комнату" reward="+80 ₽" theme={theme} active />
      <PhotoTaskRow photo={PHOTOS.takeTrash} title="Вынести мусор" reward="+50 ₽" theme={theme} />
      <AppleBtn label="Я сделал!" theme={theme} />
    </Stack>
  );
}

function ApprovalScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14}>
      <Photo src={PHOTOS.approval} height={120} radius={20} wash={theme.photoWash} />
      <div style={{ fontFamily: appleFont, fontSize: 20, fontWeight: 700, color: theme.text }}>На проверке</div>
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${theme.border}`,
          background: theme.surface,
        }}
      >
        <Photo src={PHOTOS.cleanRoom} height={80} />
        <div style={{ padding: 14 }}>
          <Row justify="space-between" align="center">
            <div>
              <div style={{ fontFamily: appleFont, fontSize: 15, fontWeight: 600, color: theme.text }}>
                Убрать комнату
              </div>
              <div style={{ fontFamily: appleFont, fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                Маша · 5 мин назад
              </div>
            </div>
            <RewardPill amount="+80 ₽" theme={theme} />
          </Row>
        </div>
      </div>
      <Row gap={10}>
        <div style={{ flex: 1 }}>
          <AppleBtn label="Отклонить" theme={theme} variant="ghost" small />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 44,
              borderRadius: 22,
              background: theme.success,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: appleFont,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Одобрить
          </div>
        </div>
      </Row>
    </Stack>
  );
}

function BalanceScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={14} style={{ alignItems: "center", textAlign: "center" }}>
      <div style={{ width: "100%", borderRadius: 24, overflow: "hidden" }}>
        <Photo src={PHOTOS.balance} height={160} wash={theme.photoWash} />
      </div>
      <div style={{ fontFamily: appleFont, fontSize: 24, fontWeight: 700, color: theme.text, letterSpacing: -0.4 }}>
        +80 ₽ зачислено
      </div>
      <div style={{ fontFamily: appleFont, fontSize: 14, color: theme.textMuted }}>Задача одобрена родителем</div>
      <div
        style={{
          width: "100%",
          padding: 20,
          borderRadius: 24,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ fontFamily: appleFont, fontSize: 12, color: theme.textMuted }}>Новый баланс</div>
        <div style={{ fontFamily: appleFont, fontSize: 36, fontWeight: 700, color: theme.text, letterSpacing: -1 }}>
          320 ₽
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <AppleBtn label="К задачам" theme={theme} />
      </div>
    </Stack>
  );
}

function renderScreen(id: ScreenId, theme: FamilyTheme) {
  switch (id) {
    case "welcome":
      return <WelcomeScreen theme={theme} />;
    case "register":
      return <RegisterScreen theme={theme} />;
    case "qr":
      return <QrScreen theme={theme} />;
    case "scan":
      return <ScanScreen theme={theme} />;
    case "task":
      return <CreateTaskScreen theme={theme} />;
    case "child":
      return <ChildTasksScreen theme={theme} />;
    case "approve":
      return <ApprovalScreen theme={theme} />;
    case "balance":
      return <BalanceScreen theme={theme} />;
    default:
      return <WelcomeScreen theme={theme} />;
  }
}

function screenRole(id: ScreenId): "parent" | "child" {
  return id === "scan" || id === "child" || id === "balance" ? "child" : "parent";
}

export default function MvpApplePremium() {
  const hostTheme = useHostTheme();
  const [activeTheme, setActiveTheme] = useCanvasState("apple-theme", "sky-harbor");
  const [activeScreen, setActiveScreen] = useCanvasState<ScreenId>("apple-screen", "welcome");
  const [view, setView] = useCanvasState("apple-view", "single");

  const theme = THEMES.find((t) => t.id === activeTheme) ?? THEMES[0];

  return (
    <Stack gap={32}>
      <Stack gap={8}>
        <H1>MVP · Apple Premium</H1>
        <Text tone="secondary">
          Дизайн уровня Apple: фотография вместо иконок, iOS-типографика, Dynamic Island, стеклянные
          карточки. 6 семейных акцентов на нейтральной базе #F5F5F7.
        </Text>
      </Stack>

      <Callout tone="info">
        Фото — editorial Unsplash. В продакшене: собственная съёмка семей или лицензированный сток.
        Стиль как у Apple Card / Apple Health Family.
      </Callout>

      <Stack gap={12}>
        <H2>Палитра акцента</H2>
        <Row gap={6} wrap>
          {THEMES.map((t) => (
            <span key={t.id}>
              <Button variant={activeTheme === t.id ? "primary" : "ghost"} onClick={() => setActiveTheme(t.id)}>
                {t.name}
              </Button>
            </span>
          ))}
        </Row>
        <Row gap={10} align="center">
          <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.accent }} />
          <Text size="small" tone="secondary">
            {theme.name} · акцент {theme.accent} · база iOS #F5F5F7
          </Text>
        </Row>
      </Stack>

      <Stack gap={12}>
        <Row gap={6} wrap>
          {SCREENS.map((s) => (
            <span key={s.id}>
              <Button
                variant={activeScreen === s.id ? "primary" : "ghost"}
                onClick={() => setActiveScreen(s.id)}
              >
                {s.label}
              </Button>
            </span>
          ))}
        </Row>
        <Row gap={6}>
          <Button variant={view === "single" ? "primary" : "ghost"} onClick={() => setView("single")}>
            Один экран
          </Button>
          <Button variant={view === "flow" ? "primary" : "ghost"} onClick={() => setView("flow")}>
            Весь MVP
          </Button>
          <Button variant={view === "compare" ? "primary" : "ghost"} onClick={() => setView("compare")}>
            Все темы
          </Button>
        </Row>
      </Stack>

      {view === "single" ? (
        <Card>
          <CardHeader>
            {SCREENS.find((s) => s.id === activeScreen)?.label} · {theme.name}
          </CardHeader>
          <CardBody>
            <iPhone theme={theme} label="iPhone 15 Pro" role={screenRole(activeScreen)}>
              {renderScreen(activeScreen, theme)}
            </iPhone>
          </CardBody>
        </Card>
      ) : null}

      {view === "flow" ? (
        <Card>
          <CardHeader>Полный MVP · {theme.name}</CardHeader>
          <CardBody>
            <Grid columns={4} gap={20} align="start">
              {SCREENS.map((s) => (
                <span key={s.id}>
                  <iPhone theme={theme} label={s.label} role={screenRole(s.id)}>
                    {renderScreen(s.id, theme)}
                  </iPhone>
                </span>
              ))}
            </Grid>
          </CardBody>
        </Card>
      ) : null}

      {view === "compare" ? (
        <Card>
          <CardHeader>
            {SCREENS.find((s) => s.id === activeScreen)?.label} · все 6 тем
          </CardHeader>
          <CardBody>
            <Grid columns={3} gap={20} align="start">
              {THEMES.map((t) => (
                <span key={t.id}>
                  <iPhone theme={t} label={t.name} role={screenRole(activeScreen)}>
                    {renderScreen(activeScreen, t)}
                  </iPhone>
                </span>
              ))}
            </Grid>
          </CardBody>
        </Card>
      ) : null}

      <Grid columns={2} gap={20} align="start">
        <Card>
          <CardHeader>Apple Design System</CardHeader>
          <CardBody>
            <Stack gap={8}>
              {[
                ["Шрифт", "SF Pro Display / -apple-system"],
                ["Радиус кнопки", "26px pill"],
                ["Радиус карточки", "18–24px"],
                ["Фото", "Full-bleed hero + thumbnail в задачах"],
                ["База UI", "#F5F5F7 фон, #FFFFFF карточки"],
                ["Акцент", "iOS system colors per тема"],
                ["Рамка", "iPhone 15 Pro, Dynamic Island"],
              ].map(([k, v]) => (
                <span key={k}>
                  <Row justify="space-between">
                    <Text size="small" tone="secondary">
                      {k}
                    </Text>
                    <Text size="small" weight="medium">
                      {v}
                    </Text>
                  </Row>
                </span>
              ))}
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Отличие от «на коленке»</CardHeader>
          <CardBody>
            <Stack gap={8}>
              {[
                "Живые фото семей и задач — не SVG-иконки",
                "Крупная типографика, много воздуха",
                "Hero на весь экран как в Apple Store",
                "Задачи — карточки с превью фото комнаты",
                "Одобрение — фото-доказательство в карточке",
                "Нейтральная база + один акцент цвета",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    background: hostTheme.fill.tertiary,
                    border: `1px solid ${hostTheme.stroke.tertiary}`,
                  }}
                >
                  <Text size="small">{item}</Text>
                </div>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>Фото-набор · editorial</CardHeader>
        <CardBody>
          <Grid columns={4} gap={10}>
            {Object.entries(PHOTOS).map(([key, src]) => (
              <span key={key}>
                <Stack gap={4}>
                  <Photo src={src} height={72} radius={12} />
                  <Text size="small" tone="secondary">
                    {key}
                  </Text>
                </Stack>
              </span>
            ))}
          </Grid>
        </CardBody>
      </Card>
    </Stack>
  );
}
