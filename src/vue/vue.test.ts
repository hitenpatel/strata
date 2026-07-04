import { expect } from '@open-wc/testing';
import { createApp, h, type App } from 'vue';
import { Strata } from './index.js';
import type { StrataButton } from '../components/button/button.js';
import type { StrataSelect } from '../components/select/select.js';

const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

describe('Vue integration', () => {
  let container: HTMLDivElement;
  let app: App | undefined;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    app?.unmount();
    container.remove();
  });

  it('renders strata-button inside a Vue app', async () => {
    app = createApp({
      render: () => h('strata-button', { variant: 'secondary' }, 'Save'),
    });
    app.use(Strata);
    app.mount(container);
    await nextFrame();
    const el = container.querySelector('strata-button') as StrataButton;
    expect(el).to.exist;
    expect(el.variant).to.equal('secondary');
    expect(el.shadowRoot!.querySelector('button')).to.exist;
  });

  it('passes array props with .prop modifier semantics', async () => {
    const options = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ];
    app = createApp({
      render: () => h('strata-select', { label: 'Choice', '.options': options, '.value': 'b' }),
    });
    app.use(Strata);
    app.mount(container);
    await nextFrame();
    const el = container.querySelector('strata-select') as StrataSelect;
    expect(el.options).to.deep.equal(options);
    expect(el.value).to.equal('b');
  });

  it('receives custom events via Vue listeners', async () => {
    let received = '';
    app = createApp({
      render: () =>
        h(
          'strata-menu',
          { onSelect: (e: CustomEvent<{ value: string }>) => (received = e.detail.value) },
          [h('button', { slot: 'trigger' }, 'Open'), h('strata-menu-item', { value: 'x' }, 'X')]
        ),
    });
    app.use(Strata);
    app.mount(container);
    await nextFrame();
    const menu = container.querySelector('strata-menu')!;
    menu.dispatchEvent(new CustomEvent('select', { detail: { value: 'x' }, bubbles: true }));
    expect(received).to.equal('x');
  });
});
