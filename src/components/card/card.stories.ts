import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './card.js';

const meta: Meta = {
  title: 'Components/Card',
  component: 'strata-card',
  argTypes: {
    raised: { control: 'boolean' },
  },
  args: {
    raised: false,
  },
  render: (args) => html`
    <strata-card ?raised=${args.raised} style="max-width:340px">
      <h3 style="font-size:17px;font-weight:600;margin:0 0 6px">
        Usage this month
      </h3>
      <p style="font-size:14px;color:var(--strata-text-muted);margin:0">
        42,180 API calls across 3 environments.
      </p>
    </strata-card>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const Raised: Story = { args: { raised: true } };

export const WithHeaderAndFooter: Story = {
  render: () => html`
    <strata-card style="max-width:340px">
      <span slot="header">Billing summary</span>
      <p style="font-size:14px;color:var(--strata-text-muted);margin:0">
        Next invoice is due on 1 August for £42.00.
      </p>
      <span
        slot="footer"
        style="font-size:13px;color:var(--strata-text-subtle)"
        >Updated 2 hours ago</span
      >
    </strata-card>
  `,
};
