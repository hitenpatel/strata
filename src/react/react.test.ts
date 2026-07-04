import { expect } from '@open-wc/testing';
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import type { Root } from 'react-dom/client';

const { createRoot } = ReactDOMClient;
import { Button, Pagination, Input } from './index.js';
import type { StrataButton } from '../components/button/button.js';
import type { StrataInput } from '../components/input/input.js';

// React 19 flushes concurrent renders in a macrotask (MessageChannel), which
// can land after the next animation frame — wait for both.
const nextFrame = async () => {
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => requestAnimationFrame(r));
};

describe('React wrappers', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    container.remove();
  });

  it('renders strata-button and passes props as properties', async () => {
    root.render(React.createElement(Button, { variant: 'danger', loading: true }, 'Delete'));
    await nextFrame();
    const el = container.querySelector('strata-button') as StrataButton;
    expect(el).to.exist;
    expect(el.variant).to.equal('danger');
    expect(el.loading).to.be.true;
    expect(el.shadowRoot!.querySelector('button')!.getAttribute('aria-busy')).to.equal('true');
  });

  it('wires custom events to React handlers', async () => {
    let page = 0;
    root.render(
      React.createElement(Pagination, {
        page: 1,
        total: 5,
        onPageChange: (e: CustomEvent<{ page: number }>) => (page = e.detail.page),
      })
    );
    await nextFrame();
    const el = container.querySelector('strata-pagination')!;
    el.dispatchEvent(new CustomEvent('page-change', { detail: { page: 3 }, bubbles: true }));
    expect(page).to.equal(3);
  });

  it('passes rich props (value) to form controls', async () => {
    root.render(React.createElement(Input, { label: 'Email', value: 'a@b.dev' }));
    await nextFrame();
    const el = container.querySelector('strata-input') as StrataInput;
    expect(el.value).to.equal('a@b.dev');
    expect(el.label).to.equal('Email');
  });
});
