import { fixture, expect, html } from '@open-wc/testing';
import './button.js';
import type { StrataButton } from './button.js';

describe('strata-button', () => {
  it('renders a native button with slotted label', async () => {
    const el = await fixture<StrataButton>(html`<strata-button>Save</strata-button>`);
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button).to.exist;
    expect(el.textContent).to.equal('Save');
  });

  it('defaults to the primary variant', async () => {
    const el = await fixture<StrataButton>(html`<strata-button>Go</strata-button>`);
    expect(el.variant).to.equal('primary');
    expect(el.getAttribute('variant')).to.equal('primary');
  });

  it('reflects each variant attribute', async () => {
    for (const variant of ['primary', 'secondary', 'ghost', 'danger'] as const) {
      const el = await fixture<StrataButton>(
        html`<strata-button variant=${variant}>x</strata-button>`
      );
      expect(el.getAttribute('variant')).to.equal(variant);
    }
  });

  it('disables the native button when disabled', async () => {
    const el = await fixture<StrataButton>(html`<strata-button disabled>x</strata-button>`);
    expect(el.shadowRoot!.querySelector('button')!.disabled).to.be.true;
  });

  it('sets aria-busy and disables while loading', async () => {
    const el = await fixture<StrataButton>(html`<strata-button loading>x</strata-button>`);
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('aria-busy')).to.equal('true');
    expect(button.disabled).to.be.true;
    expect(el.shadowRoot!.querySelector('.spinner')).to.exist;
  });

  it('does not fire click when disabled', async () => {
    const el = await fixture<StrataButton>(html`<strata-button disabled>x</strata-button>`);
    let clicked = false;
    el.addEventListener('click', () => (clicked = true));
    el.shadowRoot!.querySelector('button')!.click();
    expect(clicked).to.be.false;
  });

  it('is accessible in all variants', async () => {
    for (const variant of ['primary', 'secondary', 'ghost', 'danger'] as const) {
      const el = await fixture<StrataButton>(
        html`<strata-button variant=${variant}>Label</strata-button>`
      );
      await expect(el).to.be.accessible();
    }
  });
});
