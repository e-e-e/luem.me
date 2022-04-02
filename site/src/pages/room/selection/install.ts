import { LuemmeClient } from '../luemmeClient';
import { Rect, SelectionPayload } from '../../../../../common/src/messages';

export function installSelection(root: HTMLElement, luemme: LuemmeClient) {
  const selectionContainer = document.createElement('div');
  selectionContainer.style.position = 'absolute';
  selectionContainer.style.top = '0px';
  selectionContainer.style.left = '0px';
  selectionContainer.style.pointerEvents = 'none';
  root.appendChild(selectionContainer);

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
        rects: Array.from(rects).map((a) => ({
          x: a.x,
          y: a.y,
          width: a.width,
          height: a.height,
        })),
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
