import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

let tabIdCounter = 0;
let panelIdCounter = 0;

@customElement('strata-tab')
export class StrataTab extends LitElement {
  @property({ type: Boolean, reflect: true }) selected = false;

  static styles = css`
    :host {
      display: inline-flex;
      border-radius: var(--strata-radius-sm, 4px);
      outline: none;
    }
    .tab {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      height: 32px;
      padding: 0 var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-sm, 4px);
      background: transparent;
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      font-weight: 500;
      /* text-muted nudged toward text: >=4.5:1 on the sunken strip */
      color: var(--strata-text-muted, #71717a);
      color: color-mix(
        in srgb,
        var(--strata-text-muted, #71717a) 70%,
        var(--strata-text, #09090b)
      );
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      transition:
        color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease),
        background-color var(--strata-duration-fast, 150ms) var(--strata-easing-default, ease);
    }
    :host(:hover) .tab {
      color: var(--strata-text, #09090b);
    }
    :host([selected]) .tab {
      color: var(--strata-text, #09090b);
      background: var(--strata-surface, #fff);
      box-shadow: var(--strata-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
    }
    :host(:focus-visible) {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .tab {
        transition: none;
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    if (!this.id) this.id = `strata-tab-${++tabIdCounter}`;
    if (!this.slot) this.slot = 'tab';
  }

  protected update(changed: PropertyValues<this>): void {
    super.update(changed);
    this.setAttribute('aria-selected', String(this.selected));
    this.tabIndex = this.selected ? 0 : -1;
  }

  render() {
    return html`<span class="tab" part="tab"><slot></slot></span>`;
  }
}

@customElement('strata-tab-panel')
export class StrataTabPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      line-height: 1.6;
      color: var(--strata-text, #09090b);
      outline: none;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:focus-visible) {
      border-radius: var(--strata-radius-sm, 4px);
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: 2px;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    if (!this.id) this.id = `strata-tab-panel-${++panelIdCounter}`;
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
  }

  render() {
    return html`<div class="panel" part="panel"><slot></slot></div>`;
  }
}

@customElement('strata-tabs')
export class StrataTabs extends LitElement {
  /** Index of the selected tab. */
  @property({ type: Number, reflect: true }) selected = 0;

  static styles = css`
    :host {
      display: block;
      font-family: var(--strata-font-body, system-ui, sans-serif);
    }
    [role='tablist'] {
      display: inline-flex;
      gap: 0;
      padding: var(--strata-space-1, 4px);
      background: var(--strata-surface-sunken, #f4f4f5);
      border-radius: var(--strata-radius-md, 6px);
      margin-bottom: var(--strata-space-5, 24px);
    }
  `;

  private get tabs(): StrataTab[] {
    return Array.from(this.querySelectorAll<StrataTab>('strata-tab'));
  }

  private get panels(): StrataTabPanel[] {
    return Array.from(this.querySelectorAll<StrataTabPanel>('strata-tab-panel'));
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('selected')) this.sync();
  }

  private sync = (): void => {
    const { tabs, panels } = this;
    tabs.forEach((tab, i) => {
      tab.selected = i === this.selected;
      const panel = panels[i];
      if (panel) {
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
        panel.hidden = i !== this.selected;
      }
    });
  };

  private select(index: number, focus = false): void {
    const tabs = this.tabs;
    const tab = tabs[index];
    if (!tab) return;
    if (index !== this.selected) {
      this.selected = index;
      this.sync();
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { index },
          bubbles: true,
          composed: true,
        })
      );
    }
    if (focus) tab.focus();
  }

  private handleClick(event: Event): void {
    const tab = (event.target as Element).closest('strata-tab');
    if (!tab) return;
    this.select(this.tabs.indexOf(tab as StrataTab));
  }

  private handleKeydown(event: KeyboardEvent): void {
    const tabs = this.tabs;
    if (tabs.length === 0) return;
    const current = this.selected;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        next = (current - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.select(next, true);
  }

  render() {
    return html`
      <div
        role="tablist"
        part="tablist"
        @click=${this.handleClick}
        @keydown=${this.handleKeydown}
      >
        <slot name="tab" @slotchange=${this.sync}></slot>
      </div>
      <slot @slotchange=${this.sync}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-tabs': StrataTabs;
    'strata-tab': StrataTab;
    'strata-tab-panel': StrataTabPanel;
  }
}
