class Cursor extends HTMLElement {
  private element: HTMLElement

  constructor() {
    super();
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host {
          --gradient-start-color: hsla(317, 100%, 50%, 1); 
          --gradient-end-color: hsla(317, 100%, 50%, 0); 
        }
        
        #cursor {
            pointer-events: none;
            position: absolute;
            width: 44px;
            height: 44px;
            transform: translate(-50%, -50%) scale(1);
            background: radial-gradient(circle, var(--gradient-start-color) 5%, var(--gradient-end-color) 70%);
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
    return ['pressed', 'color'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    switch (name) {
      case 'color': {
        if (newValue) {
          console.log('newValue', newValue)
          const match = newValue.match(/hsl\((.*)\)/)
          if (!match) {
            // todo handle other color types
            return;
          }
          this.style.setProperty('--gradient-start-color', `hsla(${match[1]}, 1)`)
          this.style.setProperty('--gradient-end-color', `hsla(${match[1]}, 0)`)
        } else {
          this.style.removeProperty('--gradient-start-color')
          this.style.removeProperty('--gradient-end-color',)
        }
        return
      }
      case 'pressed': {
        newValue === null ? this.element.classList.remove('pressed') : this.element.classList.add('pressed')
        return
      }
    }
  }

  get elementStyle() {
    return this.element.style
  }

  get color(): string | null {
    return this.getAttribute('color')
  }

  set color(value: string | null) {
    if (!value) {
      this.removeAttribute('color');
    } else {
      this.setAttribute('color', value);
    }
  }

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
