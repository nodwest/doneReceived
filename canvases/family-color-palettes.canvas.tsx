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
import type { CSSProperties, ReactElement } from "react";

const BASE = {
  coral: "#f16577",
  lavender: "#8d90e7",
  mint: "#b1f6ac",
  gray: "#d1d1d1",
  white: "#fafafa",
} as const;

type FamilyTheme = {
  id: string;
  name: string;
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

// Коралл — только мелкие акценты (сумма награды), не кнопки и шапки
const SOFT = {
  lavender: BASE.lavender,
  lavenderLight: "#a5a8ef",
  lavenderPale: "#c8caf5",
  lavenderDeep: "#7a7dd4",
  mint: BASE.mint,
  mintDeep: "#8ed889",
  mintText: "#3d6b3a",
  coral: BASE.coral, // только badge «+80 ₽»
} as const;

const THEMES: FamilyTheme[] = [
  {
    id: "lavender-cloud",
    name: "Лавандовое облако",
    tagline: "Мягкая лаванда для всех — спокойно, семейно, без агрессии",
    parent: { primary: SOFT.lavenderDeep, header: SOFT.lavender, onPrimary: "#ffffff" },
    child: { primary: SOFT.lavenderLight, header: SOFT.lavenderPale, onPrimary: "#4a4c7a" },
    bg: BASE.white,
    surface: "#ffffff",
    border: BASE.gray,
    text: "#3d3d3d",
    textMuted: "#7a7a7a",
    success: SOFT.mint,
    reward: SOFT.coral,
  },
  {
    id: "mint-fairy",
    name: "Мятная сказка",
    tagline: "Мята у ребёнка — свежесть и радость, лаванда у родителя",
    parent: { primary: SOFT.lavender, header: SOFT.lavenderPale, onPrimary: "#ffffff" },
    child: { primary: SOFT.mint, header: SOFT.mintDeep, onPrimary: SOFT.mintText },
    bg: BASE.white,
    surface: "#ffffff",
    border: BASE.gray,
    text: "#333333",
    textMuted: "#777777",
    success: SOFT.mintDeep,
    reward: SOFT.coral,
  },
  {
    id: "gentle-family",
    name: "Нежная семья",
    tagline: "Пастель везде — одинаково мягко для родителя и ребёнка",
    parent: { primary: SOFT.lavenderDeep, header: "#b8baf0", onPrimary: "#ffffff" },
    child: { primary: SOFT.lavenderPale, header: "#dddef8", onPrimary: "#5a5c8a" },
    bg: "#f7f7fc",
    surface: "#ffffff",
    border: "#e0e0ea",
    text: "#404040",
    textMuted: "#888888",
    success: SOFT.mint,
    reward: SOFT.coral,
  },
  {
    id: "dual-pastel",
    name: "Лаванда + мята",
    tagline: "Родитель — фиолетовый, ребёнок — зелёный, коралл только на монетках",
    parent: { primary: SOFT.lavender, header: SOFT.lavenderLight, onPrimary: "#ffffff" },
    child: { primary: "#9de898", header: SOFT.mint, onPrimary: SOFT.mintText },
    bg: BASE.white,
    surface: "#ffffff",
    border: BASE.gray,
    text: "#3a3a3a",
    textMuted: "#808080",
    success: SOFT.mint,
    reward: SOFT.coral,
  },
];

function tint(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  return `rgba(${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}, ${alpha})`;
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <Stack gap={4} style={{ alignItems: "center" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: color,
          border: `1px solid ${BASE.gray}`,
        }}
      />
      <Text size="small" tone="secondary">
        {label}
      </Text>
      <Text size="small" style={{ fontFamily: "monospace", fontSize: 10 }}>
        {color}
      </Text>
    </Stack>
  );
}

