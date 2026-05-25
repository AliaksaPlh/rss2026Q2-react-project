import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from '../types/movieTypes';

interface SelectedMoviesState {
  selected: Movie[];
}

const initialState: SelectedMoviesState = {
  selected: [],
};

const selectedMoviesSlice = createSlice({
  name: 'selectedMovies',
  initialState,
  reducers: {
    addSelectedMovie: (state, action: PayloadAction<Movie>) => {
      const exists = state.selected.some(
        (movie) => movie.id === action.payload.id
      );

      if (exists) {
        return state;
      }

      return {
        ...state,
        selected: [...state.selected, action.payload],
      };
    },
    removeSelectedMovie: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        selected: state.selected.filter((movie) => movie.id !== action.payload),
      };
    },
    toggleSelectedMovie: (state, action: PayloadAction<Movie>) => {
      const exists = state.selected.some(
        (movie) => movie.id === action.payload.id
      );

      if (exists) {
        return {
          ...state,
          selected: state.selected.filter(
            (movie) => movie.id !== action.payload.id
          ),
        };
      }

      return {
        ...state,
        selected: [...state.selected, action.payload],
      };
    },
    clearAllSelectedMovies(state) {
      return {
        ...state,
        selected: [],
      };
    },
  },
  selectors: {
    selectSelectedMovies: (state: SelectedMoviesState) => state.selected,
    selectSelectedMovieIds: (state: SelectedMoviesState) =>
      state.selected.map((movie) => movie.id),
  },
});
export const {
  addSelectedMovie,
  removeSelectedMovie,
  toggleSelectedMovie,
  clearAllSelectedMovies,
} = selectedMoviesSlice.actions;

export const { selectSelectedMovies, selectSelectedMovieIds } =
  selectedMoviesSlice.selectors;
export default selectedMoviesSlice.reducer;
