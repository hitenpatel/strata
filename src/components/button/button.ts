import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@customElement('strata-button')
export class StrataButton extends LitElement {
  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  static styles = css`
    :host {
      display: inline-block;
      /* Sediment slab: --_ink is the solid layer shadow, --_edge the slab border */
      --_bg: var(--strata-accent, #2563eb);
      --_bg-hover: var(--strata-accent-hover, #1d4ed8);
      --_fg: var(--strata-on-accent, #fff);
      --_edge: var(--strata-layer-shadow-accent, #1d4ed8);
      --_ink: var(--strata-layer-shadow-accent, #1d4ed8);
    }
    :host([hidden]) {
      display: none;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--strata-space-2, 8px);
      height: 40px;
      padding: 0 18px;
      border-radius: var(--strata-radius-md, 6px);
      border: var(--strata-border-width, 1.5px) solid var(--_edge);
      background: var(--_bg);
      color: var(--_fg);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: var(--_shadow-rest, 2px 2px 0 0 var(--_ink));
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        box-shadow 180ms var(--strata-easing-settle, ease),
        transform 180ms var(--strata-easing-settle, ease);
    }
    button:hover:not(:disabled) {
      background: var(--_bg-hover);
      transform: translate(var(--_lift, -1px), var(--_lift, -1px));
      box-shadow: var(--_shadow-hover, 3px 3px 0 0 var(--_ink));
    }
    button:focus-visible {
      outline: none;
      box-shadow:
        var(--_shadow-rest, 2px 2px 0 0 var(--_ink)),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    /* Press = the slab drops onto its shadow */
    button:active:not(:disabled) {
      transition:
        transform var(--strata-duration-press, 90ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-press, 90ms) var(--strata-easing-drop, ease);
      transform: translate(var(--strata-offset-1, 2px), var(--strata-offset-1, 2px));
      box-shadow: 0 0 0 0 transparent;
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      border-color: transparent;
      box-shadow: none;
      transform: none;
    }
    /* Loading keeps the slab dropped, full colour */
    :host([loading]) button:disabled {
      opacity: 1;
      cursor: progress;
      border-color: var(--_edge);
      background: var(--_bg-hover);
      transform: translate(var(--strata-offset-1, 2px), var(--strata-offset-1, 2px));
    }

    :host([variant='secondary']) {
      --_bg: var(--strata-surface, #fff);
      --_bg-hover: var(--strata-surface-hover, #faf8f5);
      --_fg: var(--strata-text, #231f1a);
      --_edge: var(--strata-border-strong, #d6cec1);
      --_ink: var(--strata-layer-shadow, #d6cec1);
    }

    :host([variant='ghost']) {
      --_bg: transparent;
      --_bg-hover: var(--strata-surface, #fff);
      --_fg: var(--strata-text-muted, #6a6153);
      --_edge: transparent;
      --_ink: transparent;
      --_lift: 0px;
      --_shadow-rest: 0 0 0 0 transparent;
      --_shadow-hover: 2px 2px 0 0 var(--strata-layer-shadow, #d6cec1);
    }
    :host([variant='ghost']) button:hover:not(:disabled) {
      border-color: var(--strata-border-strong, #d6cec1);
      color: var(--strata-text, #231f1a);
    }

    :host([variant='danger']) {
      --_bg: var(--strata-danger, #dc2626);
      --_bg-hover: var(--strata-danger-hover, #b91c1c);
      --_fg: var(--strata-on-danger, #fff);
      --_edge: var(--strata-layer-shadow-danger, #b91c1c);
      --_ink: var(--strata-layer-shadow-danger, #b91c1c);
    }

    .spinner {
      width: 14px;
      height: 14px;
      flex: none;
      border-radius: var(--strata-radius-full, 999px);
      border: 2px solid currentColor;
      border-right-color: transparent;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:hover:not(:disabled),
      button:active:not(:disabled),
      :host([loading]) button:disabled {
        transform: none;
      }
      .spinner {
        animation: none;
        opacity: 0.6;
      }
    }
  `;

  render() {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : nothing}
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-button': StrataButton;
  }
}
