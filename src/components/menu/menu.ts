import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';

@customElement('strata-menu-item')
export class StrataMenuItem extends LitElement {
  @property() value = '';
  @property({ type: Boolean, reflect: true }) danger = false;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--strata-space-2, 8px);
      padding: var(--strata-space-2, 8px) var(--strata-space-3, 12px);
      border-radius: var(--strata-radius-sm, 6px);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      color: var(--strata-text, #0f172a);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      outline: none;
      transition: background-color var(--strata-duration-fast, 120ms)
        var(--strata-easing-default, ease);
    }
    :host(:hover),
    :host(:focus) {
      background: var(--strata-surface-hover, #f8fafc);
    }
    :host(:focus-visible) {
      box-shadow:
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    :host([danger]) {
      color: var(--strata-danger, #dc2626);
    }
    :host([danger]:hover),
    :host([danger]:focus) {
      background: var(--strata-danger-subtle, #fef2f2);
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
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
    return html`<slot></slot>`;
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
      border: 1px solid var(--strata-border, #e2e8f0);
      border-radius: var(--strata-radius-md, 10px);
      box-shadow: var(--strata-shadow-md, 0 4px 12px rgba(15, 23, 42, 0.1));
      animation: menu-in var(--strata-duration-fast, 120ms) var(--strata-easing-default, ease);
    }
    :host(:not([open])) .popup {
      display: none;
    }
    @keyframes menu-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .popup {
        animation: none;
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
