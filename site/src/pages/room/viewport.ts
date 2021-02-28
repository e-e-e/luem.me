import { LuemmeClient } from "./luemmeClient";

export function installViewportSync(container: HTMLElement, socket: LuemmeClient) {
  let scrollLock = false
  container.addEventListener('scroll', (e) => {
    if (scrollLock) return;
    const target = e.target;
    if( !(target instanceof HTMLElement)) return
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.offsetHeight)) * 100;
    // console.log('sending', scrollPercentage)
    socket.setScrollPosition({ y: scrollPercentage, x: 0 })
  })

  let scrollLockTimer: number = 0

  socket.scrollPosition.subscribe((data) => {
    // do not emit
    clearTimeout(scrollLockTimer)
    console.log('automatically scrolling to', data)
    scrollLock = true;
    const top = (data.y/100) * (container.scrollHeight - container.offsetHeight)
    container.scrollTo({ top: top, left: 0 })
    scrollLockTimer = window.setTimeout(() => scrollLock = false, 1000);
  })
}
