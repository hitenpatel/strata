import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

@customElement('strata-dialog')
export class StrataDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property() heading = '';

  @query('dialog') private dialogEl!: HTMLDialogElement;

  static styles = css`
    :host {
      display: contents;
    }
    dialog {
      /* Sediment's deepest stack: offset-3 solid shadow + two echoed
         under-edges (composed inside the shadow-lg token). */
      width: min(480px, calc(100vw - var(--strata-space-6, 32px)));
      box-sizing: border-box;
      margin: auto;
      padding: var(--strata-space-5, 24px);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #231f1a);
      border: var(--strata-border-width, 1.5px) solid
        var(--strata-border-strong, #d6cec1);
      border-radius: var(--strata-radius-xl, 12px);
      box-shadow: var(
        --strata-shadow-lg,
        6px 6px 0 0 #d6cec1,
        0 6px 0 -1px #d6cec1,
        0 11px 0 -3px #e7e1d8
      );
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    dialog[open] {
      animation: dialog-in var(--strata-duration-slow, 320ms)
        var(--strata-easing-settle, ease);
    }
    dialog::backdrop {
      /* Flat scrim — no blur, ever. */
      background: var(--strata-scrim, rgba(21, 18, 14, 0.5));
      backdrop-filter: none;
      animation: overlay-in var(--strata-duration-slow, 320ms)
        var(--strata-easing-default, ease);
    }
    h2 {
      margin: 0 0 var(--strata-space-2, 8px);
      font-family: var(--strata-font-display, 'Satoshi', system-ui, sans-serif);
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--strata-text, #231f1a);
    }
    .body {
      font-size: 14px;
      line-height: 1.6;
      color: var(--strata-text-muted, #6a6153);
    }
    footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--strata-space-3, 12px);
      margin-top: var(--strata-space-5, 24px);
    }
    /* Panel slides up 14px, overshoots 3px, settles. */
    @keyframes dialog-in {
      0% {
        opacity: 0;
        transform: translateY(14px);
      }
      70% {
        transform: translateY(-3px);
      }
      100% {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes overlay-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      /* Fade only — no movement. */
      dialog[open] {
        animation: overlay-in var(--strata-duration-base, 200ms) ease;
      }
      dialog::backdrop {
        animation: none;
      }
    }
  `;

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('open')) {
      if (this.open && !this.dialogEl.open) {
        this.dialogEl.showModal();
      } else if (!this.open && this.dialogEl.open) {
        this.dialogEl.close();
      }
    }
  }

  private handleNativeClose = (): void => {
    this.open = false;
    this.dispatchEvent(new Event('close', { bubbles: true, composed: true }));
  };

  render() {
    return html`
      <dialog aria-labelledby="heading" @close=${this.handleNativeClose}>
        <h2 id="heading">${this.heading}</h2>
        <div class="body"><slot></slot></div>
        <footer><slot name="footer"></slot></footer>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-dialog': StrataDialog;
  }
}
