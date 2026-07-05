import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('strata-checkbox')
export class StrataCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property() name = '';
  @property() value = 'on';

  @query('input') private input!: HTMLInputElement;

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
    /* Sediment: a small raised slab that stamps down onto its shadow when checked */
    .box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      flex: none;
      border-radius: var(--strata-radius-sm, 4px);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      background: var(--strata-surface, #fff);
      color: var(--strata-on-accent, #fff);
      box-sizing: border-box;
      box-shadow: 2px 2px 0 0 var(--strata-layer-shadow, #d6cec1);
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        transform var(--strata-duration-press, 90ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-press, 90ms) var(--strata-easing-drop, ease);
    }
    :host([checked]) .box,
    :host([indeterminate]) .box {
      border-color: var(--strata-layer-shadow-accent, #1d4ed8);
      background: var(--strata-accent, #2563eb);
      transform: translate(var(--strata-offset-1, 2px), var(--strata-offset-1, 2px));
      box-shadow: 0 0 0 0 transparent;
    }
    :host([disabled]) .box {
      border-color: var(--strata-border, #e7e1d8);
      background: var(--strata-surface-sunken, #f3efe9);
      color: var(--strata-text-subtle, #8c8271);
      opacity: 0.6;
      box-shadow: none;
      transform: none;
    }
    input:focus-visible + .box {
      box-shadow:
        2px 2px 0 0 var(--strata-layer-shadow, #d6cec1),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    :host([checked]) input:focus-visible + .box,
    :host([indeterminate]) input:focus-visible + .box {
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    .check,
    .dash {
      display: none;
    }
    /* Check stamps in: 1.15 -> 1 settle */
    :host([checked]:not([indeterminate])) .check {
      display: block;
      animation: stamp 180ms var(--strata-easing-settle, cubic-bezier(0.22, 1.2, 0.36, 1));
    }
    :host([indeterminate]) .dash {
      display: block;
      width: 9px;
      height: 2.5px;
      background: currentColor;
      border-radius: 2px;
      animation: stamp 180ms var(--strata-easing-settle, cubic-bezier(0.22, 1.2, 0.36, 1));
    }
    @keyframes stamp {
      from {
        transform: scale(1.15);
      }
      to {
        transform: scale(1);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .box {
        transition: none;
      }
      :host([checked]) .box,
      :host([indeterminate]) .box {
        transform: none;
      }
      .check,
      .dash {
        animation: none;
      }
    }
  `;

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('indeterminate')) {
      this.input.indeterminate = this.indeterminate;
    }
  }

  private onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <label>
        <input
          type="checkbox"
          name=${this.name}
          value=${this.value}
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span class="box" aria-hidden="true">
          <svg
            class="check"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="dash"></span>
        </span>
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-checkbox': StrataCheckbox;
  }
}
