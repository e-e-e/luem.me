import * as pdfjs from "pdfjs-dist"
import 'pdfjs-dist/build/pdf.worker.entry';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import {LuemmeSocket} from "./websockets";

export function createPdfViewContainer() {
  const container = document.createElement('div')
  container.id = 'viewerContainer';
  const viewer = document.createElement('div')
  viewer.id = 'viewer'
  viewer.className = 'pdfViewer'
  container.appendChild(viewer);
  return container
}

export function installPdfViewer(root: HTMLElement, socket: LuemmeSocket) {
  const container = createPdfViewContainer()
  root.appendChild(container)

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
    // TODO: clean up if already loaded
    isLoaded = false;
    socket.loading(0)
    // send event
    const task = pdfjs.getDocument(url)
    task.onProgress = (data: any) => {
      if (!data.total) return;
      socket.loading((data.loaded / data.total) * 100);
    }
    const pdfDocument = await task.promise
    isLoaded = true;
    pdfViewer.setDocument(pdfDocument);
    pdfLinkService.setDocument(pdfDocument, null);
    socket.loaded(url);
  }

  return {
    load,
    container,
  }
}
