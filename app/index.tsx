import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Screen, useWide } from "../src/components/Screen";
import {
  Avatar,
  Icon,
  SectionHeading,
  Tag,
  Text,
  ui,
} from "../src/components/ui";
import { MiniGraph, Orbit } from "../src/components/Orbit";
import { colors } from "../src/theme/tokens";
import { Mode } from "../src/domain/types";
import { useWorkspace } from "../src/store/useWorkspace";

export const modes: {
  id: Mode;
  label: string;
  icon: "circle" | "sparkles" | "zap";
  detail: string;
}[] = [
  {
    id: "self",
    label: "Я сам",
    icon: "circle",
    detail: "Ты в диалогах. Alter на паузе.",
  },
  {
    id: "copilot",
    label: "Вместе",
    icon: "sparkles",
    detail: "Alter готовит ответы. Ты принимаешь решения.",
  },
  {
    id: "delegate",
    label: "Вместо меня",
    icon: "zap",
    detail: "Alter на связи в разрешённых диалогах.",
  },
];
function ModeSelector() {
  const mode = useWorkspace((s) => s.mode);
  const setMode = useWorkspace((s) => s.setMode);
  return (
    <View style={{ marginBottom: 26 }}>
      <View style={styles.modes}>
        {modes.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="radio"
            accessibilityLabel={item.label}
            aria-checked={mode === item.id}
            accessibilityState={{ checked: mode === item.id }}
            onPress={() => setMode(item.id)}
            style={[
              styles.mode,
              mode === item.id && { backgroundColor: colors.lime },
            ]}
          >
            <Icon
              name={item.icon}
              size={16}
              color={mode === item.id ? colors.ink : colors.muted}
            />
            <Text
              weight="bold"
              style={{
                color: mode === item.id ? colors.ink : colors.muted,
                fontSize: 11,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={[ui.row, { gap: 6, marginTop: 10 }]}>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.lime,
          }}
        />
        <Text style={{ fontSize: 10, color: colors.muted }}>
          {modes.find((m) => m.id === mode)?.detail}
        </Text>
      </View>
    </View>
  );
}
function RightPanel() {
  const profile = useWorkspace((s) => s.profile);
  const mode = useWorkspace((s) => s.mode);
  return (
    <View style={{ gap: 20 }}>
      <View style={[ui.card, { padding: 22 }]}>
        <View style={ui.between}>
          <Text style={ui.caption}>ТВОЙ ЦИФРОВОЙ СЛЕД</Text>
          <Icon name="fingerprint" size={18} color={colors.muted} />
        </View>
        <View style={{ alignItems: "center", marginVertical: -3 }}>
          <MiniGraph size={216} />
        </View>
        <View style={ui.between}>
          <View>
            <Text weight="semibold">Identity graph</Text>
            <Text style={{ fontSize: 10, color: colors.muted }}>
              5 граней. Один ты.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Открыть Identity graph"
            onPress={() => router.push("/identity")}
            style={styles.roundButton}
          >
            <Icon name="arrowUpRight" size={18} />
          </Pressable>
        </View>
        <View style={[ui.divider, { marginVertical: 18 }]} />
        <View style={ui.between}>
          <Text style={{ fontSize: 11, color: colors.muted }}>
            Контекст роли
          </Text>
          <Tag color={colors.lavender}>{profile.grade}</Tag>
        </View>
        <View style={[ui.between, { marginTop: 13 }]}>
          <Text style={{ fontSize: 11, color: colors.muted }}>Память</Text>
          <Text style={{ fontSize: 11 }}>
            {profile.memorySources.length} источника
          </Text>
        </View>
      </View>
      <View style={[ui.card, { backgroundColor: "#191C16" }]}>
        <View style={[ui.row, { gap: 8 }]}>
          <Icon name="shield" size={18} color={colors.lime} />
          <Text weight="semibold" style={{ fontSize: 12 }}>
            В твоих границах
          </Text>
        </View>
        <Text
          style={{
            color: colors.muted,
            fontSize: 11,
            lineHeight: 19,
            marginTop: 12,
          }}
        >
          Alter не принимает новые обязательства и не получает права при смене
          роли.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/identity?node=agency")}
          style={[ui.row, { gap: 5, minHeight: 44, marginTop: 6 }]}
        >
          <Text style={{ fontSize: 10, color: colors.lime }}>
            Настроить автономность
          </Text>
          <Icon name="arrowRight" color={colors.lime} size={13} />
        </Pressable>
      </View>
      <View style={{ padding: 7 }}>
        <Text style={ui.caption}>СЕЙЧАС В КОМАНДЕ</Text>
        {[
          {
            name: "Марк",
            role: "Product Manager",
            status: "В фокусе",
            color: colors.lavender,
          },
          {
            name: "Аня",
            role: "Frontend Engineer",
            status: "На связи",
            color: colors.pink,
          },
        ].map((p) => (
          <View key={p.name} style={[ui.row, { gap: 10, marginTop: 18 }]}>
            <Avatar name={p.name} color={p.color} />
            <View style={{ flex: 1 }}>
              <Text weight="semibold" style={{ fontSize: 12 }}>
                {p.name}
              </Text>
              <Text style={{ fontSize: 10, color: colors.muted }}>
                {p.role}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 9,
                color: p.name === "Аня" ? colors.lime : colors.muted,
              }}
            >
              {p.status}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
export default function Home() {
  const wide = useWide();
  const profile = useWorkspace((s) => s.profile);
  const mode = useWorkspace((s) => s.mode);
  const conversations = useWorkspace((s) => s.conversations);
  const read = useWorkspace((s) => s.read);
  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
    timeZone: "Europe/Moscow",
  }).format(new Date());
  const unread = conversations.reduce((n, c) => n + c.unread, 0);
  return (
    <Screen right={<RightPanel />}>
      <View style={[ui.between, { marginBottom: 15 }]}>
        <Text style={ui.caption}>ТВОЁ ПРИСУТСТВИЕ / 01</Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 9,
            textTransform: "uppercase",
          }}
        >
          {date}
        </Text>
      </View>
      <View style={[ui.row, { gap: 7 }]}>
        <Text
          weight="medium"
          style={{
            fontSize: wide ? 39 : 30,
            lineHeight: wide ? 51 : 42,
            letterSpacing: -1.7,
            flexShrink: 1,
          }}
        >
          Привет, Александра
        </Text>
        <Icon name="arrowUpRight" color={colors.lime} size={wide ? 30 : 24} />
      </View>
      <Text
        style={{
          color: colors.muted,
          fontSize: 12,
          marginTop: 5,
          marginBottom: 26,
        }}
      >
        В твоём ритме. На твоих условиях.
      </Text>
      <ModeSelector />
      <View style={[styles.bento, !wide && { gap: 12 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Мой Alter — настроить личность"
          onPress={() => router.push("/identity")}
          style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
            styles.alterCard,
            { flex: wide ? 1.2 : 1, opacity: hovered ? 0.93 : 1 },
          ]}
        >
          <View style={ui.between}>
            <Tag color={colors.ink} dot>
              {mode === "self" ? "НА ПАУЗЕ" : "ALTER НА СВЯЗИ"}
            </Tag>
            <View style={[styles.roundButton, { backgroundColor: "#B0E300" }]}>
              <Icon name="arrowUpRight" color={colors.ink} size={20} />
            </View>
          </View>
          <View style={styles.heroOrbit}>
            <Orbit size={wide ? 240 : 205} />
          </View>
          <View style={{ marginTop: wide ? 142 : 120 }}>
            <Text style={{ fontSize: 10, letterSpacing: 1, color: "#4D600E" }}>
              ТВОЁ ПРОДОЛЖЕНИЕ
            </Text>
            <Text
              weight="medium"
              style={{
                fontSize: 35,
                lineHeight: 43,
                letterSpacing: -1.5,
                color: colors.ink,
              }}
            >
              Мой Alter
            </Text>
            <View style={[ui.row, { gap: 8, marginTop: 7 }]}>
              <Text style={{ color: "#40500D", fontSize: 10 }}>
                {profile.role}
              </Text>
              <View
                style={{
                  width: 3,
                  height: 3,
                  backgroundColor: "#40500D",
                  borderRadius: 2,
                }}
              />
              <Text weight="bold" style={{ fontSize: 10, color: "#40500D" }}>
                {profile.grade}
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={{ flex: 1, gap: 12 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Открыть диалоги"
            onPress={() => router.push("/conversations")}
            style={[styles.smallCard, { backgroundColor: colors.lavender }]}
          >
            <View style={ui.between}>
              <View style={[styles.smallIcon, { backgroundColor: "#A886DC" }]}>
                <Icon name="message" color={colors.ink} size={20} />
              </View>
              <Icon name="arrowUpRight" color={colors.ink} size={20} />
            </View>
            <View style={[ui.between, { marginTop: 16 }]}>
              <Text
                weight="semibold"
                style={{
                  color: colors.ink,
                  fontSize: wide ? 20 : 18,
                  letterSpacing: -0.7,
                }}
              >
                Диалоги
              </Text>
              <Text
                weight="medium"
                style={{ color: "#594872", fontSize: 28, lineHeight: 35 }}
              >
                {String(unread).padStart(2, "0")}
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: "#57436E" }}>
              новых сообщений
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Контекст команды"
            onPress={() => router.push("/identity?node=relationships")}
            style={[styles.smallCard, { backgroundColor: colors.pink }]}
          >
            <View style={ui.between}>
              <View style={[styles.smallIcon, { backgroundColor: "#EFA3C2" }]}>
                <Icon name="users" color={colors.ink} size={20} />
              </View>
              <Icon name="arrowUpRight" color={colors.ink} size={20} />
            </View>
            <Text
              weight="semibold"
              style={{
                color: colors.ink,
                fontSize: wide ? 20 : 18,
                lineHeight: 25,
                letterSpacing: -0.7,
                marginTop: 16,
              }}
            >
              Контекст{wide ? " " : "\n"}команды
            </Text>
            <Text style={{ fontSize: 10, color: "#79485C", marginTop: 3 }}>
              Platform · {profile.relationshipIds.length} связи
            </Text>
          </Pressable>
        </View>
      </View>
      <SectionHeading
        title="Пока тебя не было"
        action="Вся сводка"
        onPress={() => router.push("/catch-up")}
        style={{ marginTop: 24 }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Открыть сводку отсутствия"
        onPress={() => router.push("/catch-up")}
        style={styles.catchup}
      >
        <View style={[ui.between, { marginBottom: 20 }]}>
          <View style={[ui.row, { gap: 8 }]}>
            <Icon name="sparkles" color={colors.lime} size={16} />
            <Text weight="semibold" style={{ fontSize: 11 }}>
              Контекст сохранён
            </Text>
          </View>
          <Text style={{ fontSize: 9, color: colors.muted }}>
            {read ? "ПРОЧИТАНО" : "СЕГОДНЯ, 09:00 — 11:30"}
          </Text>
        </View>
        <View style={styles.stats}>
          {[
            { n: "01", label: "решение", color: colors.lime },
            { n: "02", label: "вопроса", color: colors.lavender },
            { n: "01", label: "задача", color: colors.pink },
          ].map((stat, i) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                borderLeftWidth: i ? 1 : 0,
                borderColor: colors.line,
                paddingLeft: i ? 22 : 0,
              }}
            >
              <Text
                weight="medium"
                style={{
                  fontSize: 35,
                  lineHeight: 44,
                  color: stat.color,
                  letterSpacing: -1,
                }}
              >
                {stat.n}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 10 }}>
                {stat.label}
              </Text>
            </View>
          ))}
          <View style={{ alignSelf: "center" }}>
            <Icon name="arrowRight" size={22} color={colors.muted} />
          </View>
        </View>
        <Text
          style={{
            color: colors.muted,
            fontSize: 11,
            lineHeight: 19,
            marginTop: 18,
          }}
        >
          Онбординг стал короче. Два вопроса ждут твоего решения.
        </Text>
      </Pressable>
      <SectionHeading
        title="Последние диалоги"
        action="Все"
        onPress={() => router.push("/conversations")}
        style={{ marginTop: 23 }}
      />
      {conversations.slice(0, 2).map((c) => (
        <Pressable
          key={c.id}
          accessibilityRole="button"
          accessibilityLabel={`Открыть ${c.title}`}
          onPress={() => router.push(`/conversations?id=${c.id}`)}
          style={styles.conversation}
        >
          <View style={[styles.smallIcon, { backgroundColor: c.color + "20" }]}>
            <Icon
              name={c.id === "platform" ? "layers" : "users"}
              color={c.color}
              size={18}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="semibold" style={{ fontSize: 12 }}>
              {c.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}
            >
              {c.messages[c.messages.length - 1].body}
            </Text>
          </View>
          <Icon name="chevronRight" size={15} color={colors.muted} />
        </Pressable>
      ))}
    </Screen>
  );
}
const styles = StyleSheet.create({
  modes: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 17,
    gap: 3,
  },
  mode: {
    flex: 1,
    minHeight: 43,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  bento: { flexDirection: "row", gap: 16 },
  alterCard: {
    backgroundColor: colors.lime,
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    minHeight: 307,
  },
  heroOrbit: { position: "absolute", top: 23, right: -35 },
  roundButton: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCard: { borderRadius: 24, padding: 18, flex: 1, minHeight: 147 },
  smallIcon: {
    width: 35,
    height: 35,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  catchup: { padding: 22, borderRadius: 23, backgroundColor: colors.surface },
  stats: { flexDirection: "row", alignItems: "center" },
  conversation: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
});
