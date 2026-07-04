import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './menu.js';

const meta: Meta = {
  title: 'Components/Menu',
  component: 'strata-menu',
  render: () => html`
    <div style="min-height:240px">
      <strata-menu
        @select=${(e: CustomEvent<{ value: string }>) =>
          console.log('selected:', e.detail.value)}
      >
        <button
          slot="trigger"
          style="display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;
                 border-radius:var(--strata-radius-md,10px);
                 border:1px solid var(--strata-border-strong,#cbd5e1);
                 background:var(--strata-surface,#fff);color:var(--strata-text,#0f172a);
                 font:600 14px var(--strata-font-body,sans-serif);cursor:pointer"
        >
          Actions
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <strata-menu-item value="rename">Rename…</strata-menu-item>
        <strata-menu-item value="duplicate">Duplicate</strata-menu-item>
        <strata-menu-item value="archive">Archive</strata-menu-item>
        <strata-menu-item value="delete" danger>Delete workspace</strata-menu-item>
      </strata-menu>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: 'Open on click (interactive)',
};

export const KeyboardHints: Story = {
  name: 'Keyboard behaviour',
  render: () => html`
    <p style="font:14px var(--strata-font-body);color:var(--strata-text-muted);max-width:56ch">
      Enter or ↓ on the trigger opens the menu and focuses the first item
      (↑ focuses the last). Arrows move between items, Enter activates,
      Esc closes and returns focus to the trigger, and clicking outside closes.
    </p>
    <div style="min-height:220px">
      <strata-menu>
        <button
          slot="trigger"
          style="height:40px;padding:0 16px;border-radius:var(--strata-radius-md,10px);
                 border:1px solid var(--strata-border-strong,#cbd5e1);
                 background:var(--strata-surface,#fff);color:var(--strata-text,#0f172a);
                 font:600 14px var(--strata-font-body,sans-serif);cursor:pointer"
        >
          Options
        </button>
        <strata-menu-item value="one">First action</strata-menu-item>
        <strata-menu-item value="two">Second action</strata-menu-item>
        <strata-menu-item value="three">Third action</strata-menu-item>
      </strata-menu>
    </div>
  `,
};
