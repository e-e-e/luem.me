import Inactive from "inactive";
import text from "../../docs/text.pdf";
import {installLuemmeClient} from "./luemmeClient";
import {installReaderProfiles} from "./readerProfiles";
import {installViewportSync} from "./viewport";
import {installCursorSync} from "./cursor";
import {installPdfViewer} from "./pdfViewer/install";
import {createTextSelector} from "./select";

export async function installRoom(room: string) {
  const client = installLuemmeClient();
  const pdfViewer = installPdfViewer(document.body, client)
  const users = installReaderProfiles(client, room)
  installViewportSync(pdfViewer, client)
  installCursorSync(pdfViewer.container, client)
  const selector = createTextSelector((url) => {
    pdfViewer.load('/content/' + encodeURIComponent(url))
  });
  Inactive.mount(document.body, selector)
  const url = 'https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf'
  // await load(text);
}
