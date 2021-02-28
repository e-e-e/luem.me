import { LuemmeClient } from "./luemmeClient";
import {filter, first} from "rxjs/operators";
import {Position} from "../../../../common/src/messages";
import {PdfViewer} from "./pdfViewer/install";

export function installViewportSync(pdfViewer: PdfViewer, luemme: LuemmeClient) {
  let scrollLock = false
  let initial: Position = { x: 0, y: 0};
  pdfViewer.container.addEventListener('scroll', (e) => {
    if (scrollLock) return;
    const target = e.target;
    if( !(target instanceof HTMLElement)) return
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.offsetHeight)) * 100;
    // console.log('sending', scrollPercentage)
    luemme.setScrollPosition({ y: scrollPercentage, x: 0 })
  })

  let scrollLockTimer: number = 0

  const updateScrollPosition = (data: Position) => {
    // do not emit
    clearTimeout(scrollLockTimer)
    console.log('automatically scrolling to', data)
    scrollLock = true;
    const top = (data.y/100) * (pdfViewer.container.scrollHeight - pdfViewer.container.offsetHeight)
    pdfViewer.container.scrollTo({ top: top, left: 0 })
    scrollLockTimer = window.setTimeout(() => scrollLock = false, 1000);
  }
  console.log('inatlling view point')

  luemme.readingRoomInitialState
    .subscribe((roomState) => {
      initial = roomState.scrollPosition
      if (pdfViewer.state.getValue() === 'loaded') {
        updateScrollPosition(roomState.scrollPosition)
      }
    })
  pdfViewer.state.pipe(filter(v => v === 'loaded')).subscribe((v) => {
    setTimeout(() => updateScrollPosition(initial), 100)
  })
  luemme.scrollPosition.subscribe(updateScrollPosition)
}
