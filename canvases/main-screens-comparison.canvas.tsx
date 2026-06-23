import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  Row,
  Spacer,
  Stack,
  Text,
  useCanvasState,
} from "cursor/canvas";
import type { CSSProperties, ReactElement } from "react";

type Theme = {
  id: string;
  name: string;
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

const THEMES: Theme[] = [
  {
    id: "sky",
    name: "Небесная гavань",
    parent: { primary: "#5B8DEF", header: "#7EB0F5", onPrimary: "#fff" },
    child: { primary: "#9EC5FF", header: "#C5DFFB", onPrimary: "#2E4A6E" },
    bg: "#F8FAFC",
    surface: "#fff",
    border: "#DDE4EE",
    text: "#2C3E50",
    textMuted: "#7A8A9A",
    success: "#6BCB9A",
    reward: "#F0A830",
  },
  {
    id: "forest",
    name: "Лесная поляна",
    parent: { primary: "#6B9080", header: "#8FB09E", onPrimary: "#fff" },
    child: { primary: "#A4C3A2", header: "#C5DBC3", onPrimary: "#2F4A2E" },
    bg: "#F6F9F4",
    surface: "#fff",
    border: "#D5E0D0",
    text: "#2D3B2D",
    textMuted: "#6B7B6A",
    success: "#95D5B2",
    reward: "#E9C46A",
  },
  {
    id: "peach",
    name: "Месечный день",
    parent: { primary: "#C4858A", header: "#D9A8AC", onPrimary: "#fff" },
    child: { primary: "#F4C4B0", header: "#FADED0", onPrimary: "#6B4540" },
    bg: "#FFF9F5",
    surface: "#fff",
    border: "#EDD5CC",
    text: "#4A3835",
    textMuted: "#8A7570",
    success: "#88C999",
    reward: "#D4A056",
  },
  {
    id: "sea",
    name: "Морской бриз",
    parent: { primary: "#4A9DA8", header: "#6BB8C2", onPrimary: "#fff" },
    child: { primary: "#8AD4DC", header: "#B8E8ED", onPrimary: "#1E5058" },
    bg: "#F5FAFA",
    surface: "#fff",
    border: "#C8E6EA",
    text: "#1E3A40",
    textMuted: "#6A9098",
    success: "#98D8C8",
    reward: "#F0B87A",
  },
  {
    id: "honey",
    name: "Мёд и молоко",
    parent: { primary: "#C4A77D", header: "#D9C4A0", onPrimary: "#fff" },
    child: { primary: "#FFE8A3", header: "#FFF0C4", onPrimary: "#6B5520" },
    bg: "#FFFBF0",
    surface: "#fff",
    border: "#E8DFC8",
    text: "#5C4A32",
    textMuted: "#9A8870",
    success: "#A8D5A2",
    reward: "#E8A838",
  },
  {
    id: "twilight",
    name: "Пониебов",
    parent: { primary: "#7B6BA8", header: "#9A8BC0", onPrimary: "#fff" },
    child: { primary: "#B8A9D9", header: "#D4CAEA", onPrimary: "#3E3458" },
    bg: "#F9F7FC",
    surface: "#fff",
    border: "#DDD8EA",
    text: "#3A3348",
    textMuted: "#7A7288",
    success: "#89C9A8",
    reward: "#DDA15E",
  },
];

function tint(hex: string, a: number) {
  const c = hex.replace("#", "");
  return `rgba(${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)},${a})`;
}

function Phone({
  theme,
  mode,
  large,
}: {
  theme: Theme;
  mode: "parent" | "child";
  large?: boolean;
}) {
  const isChild = mode === "child";
  const acc = isChild ? theme.child : theme.parent;
  const w = large ? 300 : 240;

  const frame: CSSProperties = {
    width: w,
    height: large ? 580 : 460,
    borderRadius: isChild ? 28 : 22,
    border: `2px solid ${theme.border}`,
    background: theme.bg,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  };

  const nav = (items: string[], active: number) => (
    <div
      style={{
        borderTop: `1px solid ${theme.border}`,
        padding: "10px 8px 14px",
        display: "flex",
        justifyContent: "space-around",
        background: theme.surface,
      }}
    >
      {items.map((item, i) => (
        <Stack key={item} gap={2} style={{ alignItems: "center" }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? acc.primary : "transparent",
            }}
          />
          <Text style={{ fontSize: large ? 10 : 9, color: i === active ? acc.primary : theme.textMuted, fontWeight: i === active ? 600 : 400 }}>
            {item}
          </Text>
        </Stack>
      ))}
    </div>
  );

  if (isChild) {
    return (
      <div style={frame}>
        <div style={{ height: 44, background: acc.header, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 11, color: acc.onPrimary, opacity: 0.85 }}>9:41</Text>
          <Text style={{ fontSize: large ? 15 : 13, fontWeight: 700, color: acc.onPrimary }}>Привет, Маша!</Text>
          <Text style={{ fontSize: 11, color: acc.onPrimary, opacity: 0.85 }}>··</Text>
        </div>
        <div style={{ padding: large ? 18 : 14, flex: 1, display: "flex", flexDirection: "column", gap: large ? 14 : 10 }}>
          <div
            style={{
              padding: large ? 20 : 16,
              borderRadius: 20,
              background: tint(theme.child.primary, 0.35),
              border: `2px solid ${tint(theme.child.primary, 0.5)}`,
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: large ? 12 : 11, color: theme.textMuted }}>Мой баланс</Text>
            <Text style={{ fontSize: large ? 40 : 32, fontWeight: 800, color: theme.text, lineHeight: 1.1 }}>320 ₽</Text>
          </div>

          <div style={{ padding: large ? 14 : 11, borderRadius: 16, background: theme.surface, border: `1px solid ${theme.border}` }}>
            <Row justify="space-between" align="center">
              <Text style={{ fontSize: large ? 12 : 11, fontWeight: 600, color: theme.text }}>Мечта: кино</Text>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>320 / 500</Text>
            </Row>
            <div style={{ marginTop: 8, height: 10, borderRadius: 5, background: tint(theme.border, 0.5), overflow: "hidden" }}>
              <div style={{ width: "64%", height: "100%", background: theme.success, borderRadius: 5 }} />
            </div>
          </div>

          <Text style={{ fontSize: large ? 13 : 12, fontWeight: 700, color: theme.text }}>Сегодня</Text>

          {[
            { t: "Убрать комнату", r: "+80 ₽", s: "new" as const },
            { t: "Уроки", r: "+100 ₽", s: "wait" as const },
            { t: "Выгулять собаку", r: "+50 ₽", s: "done" as const },
          ].map((task) => (
            <div
              key={task.t}
              style={{
                padding: large ? 14 : 11,
                borderRadius: 14,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                opacity: task.s === "done" ? 0.65 : 1,
              }}
            >
              <Row justify="space-between" align="center">
                <Text style={{ fontSize: large ? 13 : 12, fontWeight: 600, color: theme.text, textDecoration: task.s === "done" ? "line-through" : "none" }}>
                  {task.t}
                </Text>
                <span style={{ padding: "4px 10px", borderRadius: 999, background: tint(theme.reward, 0.2), color: theme.reward, fontSize: 11, fontWeight: 700 }}>
                  {task.r}
                </span>
              </Row>
              {task.s === "wait" ? (
                <Text style={{ fontSize: 10, color: theme.textMuted, marginTop: 4 }}>Ждём проверки…</Text>
              ) : null}
            </div>
          ))}

          <Spacer />

          <div
            style={{
              height: large ? 52 : 44,
              borderRadius: 16,
              background: theme.child.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: large ? 16 : 14, fontWeight: 700, color: theme.child.onPrimary }}>Я сделал!</Text>
          </div>
        </div>
        {nav(["Задачи", "Кошелёк", "Мечта"], 0)}
      </div>
    );
  }

  return (
    <div style={frame}>
      <div style={{ height: 40, background: tint(theme.parent.primary, 0.15), padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 11, color: theme.textMuted }}>9:41</Text>
        <Text style={{ fontSize: large ? 14 : 12, fontWeight: 700, color: theme.text }}>Доброе утро, Анна</Text>
        <Text style={{ fontSize: 11, color: theme.textMuted }}>··</Text>
      </div>
      <div style={{ padding: large ? 18 : 14, flex: 1, display: "flex", flexDirection: "column", gap: large ? 14 : 10 }}>
        <div style={{ padding: large ? 16 : 12, borderRadius: 16, background: tint(theme.parent.primary, 0.12), border: `1px solid ${tint(theme.parent.primary, 0.25)}` }}>
          <Text style={{ fontSize: 11, color: theme.textMuted }}>Накоплено детям</Text>
          <Text style={{ fontSize: large ? 28 : 22, fontWeight: 800, color: theme.text }}>450 ₽</Text>
        </div>

        <Text style={{ fontSize: large ? 13 : 12, fontWeight: 700, color: theme.text }}>Ждут проверки · 2</Text>

        {[
          { t: "Уроки сделаны", who: "Маша", r: "+100 ₽" },
          { t: "Вынести мусор", who: "Петя", r: "+50 ₽" },
        ].map((item) => (
          <div
            key={item.t}
            style={{
              padding: large ? 14 : 11,
              borderRadius: 14,
              background: tint(theme.reward, 0.08),
              border: `1.5px solid ${tint(theme.reward, 0.25)}`,
            }}
          >
            <Row justify="space-between" align="start">
              <Stack gap={2}>
                <Text style={{ fontSize: large ? 13 : 12, fontWeight: 600, color: theme.text }}>{item.t}</Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>{item.who}</Text>
              </Stack>
              <Stack gap={6} style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 12, fontWeight: 700, color: theme.reward }}>{item.r}</Text>
                <Row gap={4}>
                  <div style={{ padding: "5px 10px", borderRadius: 8, background: theme.surface, border: `1px solid ${theme.border}` }}>
                    <Text style={{ fontSize: 10, color: theme.textMuted }}>Нет</Text>
                  </div>
                  <div style={{ padding: "5px 10px", borderRadius: 8, background: theme.success }}>
                    <Text style={{ fontSize: 10, fontWeight: 600, color: "#2d5a3d" }}>Да</Text>
                  </div>
                </Row>
              </Stack>
            </Row>
          </div>
        ))}

        <Text style={{ fontSize: large ? 13 : 12, fontWeight: 700, color: theme.text }}>На сегодня</Text>

        <div style={{ padding: large ? 14 : 11, borderRadius: 14, background: theme.surface, border: `1px solid ${theme.border}` }}>
          <Row justify="space-between">
            <Stack gap={2}>
              <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Убрать комнату</Text>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>Маша · новая</Text>
            </Stack>
            <Text style={{ fontSize: 12, fontWeight: 700, color: theme.reward }}>+80 ₽</Text>
          </Row>
        </div>

        <Spacer />

        <div
          style={{
            height: large ? 48 : 40,
            borderRadius: 14,
            background: theme.parent.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: large ? 15 : 13, fontWeight: 700, color: theme.parent.onPrimary }}>+ Новая задача</Text>
        </div>
      </div>
      {nav(["Дом", "Задачи", "Дети"], 0)}
    </div>
  );
}

