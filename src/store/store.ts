import { configureStore } from '@reduxjs/toolkit';
import selectedMoviesReducer from './slice';
import { movieApi } from '../api/rtk/movieApi';

const store = configureStore({
  reducer: {
    selectedMovies: selectedMoviesReducer,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
