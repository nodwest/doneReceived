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
  Row,
  Spacer,
  Stack,
  Text,
  computeDAGLayout,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";
import type { ReactElement } from "react";

type FamilyTheme = {
  id: string;
  name: string;
  mood: string;
  parent: { primary: string; header: string; onPrimary: string };
  child: { primary: string; header: string; onPrimary: string };
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  success: string;
  reward: string;
  reject: string;
};

const THEMES: FamilyTheme[] = [
  {
    id: "sky-harbor",
    name: "Небесная гавань",
    mood: "Спокойствие",
    parent: { primary: "#5B8DEF", header: "#7EB0F5", onPrimary: "#ffffff" },
    child: { primary: "#9EC5FF", header: "#C5DFFB", onPrimary: "#2E4A6E" },
    bg: "#F8FAFC",
    surface: "#ffffff",
    border: "#DDE4EE",
    text: "#2C3E50",
    textMuted: "#7A8A9A",
    success: "#6BCB9A",
    reward: "#F0A830",
    reject: "#E07A7A",
  },
  {
    id: "forest-glade",
    name: "Лесная поляна",
    mood: "Природа",
    parent: { primary: "#6B9080", header: "#8FB09E", onPrimary: "#ffffff" },
    child: { primary: "#A4C3A2", header: "#C5DBC3", onPrimary: "#2F4A2E" },
    bg: "#F6F9F4",
    surface: "#ffffff",
    border: "#D5E0D0",
    text: "#2D3B2D",
    textMuted: "#6B7B6A",
    success: "#95D5B2",
    reward: "#E9C46A",
    reject: "#D4847A",
  },
  {
    id: "peach-dusk",
    name: "Месечный день",
    mood: "Уют",
    parent: { primary: "#C4858A", header: "#D9A8AC", onPrimary: "#ffffff" },
    child: { primary: "#F4C4B0", header: "#FADED0", onPrimary: "#6B4540" },
    bg: "#FFF9F5",
    surface: "#ffffff",
    border: "#EDD5CC",
    text: "#4A3835",
    textMuted: "#8A7570",
    success: "#88C999",
    reward: "#D4A056",
    reject: "#C97A7A",
  },
  {
    id: "sea-breeze",
    name: "Морской бриз",
    mood: "Свежесть",
    parent: { primary: "#4A9DA8", header: "#6BB8C2", onPrimary: "#ffffff" },
    child: { primary: "#8AD4DC", header: "#B8E8ED", onPrimary: "#1E5058" },
    bg: "#F5FAFA",
    surface: "#ffffff",
    border: "#C8E6EA",
    text: "#1E3A40",
    textMuted: "#6A9098",
    success: "#98D8C8",
    reward: "#F0B87A",
    reject: "#D88A8A",
  },
  {
    id: "honey-milk",
    name: "Мёд и молоко",
    mood: "Дом",
    parent: { primary: "#C4A77D", header: "#D9C4A0", onPrimary: "#ffffff" },
    child: { primary: "#FFE8A3", header: "#FFF0C4", onPrimary: "#6B5520" },
    bg: "#FFFBF0",
    surface: "#ffffff",
    border: "#E8DFC8",
    text: "#5C4A32",
    textMuted: "#9A8870",
    success: "#A8D5A2",
    reward: "#E8A838",
    reject: "#D4907A",
  },
  {
    id: "twilight-tale",
    name: "Пониебов",
    mood: "Мечта",
    parent: { primary: "#7B6BA8", header: "#9A8BC0", onPrimary: "#ffffff" },
    child: { primary: "#B8A9D9", header: "#D4CAEA", onPrimary: "#3E3458" },
    bg: "#F9F7FC",
    surface: "#ffffff",
    border: "#DDD8EA",
    text: "#3A3348",
    textMuted: "#7A7288",
    success: "#89C9A8",
    reward: "#DDA15E",
    reject: "#C88A9A",
  },
];

type VariantId = "qr-center" | "wizard" | "dual";

const VARIANTS: { id: VariantId; name: string; desc: string }[] = [
  {
    id: "qr-center",
    name: "QR в центре",
    desc: "После регистрации — сразу большой QR. Ребёнок = главный путь, ручной ввод — запасной.",
  },
  {
    id: "wizard",
    name: "Мастер шагов",
    desc: "4 шага с прогрессом. QR на шаге 3, структурированный и предсказуемый флоу.",
  },
  {
    id: "dual",
    name: "Двойной экран",
    desc: "Родитель и ребёнок видят связанные экраны. QR ↔ камера как единая пара.",
  },
];

function tint(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  return `rgba(${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}, ${alpha})`;
}

function SceneBanner({ theme, children }: { theme: FamilyTheme; children: ReactElement }) {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 12,
        background: tint(theme.parent.primary, 0.08),
        border: `1px solid ${tint(theme.parent.primary, 0.18)}`,
        overflow: "hidden",
        marginBottom: 2,
      }}
    >
      {children}
    </div>
  );
}

