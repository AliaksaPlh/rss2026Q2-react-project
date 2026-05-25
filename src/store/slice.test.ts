import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import MovieReducer from './slice';
import {
  addSelectedMovie,
  removeSelectedMovie,
  toggleSelectedMovie,
  clearAllSelectedMovies,
} from './slice';
import { batmanMock, duneMock, supermanMock } from '../test-utils/testData';

describe('MovieSlice', () => {
  it('addSelectedMovie add correctly', () => {
    const initialState = { selected: [batmanMock, supermanMock] };
    const state = MovieReducer(initialState, addSelectedMovie(duneMock));
    expect(state.selected).toEqual([batmanMock, supermanMock, duneMock]);
  });

  it('does not add duplicate movies', () => {
    const initialState = {
      selected: [batmanMock],
    };
    const state = MovieReducer(initialState, addSelectedMovie(batmanMock));
    expect(state.selected).toEqual([batmanMock]);
  });

  it('removeSelectedMovie remove correctly', () => {
    const initialState = {
      selected: [batmanMock, supermanMock, duneMock],
    };
    const state = MovieReducer(initialState, removeSelectedMovie(duneMock.id));
    expect(state.selected).toEqual([batmanMock, supermanMock]);
  });

  it('toggleSelectedMovie selects and unselects movies', () => {
    const selectedState = MovieReducer(
      { selected: [] },
      toggleSelectedMovie(batmanMock)
    );
    expect(selectedState.selected).toEqual([batmanMock]);

    const unselectedState = MovieReducer(
      selectedState,
      toggleSelectedMovie(batmanMock)
    );
    expect(unselectedState.selected).toEqual([]);
  });

  it('clearAllSelectedMovies clear all, empty arr in state', () => {
    const initialState = {
      selected: [batmanMock, supermanMock, duneMock],
    };
    const state = MovieReducer(initialState, clearAllSelectedMovies());
    expect(state.selected).length(0);
  });
});
