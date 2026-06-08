import { describe, expect, it } from 'vitest';
import formReducer, {
  cleanFormData,
  setCountry,
  setFormData,
  setPhoto,
} from '../components/store/slice';
import { countries } from '../utils/consts';
import type { User } from '../utils/types';

const mockUser: User = {
  name: 'Alex',
  age: 25,
  eMail: 'alex@example.com',
  password: 'abcABC123456!',
  gender: 'female',
  photo: 'data:image/png;base64,test',
  country: 'BY',
};

describe('form slice', () => {
  it('returns initial state with countries list', () => {
    const state = formReducer(undefined, { type: 'unknown' });

    expect(state.name).toBe('');
    expect(state.age).toBe(0);
    expect(state.eMail).toBe('');
    expect(state.photo).toBe('');
    expect(state.country).toBe('');
    expect(state.submissions).toEqual([]);
    expect(state.countries).toEqual(countries);
  });

  it('stores submitted form data and adds it to submissions history', () => {
    const state = formReducer(undefined, setFormData(mockUser));

    expect(state.name).toBe('Alex');
    expect(state.eMail).toBe('alex@example.com');
    expect(state.photo).toBe('data:image/png;base64,test');
    expect(state.country).toBe('BY');
    expect(state.submissions).toEqual([mockUser]);
  });

  it('keeps all successful submissions in history', () => {
    const secondUser: User = {
      ...mockUser,
      name: 'Maria',
      eMail: 'maria@example.com',
      country: 'US',
    };

    const firstState = formReducer(undefined, setFormData(mockUser));
    const secondState = formReducer(firstState, setFormData(secondUser));

    expect(secondState.name).toBe('Maria');
    expect(secondState.eMail).toBe('maria@example.com');
    expect(secondState.submissions).toEqual([mockUser, secondUser]);
  });

  it('updates photo without adding a submission', () => {
    const state = formReducer(undefined, setPhoto('data:image/png;base64,new'));

    expect(state.photo).toBe('data:image/png;base64,new');
    expect(state.submissions).toEqual([]);
  });

  it('updates country without adding a submission', () => {
    const state = formReducer(undefined, setCountry('US'));

    expect(state.country).toBe('US');
    expect(state.submissions).toEqual([]);
  });

  it('resets form data, submissions history, and keeps countries list', () => {
    const filledState = formReducer(undefined, setFormData(mockUser));
    const cleanState = formReducer(filledState, cleanFormData());

    expect(cleanState.name).toBe('');
    expect(cleanState.photo).toBe('');
    expect(cleanState.country).toBe('');
    expect(cleanState.submissions).toEqual([]);
    expect(cleanState.countries).toEqual(countries);
  });
});
