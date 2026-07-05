import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

export interface SelectOption {
  value: string;
  label: string;
}

@customElement('strata-select')
export class StrataSelect extends LitElement {
  static formAssociated = true;

  @property() label = '';
  @property({ type: Array }) options: SelectOption[] = [];
  @property() value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() error = '';
  @property() hint = '';
  @property() name = '';

  /* Presentational only: drives the chevron rotation while the native picker is up */
  @state() private pickerOpen = false;

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    label {
      font-size: 13px;
      font-weight: 500;
      color: var(--strata-text, #231f1a);
    }
    .control {
      position: relative;
      display: flex;
      align-items: center;
    }
    /* Sediment recessed bed: sunken fill + solid inset top edge from the layer above */
    select {
      appearance: none;
      -webkit-appearance: none;
      height: 40px;
      width: 100%;
      padding: 0 36px 0 var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-md, 6px);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      background: var(--strata-surface-sunken, #f3efe9);
      color: var(--strata-text, #231f1a);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
      box-shadow: inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1);
      transition:
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease);
    }
    /* Focus: border -> accent, 3px strata band reveals on the left, double-layer ring */
    select:focus-visible {
      border-color: var(--strata-accent, #2563eb);
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-accent, #2563eb),
        inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    select:disabled {
      border-color: var(--strata-border, #e7e1d8);
      background: var(--strata-surface-sunken, #f3efe9);
      color: var(--strata-text-subtle, #8c8271);
      cursor: not-allowed;
      opacity: 0.7;
      box-shadow: none;
    }
    :host([data-invalid]) select:not(:disabled) {
      border-color: var(--strata-danger, #dc2626);
      background: var(--strata-danger-subtle, #fdf0ee);
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-danger, #dc2626),
        inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1);
    }
    :host([data-invalid]) select:not(:disabled):focus-visible {
      border-color: var(--strata-danger, #dc2626);
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-danger, #dc2626),
        inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    /* Native listbox popup cannot be styled; the floating-slab treatment
       (var(--strata-shadow-md) + 1.5px border + radius-lg) lives in the menu
       component the design reuses for custom listboxes. */
    .chevron {
      position: absolute;
      right: var(--strata-space-3, 12px);
      color: var(--strata-text-subtle, #8c8271);
      pointer-events: none;
      transition: transform var(--strata-duration-base, 200ms)
        var(--strata-easing-settle, cubic-bezier(0.22, 1.2, 0.36, 1));
    }
    .chevron.open {
      transform: rotate(180deg);
      color: var(--strata-accent, #2563eb);
    }
    select:focus-visible ~ .chevron {
      color: var(--strata-accent, #2563eb);
    }
    .hint {
      font-size: 12px;
      color: var(--strata-text-muted, #6a6153);
    }
    .error {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--strata-danger, #dc2626);
    }
    @media (prefers-reduced-motion: reduce) {
      select,
      .chevron {
        transition: none;
      }
    }
  `;

  private onChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.internals.setFormValue(this.value);
    this.pickerOpen = false;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private onPointerDown() {
    if (!this.disabled) this.pickerOpen = !this.pickerOpen;
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Escape') {
      this.pickerOpen = false;
    } else if (e.key === ' ' || e.key === 'Enter' || (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp'))) {
      this.pickerOpen = true;
    }
  }

  private onBlur() {
    this.pickerOpen = false;
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.internals.setFormValue(this.value);
    }
    if (changed.has('error')) {
      this.toggleAttribute('data-invalid', !!this.error);
    }
  }

  private renderErrorIcon() {
    return html`<svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>`;
  }

  render() {
    const describedBy =
      [this.error ? 'error' : '', this.hint ? 'hint' : ''].filter(Boolean).join(' ') || nothing;
    return html`
      <div class="field">
        ${this.label ? html`<label for="control">${this.label}</label>` : nothing}
        <div class="control">
          <select
            id="control"
            name=${this.name || nothing}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-invalid=${this.error ? 'true' : nothing}
            aria-describedby=${describedBy}
            .value=${live(this.value)}
            @change=${this.onChange}
            @pointerdown=${this.onPointerDown}
            @keydown=${this.onKeyDown}
            @blur=${this.onBlur}
          >
            ${this.options.map(
              (opt) =>
                html`<option value=${opt.value} ?selected=${opt.value === this.value}>
                  ${opt.label}
                </option>`
            )}
          </select>
          <svg
            class="chevron ${this.pickerOpen ? 'open' : ''}"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        ${this.error
          ? html`<span class="error" id="error">${this.renderErrorIcon()}${this.error}</span>`
          : nothing}
        ${this.hint ? html`<span class="hint" id="hint">${this.hint}</span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-select': StrataSelect;
  }
}
