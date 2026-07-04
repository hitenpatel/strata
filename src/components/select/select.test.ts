import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import './select.js';
import type { StrataSelect } from './select.js';

const options = [
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
];

describe('strata-select', () => {
  it('renders a labelled native select with options', async () => {
    const el = await fixture<StrataSelect>(
      html`<strata-select label="Role" .options=${options} value="editor"></strata-select>`
    );
    const select = el.shadowRoot!.querySelector('select')!;
    const label = el.shadowRoot!.querySelector('label')!;
    expect(select).to.exist;
    expect(label.textContent).to.equal('Role');
    expect(label.getAttribute('for')).to.equal(select.id);
    expect(select.options.length).to.equal(3);
    expect(select.options[1]!.textContent!.trim()).to.equal('Admin');
  });

  it('reflects the value in the native select', async () => {
    const el = await fixture<StrataSelect>(
      html`<strata-select label="Role" .options=${options} value="admin"></strata-select>`
    );
    expect(el.shadowRoot!.querySelector('select')!.value).to.equal('admin');
  });

  it('disables the native select', async () => {
    const el = await fixture<StrataSelect>(
      html`<strata-select label="Role" .options=${options} disabled></strata-select>`
    );
    expect(el.shadowRoot!.querySelector('select')!.disabled).to.be.true;
  });

  it('shows error text with aria-invalid and aria-describedby', async () => {
    const el = await fixture<StrataSelect>(
      html`<strata-select
        label="Role"
        .options=${options}
        value="editor"
        error="Choose a role"
      ></strata-select>`
    );
    const select = el.shadowRoot!.querySelector('select')!;
    expect(select.getAttribute('aria-invalid')).to.equal('true');
    expect(select.getAttribute('aria-describedby')).to.contain('error');
    expect(el.shadowRoot!.querySelector('#error')!.textContent).to.contain('Choose a role');
  });

  it('shows hint text linked via aria-describedby', async () => {
    const el = await fixture<StrataSelect>(
      html`<strata-select
        label="Role"
        .options=${options}
        value="editor"
        hint="Admins can invite"
      ></strata-select>`
    );
    expect(el.shadowRoot!.querySelector('select')!.getAttribute('aria-describedby')).to.contain(
      'hint'
    );
  });

  it('emits a composed change event and syncs value', async () => {
    const el = await fixture<StrataSelect>(
      html`<strata-select label="Role" .options=${options} value="editor"></strata-select>`
    );
    const select = el.shadowRoot!.querySelector('select')!;
    setTimeout(() => {
      select.value = 'viewer';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const event = await oneEvent(el, 'change');
    expect(event.composed).to.be.true;
    expect(el.value).to.equal('viewer');
  });

  it('participates in forms via ElementInternals', async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <strata-select label="Role" name="role" .options=${options} value="admin"></strata-select>
      </form>`
    );
    const data = new FormData(form);
    expect(data.get('role')).to.equal('admin');
  });

  it('is accessible in default, error, hint and disabled states', async () => {
    for (const tpl of [
      html`<strata-select label="Role" .options=${options} value="editor"></strata-select>`,
      html`<strata-select label="Role" .options=${options} error="Bad"></strata-select>`,
      html`<strata-select label="Role" .options=${options} hint="Hint"></strata-select>`,
      html`<strata-select label="Role" .options=${options} disabled></strata-select>`,
    ]) {
      const el = await fixture<StrataSelect>(tpl);
      await expect(el).to.be.accessible();
    }
  });
});
