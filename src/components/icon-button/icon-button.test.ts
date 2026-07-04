import { fixture, expect, html } from '@open-wc/testing';
import './icon-button.js';
import type { StrataIconButton } from './icon-button.js';

const icon = html`<svg viewBox="0 0 24 24" aria-hidden="true">
  <line x1="12" y1="5" x2="12" y2="19"></line>
</svg>`;

describe('strata-icon-button', () => {
  it('renders a native button with the label as aria-label', async () => {
    const el = await fixture<StrataIconButton>(
      html`<strata-icon-button label="Add">${icon}</strata-icon-button>`
    );
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button).to.exist;
    expect(button.getAttribute('aria-label')).to.equal('Add');
  });

  it('defaults to the secondary variant', async () => {
    const el = await fixture<StrataIconButton>(
      html`<strata-icon-button label="Add">${icon}</strata-icon-button>`
    );
    expect(el.variant).to.equal('secondary');
    expect(el.getAttribute('variant')).to.equal('secondary');
  });

  it('reflects each variant attribute', async () => {
    for (const variant of ['primary', 'secondary', 'ghost', 'danger'] as const) {
      const el = await fixture<StrataIconButton>(
        html`<strata-icon-button variant=${variant} label="Add">${icon}</strata-icon-button>`
      );
      expect(el.getAttribute('variant')).to.equal(variant);
    }
  });

  it('is a 40x40 target', async () => {
    const el = await fixture<StrataIconButton>(
      html`<strata-icon-button label="Add">${icon}</strata-icon-button>`
    );
    const rect = el.shadowRoot!.querySelector('button')!.getBoundingClientRect();
    expect(rect.width).to.equal(40);
    expect(rect.height).to.equal(40);
  });

  it('does not fire click when disabled', async () => {
    const el = await fixture<StrataIconButton>(
      html`<strata-icon-button label="Add" disabled>${icon}</strata-icon-button>`
    );
    let clicked = false;
    el.addEventListener('click', () => (clicked = true));
    el.shadowRoot!.querySelector('button')!.click();
    expect(clicked).to.be.false;
  });

  it('is accessible in all variants', async () => {
    for (const variant of ['primary', 'secondary', 'ghost', 'danger'] as const) {
      const el = await fixture<StrataIconButton>(
        html`<strata-icon-button variant=${variant} label="Settings">${icon}</strata-icon-button>`
      );
      await expect(el).to.be.accessible();
    }
  });
});
