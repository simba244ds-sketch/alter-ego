import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as NativeText,
  TextProps,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Fingerprint,
  Home,
  Layers3,
  MessageCircle,
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
  BookOpen,
  Brain,
  SlidersHorizontal,
  CheckCheck,
  RotateCcw,
  Pause,
  Circle,
  CheckCircle2,
  LockKeyhole,
  LogOut,
  Menu,
  Target,
  FileText,
} from "lucide-react-native";
import { colors, fonts } from "../theme/tokens";
const icons = {
  arrowUpRight: ArrowUpRight,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  bell: Bell,
  check: Check,
  chevronRight: ChevronRight,
  help: CircleHelp,
  clock: Clock3,
  fingerprint: Fingerprint,
  home: Home,
  layers: Layers3,
  message: MessageCircle,
  more: MoreHorizontal,
  network: Network,
  plus: Plus,
  search: Search,
  send: Send,
  settings: Settings2,
  shield: ShieldCheck,
  sparkles: Sparkles,
  users: Users,
  x: X,
  zap: Zap,
  book: BookOpen,
  brain: Brain,
  sliders: SlidersHorizontal,
  checkCheck: CheckCheck,
  retry: RotateCcw,
  pause: Pause,
  circle: Circle,
  checkCircle: CheckCircle2,
  lock: LockKeyhole,
  logout: LogOut,
  menu: Menu,
  target: Target,
  file: FileText,
};
export type IconName = keyof typeof icons;
export function Icon({
  name,
  size = 20,
  color = colors.text,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const C = icons[name];
  return <C size={size} color={color} strokeWidth={strokeWidth} />;
}
export function Text({
  style,
  weight = "regular",
  ...props
}: TextProps & { weight?: keyof typeof fonts }) {
  return (
    <NativeText
      {...props}
      style={[
        {
          fontFamily: fonts[weight],
          color: colors.text,
          fontSize: 14,
          lineHeight: 22,
        },
        style,
      ]}
    />
  );
}
export function Tag({
  children,
  color = colors.lime,
  dot = false,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.tag, { borderColor: color + "35" }, style]}>
      {dot && (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: color,
          }}
        />
      )}
      <Text
        weight="semibold"
        style={{ color, fontSize: 10, lineHeight: 16, letterSpacing: 0.4 }}
      >
        {children}
      </Text>
    </View>
  );
}
export function Button({
  title,
  onPress,
  variant = "lime",
  icon,
  disabled,
  loading,
  style,
  testID,
}: {
  title: string;
  onPress(): void;
  variant?: "lime" | "dark" | "ghost";
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const ink = variant === "lime" ? colors.ink : colors.text;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={onPress}
      style={({
        pressed,
        hovered,
      }: {
        pressed: boolean;
        hovered?: boolean;
      }) => [
        styles.button,
        variant === "lime"
          ? { backgroundColor: colors.lime }
          : variant === "dark"
            ? {
                backgroundColor: colors.raised,
                borderWidth: 1,
                borderColor: colors.line,
              }
            : { backgroundColor: "transparent" },
        (disabled || loading) && { opacity: 0.45 },
        (pressed || hovered) && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={ink} />
      ) : (
        icon && <Icon name={icon} size={17} color={ink} />
      )}
      <Text weight="bold" style={{ color: ink, fontSize: 12 }}>
        {title}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  color = colors.text,
  style,
}: {
  name: IconName;
  label: string;
  onPress(): void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({
        pressed,
        hovered,
      }: {
        pressed: boolean;
        hovered?: boolean;
      }) => [
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
          opacity: pressed || hovered ? 0.65 : 1,
        },
        style,
      ]}
    >
      <Icon name={name} color={color} />
    </Pressable>
  );
}
export function Avatar({
  name = "А",
  color = colors.lavender,
  size = 34,
}: {
  name?: string;
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.bg,
      }}
    >
      <Text
        weight="bold"
        style={{
          color: colors.ink,
          fontSize: size / 2.8,
          lineHeight: size / 1.3,
        }}
      >
        {name.length <= 2
          ? name
          : name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
      </Text>
    </View>
  );
}
export function SectionHeading({
  title,
  action,
  onPress,
  style,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.section, style]}>
      <Text weight="semibold" style={{ fontSize: 18, letterSpacing: -0.6 }}>
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{
            minHeight: 44,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Text style={{ color: colors.muted, fontSize: 11 }}>{action}</Text>
          <Icon name="arrowUpRight" color={colors.muted} size={15} />
        </Pressable>
      )}
    </View>
  );
}
export function Empty({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ paddingVertical: 48, alignItems: "center", gap: 10 }}>
      <Icon name="search" color={colors.muted} size={30} />
      <Text weight="bold">{title}</Text>
      <Text style={{ color: colors.muted, textAlign: "center" }}>
        {subtitle}
      </Text>
    </View>
  );
}
export const ui = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 20 },
  muted: { color: colors.muted },
  caption: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.4,
    color: colors.muted,
  },
  divider: { height: 1, backgroundColor: colors.line },
  input: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 13,
    padding: 12,
    minHeight: 44,
    outlineWidth: 0,
  } as any,
});
const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  button: {
    minHeight: 44,
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 46,
    marginBottom: 12,
  },
});
