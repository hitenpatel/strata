import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './checkbox.js';
import type { StrataCheckbox } from './checkbox.js';

describe('strata-checkbox', () => {
  it('renders a native checkbox with slotted label text', async () => {
    const el = await fixture<StrataCheckbox>(
      html`<strata-checkbox>Email me updates</strata-checkbox>`
    );
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.type).to.equal('checkbox');
    expect(el.textContent).to.equal('Email me updates');
  });

  it('reflects checked state', async () => {
    const el = await fixture<StrataCheckbox>(html`<strata-checkbox checked>x</strata-checkbox>`);
    expect(el.checked).to.be.true;
    expect(el.shadowRoot!.querySelector('input')!.checked).to.be.true;
  });

  it('sets indeterminate on the native input', async () => {
    const el = await fixture<StrataCheckbox>(
      html`<strata-checkbox indeterminate>x</strata-checkbox>`
    );
    expect(el.shadowRoot!.querySelector('input')!.indeterminate).to.be.true;
    expect(el.shadowRoot!.querySelector('.dash')).to.exist;
  });

  it('toggles on click and emits a composed change event', async () => {
    const el = await fixture<StrataCheckbox>(html`<strata-checkbox>x</strata-checkbox>`);
    setTimeout(() => el.shadowRoot!.querySelector('input')!.click());
    const event = await oneEvent(el, 'change');
    expect(event.composed).to.be.true;
    expect(el.checked).to.be.true;
  });

  it('clears indeterminate on user toggle', async () => {
    const el = await fixture<StrataCheckbox>(
      html`<strata-checkbox indeterminate>x</strata-checkbox>`
    );
    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;
    expect(el.indeterminate).to.be.false;
    expect(el.checked).to.be.true;
  });

  it('does not toggle when disabled', async () => {
    const el = await fixture<StrataCheckbox>(html`<strata-checkbox disabled>x</strata-checkbox>`);
    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it('has a 40px minimum row height', async () => {
    const el = await fixture<StrataCheckbox>(html`<strata-checkbox>x</strata-checkbox>`);
    const rect = el.shadowRoot!.querySelector('label')!.getBoundingClientRect();
    expect(rect.height).to.be.at.least(40);
  });

  it('is accessible in all states', async () => {
    for (const tpl of [
      html`<strata-checkbox>Label</strata-checkbox>`,
      html`<strata-checkbox checked>Label</strata-checkbox>`,
      html`<strata-checkbox indeterminate>Label</strata-checkbox>`,
      html`<strata-checkbox disabled>Label</strata-checkbox>`,
    ]) {
      const el = await fixture<StrataCheckbox>(tpl);
      await expect(el).to.be.accessible();
    }
  });
});
