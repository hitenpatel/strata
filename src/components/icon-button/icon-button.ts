import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@customElement('strata-icon-button')
export class StrataIconButton extends LitElement {
  @property({ reflect: true }) variant: IconButtonVariant = 'secondary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = '';
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  static styles = css`
    :host {
      display: inline-block;
      --_bg: var(--strata-surface, #fff);
      --_bg-hover: var(--strata-surface-hover, #f4f4f5);
      --_fg: var(--strata-text, #09090b);
      --_border: var(--strata-border, #e4e4e7);
    }
    :host([hidden]) {
      display: none;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: var(--strata-radius-md, 6px);
      border: var(--strata-border-width, 1px) solid var(--_border);
      background: var(--_bg);
      color: var(--_fg);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      cursor: pointer;
      box-shadow: var(--strata-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
      transition:
        background-color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease),
        border-color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease),
        color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease);
    }
    button:hover:not(:disabled) {
      background: var(--_bg-hover);
    }
    button:focus-visible {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    ::slotted(svg) {
      width: 18px;
      height: 18px;
      flex: none;
    }

    :host([variant='primary']) {
      --_bg: var(--strata-accent, #2563eb);
      --_bg-hover: var(--strata-accent-hover, #1d4ed8);
      --_fg: var(--strata-on-accent, #fff);
      --_border: transparent;
    }

    :host([variant='ghost']) {
      --_bg: transparent;
      --_bg-hover: var(--strata-surface-hover, #f4f4f5);
      --_fg: var(--strata-text, #09090b);
      --_border: transparent;
    }
    :host([variant='ghost']) button {
      box-shadow: none;
    }

    :host([variant='danger']) {
      --_bg: var(--strata-danger, #dc2626);
      --_bg-hover: var(--strata-danger-hover, #b91c1c);
      --_fg: var(--strata-on-danger, #fff);
      --_border: transparent;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  render() {
    return html`
      <button part="button" type=${this.type} ?disabled=${this.disabled} aria-label=${this.label}>
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-icon-button': StrataIconButton;
  }
}
