import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './toast.js';

const meta: Meta = {
  title: 'Components/Toast',
  component: 'strata-toast',
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'danger'] },
    heading: { control: 'text' },
    message: { control: 'text' },
  },
  args: {
    tone: 'success',
    heading: 'Saved',
    message: 'Your workspace settings were updated.',
  },
  render: (args) => html`
    <strata-toast
      tone=${args.tone}
      heading=${args.heading}
      style="max-width:360px"
      >${args.message}</strata-toast
    >
  `,
};
export default meta;

type Story = StoryObj;

export const Success: Story = {};
export const Info: Story = {
  args: { tone: 'info', heading: 'Heads up', message: 'A new version is available.' },
};
export const Danger: Story = {
  args: {
    tone: 'danger',
    heading: 'Deploy failed',
    message: 'The production deploy could not complete.',
  },
};

export const AllTones: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:360px">
      <strata-toast tone="info" heading="Heads up"
        >A new version is available.</strata-toast
      >
      <strata-toast tone="success" heading="Saved"
        >Your workspace settings were updated.</strata-toast
      >
      <strata-toast tone="danger" heading="Deploy failed"
        >The production deploy could not complete.</strata-toast
      >
    </div>
  `,
};

export const Region: Story = {
  name: 'Toast region (bottom-right stack)',
  render: () => html`
    <p style="font:14px var(--strata-font-body);color:var(--strata-text-muted)">
      Toasts stack in a fixed, polite live region at the bottom-right.
    </p>
    <strata-toast-region>
      <strata-toast tone="success" heading="Saved"
        >Settings updated.</strata-toast
      >
      <strata-toast tone="info">Background sync finished.</strata-toast>
    </strata-toast-region>
  `,
};
