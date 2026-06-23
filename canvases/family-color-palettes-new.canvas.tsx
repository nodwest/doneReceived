import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  H3,
  Row,
  Stack,
  Text,
  useCanvasState,
} from "cursor/canvas";
import type { CSSProperties } from "react";

type FamilyTheme = {
  id: string;
  name: string;
  mood: string;
  tagline: string;
  parent: { primary: string; header: string; onPrimary: string };
  child: { primary: string; header: string; onPrimary: string };
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  success: string;
  reward: string;
};

const THEMES: FamilyTheme[] = [
  {
    id: "sky-harbor",
    name: "Небесная гавань",
    mood: "Спокойствие · доверие",
    tagline: "Мягкий голубой — как ясное небо, без напряжения",
    parent: { primary: "#5B8DEF", header: "#7EB0F5", onPrimary: "#ffffff" },
    child: { primary: "#9EC5FF", header: "#C5DFFB", onPrimary: "#2E4A6E" },
    bg: "#F8FAFC",
    surface: "#ffffff",
    border: "#DDE4EE",
    text: "#2C3E50",
    textMuted: "#7A8A9A",
    success: "#6BCB9A",
    reward: "#F0A830",
  },
  {
    id: "forest-glade",
    name: "Лесная поляна",
    mood: "Природа · рост",
    tagline: "Шалфей и мох — заземлённая семейная атмосфера",
    parent: { primary: "#6B9080", header: "#8FB09E", onPrimary: "#ffffff" },
    child: { primary: "#A4C3A2", header: "#C5DBC3", onPrimary: "#2F4A2E" },
    bg: "#F6F9F4",
    surface: "#ffffff",
    border: "#D5E0D0",
    text: "#2D3B2D",
    textMuted: "#6B7B6A",
    success: "#95D5B2",
    reward: "#E9C46A",
  },
  {
    id: "peach-dusk",
    name: "Месечный день",
    mood: "Тепло · уют",
    tagline: "Пыльная роза и персик — домашнее тепло без крика",
    parent: { primary: "#C4858A", header: "#D9A8AC", onPrimary: "#ffffff" },
    child: { primary: "#F4C4B0", header: "#FADED0", onPrimary: "#6B4540" },
    bg: "#FFF9F5",
    surface: "#ffffff",
    border: "#EDD5CC",
    text: "#4A3835",
    textMuted: "#8A7570",
    success: "#88C999",
    reward: "#D4A056",
  },
  {
    id: "sea-breeze",
    name: "Морской бриз",
    mood: "Свежесть · лёгкость",
    tagline: "Бирюза и песок — ощущение отпуска и свободы",
    parent: { primary: "#4A9DA8", header: "#6BB8C2", onPrimary: "#ffffff" },
    child: { primary: "#8AD4DC", header: "#B8E8ED", onPrimary: "#1E5058" },
    bg: "#F5FAFA",
    surface: "#ffffff",
    border: "#C8E6EA",
    text: "#1E3A40",
    textMuted: "#6A9098",
    success: "#98D8C8",
    reward: "#F0B87A",
  },
  {
    id: "honey-milk",
    name: "Мёд и молоко",
    mood: "Дом · безопасность",
    tagline: "Кремовый и медовый — как воскресное утро дома",
    parent: { primary: "#C4A77D", header: "#D9C4A0", onPrimary: "#ffffff" },
    child: { primary: "#FFE8A3", header: "#FFF0C4", onPrimary: "#6B5520" },
    bg: "#FFFBF0",
    surface: "#ffffff",
    border: "#E8DFC8",
    text: "#5C4A32",
    textMuted: "#9A8870",
    success: "#A8D5A2",
    reward: "#E8A838",
  },
  {
    id: "twilight-tale",
    name: "Пониебов",
    mood: "Сказка · мечта",
    tagline: "Приглушённый сливовый — волшебство без кислотности",
    parent: { primary: "#7B6BA8", header: "#9A8BC0", onPrimary: "#ffffff" },
    child: { primary: "#B8A9D9", header: "#D4CAEA", onPrimary: "#3E3458" },
    bg: "#F9F7FC",
    surface: "#ffffff",
    border: "#DDD8EA",
    text: "#3A3348",
    textMuted: "#7A7288",
    success: "#89C9A8",
    reward: "#DDA15E",
  },
];

