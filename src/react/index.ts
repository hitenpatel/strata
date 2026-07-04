import React from 'react';
import { createComponent, type EventName } from '@lit/react';

import { StrataButton } from '../components/button/button.js';
import { StrataIconButton } from '../components/icon-button/icon-button.js';
import { StrataInput } from '../components/input/input.js';
import { StrataTextarea } from '../components/textarea/textarea.js';
import { StrataSelect } from '../components/select/select.js';
import { StrataCheckbox } from '../components/checkbox/checkbox.js';
import { StrataRadio } from '../components/radio/radio.js';
import { StrataRadioGroup } from '../components/radio/radio-group.js';
import { StrataSwitch } from '../components/switch/switch.js';
import { StrataBadge } from '../components/badge/badge.js';
import { StrataCard } from '../components/card/card.js';
import { StrataAvatar } from '../components/avatar/avatar.js';
import { StrataSkeleton } from '../components/skeleton/skeleton.js';
import { StrataTooltip } from '../components/tooltip/tooltip.js';
import { StrataToast, StrataToastRegion } from '../components/toast/toast.js';
import { StrataDialog } from '../components/dialog/dialog.js';
import { StrataTabs, StrataTab, StrataTabPanel } from '../components/tabs/tabs.js';
import { StrataMenu, StrataMenuItem } from '../components/menu/menu.js';
import { StrataTable } from '../components/table/table.js';
import { StrataBreadcrumb } from '../components/breadcrumb/breadcrumb.js';
import { StrataPagination } from '../components/pagination/pagination.js';

export type {
  ButtonVariant,
  IconButtonVariant,
  BadgeTone,
  AvatarSize,
  SkeletonVariant,
  TooltipPlacement,
  ToastTone,
} from '../index.js';
export type { SelectOption } from '../components/select/select.js';
export type { BreadcrumbItem } from '../components/breadcrumb/breadcrumb.js';
export type { StrataTableColumn } from '../components/table/table.js';

export const Button = createComponent({
  react: React,
  tagName: 'strata-button',
  elementClass: StrataButton,
});

export const IconButton = createComponent({
  react: React,
  tagName: 'strata-icon-button',
  elementClass: StrataIconButton,
});

export const Input = createComponent({
  react: React,
  tagName: 'strata-input',
  elementClass: StrataInput,
  events: {
    onInput: 'input' as EventName<Event>,
    onChange: 'change' as EventName<Event>,
  },
});

export const Textarea = createComponent({
  react: React,
  tagName: 'strata-textarea',
  elementClass: StrataTextarea,
  events: {
    onInput: 'input' as EventName<Event>,
    onChange: 'change' as EventName<Event>,
  },
});

export const Select = createComponent({
  react: React,
  tagName: 'strata-select',
  elementClass: StrataSelect,
  events: { onChange: 'change' as EventName<Event> },
});

export const Checkbox = createComponent({
  react: React,
  tagName: 'strata-checkbox',
  elementClass: StrataCheckbox,
  events: { onChange: 'change' as EventName<Event> },
});

export const Radio = createComponent({
  react: React,
  tagName: 'strata-radio',
  elementClass: StrataRadio,
  events: { onChange: 'change' as EventName<Event> },
});

export const RadioGroup = createComponent({
  react: React,
  tagName: 'strata-radio-group',
  elementClass: StrataRadioGroup,
  events: { onChange: 'change' as EventName<Event> },
});

export const Switch = createComponent({
  react: React,
  tagName: 'strata-switch',
  elementClass: StrataSwitch,
  events: { onChange: 'change' as EventName<Event> },
});

export const Badge = createComponent({
  react: React,
  tagName: 'strata-badge',
  elementClass: StrataBadge,
});

export const Card = createComponent({
  react: React,
  tagName: 'strata-card',
  elementClass: StrataCard,
});

export const Avatar = createComponent({
  react: React,
  tagName: 'strata-avatar',
  elementClass: StrataAvatar,
});

export const Skeleton = createComponent({
  react: React,
  tagName: 'strata-skeleton',
  elementClass: StrataSkeleton,
});

export const Tooltip = createComponent({
  react: React,
  tagName: 'strata-tooltip',
  elementClass: StrataTooltip,
});

export const Toast = createComponent({
  react: React,
  tagName: 'strata-toast',
  elementClass: StrataToast,
  events: { onDismiss: 'strata-dismiss' as EventName<CustomEvent> },
});

export const ToastRegion = createComponent({
  react: React,
  tagName: 'strata-toast-region',
  elementClass: StrataToastRegion,
});

export const Dialog = createComponent({
  react: React,
  tagName: 'strata-dialog',
  elementClass: StrataDialog,
  events: { onClose: 'close' as EventName<Event> },
});

export const Tabs = createComponent({
  react: React,
  tagName: 'strata-tabs',
  elementClass: StrataTabs,
  events: { onChange: 'change' as EventName<CustomEvent<{ index: number }>> },
});

export const Tab = createComponent({
  react: React,
  tagName: 'strata-tab',
  elementClass: StrataTab,
});

export const TabPanel = createComponent({
  react: React,
  tagName: 'strata-tab-panel',
  elementClass: StrataTabPanel,
});

export const Menu = createComponent({
  react: React,
  tagName: 'strata-menu',
  elementClass: StrataMenu,
  events: { onSelect: 'select' as EventName<CustomEvent<{ value: string }>> },
});

export const MenuItem = createComponent({
  react: React,
  tagName: 'strata-menu-item',
  elementClass: StrataMenuItem,
});

export const Table = createComponent({
  react: React,
  tagName: 'strata-table',
  elementClass: StrataTable,
});

export const Breadcrumb = createComponent({
  react: React,
  tagName: 'strata-breadcrumb',
  elementClass: StrataBreadcrumb,
});

export const Pagination = createComponent({
  react: React,
  tagName: 'strata-pagination',
  elementClass: StrataPagination,
  events: { onPageChange: 'page-change' as EventName<CustomEvent<{ page: number }>> },
});
