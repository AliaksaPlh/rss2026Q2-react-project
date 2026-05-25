import { configureStore } from '@reduxjs/toolkit';
import selectedMoviesReducer from './slice';

const store = configureStore({
  reducer: {
    selectedMovies: selectedMoviesReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
