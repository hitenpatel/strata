import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './input.js';
import type { StrataInput } from './input.js';

describe('strata-input', () => {
  it('renders a labelled input', async () => {
    const el = await fixture<StrataInput>(html`<strata-input label="Email"></strata-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    const label = el.shadowRoot!.querySelector('label')!;
    expect(input).to.exist;
    expect(label.textContent).to.equal('Email');
    expect(label.getAttribute('for')).to.equal(input.id);
  });

  it('passes through type, placeholder, required and value', async () => {
    const el = await fixture<StrataInput>(
      html`<strata-input
        label="Email"
        type="email"
        placeholder="you@company.com"
        value="a@b.co"
        required
      ></strata-input>`
    );
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.type).to.equal('email');
    expect(input.placeholder).to.equal('you@company.com');
    expect(input.value).to.equal('a@b.co');
    expect(input.required).to.be.true;
  });

  it('disables the native input', async () => {
    const el = await fixture<StrataInput>(
      html`<strata-input label="Email" disabled></strata-input>`
    );
    expect(el.shadowRoot!.querySelector('input')!.disabled).to.be.true;
  });

  it('shows error text with aria-invalid and aria-describedby', async () => {
    const el = await fixture<StrataInput>(
      html`<strata-input label="Email" error="Enter a valid email address"></strata-input>`
    );
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).to.equal('true');
    expect(input.getAttribute('aria-describedby')).to.contain('error');
    expect(el.shadowRoot!.querySelector('#error')!.textContent).to.contain(
      'Enter a valid email address'
    );
  });

  it('shows hint text linked via aria-describedby', async () => {
    const el = await fixture<StrataInput>(
      html`<strata-input label="Email" hint="Work address preferred"></strata-input>`
    );
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-describedby')).to.contain('hint');
    expect(el.shadowRoot!.querySelector('#hint')!.textContent).to.equal('Work address preferred');
  });

  it('emits composed input events and syncs value', async () => {
    const el = await fixture<StrataInput>(html`<strata-input label="Email"></strata-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    setTimeout(() => {
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const event = await oneEvent(el, 'input');
    expect(event.composed).to.be.true;
    expect(el.value).to.equal('hello');
  });

  it('emits a composed change event', async () => {
    const el = await fixture<StrataInput>(html`<strata-input label="Email"></strata-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    setTimeout(() => input.dispatchEvent(new Event('change', { bubbles: true })));
    const event = await oneEvent(el, 'change');
    expect(event.composed).to.be.true;
  });

  it('participates in forms via ElementInternals', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><strata-input label="Email" name="email" value="a@b.co"></strata-input></form>`
    );
    const data = new FormData(form);
    expect(data.get('email')).to.equal('a@b.co');
  });

  it('is accessible in default, error, hint and disabled states', async () => {
    for (const tpl of [
      html`<strata-input label="Email"></strata-input>`,
      html`<strata-input label="Email" error="Bad"></strata-input>`,
      html`<strata-input label="Email" hint="Hint"></strata-input>`,
      html`<strata-input label="Email" disabled></strata-input>`,
    ]) {
      const el = await fixture<StrataInput>(tpl);
      await expect(el).to.be.accessible();
    }
  });
});
