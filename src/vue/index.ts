import type { App, Plugin } from 'vue';

// Importing the root entry registers every <strata-*> custom element.
import '../index.js';

import type { ButtonVariant } from '../components/button/button.js';
import type { IconButtonVariant } from '../components/icon-button/icon-button.js';
import type { BadgeTone } from '../components/badge/badge.js';
import type { AvatarSize } from '../components/avatar/avatar.js';
import type { SkeletonVariant } from '../components/skeleton/skeleton.js';
import type { TooltipPlacement } from '../components/tooltip/tooltip.js';
import type { ToastTone } from '../components/toast/toast.js';
import type { SelectOption } from '../components/select/select.js';
import type { BreadcrumbItem } from '../components/breadcrumb/breadcrumb.js';
import type { StrataTableColumn } from '../components/table/table.js';

export type {
  ButtonVariant,
  IconButtonVariant,
  BadgeTone,
  AvatarSize,
  SkeletonVariant,
  TooltipPlacement,
  ToastTone,
  SelectOption,
  BreadcrumbItem,
  StrataTableColumn,
};

/**
 * Tag predicate for Vue's compiler so <strata-*> tags are treated as custom
 * elements rather than unresolved Vue components. Vite:
 *
 *   vue({ template: { compilerOptions: { isCustomElement: isStrataElement } } })
 */
export const isStrataElement = (tag: string): boolean => tag.startsWith('strata-');

/**
 * Optional convenience plugin: `app.use(Strata)`. Element registration
 * happens on import; the plugin also sets the runtime custom-element
 * check for in-browser template compilation.
 */
export const Strata: Plugin = {
  install(app: App) {
    const prev = app.config.compilerOptions.isCustomElement;
    app.config.compilerOptions.isCustomElement = (tag) =>
      isStrataElement(tag) || (prev ? prev(tag) : false);
  },
};

type Base = {
  id?: string;
  class?: unknown;
  style?: unknown;
  slot?: string;
  key?: string | number;
};

declare module 'vue' {
  interface GlobalComponents {
    'strata-button': Base & {
      variant?: ButtonVariant;
      disabled?: boolean;
      loading?: boolean;
      type?: 'button' | 'submit' | 'reset';
    };
    'strata-icon-button': Base & {
      variant?: IconButtonVariant;
      disabled?: boolean;
      label?: string;
      type?: 'button' | 'submit' | 'reset';
    };
    'strata-input': Base & {
      label?: string;
      type?: string;
      value?: string;
      placeholder?: string;
      disabled?: boolean;
      required?: boolean;
      error?: string;
      hint?: string;
      name?: string;
      onInput?: (e: Event) => void;
      onChange?: (e: Event) => void;
    };
    'strata-textarea': Base & {
      label?: string;
      value?: string;
      placeholder?: string;
      disabled?: boolean;
      required?: boolean;
      rows?: number;
      error?: string;
      hint?: string;
      name?: string;
      onInput?: (e: Event) => void;
      onChange?: (e: Event) => void;
    };
    'strata-select': Base & {
      label?: string;
      options?: SelectOption[];
      value?: string;
      disabled?: boolean;
      required?: boolean;
      error?: string;
      hint?: string;
      name?: string;
      onChange?: (e: Event) => void;
    };
    'strata-checkbox': Base & {
      checked?: boolean;
      disabled?: boolean;
      indeterminate?: boolean;
      name?: string;
      value?: string;
      onChange?: (e: Event) => void;
    };
    'strata-radio': Base & {
      checked?: boolean;
      disabled?: boolean;
      name?: string;
      value?: string;
      onChange?: (e: Event) => void;
    };
    'strata-radio-group': Base & {
      label?: string;
      value?: string;
      onChange?: (e: Event) => void;
    };
    'strata-switch': Base & {
      checked?: boolean;
      disabled?: boolean;
      label?: string;
      onChange?: (e: Event) => void;
    };
    'strata-badge': Base & { tone?: BadgeTone };
    'strata-card': Base & { raised?: boolean };
    'strata-avatar': Base & { src?: string; name?: string; size?: AvatarSize };
    'strata-skeleton': Base & {
      variant?: SkeletonVariant;
      width?: string;
      height?: string;
    };
    'strata-tooltip': Base & { text?: string; placement?: TooltipPlacement };
    'strata-toast': Base & {
      tone?: ToastTone;
      heading?: string;
      'onStrata-dismiss'?: (e: CustomEvent) => void;
    };
    'strata-toast-region': Base;
    'strata-dialog': Base & {
      open?: boolean;
      heading?: string;
      onClose?: (e: Event) => void;
    };
    'strata-tabs': Base & {
      selected?: number;
      onChange?: (e: CustomEvent<{ index: number }>) => void;
    };
    'strata-tab': Base & { selected?: boolean };
    'strata-tab-panel': Base;
    'strata-menu': Base & {
      open?: boolean;
      onSelect?: (e: CustomEvent<{ value: string }>) => void;
    };
    'strata-menu-item': Base & { value?: string; danger?: boolean };
    'strata-table': Base & {
      columns?: StrataTableColumn[];
      rows?: Record<string, unknown>[];
      'empty-message'?: string;
    };
    'strata-breadcrumb': Base & { items?: BreadcrumbItem[] };
    'strata-pagination': Base & {
      page?: number;
      total?: number;
      'onPage-change'?: (e: CustomEvent<{ page: number }>) => void;
    };
  }
}
