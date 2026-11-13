import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router, usePathname } from "expo-router";
import Head from "expo-router/head";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/tokens";
import { Avatar, Icon, IconName, Text, ui } from "./ui";
import { useWorkspace } from "../store/useWorkspace";

const tabs: {
  path: "/" | "/identity" | "/conversations" | "/catch-up";
  name: string;
  short: string;
  icon: IconName;
  index: string;
}[] = [
  {
    path: "/",
    name: "Присутствие",
    short: "Главная",
    icon: "home",
    index: "01",
  },
  {
    path: "/identity",
    name: "Мой Alter",
    short: "Identity",
    icon: "fingerprint",
    index: "02",
  },
  {
    path: "/conversations",
    name: "Диалоги",
    short: "Диалоги",
    icon: "message",
    index: "03",
  },
  {
    path: "/catch-up",
    name: "Что нового",
    short: "Catch-up",
    icon: "layers",
    index: "04",
  },
];
export function useWide() {
  return useWindowDimensions().width >= 1000;
}
export function Screen({
  children,
  right,
  scroll = true,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
  scroll?: boolean;
}) {
  const wide = useWide();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const notice = useWorkspace((s) => s.notice);
  const clear = useWorkspace((s) => s.clearNotice);
  const hydrated = useWorkspace((s) => s.hydrated);
  const storageError = useWorkspace((s) => s.storageError);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(clear, 4200);
    return () => clearTimeout(t);
  }, [notice, clear]);
  return (
    <View style={[styles.root, { paddingTop: wide ? 0 : insets.top }]}>
      <Head>
        <title>{`ALTER EGO · ${tabs.find((t) => t.path === path)?.name || "Твоё присутствие"}`}</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      {wide && (
        <View style={styles.sidebar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="ALTER EGO — главная"
            onPress={() => router.push("/")}
            style={styles.brand}
          >
            <View style={styles.brandIcon}>
              <Icon name="sparkles" color={colors.ink} size={21} />
            </View>
            <Text weight="extra" style={styles.brandText}>
              ALTER EGO
              <Text style={{ color: colors.lime, fontSize: 20 }}>.</Text>
            </Text>
          </Pressable>
          <View style={{ paddingHorizontal: 12, paddingTop: 44 }}>
            <Text style={[ui.caption, { marginLeft: 14, marginBottom: 17 }]}>
              ТВОЁ ПРОСТРАНСТВО
            </Text>
            {tabs.map((tab) => {
              const active = path === tab.path;
              return (
                <Pressable
                  key={tab.path}
                  accessibilityRole="tab"
                  aria-selected={active}
                  accessibilityState={{ selected: active }}
                  onPress={() => router.push(tab.path)}
                  style={({
                    hovered,
                  }: {
                    pressed: boolean;
                    hovered?: boolean;
                  }) => [
                    styles.navItem,
                    active && { backgroundColor: colors.limeDim },
                    hovered && !active && { backgroundColor: colors.surface },
                  ]}
                >
                  <Icon
                    name={tab.icon}
                    color={active ? colors.lime : colors.muted}
                    size={20}
                  />
                  <Text
                    weight={active ? "bold" : "medium"}
                    style={{
                      color: active ? colors.lime : colors.muted,
                      fontSize: 12,
                      flex: 1,
                    }}
                  >
                    {tab.name}
                  </Text>
                  {tab.path === "/catch-up" && !useWorkspace.getState().read ? (
                    <View style={styles.dot} />
                  ) : (
                    <Text style={{ color: colors.subtle, fontSize: 10 }}>
                      {tab.index}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.sidebarNote}>
            <Icon name="shield" color={colors.lime} size={22} />
            <Text weight="semibold" style={{ fontSize: 12, marginTop: 12 }}>
              Ты определяешь границы.
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontSize: 11,
                lineHeight: 18,
                marginTop: 5,
              }}
            >
              Alter помогает оставаться на связи. Контроль всегда у тебя.
            </Text>
            <View style={[ui.row, { marginTop: 16, gap: 6 }]}>
              <View style={styles.dot} />
              <Text style={{ fontSize: 9, color: colors.muted }}>
                ЛОКАЛЬНЫЙ ПРОТОТИП
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Открыть профиль и компетенции"
            onPress={() => router.push("/identity?node=skills")}
            style={styles.profile}
          >
            <Avatar name="АС" size={37} />
            <View style={{ flex: 1 }}>
              <Text weight="semibold" style={{ fontSize: 12 }}>
                Александра С.
              </Text>
              <Text style={{ fontSize: 10, color: colors.muted }}>
                Product Designer
              </Text>
            </View>
            <Icon name="settings" color={colors.muted} size={17} />
          </Pressable>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        {wide && (
          <View style={styles.topbar}>
            <View style={[ui.row, { gap: 9 }]}>
              <Icon name="users" size={15} color={colors.muted} />
              <Text style={{ fontSize: 11, color: colors.muted }}>
                Workspace
              </Text>
              <Text style={{ fontSize: 11, color: colors.subtle }}>/</Text>
              <Text style={{ fontSize: 11 }}>Команда Platform</Text>
            </View>
            <View style={[ui.row, { gap: 18 }]}>
              <View style={[ui.row, { gap: 6 }]}>
                <View style={styles.dot} />
                <Text style={{ fontSize: 10, color: colors.muted }}>
                  Все системы в ритме
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: colors.subtle }}>
                DEMO V.01
              </Text>
            </View>
          </View>
        )}
        {scroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.content,
              !wide && styles.mobileContent,
              wide && { paddingBottom: 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {!wide && <MobileBrand />}
            {storageError && (
              <Text accessibilityRole="alert" style={{ color: colors.danger }}>
                {storageError}
              </Text>
            )}
            {!hydrated ? (
              <ActivityIndicator style={{ margin: 50 }} color={colors.lime} />
            ) : (
              <View
                style={[
                  wide && {
                    flexDirection: "row",
                    gap: 28,
                    alignItems: "flex-start",
                  },
                ]}
              >
                <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
                {wide && right && <View style={{ width: 270 }}>{right}</View>}
              </View>
            )}
            <Text
              style={{
                fontSize: 9,
                color: colors.subtle,
                marginTop: 28,
                letterSpacing: 1,
              }}
            >
              ALTER EGO · СОЦИАЛЬНОЕ ПРИСУТСТВИЕ ПОД ТВОИМ КОНТРОЛЕМ
            </Text>
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            {hydrated ? (
              children
            ) : (
              <ActivityIndicator style={{ margin: 50 }} color={colors.lime} />
            )}
          </View>
        )}
        {!wide && (
          <View
            style={[
              styles.bottomNav,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            {tabs.map((tab) => {
              const active = path === tab.path;
              return (
                <Pressable
                  key={tab.path}
                  accessibilityRole="tab"
                  accessibilityLabel={tab.name}
                  aria-selected={active}
                  accessibilityState={{ selected: active }}
                  onPress={() => router.push(tab.path)}
                  style={styles.bottomItem}
                >
                  <View
                    style={[
                      styles.bottomIcon,
                      active && { backgroundColor: colors.limeDim },
                    ]}
                  >
                    <Icon
                      name={tab.icon}
                      size={20}
                      color={active ? colors.lime : colors.muted}
                    />
                  </View>
                  <Text
                    weight={active ? "bold" : "regular"}
                    style={{
                      fontSize: 9,
                      color: active ? colors.lime : colors.muted,
                    }}
                  >
                    {tab.short}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      {notice && (
        <Pressable
          accessibilityRole="alert"
          onPress={clear}
          style={[
            styles.toast,
            {
              bottom: wide ? 24 : 94 + insets.bottom,
              left: wide ? 260 : 16,
              right: 16,
            },
          ]}
        >
          <Icon name="checkCircle" size={19} color={colors.lime} />
          <Text style={{ flex: 1, fontSize: 11 }}>{notice}</Text>
          <Icon name="x" size={15} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}
export function MobileBrand() {
  return (
    <View style={[ui.between, { marginBottom: 27 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="ALTER EGO — главная"
        onPress={() => router.push("/")}
        style={[ui.row, { gap: 8 }]}
      >
        <View
          style={[styles.brandIcon, { width: 28, height: 28, borderRadius: 9 }]}
        >
          <Icon name="sparkles" color={colors.ink} size={17} />
        </View>
        <Text weight="extra" style={{ fontSize: 15, letterSpacing: -0.6 }}>
          ALTER EGO<Text style={{ color: colors.lime }}>.</Text>
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Настройки профиля"
        onPress={() => router.push("/identity?node=skills")}
      >
        <Avatar name="АС" size={34} />
      </Pressable>
    </View>
  );
}
export function PageHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const wide = useWide();
  return (
    <View style={{ marginBottom: 25 }}>
      <Text style={[ui.caption, { marginBottom: 10 }]}>{eyebrow}</Text>
      <View style={[ui.between, { gap: 10 }]}>
        <Text
          weight="medium"
          style={{
            fontSize: wide ? 37 : 31,
            lineHeight: wide ? 47 : 41,
            letterSpacing: -1.5,
            flex: 1,
          }}
        >
          {title}
        </Text>
        {action}
      </View>
      {subtitle && (
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            marginTop: 7,
            lineHeight: 20,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row", backgroundColor: colors.bg },
  sidebar: {
    width: 224,
    borderRightWidth: 1,
    borderColor: colors.line,
    paddingTop: 30,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 25,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { fontSize: 18, letterSpacing: -0.9 },
  navItem: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    minHeight: 49,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 7,
  },
  sidebarNote: {
    padding: 19,
    borderRadius: 18,
    backgroundColor: "#191C15",
    margin: 17,
  },
  profile: {
    padding: 19,
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.lime },
  topbar: {
    minHeight: 77,
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    paddingHorizontal: 36,
    paddingTop: 34,
    width: "100%",
    maxWidth: 1450,
    alignSelf: "center",
  },
  mobileContent: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 25 },
  bottomNav: {
    borderTopWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    backgroundColor: colors.bg,
    paddingTop: 8,
  },
  bottomItem: { flex: 1, minHeight: 53, alignItems: "center", gap: 2 },
  bottomIcon: {
    width: 49,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toast: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    padding: 17,
    backgroundColor: "#282D20",
    borderWidth: 1,
    borderColor: "#4A562B",
    borderRadius: 16,
    maxWidth: 650,
    zIndex: 100,
  },
});
