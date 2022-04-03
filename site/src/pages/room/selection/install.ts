import { LuemmeClient } from '../luemmeClient';
import { Color, Rect, SelectionPayload } from 'luem.me.common';
import { Profiles } from '../profiles/install';
import { colorToHslString } from '../base/color';
import {View} from "../pdfViewer/install";

function domRectToRect(rect: DOMRect): Rect {
  const { x, y, width, height } = rect;
  return {
    x,
    y,
    width,
    height,
  };
}

function createSelectionsContainer() {
  const selectionContainer = document.createElement('div');
  selectionContainer.style.position = 'absolute';
  selectionContainer.style.top = '0px';
  selectionContainer.style.left = '0px';
  selectionContainer.style.pointerEvents = 'none';
  return selectionContainer;
}

function drawSelectionRect(rect: Rect, color: Color) {
  const select = document.createElement('div');
  select.style.position = 'absolute';
  select.style.top = `${scrollTop + rect.top}px`;
  select.style.left = `${rect.left}px`;
  select.style.width = `${rect.width}px`;
  select.style.height = `${rect.height}px`;
  select.style.background = colorToHslString(color, 0.5);
  selectionContainer.appendChild(select);
}

export function installSelectionSync(
  view: View,
  luemme: LuemmeClient,
  profiles: Profiles
) {
  const selectionContainer = createSelectionsContainer();
  document.appendChild(selectionContainer);

  const updateSelection = (data: SelectionPayload) => {
    // createSelection
    console.log('selection:', data);
  };

  document.addEventListener('selectionchange', (e) => {
    selectionContainer.innerHTML = '';
    const scrollTop = root.scrollTop;
    const selection = document.getSelection();
    if (selection?.rangeCount) {
      const rects = selection.getRangeAt(0).getClientRects();
      luemme.sendSelection({
        rects: Array.from(rects, domRectToRect),
      });
      for (const rect of Array.from(rects)) {
        const select = document.createElement('div');
        select.style.position = 'absolute';
        select.style.top = `${scrollTop + rect.top}px`;
        select.style.left = `${rect.left}px`;
        select.style.width = `${rect.width}px`;
        select.style.height = `${rect.height}px`;
        select.style.background = 'rgba(255,255,0,0.5)';
        selectionContainer.appendChild(select);
      }
    } else {
      console.log('no selection');
    }
  });

  console.log('hello buddy 333ss');
  // On resize we need to clear or recalculate selection

  luemme.selection.subscribe(updateSelection);
}