function MiniPhone({
  theme,
  mode,
}: {
  theme: FamilyTheme;
  mode: "parent" | "child";
}) {
  const isChild = mode === "child";
  const accent = isChild ? theme.child : theme.parent;

  const frame: CSSProperties = {
    width: 200,
    borderRadius: isChild ? 20 : 16,
    border: `2px solid ${isChild ? tint(theme.child.primary, 0.35) : theme.border}`,
    background: theme.bg,
    overflow: "hidden",
  };

  return (
    <Stack gap={6}>
      <Text size="small" weight="medium">
        {isChild ? "Ребёнок" : "Родитель"}
      </Text>
      <div style={frame}>
        <div
          style={{
            height: 32,
            padding: "0 10px",
            background: accent.header,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="small" style={{ color: accent.onPrimary, fontWeight: 600, fontSize: 11 }}>
            {isChild ? "Привет, Маша!" : "Семейный кошелёк"}
          </Text>
        </div>
        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {isChild ? (
            <>
              <div
                style={{
                  padding: 10,
                  borderRadius: 14,
                  background: tint(theme.child.primary, 0.2),
                  border: `1.5px solid ${tint(theme.child.primary, 0.4)}`,
                }}
              >
                <Text size="small" style={{ color: theme.textMuted, fontSize: 10 }}>
                  Мой баланс
                </Text>
                <Text style={{ fontSize: 22, fontWeight: 700, color: theme.text }}>320 ₽</Text>
              </div>
              <div
                style={{
                  padding: 8,
                  borderRadius: 12,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text size="small" style={{ color: theme.text, fontSize: 11 }}>
                  Убрать комнату
                </Text>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: tint(theme.reward, 0.2),
                    color: theme.reward,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  +80 ₽
                </span>
              </div>
        <div
          style={{
            height: 36,
            borderRadius: 12,
            background: theme.child.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
                <Text size="small" style={{ color: theme.child.onPrimary, fontWeight: 600, fontSize: 11 }}>
                  Я сделал!
                </Text>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: 8,
                  borderRadius: 10,
                  background: tint(theme.parent.primary, 0.12),
                  border: `1px solid ${tint(theme.parent.primary, 0.3)}`,
                }}
              >
                <Text size="small" style={{ color: theme.textMuted, fontSize: 10 }}>
                  Ждут проверки
                </Text>
                <Text size="small" style={{ color: theme.text, fontWeight: 600, fontSize: 11 }}>
                  Уроки сделаны · Маша
                </Text>
              </div>
              <div
                style={{
                  padding: 8,
                  borderRadius: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Row justify="space-between" align="center">
                  <Text size="small" style={{ color: theme.text, fontSize: 11 }}>
                    Вынести мусор
                  </Text>
                  <span style={{ color: theme.success, fontSize: 10, fontWeight: 600 }}>+50 ₽</span>
                </Row>
              </div>
              <div
                style={{
                  height: 32,
                  borderRadius: 10,
                  background: theme.parent.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text size="small" style={{ color: theme.parent.onPrimary, fontWeight: 600, fontSize: 11 }}>
                  + Новая задача
                </Text>
              </div>
            </>
          )}
        </div>
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            padding: "6px 4px",
            display: "flex",
            justifyContent: "space-around",
            background: tint(theme.bg, 1),
          }}
        >
          {(isChild ? ["Задачи", "Кошелёк", "Мечта"] : ["Дом", "Задачи", "Дети"]).map((t) => (
            <Text key={t} style={{ fontSize: 9, color: theme.textMuted }}>
              {t}
            </Text>
          ))}
        </div>
      </div>
    </Stack>
  );
}

function WelcomePreviewFixed({ theme }: { theme: FamilyTheme }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 14,
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <svg width={120} height={48} viewBox="0 0 120 48" aria-hidden>
        <rect x={42} y={18} width={36} height={24} rx={4} fill={tint(BASE.coral, 0.4)} />
        <polygon points="40,20 60,6 80,20" fill={tint(BASE.lavender, 0.45)} />
        <circle cx={28} cy={32} r={8} fill={tint(BASE.lavender, 0.5)} />
        <circle cx={60} cy={30} r={7} fill={tint(BASE.coral, 0.5)} />
        <circle cx={88} cy={32} r={7} fill={tint(BASE.mint, 0.55)} />
      </svg>
      <Text weight="medium" style={{ color: theme.text }}>
        Семейный кошелёк
      </Text>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            height: 34,
            borderRadius: 10,
            background: theme.parent.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="small" style={{ color: theme.parent.onPrimary, fontWeight: 600, fontSize: 11 }}>
            Я родитель
          </Text>
        </div>
        <div
          style={{
            height: 34,
            borderRadius: 10,
            background: tint(theme.child.primary, 0.15),
            border: `1.5px solid ${theme.child.primary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="small" style={{ color: theme.child.primary, fontWeight: 600, fontSize: 11 }}>
            Я ребёнок
          </Text>
        </div>
      </div>
    </div>
  );
}

function ThemeCardClean({ theme }: { theme: FamilyTheme }) {
  return (
    <Card>
      <CardHeader>{theme.name}</CardHeader>
      <CardBody>
        <Stack gap={14}>
          <Text size="small" tone="secondary">
            {theme.tagline}
          </Text>
          <Grid columns={3} gap={10}>
            <WelcomePreviewFixed theme={theme} />
            <MiniPhone theme={theme} mode="parent" />
            <MiniPhone theme={theme} mode="child" />
          </Grid>
          <Row gap={16} wrap justify="center">
            <Swatch color={theme.parent.primary} label="Родитель" />
            <Swatch color={theme.child.primary} label="Ребёнок" />
            <Swatch color={theme.success} label="Успех" />
            <Swatch color={theme.bg} label="Фон" />
            <Swatch color={theme.border} label="Границы" />
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function FamilyColorPalettes() {
  const [active, setActive] = useCanvasState("palette", "lavender-cloud");
  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  const usage = [
    { color: BASE.lavender, role: "Родитель, шапки, основные кнопки" },
    { color: SOFT.lavenderLight, role: "Ребёнок — мягкая лаванда или мята" },
    { color: BASE.mint, role: "Успех, «одобрено», прогресс" },
    { color: BASE.coral, role: "Только сумма награды (+80 ₽), не кнопки" },
    { color: BASE.white, role: "Фон экранов" },
  ];

  return (
    <Stack gap={24}>
      <Stack gap={6}>
        <H1>Цветовые темы · Семейный кошелёк</H1>
        <Text tone="secondary">
          4 варианта на базе #f16577 · #8d90e7 · #b1f6ac · #d1d1d1 · #fafafa. Переключайте тему —
          смотрите приветствие, родителя и ребёнка.
        </Text>
      </Stack>

      <Card>
        <CardHeader>Базовая палитра</CardHeader>
        <CardBody>
          <Row gap={20} wrap justify="center">
            {usage.map((u) => (
              <Stack key={u.color} gap={4} style={{ maxWidth: 120, alignItems: "center" }}>
                <Swatch color={u.color} label={u.color} />
                <Text size="small" tone="secondary" style={{ textAlign: "center", fontSize: 10 }}>
                  {u.role}
                </Text>
              </Stack>
            ))}
          </Row>
        </CardBody>
      </Card>

      <Row gap={8} wrap>
        {THEMES.map((t) => (
          <span key={t.id}>
            <Button variant={active === t.id ? "primary" : "ghost"} onClick={() => setActive(t.id)}>
              {t.name}
            </Button>
          </span>
        ))}
      </Row>

      <ThemeCardClean theme={current} />

      <Card>
        <CardHeader>Все 4 варианта</CardHeader>
        <CardBody>
          <Stack gap={20}>
            {THEMES.map((t) => (
              <Stack key={t.id} gap={8}>
                <H2>{t.name}</H2>
                <Grid columns={3} gap={10}>
                  <WelcomePreviewFixed theme={t} />
                  <MiniPhone theme={t} mode="parent" />
                  <MiniPhone theme={t} mode="child" />
                </Grid>
              </Stack>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Рекомендация</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <H3>Лавандовое облако — лучший баланс</H3>
            <Text size="small" tone="secondary">
              Без агрессивного красного: лаванда (#8d90e7) для родителя, светлая лаванда (#a5a8ef)
              для ребёнка. Мята (#b1f6ac) — «одобрено». Коралл (#f16577) только на бейджах с
              суммой награды, не на кнопках и шапках.
            </Text>
            <Grid columns={2} gap={12}>
              {[
                ["Родитель", SOFT.lavenderDeep],
                ["Ребёнок", SOFT.lavenderLight],
                ["Успех", BASE.mint],
                ["Награда (badge)", BASE.coral],
                ["Фон", BASE.white],
                ["Границы", BASE.gray],
              ].map(([label, hex]) => (
                <Row key={label} justify="space-between" align="center">
                  <Text size="small">{label}</Text>
                  <Row gap={8} align="center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        background: hex as string,
                        border: `1px solid ${BASE.gray}`,
                      }}
                    />
                    <Text size="small" style={{ fontFamily: "monospace" }}>
                      {hex}
                    </Text>
                  </Row>
                </Row>
              ))}
            </Grid>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
