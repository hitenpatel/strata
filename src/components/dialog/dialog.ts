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
      width: min(480px, calc(100vw - var(--strata-space-6, 32px)));
      box-sizing: border-box;
      margin: auto;
      padding: var(--strata-space-5, 24px);
      background: var(--strata-surface, #fff);
      color: var(--strata-text, #09090b);
      border: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      border-radius: var(--strata-radius-lg, 8px);
      box-shadow: var(
        --strata-shadow-lg,
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1)
      );
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    /* The panel itself can receive focus when opened; the UA "auto" ring
       reads as a heavy border. Focus indication belongs on the interactive
       children inside. */
    dialog:focus-visible {
      outline: none;
    }
    dialog[open] {
      animation: dialog-in var(--strata-duration-base, 200ms)
        var(--strata-easing-out, ease-out);
    }
    dialog::backdrop {
      /* Flat scrim — no blur, ever. */
      background: rgb(0 0 0 / 0.6);
      backdrop-filter: none;
      animation: overlay-in var(--strata-duration-base, 200ms)
        var(--strata-easing-default, ease);
    }
    h2 {
      margin: 0 0 var(--strata-space-2, 8px);
      font-family: var(--strata-font-display, 'Satoshi', system-ui, sans-serif);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--strata-text, #09090b);
    }
    .body {
      font-size: 14px;
      line-height: 1.6;
      color: var(--strata-text-muted, #71717a);
    }
    footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--strata-space-3, 12px);
      margin-top: var(--strata-space-5, 24px);
    }
    /* Fade + zoom 0.96 -> 1. */
    @keyframes dialog-in {
      from {
        opacity: 0;
        transform: scale(0.96);
      }
      to {
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
      /* Fade only — no zoom. */
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
      <dialog part="dialog" aria-labelledby="heading" @close=${this.handleNativeClose}>
        <h2 part="header" id="heading">${this.heading}</h2>
        <div class="body" part="body"><slot></slot></div>
        <footer part="footer"><slot name="footer"></slot></footer>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-dialog': StrataDialog;
  }
}
