
class Cursor extends HTMLElement {
  private element: HTMLElement

  constructor() {
    super();
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        #cursor {
            cursor: none;
            pointer-events: none;
            position: absolute;
            width: 44px;
            height: 44px;
            transform: translate(-50%, -50%) scale(1);
            background: radial-gradient(circle, rgba(255,0,183, 1) 5%, rgba(255,0,183,0) 70%);
            transition: transform 200ms ease-out, opacity 200ms ease-out;
            opacity: 0.5;
        }
        #cursor.pressed {
            transform: translate(-50%, -50%) scale(0.25);
            opacity: 1;
        }
      </style>
      <div id="cursor"/>
    `
    const shadow = this.attachShadow({mode: 'open'})
    shadow.appendChild(template.content.cloneNode(true));
    this.element = shadow.getElementById('cursor')!;
  }

  static get observedAttributes() {
    return ['pressed'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'pressed': {
        newValue === null ? this.element.classList.remove('pressed') : this.element.classList.add('pressed')
      }
    }
  }

  get style() { return this.element.style }

  get pressed(): boolean {
    return this.getAttribute('pressed') != null
  }

  set pressed(value: boolean) {
    if (!value) {
      this.removeAttribute('pressed');
    } else {
      this.setAttribute('pressed', '');
    }
  }
}


customElements.define('lue-cursor', Cursor)
