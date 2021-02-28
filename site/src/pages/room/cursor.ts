import {LuemmeClient} from "./luemmeClient";
import Icon from '../../images/cursor.svg';
import {CursorPositionPayload} from "../../../../common/src/messages";

function pageToPercentage(x: number, rect: DOMRect) {
  return ((x - rect.x) / rect.width * 100)
}

function percentageToPage(v: number, rect: DOMRect) {
  return (v / 100) * rect.width + rect.x
}

export function installCursorSync(container: HTMLElement, socket: LuemmeClient) {
  // state
  const cursors = new Map<string, HTMLElement>();
  let rect: DOMRect | null = null

  const updateCursor = (data: CursorPositionPayload) => {
    const page = container.querySelector('#viewer .page');
    if (!page) return
    const rect = page.getBoundingClientRect()
    const scaledX = percentageToPage(data.x, rect)
    const scaledY = (data.y / 100) * container.scrollHeight - container.scrollTop
    const cursor = cursors.get(data.id);
    if (cursor) {
      cursor.style.top = `${scaledY - 5}px`
      cursor.style.left = `${scaledX - 5}px`
    } else {
      const cursor = document.createElement('div')
      cursor.style.position = 'absolute'
      cursor.style.top = `${scaledY - 8}px`
      cursor.style.left = `${scaledX - 8}px`
      cursor.style.background = `url(${Icon})`
      cursor.style.width = '22px'
      cursor.style.height = '22px'
      cursors.set(data.id, cursor);
      document.body.append(cursor)
    }
  }

  window.addEventListener('mousemove', (e) => {
    const page = container.querySelector('#viewer .page');
    if (!page) return
    rect = page.getBoundingClientRect()
    const x = pageToPercentage(e.pageX, rect)
    const y = ((e.pageY + container.scrollTop) / container.scrollHeight) * 100
    // console.log(e.pageX,p, percentageToPage(p, rect))
    socket.sendCursorPosition({x, y})
  })
  socket.cursorPosition.subscribe(updateCursor)
}
