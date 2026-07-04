import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './badge.js';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'strata-badge',
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
    label: { control: 'text' },
  },
  args: {
    tone: 'neutral',
    label: 'Badge',
  },
  render: (args) => html`
    <strata-badge tone=${args.tone}>${args.label}</strata-badge>
  `,
};
export default meta;

type Story = StoryObj;

export const Neutral: Story = {};
export const Accent: Story = { args: { tone: 'accent', label: 'Beta' } };
export const Success: Story = { args: { tone: 'success', label: 'Active' } };
export const Warning: Story = { args: { tone: 'warning', label: 'Invited' } };
export const Danger: Story = { args: { tone: 'danger', label: 'Suspended' } };

export const AllTones: Story = {
  render: () => html`
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <strata-badge tone="neutral">Neutral</strata-badge>
      <strata-badge tone="accent">Beta</strata-badge>
      <strata-badge tone="success">Active</strata-badge>
      <strata-badge tone="warning">Invited</strata-badge>
      <strata-badge tone="danger">Suspended</strata-badge>
    </div>
  `,
};
