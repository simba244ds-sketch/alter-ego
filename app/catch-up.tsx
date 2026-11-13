import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Screen, PageHeading, useWide } from "../src/components/Screen";
import {
  Button,
  Empty,
  Icon,
  IconName,
  Tag,
  Text,
  ui,
} from "../src/components/ui";
import { Orbit } from "../src/components/Orbit";
import { colors } from "../src/theme/tokens";
import { useWorkspace } from "../src/store/useWorkspace";

const types: Record<string, { label: string; color: string; icon: IconName }> =
  {
    decision: { label: "РЕШЕНИЕ", color: colors.lime, icon: "checkCheck" },
    question: { label: "ВОПРОС", color: colors.lavender, icon: "help" },
    task: { label: "ЗАДАЧА", color: colors.pink, icon: "target" },
  };
export default function CatchUp() {
  const wide = useWide();
  const items = useWorkspace((s) => s.catchUp);
  const conversations = useWorkspace((s) => s.conversations);
  const read = useWorkspace((s) => s.read);
  const mark = useWorkspace((s) => s.readCatchUp);
  const toggleTask = useWorkspace((s) => s.toggleTask);
  const [filter, setFilter] = useState("all");
  const filtered = items.filter((i) => filter === "all" || i.type === filter);
  return (
    <Screen>
      <PageHeading
        eyebrow="ВОЗВРАЩЕНИЕ В КОНТЕКСТ / 04"
        title="Ты ничего не пропустила."
        subtitle="Всё важное за время твоего отсутствия — в одном месте."
      />
      <View style={styles.hero}>
        <View style={{ flex: 1, zIndex: 1 }}>
          <Tag color={colors.lime} dot>
            СЕГОДНЯ · 09:00 — 11:30
          </Tag>
          <Text
            weight="medium"
            style={{
              fontSize: wide ? 36 : 29,
              lineHeight: wide ? 46 : 38,
              letterSpacing: -1,
              marginTop: 22,
            }}
          >
            Была не здесь.{wide ? "\n" : " "}Но была в курсе.
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 21,
              color: "#AAB09B",
              maxWidth: 420,
              marginTop: 13,
            }}
          >
            Alter сохранил контекст трёх обсуждений. Новые обязательства
            остались за тобой.
          </Text>
          <View style={[ui.row, { gap: 8, marginTop: 23 }]}>
            <Icon name="sparkles" color={colors.lime} size={14} />
            <Text style={{ fontSize: 10, color: colors.lime }}>
              Сводка по демонстрационным диалогам
            </Text>
          </View>
        </View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: wide ? 20 : -90,
            top: wide ? -10 : 30,
            opacity: wide ? 0.8 : 0.25,
          }}
        >
          <Orbit size={300} color={colors.lime} glow />
        </View>
      </View>
      <View style={[ui.row, { gap: wide ? 17 : 10, marginVertical: 20 }]}>
        {[
          { id: "decision", n: 1, title: "Решение" },
          { id: "question", n: 2, title: "Вопроса" },
          { id: "task", n: 1, title: "Задача" },
        ].map((t) => (
          <Pressable
            key={t.id}
            accessibilityRole="button"
            accessibilityLabel={`Показать ${t.title.toLowerCase()}`}
            onPress={() => setFilter(filter === t.id ? "all" : t.id)}
            style={[
              styles.stat,
              filter === t.id && { borderColor: types[t.id].color },
            ]}
          >
            <Icon name={types[t.id].icon} color={types[t.id].color} size={18} />
            <Text
              weight="medium"
              style={{
                fontSize: 31,
                lineHeight: 42,
                letterSpacing: -1,
                marginTop: 14,
              }}
            >
              {String(t.n).padStart(2, "0")}
            </Text>
            <Text style={{ fontSize: 10, color: colors.muted }}>{t.title}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[ui.between, { marginTop: 8, marginBottom: 15, gap: 8 }]}>
        <Text weight="semibold" style={{ fontSize: 18, letterSpacing: -0.5 }}>
          Важное за день
        </Text>
        <Button
          title={read ? "Прочитано" : "Всё прочитано"}
          icon="checkCheck"
          variant="ghost"
          disabled={read}
          onPress={mark}
          style={{ paddingHorizontal: 0 }}
        />
      </View>
      <View style={[ui.row, { gap: 7, marginBottom: 22, flexWrap: "wrap" }]}>
        {[
          { id: "all", title: "Всё" },
          { id: "decision", title: "Решения" },
          { id: "question", title: "Вопросы" },
          { id: "task", title: "Задачи" },
        ].map((f) => (
          <Pressable
            key={f.id}
            accessibilityRole="tab"
            aria-selected={filter === f.id}
            accessibilityState={{ selected: filter === f.id }}
            onPress={() => setFilter(f.id)}
            style={[
              styles.pill,
              filter === f.id && {
                backgroundColor: colors.lime,
                borderColor: colors.lime,
              },
            ]}
          >
            <Text
              weight="semibold"
              style={{
                fontSize: 11,
                color: filter === f.id ? colors.ink : colors.muted,
              }}
            >
              {f.title}
            </Text>
          </Pressable>
        ))}
      </View>
      {!filtered.length && (
        <Empty
          title="Здесь пока тихо"
          subtitle="Нет событий в выбранной категории."
        />
      )}
      <View style={{ gap: 15 }}>
        {filtered.map((item) => {
          const t = types[item.type];
          const c = conversations.find((c) => c.id === item.conversationId);
          return (
            <View
              key={item.id}
              style={[styles.event, item.done && { opacity: 0.6 }]}
            >
              <View
                style={[
                  ui.row,
                  { gap: wide ? 18 : 12, alignItems: "flex-start" },
                ]}
              >
                <View
                  style={[
                    styles.eventIcon,
                    { backgroundColor: t.color + "18" },
                  ]}
                >
                  <Icon
                    name={item.done ? "check" : t.icon}
                    color={t.color}
                    size={20}
                  />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={ui.between}>
                    <Text
                      weight="semibold"
                      style={{ color: t.color, fontSize: 9, letterSpacing: 1 }}
                    >
                      {item.done ? "ВЫПОЛНЕНО" : t.label}
                    </Text>
                    <Text style={{ fontSize: 9, color: colors.subtle }}>
                      {item.time}
                    </Text>
                  </View>
                  <Text
                    weight="semibold"
                    style={{
                      fontSize: wide ? 19 : 16,
                      lineHeight: 25,
                      letterSpacing: -0.5,
                      marginTop: 8,
                      textDecorationLine: item.done ? "line-through" : "none",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 12,
                      lineHeight: 21,
                      marginTop: 7,
                    }}
                  >
                    {item.body}
                  </Text>
                  <View
                    style={[
                      ui.row,
                      { flexWrap: "wrap", gap: 8, marginTop: 16 },
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`К диалогу: ${item.title}`}
                      onPress={() =>
                        router.push(`/conversations?id=${item.conversationId}`)
                      }
                      style={styles.source}
                    >
                      <Icon
                        name="message"
                        color={c?.color || colors.muted}
                        size={13}
                      />
                      <Text style={{ fontSize: 10 }}>{c?.title}</Text>
                      <Icon
                        name="arrowUpRight"
                        size={13}
                        color={colors.muted}
                      />
                    </Pressable>
                    {item.type === "task" && (
                      <Button
                        title={item.done ? "Вернуть задачу" : "Готово"}
                        icon={item.done ? "retry" : "check"}
                        variant="ghost"
                        onPress={() => toggleTask(item.id)}
                        style={{ minHeight: 44, paddingHorizontal: 10 }}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <View style={[ui.row, { gap: 10, paddingVertical: 22 }]}>
        <Icon name="shield" size={16} color={colors.muted} />
        <Text
          style={{ flex: 1, fontSize: 10, lineHeight: 18, color: colors.muted }}
        >
          Сводка не заменяет исходный разговор. Проверь контекст перед решением
          — источник есть у каждого события.
        </Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#1D2314",
    borderWidth: 1,
    borderColor: "#343E20",
    borderRadius: 27,
    padding: 26,
    overflow: "hidden",
    minHeight: 255,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 19,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 42,
    justifyContent: "center",
  },
  event: {
    padding: 22,
    borderRadius: 23,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#282828",
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  source: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 12,
    backgroundColor: colors.raised,
    borderRadius: 11,
  },
});
