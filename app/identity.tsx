import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { router, useLocalSearchParams } from "expo-router";
import { Screen, PageHeading, useWide } from "../src/components/Screen";
import {
  Button,
  Icon,
  IconButton,
  IconName,
  SectionHeading,
  Tag,
  Text,
  ui,
} from "../src/components/ui";
import { colors } from "../src/theme/tokens";
import { Branch, Grade, Profile } from "../src/domain/types";
import { memorySources, relationships } from "../src/data/seed";
import { useWorkspace } from "../src/store/useWorkspace";

const branches: {
  id: Branch;
  name: string;
  ru: string;
  icon: IconName;
  color: string;
  x: number;
  y: number;
  description: string;
}[] = [
  {
    id: "memory",
    name: "Memory",
    ru: "Память",
    icon: "book",
    color: colors.lime,
    x: 50,
    y: 10,
    description: "Рабочий контекст, на который опирается Alter.",
  },
  {
    id: "persona",
    name: "Persona",
    ru: "Характер",
    icon: "brain",
    color: colors.lavender,
    x: 84,
    y: 38,
    description: "Твой голос. Твой стиль. Настрой, как звучит Alter.",
  },
  {
    id: "skills",
    name: "Skills",
    ru: "Компетенции",
    icon: "target",
    color: colors.pink,
    x: 72,
    y: 84,
    description: "Профессиональная роль и глубина экспертизы.",
  },
  {
    id: "agency",
    name: "Agency",
    ru: "Автономность",
    icon: "sliders",
    color: colors.lavender,
    x: 28,
    y: 84,
    description: "Определи, когда Alter действует сам, а когда спрашивает.",
  },
  {
    id: "relationships",
    name: "Relationships",
    ru: "Связи",
    icon: "users",
    color: colors.lime,
    x: 16,
    y: 38,
    description: "Команды и люди, чей контекст знаком твоему Alter.",
  },
];
function summary(id: Branch, p: Profile) {
  return id === "memory"
    ? `${p.memorySources.length} источника`
    : id === "persona"
      ? { friendly: "Дружелюбный", balanced: "Сдержанный", formal: "Деловой" }[
          p.tone
        ]
      : id === "skills"
        ? `${p.grade} · ${p.role}`
        : id === "agency"
          ? p.autonomy === "approval"
            ? "С подтверждением"
            : "В заданных границах"
          : `${p.relationshipIds.length} команды`;
}
export default function Identity() {
  const wide = useWide();
  const hydrated = useWorkspace((s) => s.hydrated);
  const profile = useWorkspace((s) => s.profile);
  const update = useWorkspace((s) => s.updateProfile);
  const params = useLocalSearchParams<{ node?: string }>();
  const [selected, setSelected] = useState<Branch | null>(null);
  const [draft, setDraft] = useState<Profile>(profile);
  const open = (id: Branch) => {
    setDraft({ ...profile });
    setSelected(id);
  };
  useEffect(() => {
    if (hydrated && branches.some((b) => b.id === params.node))
      open(params.node as Branch);
  }, [params.node, hydrated]);
  const branch = branches.find((b) => b.id === selected);
  const close = () => {
    setSelected(null);
    if (params.node) router.setParams({ node: "" });
  };
  const toggle = (key: "memorySources" | "relationshipIds", id: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(id)
        ? d[key].filter((x) => x !== id)
        : [...d[key], id],
    }));
  return (
    <Screen>
      <PageHeading
        eyebrow="ЛИЧНОСТЬ / 02"
        title="Твой Alter. Твои правила."
        subtitle="Пять граней, которые делают его твоим продолжением."
        action={
          <Tag color={colors.lime} dot>
            НАСТРАИВАЕТСЯ
          </Tag>
        }
      />
      <View style={[wide && { flexDirection: "row", gap: 24 }]}>
        <View style={[styles.graphCard, { flex: 1 }]}>
          <View style={ui.between}>
            <Text style={ui.caption}>IDENTITY GRAPH</Text>
            <Icon name="network" color={colors.muted} size={18} />
          </View>
          <View
            style={{
              height: wide ? 420 : 350,
              marginHorizontal: wide ? 12 : -10,
            }}
          >
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={StyleSheet.absoluteFill}
            >
              <Defs>
                <RadialGradient id="identityGlow">
                  <Stop stopColor={colors.lime} stopOpacity=".14" />
                  <Stop offset="1" stopColor={colors.lime} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx="50" cy="49" r="44" fill="url(#identityGlow)" />
              <Circle
                cx="50"
                cy="49"
                r="37"
                fill="none"
                stroke={colors.line}
                strokeWidth=".25"
                strokeDasharray="1 1.5"
              />
              {branches.map((b) => (
                <Line
                  key={b.id}
                  x1="50"
                  y1="49"
                  x2={b.x}
                  y2={b.y}
                  stroke={b.color}
                  strokeOpacity=".3"
                  strokeWidth=".3"
                />
              ))}
            </Svg>
            <View style={styles.you}>
              <Text
                weight="extra"
                style={{
                  color: colors.lime,
                  fontSize: 25,
                  lineHeight: 32,
                  letterSpacing: -1,
                }}
              >
                YOU
              </Text>
              <Text
                style={{
                  color: "#9AA86D",
                  fontSize: 8,
                  lineHeight: 14,
                  letterSpacing: 2,
                }}
              >
                THE CORE
              </Text>
            </View>
            {branches.map((b, i) => (
              <Pressable
                key={b.id}
                accessibilityRole="button"
                accessibilityLabel={`${b.name} — ${b.ru}`}
                testID={`node-${b.id}`}
                onPress={() => open(b.id)}
                style={({
                  hovered,
                  pressed,
                }: {
                  pressed: boolean;
                  hovered?: boolean;
                }) => [
                  styles.node,
                  {
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    borderColor: hovered || pressed ? b.color : colors.line,
                    backgroundColor:
                      hovered || pressed ? colors.raised : colors.surface,
                  },
                ]}
              >
                <View
                  style={[styles.nodeIcon, { backgroundColor: b.color + "18" }]}
                >
                  <Icon name={b.icon} color={b.color} size={16} />
                </View>
                <Text
                  weight="semibold"
                  style={{
                    fontSize: b.id === "relationships" ? 9 : 11,
                    lineHeight: 17,
                  }}
                >
                  {b.name}
                </Text>
                <Text
                  style={{ fontSize: 8, color: colors.muted, lineHeight: 13 }}
                >
                  {String(i + 1).padStart(2, "0")} / {b.ru}
                </Text>
              </Pressable>
            ))}
          </View>
          <View
            style={[ui.row, { justifyContent: "center", gap: 7, marginTop: 8 }]}
          >
            <Icon name="plus" size={13} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 10 }}>
              Нажми на узел, чтобы настроить
            </Text>
          </View>
          <Button
            title="Настроить границы Alter"
            icon="shield"
            onPress={() => open("agency")}
            style={{ marginTop: 20 }}
          />
        </View>
        <View style={{ width: wide ? 285 : "100%", marginTop: wide ? 0 : 24 }}>
          <View
            style={[
              ui.card,
              { backgroundColor: colors.lavenderDim, marginBottom: 17 },
            ]}
          >
            <View style={ui.between}>
              <Icon name="fingerprint" size={28} color={colors.lavender} />
              <Tag color={colors.lavender}>{profile.grade}</Tag>
            </View>
            <Text
              weight="semibold"
              style={{
                fontSize: 21,
                lineHeight: 28,
                letterSpacing: -0.7,
                marginTop: 20,
              }}
            >
              {profile.name}
            </Text>
            <Text
              style={{ color: colors.lavender, fontSize: 11, marginTop: 3 }}
            >
              {profile.role} · Platform
            </Text>
            <View
              style={[
                ui.divider,
                { marginVertical: 18, backgroundColor: "#443751" },
              ]}
            />
            <Text style={{ color: "#BEB0CC", fontSize: 11, lineHeight: 19 }}>
              Alter развивается вместе с тобой. Доступы всегда задаются
              отдельно.
            </Text>
          </View>
          <View style={[ui.card, { padding: 18 }]}>
            <Text style={ui.caption}>СОСТОЯНИЕ ЛИЧНОСТИ</Text>
            {branches.map((b) => (
              <Pressable
                key={b.id}
                accessibilityRole="button"
                accessibilityLabel={`Настроить ${b.ru}`}
                onPress={() => open(b.id)}
                style={[
                  ui.row,
                  {
                    gap: 10,
                    paddingVertical: 13,
                    borderBottomWidth: b.id === "relationships" ? 0 : 1,
                    borderColor: colors.line,
                  },
                ]}
              >
                <Icon name={b.icon} color={b.color} size={17} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11 }}>{b.ru}</Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 9, color: colors.muted }}
                  >
                    {summary(b.id, profile)}
                  </Text>
                </View>
                <Icon name="chevronRight" color={colors.muted} size={14} />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <View
        style={[
          ui.row,
          {
            gap: 10,
            marginTop: 24,
            padding: 17,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.line,
          },
        ]}
      >
        <Icon name="lock" color={colors.lime} size={19} />
        <Text
          style={{ flex: 1, color: colors.muted, fontSize: 11, lineHeight: 19 }}
        >
          Новый грейд расширяет контекст экспертизы. Он не добавляет прав и не
          открывает новые диалоги.
        </Text>
      </View>
      <Modal
        visible={!!selected}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        <View
          style={[
            styles.overlay,
            wide && { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Pressable
            accessibilityLabel="Закрыть настройки"
            onPress={close}
            style={StyleSheet.absoluteFill}
          />
          <View
            accessibilityViewIsModal
            style={[
              styles.sheet,
              wide && { borderRadius: 28, maxWidth: 520, width: "100%" },
            ]}
          >
            <View style={ui.between}>
              <View style={[ui.row, { gap: 12 }]}>
                <View
                  style={[
                    styles.nodeIcon,
                    {
                      backgroundColor: (branch?.color || colors.lime) + "20",
                      width: 44,
                      height: 44,
                    },
                  ]}
                >
                  <Icon
                    name={branch?.icon || "settings"}
                    size={22}
                    color={branch?.color}
                  />
                </View>
                <View>
                  <Text style={ui.caption}>{branch?.name.toUpperCase()}</Text>
                  <Text
                    weight="semibold"
                    style={{ fontSize: 23, lineHeight: 32 }}
                  >
                    {branch?.ru}
                  </Text>
                </View>
              </View>
              <IconButton name="x" label="Закрыть панель" onPress={close} />
            </View>
            <Text
              style={{
                color: colors.muted,
                marginTop: 17,
                marginBottom: 23,
                fontSize: 12,
              }}
            >
              {branch?.description}
            </Text>
            <ScrollView
              style={{ maxHeight: 390 }}
              showsVerticalScrollIndicator={false}
            >
              {selected === "persona" && (
                <>
                  <Text weight="semibold" style={styles.label}>
                    ТОН ОБЩЕНИЯ
                  </Text>
                  {[
                    {
                      id: "friendly",
                      title: "Дружелюбный",
                      detail: "Тепло, просто и по делу",
                    },
                    {
                      id: "balanced",
                      title: "Сдержанный",
                      detail: "Нейтрально, без лишних эмоций",
                    },
                    {
                      id: "formal",
                      title: "Деловой",
                      detail: "Формально и структурированно",
                    },
                  ].map((t) => (
                    <Choice
                      key={t.id}
                      title={t.title}
                      detail={t.detail}
                      selected={draft.tone === t.id}
                      onPress={() =>
                        setDraft((d) => ({
                          ...d,
                          tone: t.id as Profile["tone"],
                        }))
                      }
                    />
                  ))}
                  <Text
                    weight="semibold"
                    style={[styles.label, { marginTop: 18 }]}
                  >
                    ПОДРОБНОСТЬ ОТВЕТОВ
                  </Text>
                  <View style={[ui.row, { gap: 8 }]}>
                    {[
                      { id: "brief", title: "Кратко" },
                      { id: "detailed", title: "Развёрнуто" },
                    ].map((t) => (
                      <Button
                        key={t.id}
                        title={t.title}
                        variant={draft.detail === t.id ? "lime" : "dark"}
                        style={{ flex: 1 }}
                        onPress={() =>
                          setDraft((d) => ({
                            ...d,
                            detail: t.id as Profile["detail"],
                          }))
                        }
                      />
                    ))}
                  </View>
                </>
              )}
              {selected === "skills" && (
                <>
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 12,
                      marginBottom: 18,
                    }}
                  >
                    Роль: {profile.role}. Выбери грейд, который Alter будет
                    учитывать в ответах.
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                  >
                    {(["Junior", "Middle", "Senior", "Lead"] as Grade[]).map(
                      (grade) => (
                        <Button
                          key={grade}
                          title={grade}
                          testID={`grade-${grade}`}
                          variant={draft.grade === grade ? "lime" : "dark"}
                          style={{ width: "47%" }}
                          onPress={() => setDraft((d) => ({ ...d, grade }))}
                        />
                      ),
                    )}
                  </View>
                  <View style={[styles.info, { marginTop: 20 }]}>
                    <Icon name="shield" color={colors.lime} size={19} />
                    <Text style={styles.infoText}>
                      Меняется контекст компетенций. Разрешения, память и
                      автономность остаются прежними.
                    </Text>
                  </View>
                </>
              )}
              {selected === "agency" && (
                <>
                  <Choice
                    title="С моим подтверждением"
                    detail="Alter готовит черновик. Публикуешь ты."
                    selected={draft.autonomy === "approval"}
                    onPress={() =>
                      setDraft((d) => ({ ...d, autonomy: "approval" }))
                    }
                  />
                  <Choice
                    title="В разрешённых диалогах"
                    detail="В режиме «Вместо меня» Alter публикует локальные ответы сам."
                    selected={draft.autonomy === "scoped"}
                    onPress={() =>
                      setDraft((d) => ({ ...d, autonomy: "scoped" }))
                    }
                  />
                  <View style={styles.info}>
                    <Icon name="lock" color={colors.lime} size={19} />
                    <Text style={styles.infoText}>
                      Доступны только Platform и Design guild. Новые
                      обязательства требуют решения человека. Реальные сообщения
                      не отправляются.
                    </Text>
                  </View>
                </>
              )}
              {selected === "memory" && (
                <>
                  {memorySources.map((item) => (
                    <Choice
                      key={item.id}
                      title={item.title}
                      detail={item.detail}
                      selected={draft.memorySources.includes(item.id)}
                      onPress={() => toggle("memorySources", item.id)}
                      checkbox
                    />
                  ))}
                  <Text
                    style={{ color: colors.muted, fontSize: 10, marginTop: 12 }}
                  >
                    Демонстрационные источники. Отключённые источники
                    исключаются из контекста mock AI.
                  </Text>
                </>
              )}
              {selected === "relationships" && (
                <>
                  {relationships.map((item) => (
                    <Choice
                      key={item.id}
                      title={item.title}
                      detail={item.detail}
                      selected={draft.relationshipIds.includes(item.id)}
                      onPress={() => toggle("relationshipIds", item.id)}
                      checkbox
                    />
                  ))}
                  <Text
                    style={{ color: colors.muted, fontSize: 10, marginTop: 12 }}
                  >
                    Связь добавляет контекст о команде. Доступ к её диалогам
                    задаётся отдельно.
                  </Text>
                </>
              )}
            </ScrollView>
            <Button
              title="Сохранить настройки"
              icon="check"
              testID="save-settings"
              onPress={() => {
                update(draft);
                close();
              }}
              style={{ marginTop: 26 }}
            />
            <Text
              style={{
                color: colors.subtle,
                textAlign: "center",
                fontSize: 9,
                marginTop: 10,
              }}
            >
              Сохраняется только на этом устройстве
            </Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
function Choice({
  title,
  detail,
  selected,
  onPress,
  checkbox = false,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onPress(): void;
  checkbox?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={checkbox ? "checkbox" : "radio"}
      accessibilityLabel={title}
      aria-checked={selected}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.choice,
        selected && {
          borderColor: colors.lime,
          backgroundColor: colors.limeDim,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text weight="semibold" style={{ fontSize: 12 }}>
          {title}
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontSize: 10,
            lineHeight: 17,
            marginTop: 4,
          }}
        >
          {detail}
        </Text>
      </View>
      <View
        style={{
          width: 21,
          height: 21,
          borderRadius: checkbox ? 6 : 11,
          borderWidth: 1,
          borderColor: selected ? colors.lime : colors.subtle,
          backgroundColor: selected ? colors.lime : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <Icon name="check" color={colors.ink} size={14} />}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  graphCard: {
    backgroundColor: "#181A15",
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#2C3021",
    padding: 20,
  },
  you: {
    position: "absolute",
    left: "50%",
    top: "49%",
    width: 94,
    height: 94,
    marginLeft: -47,
    marginTop: -47,
    borderRadius: 47,
    borderWidth: 1,
    borderColor: "#6C8328",
    backgroundColor: "#242B15",
    alignItems: "center",
    justifyContent: "center",
  },
  node: {
    position: "absolute",
    width: 94,
    minHeight: 83,
    marginLeft: -47,
    marginTop: -38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 9,
  },
  nodeIcon: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#000000AD",
    justifyContent: "flex-end",
    paddingTop: 35,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    paddingBottom: 30,
    maxHeight: "95%",
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: {
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1.3,
    marginBottom: 12,
  },
  choice: {
    minHeight: 75,
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 9,
  },
  info: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#25291C",
    marginTop: 10,
  },
  infoText: { flex: 1, fontSize: 11, lineHeight: 18, color: "#B6BBA7" },
});
