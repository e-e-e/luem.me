import { Color, UserInfo } from 'luem.me.common';

export function nextHue(colors: number[]) {
  if (colors.length === 0) return Math.floor(Math.random() * 360);
  if (colors.length === 1) return (colors[0] + 180) % 360;
  const sorted = colors.sort((a, b) => a - b);
  let max = 0;
  let currentMid = 0;
  for (let i = 0; i < sorted.length; i++) {
    const from = sorted[i];
    let to = sorted[(i + 1) % sorted.length];
    if (to < from) to += 360;
    const dist = to - from;
    if (dist > max) {
      max = dist;
      currentMid = from + Math.floor(dist / 2);
    }
  }
  return currentMid;
}

export function getNextUserColor(colors: UserInfo[]): Color {
  return {
    h: nextHue(colors.map((c) => c.color.h)),
    s: 100,
    l: 50,
  };
}
