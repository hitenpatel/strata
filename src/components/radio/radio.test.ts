import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './radio.js';
import './radio-group.js';
import type { StrataRadio } from './radio.js';
import type { StrataRadioGroup } from './radio-group.js';

describe('strata-radio', () => {
  it('renders a native radio with slotted label text', async () => {
    const el = await fixture<StrataRadio>(
      html`<strata-radio name="r" value="a">Option A</strata-radio>`
    );
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.type).to.equal('radio');
    expect(el.textContent).to.equal('Option A');
  });

  it('reflects checked state', async () => {
    const el = await fixture<StrataRadio>(
      html`<strata-radio name="r" value="a" checked>A</strata-radio>`
    );
    expect(el.shadowRoot!.querySelector('input')!.checked).to.be.true;
  });

  it('emits a composed change event when selected', async () => {
    const el = await fixture<StrataRadio>(html`<strata-radio name="r" value="a">A</strata-radio>`);
    setTimeout(() => el.shadowRoot!.querySelector('input')!.click());
    const event = await oneEvent(el, 'change');
    expect(event.composed).to.be.true;
    expect(el.checked).to.be.true;
  });

  it('does not select when disabled', async () => {
    const el = await fixture<StrataRadio>(
      html`<strata-radio name="r" value="a" disabled>A</strata-radio>`
    );
    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it('is accessible', async () => {
    for (const tpl of [
      html`<strata-radio name="r" value="a">Label</strata-radio>`,
      html`<strata-radio name="r" value="a" checked>Label</strata-radio>`,
      html`<strata-radio name="r" value="a" disabled>Label</strata-radio>`,
    ]) {
      const el = await fixture<StrataRadio>(tpl);
      await expect(el).to.be.accessible();
    }
  });
});

describe('strata-radio-group', () => {
  const groupFixture = () =>
    fixture<StrataRadioGroup>(html`
      <strata-radio-group label="Role" value="editor">
        <strata-radio name="role" value="editor">Editor</strata-radio>
        <strata-radio name="role" value="admin">Admin</strata-radio>
        <strata-radio name="role" value="viewer">Viewer</strata-radio>
      </strata-radio-group>
    `);

  it('exposes role=radiogroup with a label', async () => {
    const el = await groupFixture();
    const group = el.shadowRoot!.querySelector('[role="radiogroup"]')!;
    expect(group).to.exist;
    expect(group.getAttribute('aria-labelledby')).to.equal('legend');
    expect(el.shadowRoot!.querySelector('#legend')!.textContent).to.equal('Role');
  });

  it('checks the radio matching its value', async () => {
    const el = await groupFixture();
    const radios = [...el.querySelectorAll<StrataRadio>('strata-radio')];
    expect(radios.map((r) => r.checked)).to.deep.equal([true, false, false]);
  });

  it('keeps selection exclusive and updates value on child change', async () => {
    const el = await groupFixture();
    const radios = [...el.querySelectorAll<StrataRadio>('strata-radio')];
    setTimeout(() => radios[1]!.shadowRoot!.querySelector('input')!.click());
    const event = await oneEvent(el, 'change');
    expect(event.composed).to.be.true;
    expect(el.value).to.equal('admin');
    expect(radios.map((r) => r.checked)).to.deep.equal([false, true, false]);
  });

  it('moves selection with arrow keys', async () => {
    const el = await groupFixture();
    const group = el.shadowRoot!.querySelector('[role="radiogroup"]')!;
    group.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.value).to.equal('admin');
    group.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.value).to.equal('editor');
  });

  it('skips disabled radios when moving with arrow keys', async () => {
    const el = await fixture<StrataRadioGroup>(html`
      <strata-radio-group label="Plan" value="free">
        <strata-radio name="plan" value="free">Free</strata-radio>
        <strata-radio name="plan" value="pro" disabled>Pro</strata-radio>
        <strata-radio name="plan" value="max">Max</strata-radio>
      </strata-radio-group>
    `);
    el.shadowRoot!.querySelector('[role="radiogroup"]')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.value).to.equal('max');
  });

  it('is accessible', async () => {
    const el = await groupFixture();
    await expect(el).to.be.accessible();
  });
});
