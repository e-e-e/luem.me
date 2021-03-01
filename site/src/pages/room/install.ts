import {installLuemmeClient} from "./luemmeClient";
import {installReaderProfiles} from "./readerProfiles";
import {installViewportSync} from "./viewport";
import {installCursorSync} from "./cursor";
import {installPdfViewer} from "./pdfViewer/install";
import {installControls} from "./controls";

export async function installRoom(room: string) {
  const client = installLuemmeClient();
  const pdfViewer = installPdfViewer(document.body, client)
  const users = installReaderProfiles(client, room)
  installViewportSync(pdfViewer, client)
  installCursorSync(pdfViewer.container, client)
  installControls(pdfViewer);
  const url = 'https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf'
  // await load(text);
}
