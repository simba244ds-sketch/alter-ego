import React from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { colors } from "../theme/tokens";

export function Orbit({
  size = 200,
  color = colors.ink,
  glow = false,
}: {
  size?: number;
  color?: string;
  glow?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      <Defs>
        <RadialGradient id="halo">
          <Stop offset="0" stopColor={colors.lime} stopOpacity=".18" />
          <Stop offset="1" stopColor={colors.lime} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="orb" x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor={color} stopOpacity=".9" />
          <Stop offset="1" stopColor={color} stopOpacity=".12" />
        </LinearGradient>
      </Defs>
      {glow && <Circle cx="120" cy="120" r="115" fill="url(#halo)" />}
      <G
        transform="rotate(-32 120 120)"
        fill="none"
        stroke="url(#orb)"
        strokeWidth=".9"
      >
        {Array.from({ length: 14 }, (_, i) => (
          <Ellipse
            key={i}
            cx="120"
            cy="120"
            rx={28 + i * 5.2}
            ry={92 - i * 4.4}
          />
        ))}
      </G>
      <G
        transform="rotate(42 120 120)"
        fill="none"
        stroke={color}
        strokeOpacity=".2"
        strokeWidth=".7"
      >
        <Ellipse cx="120" cy="120" rx="96" ry="39" />
        <Ellipse cx="120" cy="120" rx="96" ry="65" />
      </G>
      <Circle cx="182" cy="62" r="5.5" fill={color} />
      <Circle cx="53" cy="166" r="3" fill={color} />
      <Circle cx="120" cy="120" r="7" fill={color} />
    </Svg>
  );
}

export function MiniGraph({ size = 230 }: { size?: number }) {
  const nodes = [
    [115, 26],
    [204, 89],
    [172, 192],
    [58, 192],
    [26, 89],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 230 230">
      <Defs>
        <RadialGradient id="graphGlow">
          <Stop stopColor={colors.lime} stopOpacity=".2" />
          <Stop offset="1" stopColor={colors.lime} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="115" cy="113" r="96" fill="url(#graphGlow)" />
      <Circle
        cx="115"
        cy="113"
        r="91"
        stroke={colors.line}
        strokeDasharray="3 6"
        fill="none"
      />
      {nodes.map(([x, y], i) => (
        <G key={i}>
          <Path
            d={`M115 113 L${x} ${y}`}
            stroke={i < 2 ? "#778C3A" : colors.line}
            strokeWidth="1"
          />
          <Circle
            cx={x}
            cy={y}
            r="12"
            fill={colors.surface}
            stroke={i === 0 ? colors.lime : colors.line}
          />
          <Circle
            cx={x}
            cy={y}
            r="3"
            fill={
              [
                colors.lime,
                colors.lavender,
                colors.pink,
                colors.lavender,
                colors.lime,
              ][i]
            }
          />
        </G>
      ))}
      <Circle
        cx="115"
        cy="113"
        r="29"
        fill={colors.limeDim}
        stroke={colors.lime}
      />
      <SvgText
        x="115"
        y="117"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill={colors.lime}
      >
        YOU
      </SvgText>
    </Svg>
  );
}
