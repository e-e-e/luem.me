import Inactive from "inactive";
import {LuemmeClient} from "../luemmeClient";
import {createPdfViewControls, createPdfViewerContainer} from "./Viewer";

import * as pdfjs from "pdfjs-dist"
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';

import 'pdfjs-dist/build/pdf.worker.entry';
import 'pdfjs-dist/web/pdf_viewer.css';
import { distinctUntilChanged, filter, first} from "rxjs/operators";
import {BehaviorSubject } from "rxjs";

const DEFAULT_SCALE_DELTA = 1.1
const MAX_SCALE = 4
const MIN_SCALE = 0.2

export type State = 'initial' | 'loading' | 'loaded'

export type PdfViewer = {
  container: HTMLElement
  load(url: string): Promise<void>
  state: BehaviorSubject<State>
}

export function installPdfViewer(root: HTMLElement, luemme: LuemmeClient): PdfViewer {
  const container = createPdfViewerContainer()
  if (!(container instanceof HTMLElement)) throw new Error('expected component to return HTML element')

  const eventBus = new pdfjsViewer.EventBus();

  const pdfLinkService = new pdfjsViewer.PDFLinkService({
    eventBus,
  });

  const pdfFindController = new pdfjsViewer.PDFFindController({
    eventBus,
    linkService: pdfLinkService,
  });

  const pdfViewer = new pdfjsViewer.PDFViewer({
    container,
    eventBus,
    linkService: pdfLinkService,
    findController: pdfFindController,
  });

  pdfLinkService.setViewer(pdfViewer);

  eventBus.on("pagesinit", function () {
    // We can use pdfViewer now, e.g. let's change default scale.
    // pdfViewer.currentScaleValue = "page-width";
    //   pdfFindController.executeCommand("find", { query: 'and' });
    const viewer = document.getElementById('viewer')
    if (viewer instanceof HTMLElement) {
      const extraScroll = window.innerHeight - 100;
      viewer.style.paddingBottom = `${extraScroll < 0 ? 0 : extraScroll}px`;
    }
  });

  const documentState = new BehaviorSubject<State>('initial');
  let isLoaded = false;

  async function load(url: string) {
    console.log('load', url)
    // TODO: clean up if already loaded
    isLoaded = false;
    documentState.next('loading')
    // luemme.sendReadingRoomText(url);
    luemme.sendLoadingStatus({url, percent: 0})
    // send event
    const task = pdfjs.getDocument(url)
    task.onProgress = (data: any) => {
      if (!data.total) return;
      luemme.sendLoadingStatus({url, percent: (data.loaded / data.total) * 100});
    }
    const pdfDocument = await task.promise
    isLoaded = true;
    documentState.next('loaded')
    pdfViewer.setDocument(pdfDocument);
    pdfLinkService.setDocument(pdfDocument, null);
    luemme.sendLoadedStatus({url});
  }

  luemme.readingRoomText.subscribe(data => load(data.url));
  luemme.readingRoomInitialState.pipe(first()).subscribe((roomState) => {
    console.log('initial state', roomState)
    if (roomState.url) {
      load(roomState.url)
    }
  })

  const zoomIn = (ticks: number) => {
    let newScale = pdfViewer.currentScale;
    do {
      newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.ceil(newScale * 10) / 10;
      newScale = Math.min(MAX_SCALE, newScale);
    } while (--ticks > 0 && newScale < MAX_SCALE);
    pdfViewer.currentScaleValue = newScale;
  }

  const zoomOut = (ticks: number) => {
    let newScale = pdfViewer.currentScale;
    do {
      newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
      newScale = Math.floor(newScale * 10) / 10;
      newScale = Math.max(MIN_SCALE, newScale);
    } while (--ticks > 0 && newScale > MIN_SCALE);
    pdfViewer.currentScaleValue = newScale;
  }

  const controls = createPdfViewControls({zoomOut: () => zoomOut(1), zoomIn: () => zoomIn(1)})
  if (controls instanceof HTMLElement) container.appendChild(controls)

  documentState.pipe(distinctUntilChanged(),
    filter(v => v === 'loaded')
  ).subscribe((v) => {
    console.log('loaded do something', v)
  })

  Inactive.mount(root, container)
  return {
    load: (url: string) => {
      luemme.sendReadingRoomText(url)
      return load(url)
    },
    state: documentState,
    container
  }
}
