import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';
import store from '../store/store';
import { movieApi } from '../api/rtk/movieApi';

beforeEach(() => {
  store.dispatch(movieApi.util.resetApiState());
});
