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
      border-radius: var(--strata-radius-sm, 4px);
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-size: 14px;
      color: var(--strata-text, #231f1a);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      outline: none;
      transition:
        background-color var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease),
        box-shadow var(--strata-duration-fast, 120ms) var(--strata-easing-drop, ease);
    }
    :host(:hover) {
      background: var(--strata-surface-hover, #faf8f5);
    }
    /* Active (focused) item: accent-subtle fill + the 3px strata band */
    :host(:focus) {
      background: var(--strata-accent-subtle, #eef4ff);
      box-shadow: inset 3px 0 0 0 var(--strata-band-accent, #2563eb);
    }
    :host(:focus-visible) {
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-accent, #2563eb),
        0 0 0 2px var(--strata-surface, #fff),
        0 0 0 4px var(--strata-focus-ring, #2563eb);
    }
    :host([danger]) {
      color: var(--strata-danger, #dc2626);
    }
    :host([danger]:hover) {
      background: var(--strata-danger-subtle, #fdf0ee);
    }
    :host([danger]:focus) {
      background: var(--strata-danger-subtle, #fdf0ee);
      box-shadow: inset 3px 0 0 0 var(--strata-band-danger, #dc2626);
    }
    :host([danger]:focus-visible) {
      box-shadow:
        inset 3px 0 0 0 var(--strata-band-danger, #dc2626),
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
    /* Sediment: the menu is a floating slab — offset-2 shadow + one echoed under-edge */
    .popup {
      position: absolute;
      top: calc(100% + var(--strata-space-1, 4px));
      left: 0;
      z-index: 20;
      min-width: 200px;
      padding: var(--strata-space-1, 4px);
      background: var(--strata-surface-raised, #fff);
      border: var(--strata-border-width, 1.5px) solid var(--strata-border-strong, #d6cec1);
      border-radius: var(--strata-radius-lg, 8px);
      box-shadow:
        4px 4px 0 0 var(--strata-layer-shadow, #d6cec1),
        0 5px 0 -1px var(--strata-layer-edge-1, #d6cec1);
      animation: menu-settle var(--strata-duration-base, 200ms)
        var(--strata-easing-settle, cubic-bezier(0.22, 1.2, 0.36, 1));
    }
    :host(:not([open])) .popup {
      display: none;
    }
    /* Enters with a 4px drop + settle */
    @keyframes menu-settle {
      0% {
        opacity: 0;
        transform: translateY(-4px);
      }
      70% {
        transform: translateY(1px);
      }
      100% {
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
        animation: menu-fade var(--strata-duration-fast, 120ms) ease;
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
