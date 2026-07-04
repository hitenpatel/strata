import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './radio.js';
import './radio-group.js';

const meta: Meta = {
  title: 'Components/Radio',
  component: 'strata-radio-group',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'select', options: ['editor', 'admin', 'viewer'] },
  },
  args: {
    label: 'Role',
    value: 'editor',
  },
  render: (args) => html`
    <strata-radio-group label=${args.label} value=${args.value}>
      <strata-radio name="role" value="editor">Editor</strata-radio>
      <strata-radio name="role" value="admin">Admin</strata-radio>
      <strata-radio name="role" value="viewer">Viewer</strata-radio>
    </strata-radio-group>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const SecondSelected: Story = { args: { value: 'admin' } };

export const WithDisabledOption: Story = {
  render: () => html`
    <strata-radio-group label="Plan" value="pro">
      <strata-radio name="plan" value="free">Free</strata-radio>
      <strata-radio name="plan" value="pro">Pro</strata-radio>
      <strata-radio name="plan" value="enterprise" disabled>Enterprise (contact sales)</strata-radio>
    </strata-radio-group>
  `,
};

export const Standalone: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column">
      <strata-radio name="solo" value="a">Unselected</strata-radio>
      <strata-radio name="solo" value="b" checked>Selected</strata-radio>
      <strata-radio name="solo" value="c" disabled>Disabled</strata-radio>
    </div>
  `,
};