function tint(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  return `rgba(${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}, ${alpha})`;
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <Stack gap={3} style={{ alignItems: "center", minWidth: 56 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: color,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      />
      <Text size="small" tone="secondary" style={{ fontSize: 9, textAlign: "center" }}>
        {label}
      </Text>
      <Text size="small" style={{ fontFamily: "monospace", fontSize: 9 }}>
        {color}
      </Text>
    </Stack>
  );
}

function MiniPhone({ theme, mode }: { theme: FamilyTheme; mode: "parent" | "child" }) {
  const isChild = mode === "child";
  const accent = isChild ? theme.child : theme.parent;

  return (
    <Stack gap={5}>
      <Text size="small" weight="medium">
        {isChild ? "Ребёнок" : "Родитель"}
      </Text>
      <div
        style={{
          width: 188,
          borderRadius: isChild ? 18 : 14,
          border: `2px solid ${tint(accent.primary, 0.25)}`,
          background: theme.bg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 30,
            background: accent.header,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="small" style={{ color: accent.onPrimary, fontWeight: 600, fontSize: 10 }}>
            {isChild ? "Привет, Маша!" : "Семейный кошелёк"}
          </Text>
        </div>
        <div style={{ padding: 9, display: "flex", flexDirection: "column", gap: 7 }}>
          {isChild ? (
            <>
              <div
                style={{
                  padding: 9,
                  borderRadius: 12,
                  background: tint(theme.child.primary, 0.25),
                  border: `1px solid ${tint(theme.child.primary, 0.4)}`,
                }}
              >
                <Text style={{ fontSize: 9, color: theme.textMuted }}>Мой баланс</Text>
                <Text style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>320 ₽</Text>
              </div>
              <div
                style={{
                  padding: 7,
                  borderRadius: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 10, color: theme.text }}>Убрать комнату</Text>
                <span
                  style={{
                    padding: "2px 7px",
                    borderRadius: 999,
                    background: tint(theme.reward, 0.2),
                    color: theme.reward,
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  +80 ₽
                </span>
              </div>
              <div
                style={{
                  height: 34,
                  borderRadius: 11,
                  background: theme.child.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: 600, color: theme.child.onPrimary }}>
                  Я сделал!
                </Text>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: 7,
                  borderRadius: 9,
                  background: tint(theme.parent.primary, 0.12),
                  border: `1px solid ${tint(theme.parent.primary, 0.25)}`,
                }}
              >
                <Text style={{ fontSize: 9, color: theme.textMuted }}>Ждут проверки</Text>
                <Text style={{ fontSize: 10, fontWeight: 600, color: theme.text }}>
                  Уроки · Маша
                </Text>
              </div>
              <div
                style={{
                  padding: 7,
                  borderRadius: 9,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Row justify="space-between" align="center">
                  <Text style={{ fontSize: 10, color: theme.text }}>Вынести мусор</Text>
                  <Text style={{ fontSize: 9, fontWeight: 600, color: theme.success }}>+50 ₽</Text>
                </Row>
              </div>
              <div
                style={{
                  height: 30,
                  borderRadius: 9,
                  background: theme.parent.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: 600, color: theme.parent.onPrimary }}>
                  + Новая задача
                </Text>
              </div>
            </>
          )}
        </div>
      </div>
    </Stack>
  );
}

function WelcomeBlock({ theme }: { theme: FamilyTheme }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {[theme.parent.primary, theme.child.primary, theme.success].map((c) => (
          <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
        ))}
      </div>
      <Text weight="medium" style={{ color: theme.text, fontSize: 12 }}>
        Семейный кошелёк
      </Text>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            height: 30,
            borderRadius: 9,
            background: theme.parent.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 600, color: theme.parent.onPrimary }}>
            Я родитель
          </Text>
        </div>
        <div
          style={{
            height: 30,
            borderRadius: 9,
            background: theme.child.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 600, color: theme.child.onPrimary }}>
            Я ребёнок
          </Text>
        </div>
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: FamilyTheme }) {
  return (
    <Card>
      <CardHeader>
        {theme.name} · {theme.mood}
      </CardHeader>
      <CardBody>
        <Stack gap={12}>
          <Text size="small" tone="secondary">
            {theme.tagline}
          </Text>
          <Grid columns={3} gap={8}>
            <WelcomeBlock theme={theme} />
            <MiniPhone theme={theme} mode="parent" />
            <MiniPhone theme={theme} mode="child" />
          </Grid>
          <Row gap={10} wrap justify="center">
            <Swatch color={theme.parent.primary} label="Родитель" />
            <Swatch color={theme.child.primary} label="Ребёнок" />
            <Swatch color={theme.success} label="Успех" />
            <Swatch color={theme.reward} label="Награда" />
            <Swatch color={theme.bg} label="Фон" />
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function FamilyColorPalettesNew() {
  const [active, setActive] = useCanvasState("palette-new", "sky-harbor");
  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  const picks = [
    {
      name: "Универсальная",
      id: "sky-harbor",
      why: "Голубой нравится и детям, и взрослым. Нейтрально, чисто, не устаёшь.",
    },
    {
      name: "Для младших",
      id: "honey-milk",
      why: "Тёплый крем и мёд — ощущение безопасности, 5–8 лет.",
    },
    {
      name: "Для природы/ЗОЖ",
      id: "forest-glade",
      why: "Зелёный про рост и привычки, спокойный родительский UI.",
    },
  ];

  return (
    <Stack gap={24}>
      <Stack gap={6}>
        <H1>Новые палитры · без привязки к старым цветам</H1>
        <Text tone="secondary">
          6 самостоятельных семейных тем. Коралл и лаванда не используются — каждая палитра собрана
          с нуля под настроение.
        </Text>
      </Stack>

      <Row gap={6} wrap>
        {THEMES.map((t) => (
          <span key={t.id}>
            <Button variant={active === t.id ? "primary" : "ghost"} onClick={() => setActive(t.id)}>
              {t.name}
            </Button>
          </span>
        ))}
      </Row>

      <ThemePreview theme={current} />

      <Card>
        <CardHeader>Все 6 вариантов</CardHeader>
        <CardBody>
          <Stack gap={16}>
            {THEMES.map((t) => (
              <Stack key={t.id} gap={6}>
                <H2>{t.name}</H2>
                <Grid columns={3} gap={8}>
                  <WelcomeBlock theme={t} />
                  <MiniPhone theme={t} mode="parent" />
                  <MiniPhone theme={t} mode="child" />
                </Grid>
              </Stack>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Куда смотреть</CardHeader>
        <CardBody>
          <Grid columns={3} gap={12}>
            {picks.map((p) => {
              const t = THEMES.find((x) => x.id === p.id)!;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: `2px solid ${t.parent.primary}`,
                    background: tint(t.bg, 1),
                  }}
                >
                  <H3>{p.name}</H3>
                  <Text size="small" weight="medium">
                    {t.name}
                  </Text>
                  <Text size="small" tone="secondary">
                    {p.why}
                  </Text>
                </div>
              );
            })}
          </Grid>
        </CardBody>
      </Card>
    </Stack>
  );
}
