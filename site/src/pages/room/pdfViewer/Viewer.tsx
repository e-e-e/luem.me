import Inactive from "inactive";


export function createPdfViewControls({ zoomOut, zoomIn }: { zoomIn: () => void, zoomOut: () => void}) {
  return (
    <div id="scale-controls">
      <button onClick={zoomOut}>-</button>
      <button onClick={zoomIn}>+</button>
    </div>
  )
}

export function createPdfViewerContainer() {
  return (
    <div id="viewerContainer">
      <div id="viewer" className="pdfViewer"/>
    </div>
  )
}
