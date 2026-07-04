import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StrataRadio } from './radio.js';

@customElement('strata-radio-group')
export class StrataRadioGroup extends LitElement {
  @property() label = '';
  @property() value = '';

  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    :host([hidden]) {
      display: none;
    }
    .legend {
      font-size: 13px;
      font-weight: 500;
      color: var(--strata-text, #0f172a);
      margin-bottom: var(--strata-space-1, 4px);
    }
    .radios {
      display: flex;
      flex-direction: column;
    }
  `;

  private get radios(): StrataRadio[] {
    return [...this.querySelectorAll<StrataRadio>('strata-radio')];
  }

  protected firstUpdated() {
    if (this.value) {
      this.syncFromValue();
    } else {
      const checked = this.radios.find((r) => r.checked);
      if (checked) this.value = checked.value;
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.syncFromValue();
    }
  }

  private syncFromValue() {
    for (const radio of this.radios) {
      radio.checked = radio.value === this.value;
    }
  }

  private onChange(e: Event) {
    const target = e.target as HTMLElement;
    if (!(target instanceof StrataRadio)) return;
    e.stopPropagation();
    this.value = target.value;
    for (const radio of this.radios) {
      if (radio !== target) radio.checked = false;
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private onKeyDown(e: KeyboardEvent) {
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const backward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!forward && !backward) return;
    e.preventDefault();
    const enabled = this.radios.filter((r) => !r.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((r) => r.checked);
    const step = forward ? 1 : -1;
    const next = enabled[(current + step + enabled.length) % enabled.length];
    if (!next || next.checked) return;
    this.value = next.value;
    for (const radio of this.radios) {
      radio.checked = radio === next;
    }
    next.focus();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      ${this.label ? html`<div class="legend" id="legend">${this.label}</div>` : nothing}
      <div
        class="radios"
        role="radiogroup"
        aria-labelledby=${this.label ? 'legend' : nothing}
        @change=${this.onChange}
        @keydown=${this.onKeyDown}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-radio-group': StrataRadioGroup;
  }
}
