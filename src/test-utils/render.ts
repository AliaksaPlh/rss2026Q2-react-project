import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/store';

function ReduxProvider({ children }: { children: ReactNode }) {
  return createElement(Provider, { store }, children);
}

function render(ui: ReactElement) {
  return rtlRender(ui, { wrapper: ReduxProvider });
}

export { render };
export * from '@testing-library/react';