function ThemeHero({ theme }: { theme: FamilyTheme }) {
  const p = theme.parent.primary;
  const c = theme.child.primary;
  const r = theme.reward;

  if (theme.id === "sky-harbor") {
    return (
      <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
        <rect width="220" height="56" fill={tint(p, 0.12)} />
        <ellipse cx="48" cy="22" rx="22" ry="10" fill={tint(c, 0.55)} />
        <ellipse cx="72" cy="18" rx="18" ry="9" fill={tint(c, 0.4)} />
        <ellipse cx="168" cy="20" rx="20" ry="10" fill={tint(c, 0.45)} />
        <circle cx="182" cy="14" r="9" fill={tint(r, 0.7)} />
        <rect x="88" y="34" width="44" height="18" rx="4" fill={tint(p, 0.35)} />
        <polygon points="84,36 110,20 136,36" fill={tint(p, 0.5)} />
      </svg>
    );
  }
  if (theme.id === "forest-glade") {
    return (
      <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
        <rect width="220" height="56" fill={tint(p, 0.1)} />
        <polygon points="30,44 30,28 42,18 54,28 54,44" fill={tint(p, 0.55)} />
        <polygon points="58,44 58,24 72,12 86,24 86,44" fill={tint(p, 0.7)} />
        <polygon points="156,44 156,26 168,16 180,26 180,44" fill={tint(p, 0.5)} />
        <rect x="0" y="44" width="220" height="12" fill={tint(p, 0.25)} />
        <ellipse cx="110" cy="46" rx="8" ry="4" fill={tint(c, 0.6)} />
      </svg>
    );
  }
  if (theme.id === "peach-dusk") {
    return (
      <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
        <rect width="220" height="56" fill={tint(p, 0.1)} />
        <circle cx="168" cy="20" r="14" fill={tint(c, 0.5)} />
        <circle cx="178" cy="18" r="12" fill={tint(theme.bg, 1)} />
        <circle cx="40" cy="14" r="2" fill={tint(r, 0.8)} />
        <circle cx="60" cy="10" r="1.5" fill={tint(r, 0.6)} />
        <circle cx="130" cy="12" r="2" fill={tint(r, 0.7)} />
        <rect x="78" y="36" width="64" height="16" rx="3" fill={tint(p, 0.35)} />
        <polygon points="74,38 110,24 146,38" fill={tint(p, 0.5)} />
      </svg>
    );
  }
  if (theme.id === "sea-breeze") {
    return (
      <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
        <rect width="220" height="56" fill={tint(c, 0.15)} />
        <path d="M0 38 Q55 30 110 38 T220 38 V56 H0Z" fill={tint(p, 0.35)} />
        <path d="M0 44 Q55 36 110 44 T220 44 V56 H0Z" fill={tint(p, 0.5)} />
        <ellipse cx="36" cy="28" rx="10" ry="6" fill={tint(r, 0.55)} />
        <circle cx="170" cy="18" r="8" fill={tint(r, 0.65)} />
      </svg>
    );
  }
  if (theme.id === "honey-milk") {
    return (
      <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
        <rect width="220" height="56" fill={tint(c, 0.2)} />
        <rect x="88" y="18" width="28" height="32" rx="4" fill={tint(p, 0.45)} />
        <rect x="92" y="12" width="20" height="8" rx="2" fill={tint(p, 0.6)} />
        <ellipse cx="102" cy="30" rx="8" ry="6" fill={tint(r, 0.65)} />
        <ellipse cx="48" cy="40" rx="14" ry="8" fill={tint(r, 0.4)} />
        <rect x="150" y="34" width="24" height="10" rx="5" fill={tint(p, 0.35)} />
      </svg>
    );
  }
  return (
    <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
      <rect width="220" height="56" fill={tint(p, 0.12)} />
      <circle cx="36" cy="14" r="2" fill={tint(r, 0.8)} />
      <circle cx="52" cy="10" r="1.5" fill={tint(c, 0.7)} />
      <circle cx="170" cy="12" r="2" fill={tint(r, 0.7)} />
      <ellipse cx="110" cy="36" rx="28" ry="14" fill={tint(c, 0.45)} />
      <ellipse cx="110" cy="32" rx="18" ry="8" fill={tint(p, 0.35)} />
      <rect x="96" y="28" width="6" height="10" rx="3" fill={tint(p, 0.55)} />
      <rect x="118" y="28" width="6" height="10" rx="3" fill={tint(p, 0.55)} />
      <circle cx="110" cy="22" r="7" fill={tint(c, 0.6)} />
    </svg>
  );
}

function FamilyWelcomeArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="72" viewBox="0 0 220 72" aria-hidden>
      <rect x="72" y="30" width="76" height="36" rx="5" fill={tint(theme.parent.primary, 0.3)} />
      <polygon points="68,32 110,10 152,32" fill={tint(theme.parent.primary, 0.45)} />
      <rect x="100" y="48" width="20" height="18" rx="2" fill={tint(theme.parent.primary, 0.5)} />
      <circle cx="48" cy="48" r="13" fill={tint(theme.parent.primary, 0.4)} />
      <rect x="40" y="58" width="16" height="14" rx="7" fill={tint(theme.parent.primary, 0.3)} />
      <circle cx="110" cy="46" r="11" fill={tint(theme.child.primary, 0.55)} />
      <rect x="102" y="54" width="16" height="12" rx="6" fill={tint(theme.child.primary, 0.4)} />
      <circle cx="162" cy="50" r="10" fill={tint(theme.child.primary, 0.45)} />
      <rect x="155" y="58" width="14" height="12" rx="6" fill={tint(theme.child.primary, 0.35)} />
      <ellipse cx="178" cy="58" rx="14" ry="10" fill={tint(theme.reward, 0.35)} />
      <rect x="170" y="52" width="4" height="6" rx="2" fill={tint(theme.reward, 0.7)} />
      <circle cx="178" cy="50" r="3" fill={tint(theme.reward, 0.8)} />
    </svg>
  );
}

function ParentRegisterArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="52" viewBox="0 0 220 52" aria-hidden>
      <rect x="20" y="8" width="80" height="40" rx="6" fill={tint(theme.surface, 1)} stroke={theme.border} strokeWidth="1.5" />
      <circle cx="44" cy="22" r="10" fill={tint(theme.parent.primary, 0.4)} />
      <rect x="58" y="18" width="34" height="4" rx="2" fill={tint(theme.parent.primary, 0.25)} />
      <rect x="58" y="26" width="28" height="4" rx="2" fill={tint(theme.border, 1)} />
      <rect x="58" y="34" width="30" height="4" rx="2" fill={tint(theme.border, 1)} />
      <rect x="130" y="14" width="70" height="32" rx="8" fill={tint(theme.parent.primary, 0.15)} />
      <circle cx="165" cy="26" r="12" fill={tint(theme.parent.primary, 0.45)} />
      <rect x="157" y="36" width="16" height="14" rx="7" fill={tint(theme.parent.primary, 0.35)} />
    </svg>
  );
}

function QrConnectArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="48" viewBox="0 0 220 48" aria-hidden>
      <rect x="24" y="6" width="36" height="36" rx="6" fill={tint(theme.parent.primary, 0.2)} stroke={theme.parent.primary} strokeWidth="1.5" />
      <rect x="32" y="14" width="20" height="20" rx="2" fill={tint(theme.parent.primary, 0.5)} />
      <path d="M68 24 H152" stroke={theme.child.primary} strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="152,20 160,24 152,28" fill={theme.child.primary} />
      <rect x="160" y="6" width="36" height="36" rx="8" fill={tint(theme.child.primary, 0.2)} stroke={theme.child.primary} strokeWidth="1.5" />
      <circle cx="178" cy="24" r="8" fill={tint(theme.child.primary, 0.45)} />
      <rect x="174" y="30" width="8" height="8" rx="4" fill={tint(theme.child.primary, 0.35)} />
    </svg>
  );
}

function CameraScanArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 160 120" aria-hidden style={{ minHeight: 120 }}>
      <rect width="160" height="120" fill={tint(theme.child.primary, 0.06)} />
      <rect x="30" y="20" width="100" height="80" rx="8" fill={tint(theme.text, 0.06)} stroke={theme.child.primary} strokeWidth="2" strokeDasharray="6 4" />
      <rect x="58" y="42" width="44" height="44" rx="4" fill={theme.surface} stroke={theme.parent.primary} strokeWidth="1.5" />
      <rect x="64" y="48" width="10" height="10" fill={theme.parent.primary} />
      <rect x="78" y="48" width="10" height="10" fill={theme.parent.primary} />
      <rect x="64" y="62" width="10" height="10" fill={theme.parent.primary} />
      <rect x="86" y="62" width="10" height="10" fill={theme.parent.primary} />
      <rect x="72" y="74" width="16" height="6" fill={theme.parent.primary} />
      <circle cx="80" cy="108" r="6" fill={tint(theme.child.primary, 0.5)} />
    </svg>
  );
}

function TaskBoardArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="48" viewBox="0 0 220 48" aria-hidden>
      <rect x="16" y="6" width="56" height="36" rx="4" fill={tint(theme.surface, 1)} stroke={theme.border} strokeWidth="1.5" />
      <rect x="24" y="14" width="28" height="3" rx="1.5" fill={tint(theme.parent.primary, 0.4)} />
      <rect x="24" y="22" width="36" height="3" rx="1.5" fill={tint(theme.border, 1)} />
      <rect x="24" y="30" width="20" height="3" rx="1.5" fill={tint(theme.border, 1)} />
      <rect x="100" y="10" width="8" height="28" rx="2" fill={tint(theme.parent.primary, 0.5)} transform="rotate(-20 104 24)" />
      <rect x="88" y="6" width="28" height="6" rx="2" fill={tint(theme.parent.primary, 0.35)} transform="rotate(-20 102 9)" />
      <circle cx="170" cy="24" r="14" fill={tint(theme.reward, 0.35)} stroke={theme.reward} strokeWidth="1.5" />
      <text x="170" y="28" textAnchor="middle" fill={theme.reward} fontSize="10" fontWeight="700">
        ₽
      </text>
    </svg>
  );
}

function BroomIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <rect x="8" y="2" width="2" height="10" rx="1" fill={color} />
      <rect x="4" y="11" width="10" height="4" rx="1" fill={tint(color, 0.6)} />
    </svg>
  );
}

function TrashIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <rect x="5" y="5" width="8" height="10" rx="1" fill={tint(color, 0.5)} />
      <rect x="4" y="3" width="10" height="2" rx="1" fill={color} />
      <rect x="7" y="1" width="4" height="2" rx="1" fill={color} />
    </svg>
  );
}

function PhotoProofArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="56" viewBox="0 0 220 56" aria-hidden>
      <rect x="16" y="6" width="72" height="44" rx="6" fill={tint(theme.child.primary, 0.15)} stroke={theme.border} strokeWidth="1.5" />
      <rect x="24" y="28" width="40" height="14" rx="2" fill={tint(theme.parent.primary, 0.25)} />
      <rect x="28" y="18" width="12" height="14" rx="2" fill={tint(theme.child.primary, 0.4)} />
      <rect x="44" y="22" width="16" height="10" rx="2" fill={tint(theme.child.primary, 0.35)} />
      <circle cx="168" cy="28" r="16" fill={tint(theme.success, 0.2)} stroke={theme.success} strokeWidth="1.5" />
      <path d="M160 28 L166 34 L178 22" stroke={theme.success} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PiggyBankArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="100%" height="64" viewBox="0 0 220 64" aria-hidden>
      <ellipse cx="110" cy="38" rx="40" ry="22" fill={tint(theme.child.primary, 0.45)} />
      <circle cx="132" cy="32" r="8" fill={tint(theme.child.primary, 0.55)} />
      <circle cx="136" cy="30" r="2" fill={theme.text} />
      <rect x="88" y="28" width="6" height="4" rx="2" fill={tint(theme.reward, 0.7)} />
      <ellipse cx="78" cy="36" rx="6" ry="4" fill={tint(theme.child.primary, 0.35)} />
      <circle cx="52" cy="18" r="7" fill={tint(theme.reward, 0.65)} stroke={theme.reward} strokeWidth="1" />
      <text x="52" y="21" textAnchor="middle" fill={theme.surface} fontSize="7" fontWeight="700">
        ₽
      </text>
      <circle cx="72" cy="12" r="5" fill={tint(theme.reward, 0.55)} />
      <circle cx="158" cy="14" r="6" fill={tint(theme.reward, 0.6)} />
      <path d="M58 24 Q84 14 100 26" stroke={tint(theme.reward, 0.5)} strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
    </svg>
  );
}

function CoinStackArt({ theme }: { theme: FamilyTheme }) {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" aria-hidden>
      <ellipse cx="24" cy="24" rx="14" ry="5" fill={tint(theme.reward, 0.4)} />
      <ellipse cx="24" cy="20" rx="14" ry="5" fill={tint(theme.reward, 0.55)} />
      <ellipse cx="24" cy="16" rx="14" ry="5" fill={tint(theme.reward, 0.7)} />
      <text x="24" y="19" textAnchor="middle" fill={theme.surface} fontSize="8" fontWeight="700">
        ₽
      </text>
    </svg>
  );
}

function QrMock({ size = 120, color }: { size?: number; color: string }) {
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
        padding: 10,
        borderRadius: 12,
        background: "#ffffff",
        border: `2px solid ${tint(color, 0.35)}`,
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
                fill={color}
                rx={1}
              />
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}

function StepDots({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <Row gap={5} justify="center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === current ? 18 : 7,
            height: 7,
            borderRadius: 4,
            background: i + 1 <= current ? color : tint(color, 0.2),
          }}
        />
      ))}
    </Row>
  );
}

function ThemedPhone({
  theme,
  role,
  title,
  step,
  children,
  compact,
}: {
  theme: FamilyTheme;
  role: "parent" | "child";
  title: string;
  step?: number;
  children: ReactElement;
  compact?: boolean;
}) {
  const accent = role === "parent" ? theme.parent : theme.child;
  const w = compact ? 200 : 248;
  return (
    <Stack gap={5}>
      <Text size="small" weight="medium">
        {title}
      </Text>
      {step ? <StepDots current={step} total={4} color={accent.primary} /> : null}
      <div
        style={{
          width: w,
          minHeight: compact ? 400 : 460,
          borderRadius: role === "child" ? 20 : 16,
          border: `2px solid ${tint(accent.primary, 0.3)}`,
          background: theme.bg,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 30,
            padding: "0 12px",
            background: accent.header,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 9, color: accent.onPrimary, opacity: 0.8 }}>9:41</Text>
          <Text style={{ fontSize: 10, fontWeight: 600, color: accent.onPrimary }}>
            {role === "parent" ? "Семейный кошелёк" : "Привет!"}
          </Text>
          <Text style={{ fontSize: 9, color: accent.onPrimary, opacity: 0.8 }}>...</Text>
        </div>
        <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {children}
        </div>
      </div>
    </Stack>
  );
}

function Btn({
  label,
  bg,
  fg,
  outline,
  small,
}: {
  label: string;
  bg?: string;
  fg?: string;
  outline?: boolean;
  small?: boolean;
}) {
  return (
    <div
      style={{
        height: small ? 34 : 42,
        borderRadius: small ? 10 : 12,
        background: outline ? "transparent" : bg,
        border: outline ? `1.5px dashed ${bg}` : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: small ? 10 : 11, fontWeight: 600, color: outline ? bg : fg }}>
        {label}
      </Text>
    </div>
  );
}

function Field({ label, value, theme }: { label: string; value?: string; theme: FamilyTheme }) {
  return (
    <Stack gap={3}>
      <Text style={{ fontSize: 9, color: theme.textMuted }}>{label}</Text>
      <div
        style={{
          height: 36,
          borderRadius: 10,
          border: `1.5px solid ${value ? theme.parent.primary : theme.border}`,
          background: value ? tint(theme.parent.primary, 0.06) : theme.surface,
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
        }}
      >
        <Text style={{ fontSize: 10, color: value ? theme.text : theme.textMuted }}>
          {value ?? "..."}
        </Text>
      </div>
    </Stack>
  );
}

function RewardBadge({ amount, theme }: { amount: string; theme: FamilyTheme }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 999,
        background: tint(theme.reward, 0.18),
        color: theme.reward,
        fontSize: 9,
        fontWeight: 700,
      }}
    >
      {amount}
    </span>
  );
}

