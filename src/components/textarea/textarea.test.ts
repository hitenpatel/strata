import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './textarea.js';
import type { StrataTextarea } from './textarea.js';

describe('strata-textarea', () => {
  it('renders a labelled textarea', async () => {
    const el = await fixture<StrataTextarea>(
      html`<strata-textarea label="Description"></strata-textarea>`
    );
    const textarea = el.shadowRoot!.querySelector('textarea')!;
    const label = el.shadowRoot!.querySelector('label')!;
    expect(textarea).to.exist;
    expect(label.textContent).to.equal('Description');
    expect(label.getAttribute('for')).to.equal(textarea.id);
  });

  it('applies the rows property', async () => {
    const el = await fixture<StrataTextarea>(
      html`<strata-textarea label="Bio" rows="6"></strata-textarea>`
    );
    expect(el.shadowRoot!.querySelector('textarea')!.rows).to.equal(6);
  });

  it('passes through placeholder, required and value', async () => {
    const el = await fixture<StrataTextarea>(
      html`<strata-textarea label="Bio" placeholder="Tell us" value="Hi" required></strata-textarea>`
    );
    const textarea = el.shadowRoot!.querySelector('textarea')!;
    expect(textarea.placeholder).to.equal('Tell us');
    expect(textarea.value).to.equal('Hi');
    expect(textarea.required).to.be.true;
  });

  it('disables the native textarea', async () => {
    const el = await fixture<StrataTextarea>(
      html`<strata-textarea label="Bio" disabled></strata-textarea>`
    );
    expect(el.shadowRoot!.querySelector('textarea')!.disabled).to.be.true;
  });

  it('shows error text with aria-invalid and aria-describedby', async () => {
    const el = await fixture<StrataTextarea>(
      html`<strata-textarea label="Bio" error="A description is required"></strata-textarea>`
    );
    const textarea = el.shadowRoot!.querySelector('textarea')!;
    expect(textarea.getAttribute('aria-invalid')).to.equal('true');
    expect(textarea.getAttribute('aria-describedby')).to.contain('error');
    expect(el.shadowRoot!.querySelector('#error')!.textContent).to.contain(
      'A description is required'
    );
  });

  it('emits composed input events and syncs value', async () => {
    const el = await fixture<StrataTextarea>(html`<strata-textarea label="Bio"></strata-textarea>`);
    const textarea = el.shadowRoot!.querySelector('textarea')!;
    setTimeout(() => {
      textarea.value = 'hello';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const event = await oneEvent(el, 'input');
    expect(event.composed).to.be.true;
    expect(el.value).to.equal('hello');
  });

  it('participates in forms via ElementInternals', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form><strata-textarea label="Bio" name="bio" value="Hi"></strata-textarea></form>`
    );
    const data = new FormData(form);
    expect(data.get('bio')).to.equal('Hi');
  });

  it('is accessible in default, error, hint and disabled states', async () => {
    for (const tpl of [
      html`<strata-textarea label="Bio"></strata-textarea>`,
      html`<strata-textarea label="Bio" error="Bad"></strata-textarea>`,
      html`<strata-textarea label="Bio" hint="Optional"></strata-textarea>`,
      html`<strata-textarea label="Bio" disabled></strata-textarea>`,
    ]) {
      const el = await fixture<StrataTextarea>(tpl);
      await expect(el).to.be.accessible();
    }
  });
});
