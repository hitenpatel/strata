import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AvatarSize = 'sm' | 'md' | 'lg';

@customElement('strata-avatar')
export class StrataAvatar extends LitElement {
  @property() src = '';
  @property() name = '';
  @property({ reflect: true }) size: AvatarSize = 'md';

  static styles = css`
    :host {
      display: inline-flex;
      flex: none;
    }
    :host([hidden]) {
      display: none;
    }
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: var(--strata-radius-full, 999px);
      background: var(--strata-surface-sunken, #f4f4f5);
      /* Muted initials, mixed towards text to clear WCAG AA (4.5:1) —
         pure text-muted on surface-sunken measures 4.39:1 at 13px. */
      color: color-mix(
        in srgb,
        var(--strata-text-muted, #71717a) 70%,
        var(--strata-text, #09090b)
      );
      font-family: var(--strata-font-body, system-ui, sans-serif);
      font-weight: 600;
      user-select: none;
    }
    /* Stacked overlap: when avatars are overlapped by the consumer
       (negative margins), each circle separates from the one beneath it
       with a 2px canvas-colour ring. */
    :host(:not(:first-of-type)) .avatar {
      box-shadow: 0 0 0 2px var(--strata-canvas, #fff);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    :host([size='sm']) .avatar {
      width: 24px;
      height: 24px;
      font-size: 10px;
    }
    :host([size='md']) .avatar {
      width: 32px;
      height: 32px;
      font-size: 13px;
    }
    :host([size='lg']) .avatar {
      width: 40px;
      height: 40px;
      font-size: 15px;
    }
  `;

  private get initials(): string {
    return this.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  render() {
    if (this.src) {
      return html`
        <span class="avatar" part="avatar">
          <img part="image" src=${this.src} alt=${this.name} />
        </span>
      `;
    }
    return html`
      <span
        class="avatar"
        part="avatar"
        role=${this.name ? 'img' : nothing}
        aria-label=${this.name || nothing}
        aria-hidden=${this.name ? nothing : 'true'}
        >${this.initials}</span
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strata-avatar': StrataAvatar;
  }
}