function WelcomeScreen({ theme, variant }: { theme: FamilyTheme; variant: VariantId }) {
  const bigQr = variant === "qr-center";
  return (
    <Stack gap={8} style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
      <SceneBanner theme={theme}>
        <ThemeHero theme={theme} />
      </SceneBanner>
      <FamilyWelcomeArt theme={theme} />
      <Stack gap={3} style={{ textAlign: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Семейный кошелёк</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Задачи, награды и мечты</Text>
      </Stack>
      {bigQr ? (
        <Text style={{ fontSize: 9, color: theme.textMuted, textAlign: "center" }}>
          Ребёнок подключается через QR за 30 секунд
        </Text>
      ) : null}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        <Btn label="Я родитель" bg={theme.parent.primary} fg={theme.parent.onPrimary} />
        <Btn label="Я ребёнок — сканировать QR" bg={theme.child.primary} fg={theme.child.onPrimary} />
      </div>
      <Text style={{ fontSize: 9, color: theme.textMuted }}>Уже есть аккаунт? Войти</Text>
    </Stack>
  );
}

function RegisterScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8}>
      <SceneBanner theme={theme}>
        <ParentRegisterArt theme={theme} />
      </SceneBanner>
      <Stack gap={3}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Создайте аккаунт</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Вы управляете задачами и наградами</Text>
      </Stack>
      <Field label="Ваше имя" value="Анна" theme={theme} />
      <Field label="Email" value="anna@mail.ru" theme={theme} />
      <Field label="Пароль" value="********" theme={theme} />
      <Spacer />
      <Btn label="Далее" bg={theme.parent.primary} fg={theme.parent.onPrimary} />
    </Stack>
  );
}

function QrCenterAddChild({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8} style={{ alignItems: "center" }}>
      <QrConnectArt theme={theme} />
      <Stack gap={3} style={{ width: "100%", textAlign: "center" }}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Добавьте ребёнка</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Покажите QR на экране ребёнка</Text>
      </Stack>
      <QrMock size={110} color={theme.parent.primary} />
      <Text style={{ fontSize: 10, fontWeight: 600, color: theme.text, letterSpacing: 1.5 }}>
        IVAN-7K2M
      </Text>
      <div
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 10,
          background: tint(theme.child.primary, 0.2),
          border: `1px solid ${tint(theme.child.primary, 0.4)}`,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: 600, color: theme.text }}>На телефоне ребёнка:</Text>
        <Text style={{ fontSize: 9, color: theme.textMuted, lineHeight: 1.5 }}>
          1. «Я ребёнок» → 2. Сканировать QR → 3. Ввести имя
        </Text>
      </div>
      <Row gap={6} style={{ width: "100%" }}>
        <div style={{ flex: 1 }}>
          <Btn label="Скопировать" bg={theme.border} fg={theme.textMuted} outline small />
        </div>
        <div style={{ flex: 1 }}>
          <Btn label="Поделиться" bg={theme.parent.primary} fg={theme.parent.onPrimary} small />
        </div>
      </Row>
      <Text style={{ fontSize: 9, color: theme.textMuted }}>или добавить вручную</Text>
    </Stack>
  );
}

function WizardAddChild({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8}>
      <QrConnectArt theme={theme} />
      <Stack gap={3}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Шаг 3 · Ребёнок</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Сканируйте QR или введите код</Text>
      </Stack>
      <Row gap={0}>
        {["Вручную", "QR-код"].map((tab, i) => (
          <div
            key={tab}
            style={{
              flex: 1,
              height: 30,
              borderRadius: i === 0 ? "8px 0 0 8px" : "0 8px 8px 0",
              background: i === 1 ? theme.parent.primary : theme.surface,
              border: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: i === 1 ? theme.parent.onPrimary : theme.textMuted,
              }}
            >
              {tab}
            </Text>
          </div>
        ))}
      </Row>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QrMock size={100} color={theme.parent.primary} />
      </div>
      <Text style={{ fontSize: 9, color: theme.textMuted, textAlign: "center" }}>
        Семья Ивановых · IVAN-7K2M
      </Text>
      <Spacer />
      <Btn label="Продолжить" bg={theme.parent.primary} fg={theme.parent.onPrimary} />
    </Stack>
  );
}

function ChildScanScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8}>
      <Stack gap={3}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Сканируй QR</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Попроси родителя показать код</Text>
      </Stack>
      <div
        style={{
          flex: 1,
          minHeight: 120,
          borderRadius: 14,
          border: `2px dashed ${theme.child.primary}`,
          overflow: "hidden",
        }}
      >
        <CameraScanArt theme={theme} />
      </div>
      <Btn label="Ввести код вручную" bg={theme.child.primary} fg={theme.child.onPrimary} outline />
    </Stack>
  );
}

function CreateTaskScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8}>
      <SceneBanner theme={theme}>
        <TaskBoardArt theme={theme} />
      </SceneBanner>
      <Stack gap={3}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Новая задача</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Название и сумма награды</Text>
      </Stack>
      <Field label="Название" value="Убрать комнату" theme={theme} />
      <Field label="Награда, ₽" value="80" theme={theme} />
      <div
        style={{
          padding: 10,
          borderRadius: 10,
          background: tint(theme.reward, 0.1),
          border: `1px solid ${tint(theme.reward, 0.3)}`,
        }}
      >
        <Row justify="space-between" align="center">
          <Text style={{ fontSize: 10, color: theme.text }}>Маша увидит</Text>
          <RewardBadge amount="+80 ₽" theme={theme} />
        </Row>
      </div>
      <Spacer />
      <Btn label="Создать задачу" bg={theme.parent.primary} fg={theme.parent.onPrimary} />
    </Stack>
  );
}

