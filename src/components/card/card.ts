import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('strata-card')
export class StrataCard extends LitElement {
  @property({ type: Boolean, reflect: true }) raised = false;

  @state() private hasHeader = false;
  @state() private hasFooter = false;

  static styles = css`
    :host {
      display: block;
      background: var(--strata-surface, #fff);
      border: 1px solid var(--strata-border, #e2e8f0);
      border-radius: var(--strata-radius-lg, 14px);
      box-shadow: var(--strata-shadow-xs, 0 1px 2px rgba(15, 23, 42, 0.06));
      color: var(--strata-text, #0f172a);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      overflow: hidden;
    }
    :host([hidden]) {
      display: none;
    }
    :host([raised]) {
      background: var(--strata-surface-raised, #fff);
      box-shadow: var(--strata-shadow-md, 0 4px 12px rgba(15, 23, 42, 0.1));
    }
    .header,
    .body,
    .footer {
      padding: var(--strata-space-4, 16px) 22px;
    }
    .body {
      padding: 22px;
    }
    .header {
      border-bottom: 1px solid var(--strata-border, #e2e8f0);
      font-weight: 600;
    }
    .footer {
      border-top: 1px solid var(--strata-border, #e2e8f0);
      background: var(--strata-surface-hover, #f8fafc);
    }
    [hidden] {
      display: none;
    }
  `;

  private onHeaderSlot(e: Event) {
    this.hasHeader =
      (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  private onFooterSlot(e: Event) {
    this.hasFooter =
      (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  render() {
    return html`
      <div class="header" ?hidden=${!this.hasHeader}>
        <slot name="header" @slotchange=${this.onHeaderSlot}></slot>
      </div>
      <div class="body"><slot></slot></div>
      <div class="footer" ?hidden=${!this.hasFooter}>
        <slot name="footer" @slotchange=${this.onFooterSlot}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-card': StrataCard;
  }
}
