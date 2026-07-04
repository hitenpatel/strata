import { fixture, expect, html } from '@open-wc/testing';
import './breadcrumb.js';
import type { StrataBreadcrumb, BreadcrumbItem } from './breadcrumb.js';

const items: BreadcrumbItem[] = [
  { label: 'Workspaces', href: '#workspaces' },
  { label: 'Noctal Studio', href: '#noctal' },
  { label: 'Members' },
];

describe('strata-breadcrumb', () => {
  it('renders a nav labelled Breadcrumb containing an ordered list', async () => {
    const el = await fixture<StrataBreadcrumb>(
      html`<strata-breadcrumb .items=${items}></strata-breadcrumb>`
    );
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).to.equal('Breadcrumb');
    expect(nav.querySelector('ol')).to.exist;
  });

  it('renders links for ancestor items with hrefs', async () => {
    const el = await fixture<StrataBreadcrumb>(
      html`<strata-breadcrumb .items=${items}></strata-breadcrumb>`
    );
    const links = Array.from(el.shadowRoot!.querySelectorAll('a'));
    expect(links).to.have.length(2);
    expect(links[0]!.getAttribute('href')).to.equal('#workspaces');
    expect(links[0]!.textContent!.trim()).to.equal('Workspaces');
  });

  it('marks the last item aria-current="page" and does not link it', async () => {
    const el = await fixture<StrataBreadcrumb>(
      html`<strata-breadcrumb .items=${items}></strata-breadcrumb>`
    );
    const current = el.shadowRoot!.querySelector('[aria-current="page"]')!;
    expect(current.textContent!.trim()).to.equal('Members');
    expect(current.querySelector('a')).to.not.exist;
  });

  it('renders aria-hidden "/" separators between items', async () => {
    const el = await fixture<StrataBreadcrumb>(
      html`<strata-breadcrumb .items=${items}></strata-breadcrumb>`
    );
    const separators = Array.from(el.shadowRoot!.querySelectorAll('.separator'));
    expect(separators).to.have.length(2);
    separators.forEach((sep) => {
      expect(sep.getAttribute('aria-hidden')).to.equal('true');
      expect(sep.textContent!.trim()).to.equal('/');
    });
  });

  it('is accessible', async () => {
    const el = await fixture<StrataBreadcrumb>(
      html`<strata-breadcrumb .items=${items}></strata-breadcrumb>`
    );
    await expect(el).to.be.accessible();
  });
});
