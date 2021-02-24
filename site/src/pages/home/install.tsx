import Inactive from "inactive";

export function installHomePage() {
  const ref = Inactive.createRef<HTMLInputElement>()
  const submit = () => {
    if (!ref.current) return
    const value = ref.current.value
    if (value && !ref.current.validity.patternMismatch) {
      window.location.href = `/${value}`
      // history.push(`/${value}`)
    } else {
      ref.current.setCustomValidity('Room name must only contain letters and underscores.')
      ref.current.reportValidity()
      ref.current.setCustomValidity('')
    }
  }
  return Inactive.mount(document.body, (
    <main id='homepage'>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Room name: <input ref={ref} pattern="\w+" required/></label>
        <button onClick={submit}>Enter</button>
      </form>
    </main>
  ))
}
