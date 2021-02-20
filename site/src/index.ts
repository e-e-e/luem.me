import {createWsClient} from "./websockets";
import {installPdfViewer} from "./pdfViewer";
import {installViewportSync} from "./viewport";
import {installCursorSync} from "./cursor";
import text from './docs/text.pdf'

async function start() {
  const socket = createWsClient('hello');
  const { load, container } = installPdfViewer(document.body, socket)
  installViewportSync( container, socket)
  installCursorSync(container, socket)
  const url = 'https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf'
  await load(text);
}

window.onload = start;
