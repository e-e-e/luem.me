import {LuemmeSocket} from "./websockets";
import Icon from './images/cursor.svg';

export function installCursorSync(socket: LuemmeSocket) {
  // state
  const cursors = new Map<string, HTMLElement>();

  const updateCursor = (user: string, x: number, y: number) => {
    const cursor = cursors.get(user);
    if (cursor) {
      cursor.style.top = `${y}px`
      cursor.style.left = `${x}px`
    } else {
      console.log('create')
      const cursor = document.createElement('div')
      cursor.style.position = 'absolute'
      cursor.style.top = `${y}px`
      cursor.style.left = `${x}px`
      cursor.style.background = `url(${Icon})`
      cursor.style.width = '22px'
      cursor.style.height = '22px'
      cursors.set(user, cursor);
      document.body.append(cursor)
    }
  }

  window.addEventListener('mousemove', (e) => {
    socket.cursor(e.pageX, e.pageY)
  })
  socket.onCursor(updateCursor)
}
