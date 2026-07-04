import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './switch.js';
import type { StrataSwitch } from './switch.js';

describe('strata-switch', () => {
  it('renders a button with role=switch and aria-checked', async () => {
    const el = await fixture<StrataSwitch>(html`<strata-switch>Notifications</strata-switch>`);
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('role')).to.equal('switch');
    expect(button.getAttribute('aria-checked')).to.equal('false');
  });

  it('reflects checked and updates aria-checked', async () => {
    const el = await fixture<StrataSwitch>(
      html`<strata-switch checked>Notifications</strata-switch>`
    );
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-checked')).to.equal('true');
  });

  it('toggles on click and emits a composed change event', async () => {
    const el = await fixture<StrataSwitch>(html`<strata-switch>Notifications</strata-switch>`);
    setTimeout(() => el.shadowRoot!.querySelector('button')!.click());
    const event = await oneEvent(el, 'change');
    expect(event.composed).to.be.true;
    expect(el.checked).to.be.true;
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-checked')).to.equal('true');
  });

  it('does not toggle when disabled', async () => {
    const el = await fixture<StrataSwitch>(
      html`<strata-switch disabled>Notifications</strata-switch>`
    );
    el.shadowRoot!.querySelector('button')!.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it('uses the label property as aria-label when no slotted text', async () => {
    const el = await fixture<StrataSwitch>(
      html`<strata-switch label="Enable dark mode"></strata-switch>`
    );
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).to.equal(
      'Enable dark mode'
    );
  });

  it('has a 40px minimum target height', async () => {
    const el = await fixture<StrataSwitch>(html`<strata-switch>Notifications</strata-switch>`);
    const rect = el.shadowRoot!.querySelector('button')!.getBoundingClientRect();
    expect(rect.height).to.be.at.least(40);
  });

  it('is accessible in all states', async () => {
    for (const tpl of [
      html`<strata-switch>Label</strata-switch>`,
      html`<strata-switch checked>Label</strata-switch>`,
      html`<strata-switch disabled>Label</strata-switch>`,
      html`<strata-switch label="Aria only"></strata-switch>`,
    ]) {
      const el = await fixture<StrataSwitch>(tpl);
      await expect(el).to.be.accessible();
    }
  });
});
