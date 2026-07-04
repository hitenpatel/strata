import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './breadcrumb.js';
import type { BreadcrumbItem } from './breadcrumb.js';

const items: BreadcrumbItem[] = [
  { label: 'Workspaces', href: '#workspaces' },
  { label: 'Noctal Studio', href: '#noctal' },
  { label: 'Members' },
];

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: 'strata-breadcrumb',
  render: () => html`<strata-breadcrumb .items=${items}></strata-breadcrumb>`,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};

export const TwoLevels: Story = {
  render: () => html`
    <strata-breadcrumb
      .items=${[
        { label: 'Settings', href: '#settings' },
        { label: 'Billing' },
      ] satisfies BreadcrumbItem[]}
    ></strata-breadcrumb>
  `,
};

export const DeepPath: Story = {
  render: () => html`
    <strata-breadcrumb
      .items=${[
        { label: 'Workspaces', href: '#a' },
        { label: 'Noctal Studio', href: '#b' },
        { label: 'Projects', href: '#c' },
        { label: 'Q3 Launch', href: '#d' },
        { label: 'Assets' },
      ] satisfies BreadcrumbItem[]}
    ></strata-breadcrumb>
  `,
};
