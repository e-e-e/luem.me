import {LuemmeSocket} from "./websockets";

export function installViewportSync(container: HTMLElement, socket: LuemmeSocket) {
  let scrollLock = false
  container.addEventListener('scroll', (e) => {
    if (scrollLock) return;
    const target = e.target;
    if( !(target instanceof HTMLElement)) return
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.offsetHeight)) * 100;
    console.log('sending', scrollPercentage)
    socket.position(scrollPercentage)
  })
  let scrollLockTimer: number = 0
  socket.onPosition((y) => {
    // do not emit
    clearTimeout(scrollLockTimer)
    console.log('automatically scrolling to', y)
    scrollLock = true;
    const top = (y/100) * (container.scrollHeight - container.offsetHeight)
    container.scrollTo({ top: top, left: 0 })
    scrollLockTimer = window.setTimeout(() => scrollLock = false, 1000);
  })
}
