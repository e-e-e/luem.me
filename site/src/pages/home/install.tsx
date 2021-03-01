import Inactive from "inactive";

export function installHomePage() {
  const ref = Inactive.createRef<HTMLInputElement>()
  const submit = () => {
    if (!ref.current) return
    const value = ref.current.value
    if (value && !ref.current.validity.patternMismatch) {
      window.location.href = `/${value}`
    } else {
      ref.current.setCustomValidity('Room name must only contain letters and underscores.')
      ref.current.reportValidity()
    }
  }
  const onInput = () => {
    if (!ref.current) return
    if (!ref.current.validity.patternMismatch) {
      ref.current.setCustomValidity('')
    }
  }
  return Inactive.mount(document.body, (
    <main id='homepage'>
      <div>
        <h1>Luemme: We read</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <p>
            <label htmlFor="room-name">Room name:</label>
            <input name="room-name" onInput={onInput} placeholder="enter room name" ref={ref} pattern="\w+" required autocomplete="off" />
          </p>
          <p className="align-right">
          <button onClick={submit}>Enter</button>
          </p>
        </form>
      </div>
    </main>
  ))
}