function ThemeRow({ theme, large }: { theme: Theme; large?: boolean }) {
  return (
    <Card>
      <CardHeader>{theme.name}</CardHeader>
      <CardBody>
        <Row gap={large ? 24 : 16} wrap justify="center" align="start">
          <Stack gap={8} style={{ alignItems: "center" }}>
            <Text size="small" weight="medium">
              Главная родителя
            </Text>
            <Phone theme={theme} mode="parent" large={large} />
          </Stack>
          <Stack gap={8} style={{ alignItems: "center" }}>
            <Text size="small" weight="medium">
              Главная ребёнка
            </Text>
            <Phone theme={theme} mode="child" large={large} />
          </Stack>
        </Row>
      </CardBody>
    </Card>
  );
}

export default function MainScreensComparison() {
  const [view, setView] = useCanvasState<"all" | "one">("view-mode", "one");
  const [active, setActive] = useCanvasState("main-theme", "sky");
  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  return (
    <Stack gap={24}>
      <Stack gap={6}>
        <H1>Главные экраны · сравнение тем</H1>
        <Text tone="secondary">
          Полноценные главные окна родителя и ребёнка. Режим «Одна тема» — крупно. «Все 6» —
          листайте и сравнивайте подряд.
        </Text>
        <Row gap={8}>
          <Button variant={view === "one" ? "primary" : "ghost"} onClick={() => setView("one")}>
            Одна тема — крупно
          </Button>
          <Button variant={view === "all" ? "primary" : "ghost"} onClick={() => setView("all")}>
            Все 6 тем подряд
          </Button>
        </Row>
      </Stack>

      {view === "one" ? (
        <>
          <Row gap={6} wrap>
            {THEMES.map((t) => (
              <span key={t.id}>
                <Button variant={active === t.id ? "primary" : "ghost"} onClick={() => setActive(t.id)}>
                  {t.name}
                </Button>
              </span>
            ))}
          </Row>
          <ThemeRow theme={current} large />
          <Card>
            <CardHeader>Что смотреть</CardHeader>
            <CardBody>
              <Grid columns={2} gap={12}>
                {[
                  ["Баланс ребёнка", "Читается ли 320 ₽? Приятен ли фон карточки?"],
                  ["Кнопка «Я сделал!»", "Хочется нажать? Не слишком ярко?"],
                  ["Очередь проверки", "Видно ли сразу, что ждёт родителя?"],
                  ["Награды +80 ₽", "Золото/янтарь — заметно, но не раздражает"],
                ].map(([title, hint]) => (
                  <div key={title}>
                    <Text size="small" weight="medium">
                      {title}
                    </Text>
                    <Text size="small" tone="secondary">
                      {hint}
                    </Text>
                  </div>
                ))}
              </Grid>
            </CardBody>
          </Card>
        </>
      ) : (
        <Stack gap={20}>
          {THEMES.map((t) => (
            <ThemeRow key={t.id} theme={t} large={false} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
