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
      align-items: center;
      height: 42px;
      padding: 0 var(--strata-space-4, 16px);
      margin-bottom: -1px;
      border-bottom: 2px solid transparent;
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      font-weight: 600;
      color: var(--strata-text-muted, #475569);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      outline: none;
      transition:
        color var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease),
        border-color var(--strata-duration-base, 200ms) var(--strata-easing-default, ease);
    }
    :host(:hover) {
      color: var(--strata-text, #0f172a);
    }
    :host([selected]) {
      color: var(--strata-accent, #2563eb);
      border-bottom-color: var(--strata-accent, #2563eb);
    }
    :host(:focus-visible) {
      border-radius: var(--strata-radius-sm, 6px) var(--strata-radius-sm, 6px) 0 0;
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
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
    return html`<slot></slot>`;
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
      color: var(--strata-text, #0f172a);
      outline: none;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:focus-visible) {
      border-radius: var(--strata-radius-sm, 6px);
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    if (!this.id) this.id = `strata-tab-panel-${++panelIdCounter}`;
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
  }

  render() {
    return html`<slot></slot>`;
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
      display: flex;
      gap: var(--strata-space-1, 4px);
      border-bottom: 1px solid var(--strata-border, #e2e8f0);
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
      <div role="tablist" @click=${this.handleClick} @keydown=${this.handleKeydown}>
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
