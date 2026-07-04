import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type TooltipPlacement = 'top' | 'bottom';

let nextTooltipId = 0;

@customElement('strata-tooltip')
export class StrataTooltip extends LitElement {
  @property() text = '';
  @property({ reflect: true }) placement: TooltipPlacement = 'top';

  @state() private open = false;

  private descId = `strata-tooltip-desc-${++nextTooltipId}`;
  private descEl?: HTMLSpanElement;

  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    .tip {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(100% + 10px);
      z-index: 10;
      white-space: nowrap;
      padding: 6px 10px;
      border-radius: var(--strata-radius-sm, 6px);
      background: var(--strata-text, #0f172a);
      color: var(--strata-surface, #fff);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 12.5px;
      font-weight: 500;
      line-height: 1.4;
      box-shadow: var(--strata-shadow-md, 0 4px 12px rgba(15, 23, 42, 0.1));
      opacity: 0;
      visibility: hidden;
      transition:
        opacity var(--strata-duration-fast, 120ms)
          var(--strata-easing-default, ease),
        visibility var(--strata-duration-fast, 120ms);
    }
    .tip.open {
      opacity: 1;
      visibility: visible;
    }
    .arrow {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
    }
    :host([placement='top']) .arrow {
      top: 100%;
      border-top-color: var(--strata-text, #0f172a);
    }
    :host([placement='bottom']) .tip {
      bottom: auto;
      top: calc(100% + 10px);
    }
    :host([placement='bottom']) .arrow {
      top: auto;
      bottom: 100%;
      border-bottom-color: var(--strata-text, #0f172a);
    }
    @media (prefers-reduced-motion: reduce) {
      .tip {
        transition: none;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.show);
    this.addEventListener('mouseleave', this.hide);
    this.addEventListener('focusin', this.show);
    this.addEventListener('focusout', this.hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.show);
    this.removeEventListener('mouseleave', this.hide);
    this.removeEventListener('focusin', this.show);
    this.removeEventListener('focusout', this.hide);
    document.removeEventListener('keydown', this.onKeydown);
  }

  private show = () => {
    if (this.open) return;
    this.open = true;
    document.addEventListener('keydown', this.onKeydown);
  };

  private hide = () => {
    if (!this.open) return;
    this.open = false;
    document.removeEventListener('keydown', this.onKeydown);
  };

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.hide();
  };

  protected firstUpdated() {
    // The tooltip bubble lives in shadow DOM, so aria-describedby on the
    // slotted (light DOM) trigger cannot reference it. A hidden light-DOM
    // span carries the description text instead.
    this.descEl = document.createElement('span');
    this.descEl.id = this.descId;
    this.descEl.hidden = true;
    this.descEl.textContent = this.text;
    this.appendChild(this.descEl);
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('text') && this.descEl) {
      this.descEl.textContent = this.text;
    }
  }

  private onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    for (const el of slot.assignedElements()) {
      if (el.id !== this.descId) {
        el.setAttribute('aria-describedby', this.descId);
      }
    }
  }

  render() {
    return html`
      <slot @slotchange=${this.onSlotChange}></slot>
      <div class="tip ${this.open ? 'open' : ''}" role="tooltip">
        ${this.text}
        <span class="arrow"></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-tooltip': StrataTooltip;
  }
}
