import { createElement, type ReactElement, type ReactNode } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { TestReduxProvider } from './TestReduxProvider';

function render(ui: ReactElement) {
  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(TestReduxProvider, null, children),
  });
}

export { render };
export * from '@testing-library/react';
