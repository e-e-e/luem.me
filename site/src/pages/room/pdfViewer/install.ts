import Inactive from "inactive";
import { LuemmeClient } from "../luemmeClient";
import {createPdfViewControls, createPdfViewerContainer} from "./Viewer";

import * as pdfjs from "pdfjs-dist"
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';

import 'pdfjs-dist/build/pdf.worker.entry';
import 'pdfjs-dist/web/pdf_viewer.css';

const DEFAULT_SCALE_DELTA = 1.1
const MAX_SCALE = 4
const MIN_SCALE = 0.2

export function installPdfViewer(root: HTMLElement, luemme: LuemmeClient) {
  const container = createPdfViewerContainer()
  if(!(container instanceof HTMLElement)) throw new Error('expected component to return HTML element')

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
      viewer.style.paddingBottom = `${extraScroll < 0 ? 0 : extraScroll }px`;
    }
  });

  let isLoaded = false;

  async function load(url: string) {
    console.log('load', url)
    // TODO: clean up if already loaded
    isLoaded = false;
    luemme.sendLoadingStatus({ url, percent: 0 })
    // send event
    const task = pdfjs.getDocument(url)
    task.onProgress = (data: any) => {
      if (!data.total) return;
      luemme.sendLoadingStatus({ url, percent: (data.loaded / data.total) * 100 });
    }
    const pdfDocument = await task.promise
    isLoaded = true;
    pdfViewer.setDocument(pdfDocument);
    pdfLinkService.setDocument(pdfDocument, null);
    luemme.sendLoadedStatus({ url });
  }

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

  const controls = createPdfViewControls({ zoomOut: () => zoomOut(1), zoomIn: () => zoomIn(1) })
  if (controls instanceof HTMLElement) container.appendChild(controls)

  Inactive.mount(root, container)
  return {
    load,
    container,
  }
}
