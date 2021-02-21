import {installLuemmeSocket} from "./luemmeSocket";
import {installPdfViewer} from "./pdfViewer";
import {installViewportSync} from "./viewport";
import {installCursorSync} from "./cursor";
import text from './docs/text.pdf'
import {installReaderProfiles} from "./readerProfiles";

async function start() {
  const socket = installLuemmeSocket();
  const { load, container } = installPdfViewer(document.body, socket)
  const users = installReaderProfiles(socket, 'someroom')
  installViewportSync(container, socket)
  installCursorSync(container, socket)

  const url = 'https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf'
  await load(text);
}

window.onload = start;
