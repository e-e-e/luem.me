import {LuemmeSocket} from "./luemmeSocket";
import Icon from '../../images/cursor.svg';

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
    const page = container.querySelector('#viewer .page');
    if (!page ) return
    const rect = page.getBoundingClientRect()
    const scaledX = percentageToPage(x, rect)
    const scaledY = (y / 100) * container.scrollHeight - container.scrollTop
    const cursor = cursors.get(user);
    if (cursor) {
      cursor.style.top = `${scaledY-5}px`
      cursor.style.left = `${scaledX-5}px`
    } else {
      const cursor = document.createElement('div')
      cursor.style.position = 'absolute'
      cursor.style.top = `${scaledY-8}px`
      cursor.style.left = `${scaledX-8}px`
      cursor.style.background = `url(${Icon})`
      cursor.style.width = '22px'
      cursor.style.height = '22px'
      cursors.set(user, cursor);
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
    socket.cursor(x, y)
  })
  socket.onCursor(updateCursor)
}