function ChildTasksScreen({ theme }: { theme: FamilyTheme }) {
  const tasks = [
    { title: "Убрать комнату", reward: "+80 ₽", active: true, icon: <BroomIcon color={theme.parent.primary} /> },
    { title: "Вынести мусор", reward: "+50 ₽", active: false, icon: <TrashIcon color={theme.textMuted} /> },
  ];
  return (
    <Stack gap={8}>
      <div
        style={{
          padding: 10,
          borderRadius: 12,
          background: tint(theme.child.primary, 0.22),
          border: `1px solid ${tint(theme.child.primary, 0.35)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack gap={2}>
          <Text style={{ fontSize: 9, color: theme.textMuted }}>Мой баланс</Text>
          <Text style={{ fontSize: 22, fontWeight: 700, color: theme.text }}>240 ₽</Text>
        </Stack>
        <CoinStackArt theme={theme} />
      </div>
      <Text style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>Мои задачи</Text>
      {tasks.map((t) => (
        <div
          key={t.title}
          style={{
            padding: 9,
            borderRadius: 10,
            background: theme.surface,
            border: `1.5px solid ${t.active ? theme.child.primary : theme.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {t.icon}
          <div style={{ flex: 1 }}>
            <Row justify="space-between" align="center">
              <Text style={{ fontSize: 10, color: theme.text }}>{t.title}</Text>
              <RewardBadge amount={t.reward} theme={theme} />
            </Row>
          </div>
        </div>
      ))}
      <Btn label="Я сделал!" bg={theme.child.primary} fg={theme.child.onPrimary} />
    </Stack>
  );
}

function ParentApprovalScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8}>
      <SceneBanner theme={theme}>
        <PhotoProofArt theme={theme} />
      </SceneBanner>
      <Stack gap={3}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Ждёт проверки</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>Маша · Убрать комнату</Text>
      </Stack>
      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: theme.surface,
          border: `1.5px solid ${theme.border}`,
        }}
      >
        <Row justify="space-between" align="center">
          <Text style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>Убрать комнату</Text>
          <RewardBadge amount="+80 ₽" theme={theme} />
        </Row>
        <Text style={{ fontSize: 9, color: theme.textMuted, marginTop: 6 }}>
          Отправлено 5 мин назад
        </Text>
      </div>
      <Row gap={8}>
        <div style={{ flex: 1 }}>
          <Btn label="Отклонить" bg={theme.reject} fg="#ffffff" small />
        </div>
        <div style={{ flex: 1 }}>
          <Btn label="Одобрить" bg={theme.success} fg="#ffffff" small />
        </div>
      </Row>
      <Divider />
      <Text style={{ fontSize: 9, color: theme.textMuted }}>После одобрения +80 ₽ на баланс Маши</Text>
    </Stack>
  );
}

function BalanceUpdatedScreen({ theme }: { theme: FamilyTheme }) {
  return (
    <Stack gap={8} style={{ alignItems: "center", textAlign: "center" }}>
      <PiggyBankArt theme={theme} />
      <Stack gap={3}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>Задача одобрена!</Text>
        <Text style={{ fontSize: 10, color: theme.textMuted }}>+80 ₽ зачислено на баланс</Text>
      </Stack>
      <div
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          background: tint(theme.child.primary, 0.2),
          border: `1.5px solid ${tint(theme.child.primary, 0.35)}`,
        }}
      >
        <Text style={{ fontSize: 9, color: theme.textMuted }}>Новый баланс</Text>
        <Text style={{ fontSize: 26, fontWeight: 700, color: theme.text }}>320 ₽</Text>
      </div>
      <Btn label="К задачам" bg={theme.child.primary} fg={theme.child.onPrimary} />
    </Stack>
  );
}

