import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './checkbox.js';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'strata-checkbox',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    label: 'Email me product updates',
  },
  render: (args) => html`
    <strata-checkbox
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?indeterminate=${args.indeterminate}
      >${args.label}</strata-checkbox
    >
  `,
};
export default meta;

type Story = StoryObj;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all' },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, checked: true } };

export const AllStates: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column">
      <strata-checkbox>Unchecked</strata-checkbox>
      <strata-checkbox checked>Checked</strata-checkbox>
      <strata-checkbox indeterminate>Indeterminate</strata-checkbox>
      <strata-checkbox disabled>Disabled</strata-checkbox>
      <strata-checkbox disabled checked>Disabled checked</strata-checkbox>
    </div>
  `,
};
