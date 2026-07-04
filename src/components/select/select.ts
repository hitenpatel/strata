import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
      color: var(--strata-text, #0f172a);
    }
    .control {
      position: relative;
      display: flex;
      align-items: center;
    }
    select {
      appearance: none;
      -webkit-appearance: none;
      height: 40px;
      width: 100%;
      padding: 0 36px 0 var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-md, 10px);
      border: 1px solid var(--strata-border-strong, #cbd5e1);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #0f172a);
      font-size: 14px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
      transition:
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease);
    }
    select:focus-visible {
      border-color: var(--strata-accent, #2563eb);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--strata-focus-ring, #2563eb) 30%, transparent);
    }
    select:disabled {
      border-color: var(--strata-border, #e2e8f0);
      background: var(--strata-surface-sunken, #f1f5f9);
      color: var(--strata-text-subtle, #94a3b8);
      cursor: not-allowed;
    }
    :host([data-invalid]) select:not(:disabled) {
      border-color: var(--strata-danger, #dc2626);
      background: var(--strata-danger-subtle, #fef2f2);
    }
    .chevron {
      position: absolute;
      right: var(--strata-space-3, 12px);
      color: var(--strata-text-subtle, #94a3b8);
      pointer-events: none;
    }
    .hint {
      font-size: 12px;
      color: var(--strata-text-muted, #475569);
    }
    .error {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--strata-danger, #dc2626);
    }
    @media (prefers-reduced-motion: reduce) {
      select {
        transition: none;
      }
    }
  `;

  private onChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.internals.setFormValue(this.value);
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
          >
            ${this.options.map(
              (opt) =>
                html`<option value=${opt.value} ?selected=${opt.value === this.value}>
                  ${opt.label}
                </option>`
            )}
          </select>
          <svg
            class="chevron"
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