function DualPair({ theme }: { theme: FamilyTheme }) {
  return (
    <Row gap={12} align="start" wrap>
      <ThemedPhone theme={theme} role="parent" title="Родитель · QR" compact>
        <QrCenterAddChild theme={theme} />
      </ThemedPhone>
      <div style={{ display: "flex", alignItems: "center", paddingTop: 80 }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill={theme.textMuted}>
          <path d="M4 12h16M14 6l6 6-6 6" stroke={theme.textMuted} strokeWidth={2} fill="none" />
        </svg>
      </div>
      <ThemedPhone theme={theme} role="child" title="Ребёнок · Скан" compact>
        <ChildScanScreen theme={theme} />
      </ThemedPhone>
    </Row>
  );
}

function VariantPreview({ theme, variant }: { theme: FamilyTheme; variant: VariantId }) {
  const addChildBody =
    variant === "qr-center" ? (
      <QrCenterAddChild theme={theme} />
    ) : (
      <WizardAddChild theme={theme} />
    );

  if (variant === "dual") {
    return (
      <Stack gap={16}>
        <DualPair theme={theme} />
        <Text size="small" tone="secondary">
          Родитель и ребёнок работают параллельно — QR и камера как зеркальные экраны.
        </Text>
      </Stack>
    );
  }

  const step = variant === "wizard" ? 3 : undefined;

  return (
    <Grid columns={3} gap={14} align="start">
      <ThemedPhone theme={theme} role="parent" title="1 · Привет" step={variant === "wizard" ? 1 : undefined}>
        <WelcomeScreen theme={theme} variant={variant} />
      </ThemedPhone>
      <ThemedPhone theme={theme} role="parent" title="2 · Регистрация" step={variant === "wizard" ? 2 : undefined}>
        <RegisterScreen theme={theme} />
      </ThemedPhone>
      <ThemedPhone theme={theme} role="parent" title="3 · QR ребёнка" step={step}>
        {addChildBody}
      </ThemedPhone>
    </Grid>
  );
}

function MvpLoopScreens({ theme }: { theme: FamilyTheme }) {
  return (
    <Grid columns={4} gap={12} align="start">
      <ThemedPhone theme={theme} role="parent" title="4 · Создать задачу" compact>
        <CreateTaskScreen theme={theme} />
      </ThemedPhone>
      <ThemedPhone theme={theme} role="child" title="5 · Задачи ребёнка" compact>
        <ChildTasksScreen theme={theme} />
      </ThemedPhone>
      <ThemedPhone theme={theme} role="parent" title="6 · Одобрение" compact>
        <ParentApprovalScreen theme={theme} />
      </ThemedPhone>
      <ThemedPhone theme={theme} role="child" title="7 · Баланс" compact>
        <BalanceUpdatedScreen theme={theme} />
      </ThemedPhone>
    </Grid>
  );
}

function ThemeSwatches({ theme }: { theme: FamilyTheme }) {
  const swatches = [
    { c: theme.parent.primary, l: "Родитель" },
    { c: theme.child.primary, l: "Ребёнок" },
    { c: theme.reward, l: "Награда" },
    { c: theme.success, l: "Успех" },
    { c: theme.bg, l: "Фон" },
  ];
  return (
    <Row gap={8} wrap>
      {swatches.map((s) => (
        <span key={s.l}>
          <Stack gap={2} style={{ alignItems: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: s.c,
                border: `1px solid ${theme.border}`,
              }}
            />
            <Text style={{ fontSize: 8, color: theme.textMuted }}>{s.l}</Text>
          </Stack>
        </span>
      ))}
    </Row>
  );
}

export default function MvpFullDesignVariants() {
  const hostTheme = useHostTheme();
  const [activeTheme, setActiveTheme] = useCanvasState("mvp-theme", "sky-harbor");
  const [activeVariant, setActiveVariant] = useCanvasState<VariantId>("mvp-variant", "qr-center");
  const [activeScreen, setActiveScreen] = useCanvasState("mvp-screen", "onboarding");

  const theme = THEMES.find((t) => t.id === activeTheme) ?? THEMES[0];
  const variant = VARIANTS.find((v) => v.id === activeVariant) ?? VARIANTS[0];

  const mvpNodes = [{ id: "s1" }, { id: "s2" }, { id: "s3" }, { id: "s4" }, { id: "s5" }];
  const mvpLabels: Record<string, string> = {
    s1: "Регистрация + QR",
    s2: "Создать задачу",
    s3: "Я сделал!",
    s4: "Одобрить",
    s5: "Баланс",
  };

  const mvpLayout = computeDAGLayout({
    nodes: mvpNodes,
    edges: [
      { from: "s1", to: "s2" },
      { from: "s2", to: "s3" },
      { from: "s3", to: "s4" },
      { from: "s4", to: "s5" },
    ],
    direction: "horizontal",
    nodeWidth: 100,
    nodeHeight: 32,
    nodeGap: 8,
    rankGap: 40,
    padding: 6,
  });

  return (
    <Stack gap={28}>
      <Stack gap={6}>
        <H1>MVP · Дизайн с нуля</H1>
        <Text tone="secondary">
          Родитель регистрируется и добавляет ребёнка через QR. 3 варианта онбординга × 6 семейных
          палитр с иллюстрациями. Ниже — полный цикл MVP (задача → одобрение → баланс).
        </Text>
      </Stack>

      <Card>
        <CardHeader>Flow MVP · 5 шагов</CardHeader>
        <CardBody>
          <svg width={mvpLayout.width} height={mvpLayout.height + 16} style={{ display: "block" }}>
            {mvpLayout.edges.map((e) => (
              <line
                key={`${e.from}-${e.to}`}
                x1={e.sourceX}
                y1={e.sourceY}
                x2={e.targetX}
                y2={e.targetY}
                stroke={hostTheme.stroke.primary}
                strokeWidth={1.5}
                markerEnd="url(#mvp-arrow)"
              />
            ))}
            <defs>
              <marker id="mvp-arrow" markerWidth="8" markerHeight={6} refX={7} refY={3} orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={hostTheme.stroke.primary} />
              </marker>
            </defs>
            {mvpLayout.nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect
                  width={100}
                  height={32}
                  rx={8}
                  fill={hostTheme.fill.secondary}
                  stroke={theme.parent.primary}
                  strokeWidth={1.5}
                />
                <text
                  x={50}
                  y={20}
                  textAnchor="middle"
                  fill={hostTheme.text.primary}
                  fontSize={9}
                  fontWeight={600}
                >
                  {mvpLabels[n.id]}
                </text>
              </g>
            ))}
          </svg>
          <Spacer size={8} />
          <Callout tone="info">
            Шаг 1.1: ребёнок сканирует QR родителя → вводит имя → balance = 0. Дальше — задачи и
            награды.
          </Callout>
        </CardBody>
      </Card>

      <Stack gap={10}>
        <H2>Палитра</H2>
        <Row gap={6} wrap>
          {THEMES.map((t) => (
            <span key={t.id}>
              <Button variant={activeTheme === t.id ? "primary" : "ghost"} onClick={() => setActiveTheme(t.id)}>
                {t.name}
              </Button>
            </span>
          ))}
        </Row>
        <Row gap={12} align="center" wrap>
          <ThemeSwatches theme={theme} />
          <Text size="small" tone="secondary">
            {theme.name} · {theme.mood}
          </Text>
        </Row>
      </Stack>

      <Stack gap={10}>
        <H2>Вариант онбординга</H2>
        <Row gap={6} wrap>
          {VARIANTS.map((v) => (
            <span key={v.id}>
              <Button
                variant={activeVariant === v.id ? "primary" : "ghost"}
                onClick={() => setActiveVariant(v.id)}
              >
                {v.name}
              </Button>
            </span>
          ))}
        </Row>
        <Text size="small" tone="secondary">
          {variant.desc}
        </Text>
      </Stack>

      <Card>
        <CardHeader>
          Онбординг · {variant.name} · {theme.name}
        </CardHeader>
        <CardBody>
          <VariantPreview theme={theme} variant={activeVariant} />
        </CardBody>
      </Card>

      <Stack gap={10}>
        <Row gap={6} wrap>
          <Button
            variant={activeScreen === "onboarding" ? "primary" : "ghost"}
            onClick={() => setActiveScreen("onboarding")}
          >
            Онбординг
          </Button>
          <Button
            variant={activeScreen === "loop" ? "primary" : "ghost"}
            onClick={() => setActiveScreen("loop")}
          >
            Цикл задач
          </Button>
          <Button
            variant={activeScreen === "compare" ? "primary" : "ghost"}
            onClick={() => setActiveScreen("compare")}
          >
            Сравнение вариантов
          </Button>
        </Row>

        {activeScreen === "loop" ? (
          <Card>
            <CardHeader>Шаги 2–5 · {theme.name}</CardHeader>
            <CardBody>
              <MvpLoopScreens theme={theme} />
            </CardBody>
          </Card>
        ) : null}

        {activeScreen === "compare" ? (
          <Stack gap={16}>
            {VARIANTS.map((v) => (
              <span key={v.id}>
                <Card>
                  <CardHeader>{v.name}</CardHeader>
                  <CardBody>
                    <Stack gap={8}>
                      <Text size="small" tone="secondary">
                        {v.desc}
                      </Text>
                      <VariantPreview theme={theme} variant={v.id} />
                    </Stack>
                  </CardBody>
                </Card>
              </span>
            ))}
          </Stack>
        ) : null}
      </Stack>

      <Card>
        <CardHeader>Иллюстрации по темам · фон экранов</CardHeader>
        <CardBody>
          <Grid columns={3} gap={12}>
            {THEMES.map((t) => (
              <span key={t.id}>
                <Stack gap={6}>
                  <H3>{t.name}</H3>
                  <SceneBanner theme={t}>
                    <ThemeHero theme={t} />
                  </SceneBanner>
                  <FamilyWelcomeArt theme={t} />
                </Stack>
              </span>
            ))}
          </Grid>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Все палитры · экран QR (родитель)</CardHeader>
        <CardBody>
          <Grid columns={3} gap={14}>
            {THEMES.map((t) => (
              <span key={t.id}>
                <Stack gap={6}>
                  <H3>{t.name}</H3>
                  <ThemedPhone theme={t} role="parent" title="QR ребёнка" compact>
                    <QrCenterAddChild theme={t} />
                  </ThemedPhone>
                </Stack>
              </span>
            ))}
          </Grid>
        </CardBody>
      </Card>

      <Grid columns={2} gap={16} align="start">
        <Card>
          <CardHeader>Рекомендация</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: `2px solid ${THEMES[0].parent.primary}`,
                  background: tint(THEMES[0].bg, 1),
                }}
              >
                <Text size="small" weight="medium">
                  Вариант «QR в центре» + Небесная гавань
                </Text>
                <Text size="small" tone="secondary">
                  Минимум шагов, QR — главный путь. Голубой спокойный для родителя, светлый для
                  ребёнка.
                </Text>
              </div>
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: `2px solid ${THEMES[4].parent.primary}`,
                  background: tint(THEMES[4].bg, 1),
                }}
              >
                <Text size="small" weight="medium">
                  Для детей 5–8 · Мёд и молоко
                </Text>
                <Text size="small" tone="secondary">
                  Тёплый крем, янтарные награды. Мастер шагов даёт ощущение безопасности.
                </Text>
              </div>
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: `2px solid ${THEMES[1].parent.primary}`,
                  background: tint(THEMES[1].bg, 1),
                }}
              >
                <Text size="small" weight="medium">
                  Привычки и ЗОЖ · Лесная поляна
                </Text>
                <Text size="small" tone="secondary">
                  Зелёный про рост. Двойной экран — наглядно показывает связь родитель ↔ ребёнок.
                </Text>
              </div>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Данные MVP</CardHeader>
          <CardBody>
            <Stack gap={6}>
              {[
                ["Family", "name, invite_code (QR)"],
                ["User parent", "name, email, role=parent"],
                ["User child", "name, balance=0, via QR scan"],
                ["Task", "title, amount, status"],
                ["Completion", "child submits → parent approves → balance +"],
              ].map(([entity, fields]) => (
                <div
                  key={entity}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    background: hostTheme.fill.tertiary,
                    border: `1px solid ${hostTheme.stroke.tertiary}`,
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
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Stack>
  );
}
