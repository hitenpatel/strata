import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('strata-radio')
export class StrataRadio extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() name = '';
  @property() value = '';

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: var(--strata-space-2, 8px);
      min-height: 40px;
      font-size: 14px;
      color: var(--strata-text, #231f1a);
      cursor: pointer;
      user-select: none;
    }
    :host([disabled]) label {
      cursor: not-allowed;
      color: var(--strata-text-subtle, #8c8271);
    }
    input {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: 0;
      opacity: 0;
      pointer-events: none;
    }
    /* Sediment: raised empty slab that stamps down when selected; dot drops in with settle */
    .circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      background: var(--strata-surface, #fff);
      box-sizing: border-box;
      box-shadow: 2px 2px 0 0 var(--strata-layer-shadow, #d6cec1);
      transition:
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        transform var(--strata-duration-press, 90ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-press, 90ms) var(--strata-easing-drop, ease);
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-accent, #2563eb);
      transform: scale(0);
      transition: transform 180ms var(--strata-easing-settle, cubic-bezier(0.22, 1.2, 0.36, 1));
    }
    :host([checked]) .circle {
      border-color: var(--strata-accent, #2563eb);
      transform: translate(var(--strata-offset-1, 2px), var(--strata-offset-1, 2px));
      box-shadow: 0 0 0 0 transparent;
    }
    :host([checked]) .dot {
      transform: scale(1);
    }
    :host([disabled]) .circle {
      border-color: var(--strata-border, #e7e1d8);
      background: var(--strata-surface-sunken, #f3efe9);
      opacity: 0.6;
      box-shadow: none;
      transform: none;
    }
    :host([disabled]) .dot {
      background: var(--strata-text-subtle, #8c8271);
    }
    input:focus-visible + .circle {
      box-shadow:
        2px 2px 0 0 var(--strata-layer-shadow, #d6cec1),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    :host([checked]) input:focus-visible + .circle {
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    @media (prefers-reduced-motion: reduce) {
      .circle,
      .dot {
        transition: none;
      }
      :host([checked]) .circle {
        transform: none;
      }
    }
  `;

  private onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.checked && !this.checked) {
      this.checked = true;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  render() {
    return html`
      <label>
        <input
          type="radio"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span class="circle" aria-hidden="true"><span class="dot"></span></span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-radio': StrataRadio;
  }
}
