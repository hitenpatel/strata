import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './tabs.js';

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'strata-tabs',
  argTypes: {
    selected: { control: { type: 'number', min: 0, max: 2 } },
  },
  args: {
    selected: 0,
  },
  render: (args) => html`
    <strata-tabs selected=${args.selected}>
      <strata-tab slot="tab">Account</strata-tab>
      <strata-tab slot="tab">Billing</strata-tab>
      <strata-tab slot="tab">Team</strata-tab>
      <strata-tab-panel>
        <h3 style="font-size:16px;font-weight:600;margin:0 0 6px">Account</h3>
        Your profile, email and password. Changes here apply across every
        workspace you belong to.
      </strata-tab-panel>
      <strata-tab-panel>
        <h3 style="font-size:16px;font-weight:600;margin:0 0 6px">Billing</h3>
        Invoices, payment methods and plan management for this workspace.
      </strata-tab-panel>
      <strata-tab-panel>
        <h3 style="font-size:16px;font-weight:600;margin:0 0 6px">Team</h3>
        Invite members, set roles and manage pending invitations.
      </strata-tab-panel>
    </strata-tabs>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const SecondSelected: Story = { args: { selected: 1 } };

export const KeyboardNavigation: Story = {
  name: 'Keyboard navigation',
  render: () => html`
    <p style="font:14px var(--strata-font-body);color:var(--strata-text-muted)">
      Focus the tablist, then use ←/→ to move between tabs (auto-activating)
      and Home/End to jump to first/last. Only the active tab is a tab stop.
    </p>
    <strata-tabs>
      <strata-tab slot="tab">Account</strata-tab>
      <strata-tab slot="tab">Billing</strata-tab>
      <strata-tab slot="tab">Team</strata-tab>
      <strata-tab-panel>Account settings panel.</strata-tab-panel>
      <strata-tab-panel>Billing settings panel.</strata-tab-panel>
      <strata-tab-panel>Team settings panel.</strata-tab-panel>
    </strata-tabs>
  `,
};
