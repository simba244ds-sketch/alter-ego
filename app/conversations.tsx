import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  MobileBrand,
  PageHeading,
  Screen,
  useWide,
} from "../src/components/Screen";
import {
  Avatar,
  Button,
  Empty,
  Icon,
  IconButton,
  Tag,
  Text,
  ui,
} from "../src/components/ui";
import { colors, fonts } from "../src/theme/tokens";
import { useWorkspace } from "../src/store/useWorkspace";
import { Conversation } from "../src/domain/types";

function ConversationList({
  selected,
  select,
}: {
  selected?: string;
  select(id: string): void;
}) {
  const conversations = useWorkspace((s) => s.conversations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "ai" && c.controller === "ai") ||
        (filter === "human" && c.controller === "human")),
  );
  return (
    <View>
      <View style={styles.search}>
        <Icon name="search" color={colors.muted} size={17} />
        <TextInput
          accessibilityLabel="Поиск диалогов"
          placeholder="Найти диалог"
          placeholderTextColor={colors.subtle}
          value={search}
          onChangeText={setSearch}
          style={[ui.input, { flex: 1, paddingHorizontal: 8 }]}
        />
        {search ? (
          <IconButton
            name="x"
            label="Очистить поиск"
            onPress={() => setSearch("")}
            style={{ width: 32, height: 32 }}
          />
        ) : null}
      </View>
      <View style={[ui.row, { gap: 6, marginVertical: 17 }]}>
        {[
          { id: "all", title: "Все" },
          { id: "ai", title: "С Alter" },
          { id: "human", title: "Мои" },
        ].map((f) => (
          <Pressable
            key={f.id}
            accessibilityRole="tab"
            aria-selected={filter === f.id}
            accessibilityState={{ selected: filter === f.id }}
            onPress={() => setFilter(f.id)}
            style={[
              styles.filter,
              filter === f.id && { backgroundColor: colors.raised },
            ]}
          >
            <Text
              weight="semibold"
              style={{
                fontSize: 11,
                color: filter === f.id ? colors.text : colors.muted,
              }}
            >
              {f.title}
            </Text>
          </Pressable>
        ))}
      </View>
      {!filtered.length && (
        <Empty
          title="Диалогов не найдено"
          subtitle="Попробуй другой запрос или фильтр."
        />
      )}
      {filtered.map((c) => (
        <Pressable
          key={c.id}
          accessibilityRole="button"
          accessibilityLabel={`Диалог ${c.title}`}
          onPress={() => select(c.id)}
          style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
            styles.listItem,
            selected === c.id && {
              backgroundColor: colors.surface,
              borderColor: "#464C36",
            },
            hovered && { backgroundColor: colors.surface },
          ]}
        >
          <View style={[ui.row, { gap: 11 }]}>
            <View
              style={[styles.convIcon, { backgroundColor: c.color + "1A" }]}
            >
              <Icon
                name={
                  c.id === "platform"
                    ? "layers"
                    : c.id === "design"
                      ? "users"
                      : c.id === "launch"
                        ? "zap"
                        : "search"
                }
                size={19}
                color={c.color}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="semibold" style={{ fontSize: 12 }}>
                {c.title}
              </Text>
              <Text style={{ color: colors.subtle, fontSize: 9 }}>
                {c.messages[c.messages.length - 1].time}
              </Text>
            </View>
            {c.unread > 0 && (
              <View style={styles.unread}>
                <Text weight="bold" style={{ color: colors.ink, fontSize: 9 }}>
                  {c.unread}
                </Text>
              </View>
            )}
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 11,
              lineHeight: 18,
              color: colors.muted,
              marginTop: 12,
            }}
          >
            {c.messages[c.messages.length - 1].body}
          </Text>
          <View style={[ui.row, { gap: 5, marginTop: 11 }]}>
            <Icon
              name={c.aiAllowed ? "sparkles" : "lock"}
              size={11}
              color={c.controller === "ai" ? colors.lavender : colors.subtle}
            />
            <Text
              style={{
                fontSize: 9,
                color: c.controller === "ai" ? colors.lavender : colors.subtle,
              }}
            >
              {c.controller === "ai"
                ? "Отвечает Alter"
                : c.aiAllowed
                  ? "Ты в диалоге"
                  : "Только человек"}
            </Text>
          </View>
        </Pressable>
      ))}
      <View style={[ui.row, { gap: 7, padding: 14 }]}>
        <Icon name="lock" color={colors.subtle} size={13} />
        <Text
          style={{ flex: 1, fontSize: 9, color: colors.subtle, lineHeight: 16 }}
        >
          Демонстрационные диалоги. Сообщения сохраняются локально.
        </Text>
      </View>
    </View>
  );
}
function Chat({
  conversation: c,
  mobile,
}: {
  conversation: Conversation;
  mobile: boolean;
}) {
  const [input, setInput] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const scroll = useRef<ScrollView>(null);
  const profile = useWorkspace((s) => s.profile);
  const pending = useWorkspace((s) => s.pending[c.id]);
  const draft = useWorkspace((s) => s.drafts[c.id]);
  const error = useWorkspace((s) => s.errors[c.id]);
  const takeOver = useWorkspace((s) => s.takeOver);
  const choose = useWorkspace((s) => s.chooseAuthor);
  const send = useWorkspace((s) => s.sendHuman);
  const generate = useWorkspace((s) => s.generate);
  const publish = useWorkspace((s) => s.publishDraft);
  const discard = useWorkspace((s) => s.discardDraft);
  const markRead = useWorkspace((s) => s.markRead);
  useEffect(() => {
    markRead(c.id);
    setInput("");
    setLastPrompt("");
  }, [c.id, markRead]);
  useEffect(() => {
    const timer = setTimeout(
      () => scroll.current?.scrollToEnd({ animated: false }),
      100,
    );
    return () => clearTimeout(timer);
  }, [c.id, c.messages.length, draft?.body]);
  const ai = c.controller === "ai";
  const submit = () => {
    if (!input.trim() || pending) return;
    if (ai) {
      setLastPrompt(input);
      void generate(c.id, input);
    } else {
      send(c.id, input);
    }
    setInput("");
  };
  const prompt = (value: string) => {
    setLastPrompt(value);
    void generate(c.id, value);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        styles.chat,
        mobile && { borderWidth: 0, borderRadius: 0, flex: 1 },
      ]}
    >
      <View style={[styles.chatHeader, mobile && { paddingHorizontal: 18 }]}>
        <View style={[ui.row, { gap: 9, flex: 1 }]}>
          {mobile && (
            <IconButton
              name="arrowLeft"
              label="К списку диалогов"
              onPress={() => router.replace("/conversations")}
              style={{ width: 34, height: 40 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text weight="bold" style={{ fontSize: 14 }}>
              {c.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: colors.muted, fontSize: 9 }}
            >
              {c.subtitle}
            </Text>
          </View>
        </View>
        {ai ? (
          <Button
            title="Перехватить"
            icon="arrowUpRight"
            testID="take-over"
            onPress={() => takeOver(c.id)}
            style={{ minHeight: 39, borderRadius: 12, paddingHorizontal: 12 }}
          />
        ) : (
          <Tag color={colors.lime} dot>
            ТЫ НА СВЯЗИ
          </Tag>
        )}
      </View>
      <View style={styles.aiNotice}>
        <Icon
          name={c.aiAllowed ? "shield" : "lock"}
          size={14}
          color={c.aiAllowed ? colors.lavender : colors.muted}
        />
        <Text
          style={{ flex: 1, fontSize: 9, lineHeight: 16, color: colors.muted }}
        >
          {c.aiAllowed
            ? `Alter · ${profile.grade} · ${profile.autonomy === "approval" ? "ответы с подтверждением" : "в разрешённых границах"}. AI всегда обозначен.`
            : "Alter не разрешён в этом канале. Повышение грейда не открывает доступ."}
        </Text>
      </View>
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: mobile ? 18 : 24, gap: 19 }}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: false })
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            alignSelf: "center",
            color: colors.subtle,
            fontSize: 9,
            letterSpacing: 1.3,
          }}
        >
          СЕГОДНЯ
        </Text>
        {c.messages.map((m) =>
          m.author === "system" ? (
            <View
              key={m.id}
              style={[ui.row, { gap: 8, justifyContent: "center" }]}
            >
              <Icon name="pause" color={colors.lime} size={12} />
              <Text style={{ color: colors.muted, fontSize: 9, flexShrink: 1 }}>
                {m.body}
              </Text>
            </View>
          ) : (
            <View
              key={m.id}
              style={{
                alignSelf: m.author === "human" ? "flex-end" : "flex-start",
                maxWidth: "92%",
                width: m.author === "human" ? undefined : "100%",
              }}
            >
              <View
                style={[
                  ui.row,
                  {
                    gap: 7,
                    marginBottom: 7,
                    justifyContent:
                      m.author === "human" ? "flex-end" : "flex-start",
                  },
                ]}
              >
                {m.author !== "human" && (
                  <Avatar
                    name={m.author === "ai" ? "✳" : m.authorName}
                    color={m.author === "ai" ? colors.lavender : colors.pink}
                    size={24}
                  />
                )}
                <Text
                  weight="semibold"
                  style={{
                    fontSize: 10,
                    color: m.author === "ai" ? colors.lavender : colors.muted,
                  }}
                >
                  {m.author === "human" ? "Ты" : m.authorName}
                </Text>
                {m.author === "ai" && (
                  <Tag
                    color={colors.lavender}
                    style={{ paddingVertical: 0, paddingHorizontal: 5 }}
                  >
                    AI
                  </Tag>
                )}
                <Text style={{ fontSize: 8, color: colors.subtle }}>
                  {m.time}
                </Text>
              </View>
              <View
                style={[
                  styles.bubble,
                  m.author === "ai" && {
                    backgroundColor: "#282232",
                    borderColor: "#42334F",
                  },
                  m.author === "human" && {
                    backgroundColor: colors.lime,
                    borderColor: colors.lime,
                    borderTopRightRadius: 4,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 21,
                    color: m.author === "human" ? colors.ink : colors.text,
                  }}
                >
                  {m.body}
                </Text>
                {m.author === "ai" && (
                  <View style={[ui.row, { gap: 5, marginTop: 10 }]}>
                    <Icon name="sparkles" size={10} color={colors.lavender} />
                    <Text
                      style={{
                        fontSize: 8,
                        lineHeight: 14,
                        color: colors.lavender,
                      }}
                    >
                      AI-ПРЕДСТАВИТЕЛЬ · ДЕМО
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ),
        )}
        {pending && (
          <View style={[ui.row, { gap: 9 }]}>
            <ActivityIndicator color={colors.lavender} size="small" />
            <Text style={{ color: colors.lavender, fontSize: 11 }}>
              Alter готовит ответ…
            </Text>
          </View>
        )}
        {error && (
          <View
            accessibilityRole="alert"
            style={[ui.card, { borderWidth: 1, borderColor: colors.danger }]}
          >
            <Text style={{ color: colors.danger, fontSize: 11 }}>{error}</Text>
            <Button
              title="Попробовать снова"
              variant="dark"
              icon="retry"
              onPress={() => prompt(lastPrompt)}
              style={{ marginTop: 12 }}
            />
          </View>
        )}
        {draft && (
          <View
            testID="ai-draft"
            style={[
              ui.card,
              {
                backgroundColor: "#282232",
                borderWidth: 1,
                borderColor: colors.lavender,
              },
            ]}
          >
            <View style={[ui.row, { gap: 7 }]}>
              <Icon name="sparkles" color={colors.lavender} size={16} />
              <Text
                weight="semibold"
                style={{ fontSize: 11, color: colors.lavender }}
              >
                AI-черновик · ждёт подтверждения
              </Text>
            </View>
            <Text style={{ fontSize: 12, lineHeight: 21, marginTop: 12 }}>
              {draft.body}
            </Text>
            <View style={[ui.row, { gap: 7, marginTop: 17 }]}>
              <Button
                title="Опубликовать"
                icon="check"
                onPress={() => publish(c.id)}
                style={{ flex: 1 }}
              />
              <Button
                title="Отклонить"
                variant="dark"
                onPress={() => discard(c.id)}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.composer}>
        <View style={[ui.row, { gap: 8, marginBottom: 10 }]}>
          <Text style={{ color: colors.muted, fontSize: 9, marginRight: 1 }}>
            СЛЕДУЮЩИЙ ОТВЕТ
          </Text>
          {[
            { id: "human", title: "Я", icon: "circle" as const },
            { id: "ai", title: "Alter · AI", icon: "sparkles" as const },
          ].map((a) => (
            <Pressable
              key={a.id}
              accessibilityRole="radio"
              accessibilityLabel={`Автор: ${a.title}`}
              aria-checked={c.controller === a.id}
              aria-disabled={a.id === "ai" && !c.aiAllowed}
              accessibilityState={{
                checked: c.controller === a.id,
                disabled: a.id === "ai" && !c.aiAllowed,
              }}
              disabled={a.id === "ai" && !c.aiAllowed}
              onPress={() => choose(c.id, a.id as "human" | "ai")}
              style={[
                styles.author,
                c.controller === a.id && {
                  backgroundColor:
                    a.id === "ai" ? colors.lavenderDim : colors.limeDim,
                },
                a.id === "ai" && !c.aiAllowed && { opacity: 0.3 },
              ]}
            >
              <Icon
                name={a.icon}
                size={11}
                color={
                  c.controller === a.id
                    ? a.id === "ai"
                      ? colors.lavender
                      : colors.lime
                    : colors.muted
                }
              />
              <Text
                style={{
                  fontSize: 10,
                  color:
                    c.controller === a.id
                      ? a.id === "ai"
                        ? colors.lavender
                        : colors.lime
                      : colors.muted,
                }}
              >
                {a.title}
              </Text>
            </Pressable>
          ))}
        </View>
        {ai && !pending && !draft && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingBottom: 10 }}
          >
            {[
              "Предложи пустое состояние",
              "Собери краткую сводку",
              "Проверь токены",
            ].map((p) => (
              <Pressable
                key={p}
                accessibilityRole="button"
                onPress={() => prompt(p)}
                style={styles.suggestion}
              >
                <Text style={{ fontSize: 9, color: colors.muted }}>{p}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View style={[styles.inputBox, ai && { borderColor: "#55416C" }]}>
          <TextInput
            testID="message-input"
            accessibilityLabel={
              ai ? "Инструкция для Alter" : "Сообщение от Александры"
            }
            placeholder={
              ai ? "Что подготовить от твоего имени?" : "Напиши сообщение…"
            }
            placeholderTextColor={colors.subtle}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            style={[
              ui.input,
              { flex: 1, maxHeight: 96, minHeight: 46, paddingHorizontal: 12 },
            ]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              ai ? "Подготовить AI-ответ" : "Отправить сообщение"
            }
            disabled={!input.trim() || pending}
            onPress={submit}
            style={[
              styles.send,
              { backgroundColor: ai ? colors.lavender : colors.lime },
              (!input.trim() || pending) && { opacity: 0.35 },
            ]}
          >
            <Icon
              name={ai ? "sparkles" : "arrowUp"}
              size={18}
              color={colors.ink}
            />
          </Pressable>
        </View>
        <Text
          style={{
            fontSize: 8,
            color: colors.subtle,
            textAlign: "center",
            marginTop: 7,
            lineHeight: 13,
          }}
        >
          Локальное демо · никаких сообщений в реальные каналы
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
export default function Conversations() {
  const wide = useWide();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const conversations = useWorkspace((s) => s.conversations);
  const selected =
    conversations.find((c) => c.id === id) ||
    (wide ? conversations[0] : undefined);
  if (!wide && id && selected)
    return (
      <Screen scroll={false}>
        <Chat key={selected.id} conversation={selected} mobile />
      </Screen>
    );
  return (
    <Screen>
      <PageHeading
        eyebrow="РАЗГОВОРЫ / 03"
        title="Всегда в диалоге."
        subtitle="Твой голос или голос Alter — решаешь ты."
        action={
          <Tag color={colors.lavender}>{conversations.length} ДИАЛОГА</Tag>
        }
      />
      <View style={wide ? { flexDirection: "row", gap: 24 } : undefined}>
        <View style={{ width: wide ? 267 : "100%" }}>
          <ConversationList
            selected={selected?.id}
            select={(id) => router.push(`/conversations?id=${id}`)}
          />
        </View>
        {wide && selected && (
          <View style={{ flex: 1, minWidth: 0, height: 660 }}>
            <Chat key={selected.id} conversation={selected} mobile={false} />
          </View>
        )}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filter: {
    paddingHorizontal: 15,
    minHeight: 37,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },
  listItem: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 7,
  },
  convIcon: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  unread: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  chat: {
    backgroundColor: "#161616",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    flex: 1,
    overflow: "hidden",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 18,
    borderBottomWidth: 1,
    borderColor: colors.line,
    minHeight: 83,
  },
  aiNotice: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#1C1A20",
    borderBottomWidth: 1,
    borderColor: "#29262D",
  },
  bubble: {
    padding: 15,
    borderRadius: 17,
    borderTopLeftRadius: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#2B2B2B",
  },
  composer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#191919",
  },
  author: {
    minHeight: 31,
    borderRadius: 9,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  suggestion: {
    borderWidth: 1,
    borderColor: "#37303F",
    borderRadius: 10,
    paddingHorizontal: 11,
    minHeight: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 4,
  },
  send: {
    width: 37,
    height: 37,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    margin: 1,
  },
});
