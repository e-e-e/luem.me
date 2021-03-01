import Inactive from "inactive";
import {PdfViewer} from "./pdfViewer/install";
import {filter, first} from "rxjs/operators";

export function createTextSelector(load: (url: string) => void) {
  const ref = Inactive.createRef<HTMLInputElement>()
  const onSubmit = (e: Event) => {
    e.preventDefault()
    if (!ref.current) return
    load(ref.current.value)
  }
  return (
    <div id="reader-controls">
      <form onSubmit={onSubmit}>
        <p>
          Enter a URL to a pdf on the web that you wish to read.
        </p>
        <p>
          <input
            required
            name="url"
            type="url"
            placeholder="Choose a pdf online to load."
            autocomplete="off"
            ref={ref}
          />
        </p>
        <p className="align-right">
          <button type="submit">Read</button>
        </p>
      </form>
    </div>
  )
}

export function installControls(pdfViewer: PdfViewer) {
  const load = (url: string) => pdfViewer.load('/content/' + encodeURIComponent(url))
  const textSelector = createTextSelector(load)

  Inactive.mount(document.body, textSelector);
  const unmount = () => {
    textSelector && document.body.removeChild(textSelector);
  }
  pdfViewer.state
    .pipe(
      filter(v => v === 'loaded' || v === 'loading'),
      first()
    )
    .subscribe(unmount)
}
