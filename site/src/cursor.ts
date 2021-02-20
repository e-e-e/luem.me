import {LuemmeSocket} from "./websockets";
import Icon from './images/cursor.svg';

function pageToPercentage(x: number, rect: DOMRect ) {
  return ((x - rect.x) / rect.width * 100)
}

function percentageToPage(v: number, rect: DOMRect ) {
  return (v/100) * rect.width + rect.x
}

export function installCursorSync(container: HTMLElement, socket: LuemmeSocket) {
  // state
  const cursors = new Map<string, HTMLElement>();
  let rect: DOMRect | null = null

  const updateCursor = (user: string, x: number, y: number) => {
    const page = document.querySelector('#viewer .page');
    if (!page) return
    const rect = page.getBoundingClientRect()
    const scaledX = percentageToPage(x, rect)
    const cursor = cursors.get(user);
    if (cursor) {
      cursor.style.top = `${y-5}px`
      cursor.style.left = `${scaledX-5}px`
    } else {
      const cursor = document.createElement('div')
      cursor.style.position = 'absolute'
      cursor.style.top = `${y-8}px`
      cursor.style.left = `${scaledX-8}px`
      cursor.style.background = `url(${Icon})`
      cursor.style.width = '22px'
      cursor.style.height = '22px'
      cursors.set(user, cursor);
      document.body.append(cursor)
    }
  }

  window.addEventListener('mousemove', (e) => {
    const page = document.querySelector('#viewer .page');
    if (!page) return
    rect = page.getBoundingClientRect()
    const p = pageToPercentage(e.pageX, rect)
    console.log(e.pageX,p, percentageToPage(p, rect))
    socket.cursor(p, e.pageY)
  })
  socket.onCursor(updateCursor)
}
