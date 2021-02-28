import Inactive from "inactive";

export function createTextSelector(load: (url: string) => void) {
  const ref = Inactive.createRef<HTMLInputElement>()
  const onSubmit = (e: Event) => {
    console.log('submit')
    e.preventDefault()
    if (!ref.current) return
    load(ref.current.value)
  }
  return (
    <div style={{ position: 'absolute', zIndex: 999999}}>
      <form onSubmit={onSubmit}>
        <label>Link <input required type="url" ref={ref} value="https://arena-attachments.s3.amazonaws.com/8434432/a9441e82740552c905c92fcdb2fca3ee.pdf"/></label>
        <button type="submit">Load</button>
      </form>
    </div>
  )
}
