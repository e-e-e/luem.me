import {LuemmeClient} from "../luemmeClient";
import {CursorPositionPayload, Position, SetCursorPositionPayload} from "../../../../../common/src/messages";
import './cursor'

function pageToPercentage(x: number, rect: DOMRect) {
  return ((x - rect.x) / rect.width * 100)
}

function percentageToPage(v: number, rect: DOMRect) {
  return (v / 100) * rect.width + rect.x
}

export function installCursorSync(container: HTMLElement, luemme: LuemmeClient) {
  const cursors = new Map<string, Cursor>();
  let rect: DOMRect | null = null
  const ownCursorState: SetCursorPositionPayload = { x: 0, y: 0, pressed: false}

  const updateCursor = (data: CursorPositionPayload) => {
    const page = container.querySelector('#viewer .page');
    if (!page) return
    const rect = page.getBoundingClientRect()
    const scaledX = percentageToPage(data.x, rect)
    const scaledY = (data.y / 100) * container.scrollHeight - container.scrollTop
    const cursor = cursors.get(data.id);
    if (cursor) {
      cursor.style.top = `${scaledY}px`
      cursor.style.left = `${scaledX}px`
      cursor.pressed = data.pressed
    } else {
      const cursor = document.createElement('lue-cursor') as Cursor
      cursor.style.top = `${scaledY}px`
      cursor.style.left = `${scaledX}px`
      cursor.pressed = data.pressed
      cursors.set(data.id, cursor);
      document.body.append(cursor)
    }
  }

  const getRelativeMousePosition = (e: MouseEvent): Position | null => {
    const page = container.querySelector('#viewer .page');
    if (!page) return null
    rect = page.getBoundingClientRect()
    const x = pageToPercentage(e.pageX, rect)
    const y = ((e.pageY + container.scrollTop) / container.scrollHeight) * 100
    return {
      x,
      y,
    }
  }

  window.addEventListener('mousedown', (e) => {
    ownCursorState.pressed = true
    luemme.sendCursorPosition(ownCursorState)
    updateCursor({...ownCursorState, id: 'me' })
  })
  window.addEventListener('mouseup', (e) => {
    ownCursorState.pressed = false
    luemme.sendCursorPosition(ownCursorState)
    updateCursor({...ownCursorState, id: 'me' })
  })
  window.addEventListener('mousemove', (e) => {
    const position = getRelativeMousePosition(e)
    if(!position) return
    ownCursorState.x = position.x
    ownCursorState.y = position.y
    luemme.sendCursorPosition(ownCursorState)
    updateCursor({...ownCursorState, id: 'me' })
  })
  luemme.cursorPosition.subscribe(updateCursor)
  luemme.userLeft.subscribe((data) => {
    const cursor = cursors.get(data)
    if (cursor) {
      cursor.parentElement?.removeChild(cursor)
      cursors.delete(data)
    }
  })
}
