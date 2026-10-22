import {
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
  Stack,
  Text,
  computeDAGLayout,
  useHostTheme,
} from "cursor/canvas";
import type { CSSProperties } from "react";

type C4Kind = "person" | "system" | "container" | "database";

function C4Node({
  label,
  sublabel,
  kind,
  x,
  y,
  width,
  height,
}: {
  label: string;
  sublabel?: string;
  kind: C4Kind;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const theme = useHostTheme();
  const styles: Record<C4Kind, { fill: string; stroke: string; dash?: boolean }> = {
    person: { fill: theme.fill.secondary, stroke: theme.category.blue },
    system: { fill: theme.fill.secondary, stroke: theme.category.green, dash: true },
    container: { fill: theme.fill.tertiary, stroke: theme.category.orange },
    database: { fill: theme.fill.tertiary, stroke: theme.category.purple },
  };
  const s = styles[kind];
  const isPerson = kind === "person";
  const isDb = kind === "database";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {isPerson ? (
        <>
          <circle
            cx={width / 2}
            cy={18}
            r={14}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.5}
          />
          <rect
            x={width / 2 - 20}
            y={34}
            width={40}
            height={28}
            rx={4}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.5}
          />
        </>
      ) : isDb ? (
        <>
          <ellipse
            cx={width / 2}
            cy={12}
            rx={width / 2 - 4}
            ry={10}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.5}
          />
          <rect
            x={4}
            y={12}
            width={width - 8}
            height={height - 20}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.5}
          />
          <ellipse
            cx={width / 2}
            cy={height - 8}
            rx={width / 2 - 4}
            ry={10}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.5}
          />
        </>
      ) : (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={6}
          fill={s.fill}
          stroke={s.stroke}
          strokeWidth={1.5}
          strokeDasharray={s.dash ? "6 4" : undefined}
        />
      )}
      <text
        x={width / 2}
        y={isPerson ? 78 : height / 2 - (sublabel ? 6 : 0)}
        textAnchor="middle"
        fill={theme.text.primary}
        fontSize={12}
        fontWeight={600}
      >
        {label}
      </text>
      {sublabel ? (
        <text
          x={width / 2}
          y={isPerson ? 92 : height / 2 + 12}
          textAnchor="middle"
          fill={theme.text.secondary}
          fontSize={10}
        >
          {sublabel}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  dashed?: boolean;
}) {
  const theme = useHostTheme();
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={theme.stroke.primary}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
        markerEnd="url(#arrowhead)"
      />
      {label ? (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fill={theme.text.tertiary}
          fontSize={9}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function FlowDiagram() {
  const theme = useHostTheme();
  const layout = computeDAGLayout({
    nodes: [
      { id: "s1" },
      { id: "s2" },
      { id: "s3" },
      { id: "s4" },
      { id: "s5" },
    ],
    edges: [
      { from: "s1", to: "s2" },
      { from: "s2", to: "s3" },
      { from: "s3", to: "s4" },
      { from: "s4", to: "s5" },
    ],
    nodeWidth: 280,
    nodeHeight: 56,
    rankGap: 40,
    padding: 16,
  });

  const labels: Record<string, { step: string; text: string; actor: string }> = {
    s1: {
      step: "1",
      text: "Родитель регистрируется, добавляет ребёнка",
      actor: "Родитель",
    },
    s2: {
      step: "2",
      text: "Родитель создаёт задачу: название + сумма",
      actor: "Родитель",
    },
    s3: {
      step: "3",
      text: "Ребёнок видит задачи, жмёт «Я сделал!»",
      actor: "Ребёнок",
    },
    s4: {
      step: "4",
      text: "Родитель одобряет или отклоняет",
      actor: "Родитель",
    },
    s5: {
      step: "5",
      text: "После одобрения — деньги на балансе ребёнка",
      actor: "Система",
    },
  };

  const actorColor: Record<string, string> = {
    Родитель: theme.category.green,
    Ребёнок: theme.category.orange,
    Система: theme.category.blue,
  };

  return (
    <svg width={layout.width} height={layout.height} style={{ display: "block" }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight={6}
          refX={7}
          refY={3}
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={theme.stroke.primary} />
        </marker>
      </defs>
      {layout.edges.map((edge) => (
        <Arrow
          key={`${edge.from}-${edge.to}`}
          x1={edge.sourceX}
          y1={edge.sourceY}
          x2={edge.targetX}
          y2={edge.targetY}
        />
      ))}
      {layout.nodes.map((node) => {
        const info = labels[node.id];
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              width={280}
              height={56}
              rx={8}
              fill={theme.fill.tertiary}
              stroke={actorColor[info.actor]}
              strokeWidth={2}
            />
            <circle cx={24} cy={28} r={14} fill={actorColor[info.actor]} />
            <text
              x={24}
              y={32}
              textAnchor="middle"
              fill={theme.text.onAccent}
              fontSize={12}
              fontWeight={700}
            >
              {info.step}
            </text>
            <text x={48} y={24} fill={theme.text.primary} fontSize={11} fontWeight={600}>
              {info.text}
            </text>
            <text x={48} y={40} fill={theme.text.secondary} fontSize={10}>
              {info.actor}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StateDiagram() {
  const theme = useHostTheme();
  const states = [
    { id: "new", label: "Новая", x: 20, color: theme.category.gray },
    { id: "pending", label: "На проверке", x: 160, color: theme.category.yellow },
    { id: "approved", label: "Одобрена", x: 320, color: theme.category.green },
    { id: "rejected", label: "Отклонена", x: 320, y: 90, color: theme.category.orange },
  ];

  return (
    <svg width={480} height={160} style={{ display: "block" }}>
      <defs>
        <marker
          id="state-arrow"
          markerWidth="8"
          markerHeight={6}
          refX={7}
          refY={3}
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={theme.stroke.primary} />
        </marker>
      </defs>
      {states.map((s) => (
        <g key={s.id} transform={`translate(${s.x}, ${s.y ?? 20})`}>
          <rect
            width={110}
            height={40}
            rx={20}
            fill={theme.fill.secondary}
            stroke={s.color}
            strokeWidth={2}
          />
          <text
            x={55}
            y={24}
            textAnchor="middle"
            fill={theme.text.primary}
            fontSize={11}
            fontWeight={600}
          >
            {s.label}
          </text>
        </g>
      ))}
      <line
        x1={130}
        y1={40}
        x2={155}
        y2={40}
        stroke={theme.stroke.primary}
        strokeWidth={1.5}
        markerEnd="url(#state-arrow)"
      />
      <text x={142} y={32} fill={theme.text.tertiary} fontSize={9} textAnchor="middle">
        сделал
      </text>
      <line
        x1={270}
        y1={40}
        x2={315}
        y2={40}
        stroke={theme.category.green}
        strokeWidth={1.5}
        markerEnd="url(#state-arrow)"
      />
      <text x={292} y={32} fill={theme.text.tertiary} fontSize={9} textAnchor="middle">
        да
      </text>
      <line
        x1={270}
        y1={48}
        x2={315}
        y2={100}
        stroke={theme.category.orange}
        strokeWidth={1.5}
        markerEnd="url(#state-arrow)"
      />
      <text x={285} y={78} fill={theme.text.tertiary} fontSize={9} textAnchor="middle">
        нет
      </text>
      <line
        x1={375}
        y1={110}
        x2={215}
        y2={62}
        stroke={theme.stroke.secondary}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        markerEnd="url(#state-arrow)"
      />
      <text x={300} y={95} fill={theme.text.tertiary} fontSize={9} textAnchor="middle">
        переделать
      </text>
    </svg>
  );
}

function ContextDiagram() {
  const theme = useHostTheme();
  return (
    <svg width={640} height={280} style={{ display: "block", maxWidth: "100%" }}>
      <defs>
        <marker
          id="ctx-arrow"
          markerWidth="8"
          markerHeight={6}
          refX={7}
          refY={3}
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={theme.stroke.primary} />
        </marker>
      </defs>
      <C4Node kind="person" label="Родитель" sublabel="создаёт задачи" x={40} y={30} width={100} height={70} />
      <C4Node kind="person" label="Ребёнок" sublabel="выполняет задачи" x={500} y={30} width={100} height={70} />
      <C4Node
        kind="system"
        label="Семейный кошелёк"
        sublabel="MVP: виртуальные награды"
        x={220}
        y={110}
        width={200}
        height={70}
      />
      <Arrow x1={90} y1={100} x2={250} y2={130} label="регистрация, задачи, проверка" />
      <Arrow x1={550} y1={100} x2={390} y2={130} label="выполнение, баланс" />
    </svg>
  );
}

function ContainerDiagram() {
  const theme = useHostTheme();
  return (
    <svg width={640} height={320} style={{ display: "block", maxWidth: "100%" }}>
      <defs>
        <marker
          id="ctr-arrow"
          markerWidth="8"
          markerHeight={6}
          refX={7}
          refY={3}
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={theme.stroke.primary} />
        </marker>
      </defs>
      <rect
        x={10}
        y={10}
        width={620}
        height={300}
        rx={8}
        fill="none"
        stroke={theme.stroke.secondary}
        strokeWidth={1}
        strokeDasharray="8 4"
      />
      <text x={20} y={28} fill={theme.text.tertiary} fontSize={10}>
        Система «Семейный кошелёк»
      </text>
      <C4Node
        kind="container"
        label="Мобильное приложение"
        sublabel="Expo · 2 роли UI"
        x={30}
        y={50}
        width={160}
        height={60}
      />
      <C4Node
        kind="container"
        label="API / Auth"
        sublabel="Supabase"
        x={240}
        y={50}
        width={140}
        height={60}
      />
      <C4Node
        kind="database"
        label="PostgreSQL"
        sublabel="семьи, задачи, баланс"
        x={430}
        y={44}
        width={170}
        height={72}
      />
      <C4Node
        kind="container"
        label="Родитель UI"
        sublabel="задачи, проверка"
        x={30}
        y={160}
        width={130}
        height={50}
      />
      <C4Node
        kind="container"
        label="Ребёнок UI"
        sublabel="список, «Я сделал!»"
        x={30}
        y={230}
        width={130}
        height={50}
      />
      <line
        x1={110}
        y1={110}
        x2={110}
        y2={155}
        stroke={theme.stroke.secondary}
        strokeWidth={1}
      />
      <line
        x1={95}
        y1={210}
        x2={95}
        y2={225}
        stroke={theme.stroke.secondary}
        strokeWidth={1}
      />
      <Arrow x1={190} y1={80} x2={235} y2={80} label="REST / Realtime" />
      <Arrow x1={380} y1={80} x2={425} y2={80} label="SQL" />
    </svg>
  );
}

function EntityTable() {
  const theme = useHostTheme();
  const rows = [
    ["Family", "семья", "name, invite_code"],
    ["User", "пользователь", "role: parent|child, name, balance"],
    ["Task", "задача", "title, reward, status, assigned_to"],
    ["Transaction", "операция", "amount, type: earn, task_id"],
  ];
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Сущность", "Описание", "Ключевые поля"].map((h) => (
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
        {rows.map(([entity, desc, fields]) => (
          <tr key={entity}>
            <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600 }}>{entity}</td>
            <td style={{ padding: "8px 12px", fontSize: 12 }}>{desc}</td>
            <td style={{ padding: "8px 12px", fontSize: 12, color: theme.text.secondary }}>
              {fields}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function MvpC4BusinessLogic() {
  const theme = useHostTheme();

  const rules = [
    "Деньги виртуальные — реальная выплата вне приложения",
    "Баланс меняется только после одобрения родителем",
    "Отклонённая задача возвращается ребёнку на доработку",
    "Один родитель + 1–3 ребёнка в MVP",
  ];

  return (
    <Stack gap={28}>
      <Stack gap={6}>
        <H1>C4 — Семейный кошелёк · MVP</H1>
        <Text tone="secondary">
          Бизнес-логика первой версии: 5 шагов, статусы задач, контекст и контейнеры системы.
        </Text>
        <Row gap={8} wrap>
          <Pill active>Context</Pill>
          <Pill active>Containers</Pill>
          <Pill active>Process</Pill>
          <Pill active>States</Pill>
        </Row>
      </Stack>

      <Grid columns={2} gap={20} align="start">
        <Card>
          <CardHeader>Level 1 · System Context</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text size="small" tone="secondary">
                Кто взаимодействует с системой и зачем
              </Text>
              <ContextDiagram />
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Level 2 · Containers</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text size="small" tone="secondary">
                Из чего состоит система внутри
              </Text>
              <ContainerDiagram />
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHeader>Бизнес-процесс MVP · 5 шагов</CardHeader>
        <CardBody>
          <FlowDiagram />
        </CardBody>
      </Card>

      <Grid columns={2} gap={20} align="start">
        <Card>
          <CardHeader>Жизненный цикл задачи</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text size="small" tone="secondary">
                Статусы и переходы между ними
              </Text>
              <StateDiagram />
              <Divider />
              <Grid columns={2} gap={8}>
                {[
                  { status: "new", desc: "Родитель создал, ребёнок ещё не нажал" },
                  { status: "pending", desc: "Ребёнок нажал «Я сделал!»" },
                  { status: "approved", desc: "Родитель одобрил → +reward на balance" },
                  { status: "rejected", desc: "Родитель отклонил → задача снова активна" },
                ].map((item) => (
                  <div
                    key={item.status}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      background: theme.fill.tertiary,
                      border: `1px solid ${theme.stroke.tertiary}`,
                    }}
                  >
                    <Text size="small" weight="medium">
                      {item.status}
                    </Text>
                    <Text size="small" tone="secondary">
                      {item.desc}
                    </Text>
                  </div>
                ))}
              </Grid>
            </Stack>
          </CardBody>
        </Card>

        <Stack gap={16}>
          <Card>
            <CardHeader>Модель данных (MVP)</CardHeader>
            <CardBody style={{ padding: 0 }}>
              <EntityTable />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Бизнес-правила</CardHeader>
            <CardBody>
              <Stack gap={8}>
                {rules.map((rule) => (
                  <Callout key={rule} tone="info">
                    {rule}
                  </Callout>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </Grid>

      <Card>
        <CardHeader>Шаг 1 · детализация (регистрация + ребёнок)</CardHeader>
        <CardBody>
          <Grid columns={3} gap={12}>
            {[
              {
                title: "1a. Регистрация родителя",
                steps: ["Email + пароль", "Имя родителя", "Создаётся Family", "role = parent"],
              },
              {
                title: "1b. Добавление ребёнка",
                steps: ["Имя + возраст", "role = child", "balance = 0", "Привязка к Family"],
              },
              {
                title: "1c. Результат",
                steps: ["Family с 1+ детьми", "Семейный код для входа ребёнка", "Готов к шагу 2"],
              },
            ].map((block) => (
              <div
                key={block.title}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: theme.fill.tertiary,
                  border: `1px solid ${theme.stroke.tertiary}`,
                }}
              >
                <H3>{block.title}</H3>
                <Stack gap={4}>
                  {block.steps.map((step, i) => (
                    <Text key={step} size="small" tone="secondary">
                      {i + 1}. {step}
                    </Text>
                  ))}
                </Stack>
              </div>
            ))}
          </Grid>
        </CardBody>
      </Card>
    </Stack>
  );
}
