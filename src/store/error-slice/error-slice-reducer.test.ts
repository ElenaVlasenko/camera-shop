import errorSlice, { ErrorState, initialState, resetErrorMessage, setErrorMessage } from './error-slice';

describe('Error slice reducer tests', () => {
  it('setErrorMessage sets error message', () => {
    const state: ErrorState = {
      ...initialState
    };
    const error = ('test error');

    const action = setErrorMessage(error);
    const newState = errorSlice.reducer(state, action);

    expect(newState.message).toBe(error);
  });
  it('resetErrorMessage resets error message', () => {
    const error = ('test error');
    const state: ErrorState = {
      ...initialState,
      message: error
    };

    const action = resetErrorMessage();
    const newState = errorSlice.reducer(state, action);

    expect(newState.message).toBe(null);
  });
});
