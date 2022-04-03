import { LuemmeClient } from '../luemmeClient';
import {
  CursorPositionPayload,
  SetCursorPositionPayload,
} from 'luem.me.common';
import './cursor';
import { Profiles } from '../profiles/install';
import { View } from '../pdfViewer/install';
import { colorToHslString } from '../base/color';
import {fromEvent} from "rxjs";

export function installCursorSync(
  view: View,
  luemme: LuemmeClient,
  profiles: Profiles
) {
  const cursors = new Map<string, Cursor>();
  const ownCursorState: SetCursorPositionPayload = {
    x: 0,
    y: 0,
    pressed: false,
  };

  const updateCursor = (data: CursorPositionPayload) => {
    const position = view.relativePosition.toPage(data);
    if (!position) return;
    const cursor = cursors.get(data.id);
    const user =
      data.id === 'me'
        ? profiles.whoami.getValue()
        : profiles.readers.get(data.id);
    if (!user) throw new Error('Attempting to update cursor without user');
    if (cursor) {
      cursor.elementStyle.top = `${position.pageY}px`;
      cursor.elementStyle.left = `${position.pageX}px`;
      cursor.pressed = data.pressed;
    } else {
      const cursor = document.createElement('lue-cursor') as Cursor;
      cursor.elementStyle.top = `${position.pageY}px`;
      cursor.elementStyle.left = `${position.pageX}px`;
      cursor.pressed = data.pressed;
      cursor.color = colorToHslString(user.color);
      cursors.set(data.id, cursor);
      document.body.append(cursor);
    }
  };

  window.addEventListener('mousedown', (e) => {
    ownCursorState.pressed = true;
    luemme.sendCursorPosition(ownCursorState);
    updateCursor({ ...ownCursorState, id: 'me' });
  });
  window.addEventListener('mouseup', (e) => {
    ownCursorState.pressed = false;
    luemme.sendCursorPosition(ownCursorState);
    updateCursor({ ...ownCursorState, id: 'me' });
  });
  window.addEventListener('mousemove', (e) => {
    const position = view.relativePosition.fromPage(e);
    if (!position) return;
    ownCursorState.x = position.x;
    ownCursorState.y = position.y;
    luemme.sendCursorPosition(ownCursorState);
    updateCursor({ ...ownCursorState, id: 'me' });
  });

  luemme.cursorPosition.subscribe(updateCursor);
  luemme.userLeft.subscribe((data) => {
    const cursor = cursors.get(data);
    if (cursor) {
      cursor.parentElement?.removeChild(cursor);
      cursors.delete(data);
    }
  });
}
