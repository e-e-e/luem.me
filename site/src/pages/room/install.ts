import { installLuemmeClient } from './luemmeClient';
import { installReaderProfiles } from './profiles/install';
import { installViewportSync } from './viewport';
import { installCursorSync } from './cursor/install';
import { installPdfViewer } from './pdfViewer/install';
import { installControls } from './controls';
import { installSelection } from './selection/install';

export async function installRoom(room: string) {
  const client = installLuemmeClient();
  const pdfViewer = installPdfViewer(document.body, client);
  const profiles = installReaderProfiles(client, room);
  installViewportSync(pdfViewer, client);
  installCursorSync(pdfViewer.container, client, profiles);
  installControls(pdfViewer);
  console.log('install');
  installSelection(pdfViewer.container, client);
  // const url = 'https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf'
  // await pdfViewer.load(url);
}
