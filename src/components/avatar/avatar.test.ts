import { fixture, expect, html } from '@open-wc/testing';
import './avatar.js';
import type { StrataAvatar } from './avatar.js';

describe('strata-avatar', () => {
  it('derives initials from the name', async () => {
    const el = await fixture<StrataAvatar>(
      html`<strata-avatar name="Amara Khan"></strata-avatar>`
    );
    const span = el.shadowRoot!.querySelector('.avatar')!;
    expect(span.textContent!.trim()).to.equal('AK');
    expect(span.getAttribute('role')).to.equal('img');
    expect(span.getAttribute('aria-label')).to.equal('Amara Khan');
  });

  it('uses at most two initials', async () => {
    const el = await fixture<StrataAvatar>(
      html`<strata-avatar name="Dana Reyes Ortiz"></strata-avatar>`
    );
    expect(el.shadowRoot!.querySelector('.avatar')!.textContent!.trim()).to.equal(
      'DR'
    );
  });

  it('renders an image with alt text from name when src is set', async () => {
    const el = await fixture<StrataAvatar>(
      html`<strata-avatar
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        name="Dana Reyes"
      ></strata-avatar>`
    );
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img).to.exist;
    expect(img.getAttribute('alt')).to.equal('Dana Reyes');
  });

  it('defaults to md and reflects each size', async () => {
    const el = await fixture<StrataAvatar>(
      html`<strata-avatar name="A B"></strata-avatar>`
    );
    expect(el.getAttribute('size')).to.equal('md');
    for (const size of ['sm', 'md', 'lg'] as const) {
      const sized = await fixture<StrataAvatar>(
        html`<strata-avatar size=${size} name="A B"></strata-avatar>`
      );
      expect(sized.getAttribute('size')).to.equal(size);
    }
  });

  it('hides an empty avatar from assistive tech', async () => {
    const el = await fixture<StrataAvatar>(html`<strata-avatar></strata-avatar>`);
    const span = el.shadowRoot!.querySelector('.avatar')!;
    expect(span.getAttribute('aria-hidden')).to.equal('true');
  });

  it('is accessible with initials and with an image', async () => {
    const initials = await fixture<StrataAvatar>(
      html`<strata-avatar name="Amara Khan"></strata-avatar>`
    );
    await expect(initials).to.be.accessible();

    const image = await fixture<StrataAvatar>(
      html`<strata-avatar
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        name="Dana Reyes"
      ></strata-avatar>`
    );
    await expect(image).to.be.accessible();
  });
});
