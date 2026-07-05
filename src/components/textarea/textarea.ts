import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

@customElement('strata-textarea')
export class StrataTextarea extends LitElement {
  static formAssociated = true;

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Number }) rows = 4;
  @property() error = '';
  @property() hint = '';
  @property() name = '';

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
    /* Sediment recessed bed: sunken fill + solid inset top edge from the layer above */
    textarea {
      min-height: 96px;
      padding: 10px var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-md, 6px);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      background: var(--strata-surface-sunken, #f3efe9);
      color: var(--strata-text, #231f1a);
      font-size: 14px;
      font-family: inherit;
      line-height: 1.5;
      outline: none;
      resize: vertical;
      width: 100%;
      box-sizing: border-box;
      box-shadow: inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1);
      transition:
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease);
    }
    textarea::placeholder {
      color: var(--strata-text-subtle, #8c8271);
    }
    /* Focus: border -> accent, 3px strata band reveals on the left, double-layer ring */
    textarea:focus-visible {
      border-color: var(--strata-accent, #2563eb);
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-accent, #2563eb),
        inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    textarea:disabled {
      border-color: var(--strata-border, #e7e1d8);
      background: var(--strata-surface-sunken, #f3efe9);
      color: var(--strata-text-subtle, #8c8271);
      cursor: not-allowed;
      opacity: 0.7;
      box-shadow: none;
    }
    :host([data-invalid]) textarea:not(:disabled) {
      border-color: var(--strata-danger, #dc2626);
      background: var(--strata-danger-subtle, #fdf0ee);
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-danger, #dc2626),
        inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1);
    }
    :host([data-invalid]) textarea:not(:disabled):focus-visible {
      border-color: var(--strata-danger, #dc2626);
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-danger, #dc2626),
        inset 0 2px 0 0 var(--strata-layer-edge-1, #d6cec1),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
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
      textarea {
        transition: none;
      }
    }
  `;

  private onInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this.internals.setFormValue(this.value);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  private onChange() {
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
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
        <textarea
          id="control"
          rows=${this.rows}
          .value=${live(this.value)}
          placeholder=${this.placeholder || nothing}
          name=${this.name || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : nothing}
          aria-describedby=${describedBy}
          @input=${this.onInput}
          @change=${this.onChange}
        ></textarea>
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
    'strata-textarea': StrataTextarea;
  }
}
