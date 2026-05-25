import { createElement } from 'react';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store/store';

const ReduxStoreProvider = Provider as ComponentType<{
  store: typeof store;
  children?: ReactNode;
}>;

function ReduxProvider({ children }: { children: ReactNode }) {
  return createElement(ReduxStoreProvider, { store }, children);
}

function render(ui: ReactElement) {
  return rtlRender(ui, { wrapper: ReduxProvider });
}

export { render };
export * from '@testing-library/react';
