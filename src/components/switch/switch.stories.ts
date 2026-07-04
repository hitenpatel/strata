import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './switch.js';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'strata-switch',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    checked: false,
    disabled: false,
    label: 'Email notifications',
  },
  render: (args) => html`
    <strata-switch ?checked=${args.checked} ?disabled=${args.disabled}
      >${args.label}</strata-switch
    >
  `,
};
export default meta;

type Story = StoryObj;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, checked: true } };

export const LabelOnly: Story = {
  name: 'aria-label without visible text',
  render: () => html`<strata-switch label="Enable dark mode"></strata-switch>`,
};

export const AllStates: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;align-items:flex-start">
      <strata-switch>Off</strata-switch>
      <strata-switch checked>On</strata-switch>
      <strata-switch disabled>Disabled off</strata-switch>
      <strata-switch disabled checked>Disabled on</strata-switch>
    </div>
  `,
};
