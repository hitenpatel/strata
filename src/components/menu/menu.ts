import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

@customElement('strata-menu-item')
export class StrataMenuItem extends LitElement {
  @property() value = '';
  @property({ type: Boolean, reflect: true }) danger = false;

  static styles = css`
    :host {
      display: block;
      border-radius: var(--strata-radius-sm, 4px);
      outline: none;
    }
    .item {
      display: flex;
      align-items: center;
      gap: var(--strata-space-2, 8px);
      padding: var(--strata-space-2, 8px) var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-sm, 4px);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      color: var(--strata-text, #09090b);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      transition: background-color var(--strata-duration-fast, 150ms)
        var(--strata-easing-default, ease);
    }
    :host(:hover) .item,
    :host(:focus) .item {
      background: var(--strata-surface-hover, #f4f4f5);
    }
    :host(:focus-visible) {
      outline: 2px solid var(--strata-focus-ring, #2563eb);
      outline-offset: -2px;
    }
    :host([danger]) .item {
      color: var(--strata-danger, #dc2626);
    }
    :host([danger]:hover) .item,
    :host([danger]:focus) .item {
      background: var(--strata-danger-subtle, #fef2f2);
    }
    @media (prefers-reduced-motion: reduce) {
      .item {
        transition: none;
      }
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
    this.tabIndex = -1;
  }

  render() {
    return html`<span class="item" part="item"><slot></slot></span>`;
  }
}

@customElement('strata-menu')
export class StrataMenu extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }
    .popup {
      position: absolute;
      top: calc(100% + var(--strata-space-1, 4px));
      left: 0;
      z-index: 20;
      min-width: 200px;
      padding: var(--strata-space-1, 4px);
      background: var(--strata-surface-raised, #fff);
      border: var(--strata-border-width, 1px) solid var(--strata-border, #e4e4e7);
      border-radius: var(--strata-radius-md, 6px);
      box-shadow: var(
        --strata-shadow-md,
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1)
      );
      transform-origin: top left;
      animation: menu-in var(--strata-duration-fast, 150ms)
        var(--strata-easing-out, cubic-bezier(0, 0, 0.2, 1));
    }
    :host(:not([open])) .popup {
      display: none;
    }
    @keyframes menu-in {
      from {
        opacity: 0;
        transform: scale(0.98);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes menu-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .popup {
        animation: menu-fade var(--strata-duration-fast, 150ms) ease;
      }
    }
  `;

  private get items(): StrataMenuItem[] {
    return Array.from(this.querySelectorAll<StrataMenuItem>('strata-menu-item'));
  }

  private get trigger(): HTMLElement | null {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    return (slot?.assignedElements()[0] as HTMLElement | undefined) ?? null;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this.handleOutsidePointerDown);
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('open')) {
      this.trigger?.setAttribute('aria-expanded', String(this.open));
      if (this.open) {
        document.addEventListener('pointerdown', this.handleOutsidePointerDown);
      } else {
        document.removeEventListener('pointerdown', this.handleOutsidePointerDown);
      }
    }
  }

  private handleOutsidePointerDown = (event: Event): void => {
    if (!event.composedPath().includes(this)) this.close();
  };

  private handleTriggerSlotChange = (): void => {
    const trigger = this.trigger;
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', String(this.open));
    }
  };

  private async openMenu(focusIndex: number): Promise<void> {
    this.open = true;
    await this.updateComplete;
    const items = this.items;
    const item = items[(focusIndex + items.length) % Math.max(items.length, 1)];
    item?.focus();
  }

  private close(refocusTrigger = false): void {
    if (!this.open) return;
    this.open = false;
    if (refocusTrigger) this.trigger?.focus();
  }

  private handleTriggerClick = (): void => {
    if (this.open) {
      this.close();
    } else {
      void this.openMenu(0);
    }
  };

  private handleTriggerKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      void this.openMenu(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      void this.openMenu(-1);
    } else if (event.key === 'Escape') {
      this.close(true);
    }
  };

  private handleMenuClick = (event: Event): void => {
    const item = (event.target as Element).closest('strata-menu-item');
    if (!item) return;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { value: (item as StrataMenuItem).value },
        bubbles: true,
        composed: true,
      })
    );
    this.close(true);
  };

  private handleMenuKeydown = (event: KeyboardEvent): void => {
    const items = this.items;
    const current = items.findIndex((item) => item === event.target);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(current + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(current - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        this.close(true);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        (event.target as HTMLElement).click();
        break;
      case 'Tab':
        this.close();
        break;
    }
  };

  render() {
    return html`
      <slot
        name="trigger"
        @click=${this.handleTriggerClick}
        @keydown=${this.handleTriggerKeydown}
        @slotchange=${this.handleTriggerSlotChange}
      ></slot>
      <div
        class="popup"
        part="menu panel"
        role="menu"
        @click=${this.handleMenuClick}
        @keydown=${this.handleMenuKeydown}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-menu': StrataMenu;
    'strata-menu-item': StrataMenuItem;
  }
}
