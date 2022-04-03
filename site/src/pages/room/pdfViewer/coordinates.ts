import { Position } from 'luem.me.common';

export type PageCoordinates = { pageX: number; pageY: number };

export const pageCoordinatesToRelativePosition =
  (container: HTMLElement) =>
  (pageCoordinates: PageCoordinates): Position | null => {
    const page = container.querySelector('#viewer .page');
    if (!page) return null;
    const rect = page.getBoundingClientRect();
    const x = ((pageCoordinates.pageX - rect.x) / rect.width) * 100;
    const y =
      ((pageCoordinates.pageY + container.scrollTop) / container.scrollHeight) *
      100;
    return {
      x,
      y,
    };
  };

export const relativePositionToPageCoordinates =
  (container: HTMLElement) =>
  (position: Position): PageCoordinates | null => {
    const page = container.querySelector('#viewer .page');
    if (!page) return null;
    const rect = page.getBoundingClientRect();
    const pageX = (position.x / 100) * rect.width + rect.x;
    const pageY =
      (position.y / 100) * container.scrollHeight - container.scrollTop;
    return {
      pageX,
      pageY,
    };
  };
