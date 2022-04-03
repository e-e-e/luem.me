import { Color } from 'luem.me.common';

export function colorToHslString(color: Color, alpha?: number): string {
  if (alpha != null) return `hsl(${color.h},${color.s}%,${color.l}%, ${alpha})`;
  return `hsl(${color.h},${color.s}%,${color.l}%)`;
}
