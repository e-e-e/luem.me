import text from "../../docs/text.pdf";
import {installLuemmeSocket} from "./luemmeSocket";
import {installReaderProfiles} from "./readerProfiles";
import {installViewportSync} from "./viewport";
import {installCursorSync} from "./cursor";
import {installPdfViewer} from "./pdfViewer/install";

export async function installRoom(room: string) {
  const socket = installLuemmeSocket();
  const { load, container } = installPdfViewer(document.body, socket)
  const users = installReaderProfiles(socket, room)
  installViewportSync(container, socket)
  installCursorSync(container, socket)
  const url = 'https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf'
  await load(text);
}
