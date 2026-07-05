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
      /* Flat treatment (secondary default): bordered square, no layer at rest */
      --_bg: var(--strata-surface, #fff);
      --_bg-hover: var(--strata-surface-hover, #faf8f5);
      --_fg: var(--strata-text-muted, #6a6153);
      --_fg-hover: var(--strata-text, #231f1a);
      --_edge: var(--strata-border-strong, #d6cec1);
      --_ink: transparent;
      --_bw: 1px;
      --_lift: 0px;
      --_shadow-rest: 0 0 0 0 transparent;
      --_shadow-hover: 0 0 0 0 transparent;
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
      border: var(--_bw) solid var(--_edge);
      background: var(--_bg);
      color: var(--_fg);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      cursor: pointer;
      box-shadow: var(--_shadow-rest);
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        border-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        box-shadow 180ms var(--strata-easing-settle, ease),
        transform 180ms var(--strata-easing-settle, ease);
    }
    button:hover:not(:disabled) {
      background: var(--_bg-hover);
      color: var(--_fg-hover);
      transform: translate(var(--_lift), var(--_lift));
      box-shadow: var(--_shadow-hover);
    }
    button:focus-visible {
      outline: none;
      box-shadow:
        var(--_shadow-rest),
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
      opacity: 0.42;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    ::slotted(svg) {
      width: 18px;
      height: 18px;
      flex: none;
    }

    :host([variant='ghost']) {
      --_bg: transparent;
      --_edge: transparent;
    }

    /* Accent-ish variants get the full slab treatment */
    :host([variant='primary']) {
      --_bg: var(--strata-accent, #2563eb);
      --_bg-hover: var(--strata-accent-hover, #1d4ed8);
      --_fg: var(--strata-on-accent, #fff);
      --_fg-hover: var(--strata-on-accent, #fff);
      --_edge: var(--strata-layer-shadow-accent, #1d4ed8);
      --_ink: var(--strata-layer-shadow-accent, #1d4ed8);
      --_bw: var(--strata-border-width, 1.5px);
      --_lift: -1px;
      --_shadow-rest: 2px 2px 0 0 var(--_ink);
      --_shadow-hover: 3px 3px 0 0 var(--_ink);
    }

    :host([variant='danger']) {
      --_bg: var(--strata-danger, #dc2626);
      --_bg-hover: var(--strata-danger-hover, #b91c1c);
      --_fg: var(--strata-on-danger, #fff);
      --_fg-hover: var(--strata-on-danger, #fff);
      --_edge: var(--strata-layer-shadow-danger, #b91c1c);
      --_ink: var(--strata-layer-shadow-danger, #b91c1c);
      --_bw: var(--strata-border-width, 1.5px);
      --_lift: -1px;
      --_shadow-rest: 2px 2px 0 0 var(--_ink);
      --_shadow-hover: 3px 3px 0 0 var(--_ink);
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
      button:hover:not(:disabled),
      button:active:not(:disabled) {
        transform: none;
      }
    }
  `;

  render() {
    return html`
      <button type=${this.type} ?disabled=${this.disabled} aria-label=${this.label}>
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
