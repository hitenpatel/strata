import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './tooltip.js';
import '../button/button.js';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: 'strata-tooltip',
  argTypes: {
    text: { control: 'text' },
    placement: { control: 'select', options: ['top', 'bottom'] },
  },
  args: {
    text: 'Copy API key',
    placement: 'top',
  },
  render: (args) => html`
    <div style="padding:60px;display:flex;justify-content:center">
      <strata-tooltip text=${args.text} placement=${args.placement}>
        <strata-button variant="secondary">Hover or focus me</strata-button>
      </strata-tooltip>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Top: Story = {};
export const Bottom: Story = { args: { placement: 'bottom' } };

export const KeyboardAndEscape: Story = {
  name: 'Keyboard focus + Escape',
  render: () => html`
    <p style="font:14px var(--strata-font-body);color:var(--strata-text-muted)">
      Tab to the button to show the tooltip; press Escape to dismiss it.
    </p>
    <div style="padding:50px;display:flex;gap:40px;justify-content:center">
      <strata-tooltip text="Shown on focus too">
        <strata-button variant="secondary">Focusable trigger</strata-button>
      </strata-tooltip>
    </div>
  `,
};
