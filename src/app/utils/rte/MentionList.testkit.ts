import { within } from '@testing-library/react';

export const getMentionListTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getCreateButton: () =>
    within(component).getByRole('button', { name: /create/i }),
});
