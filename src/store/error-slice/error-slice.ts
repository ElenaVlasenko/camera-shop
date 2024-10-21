import { buildCreateSlice, asyncThunkCreator, PayloadAction } from '@reduxjs/toolkit';
import { getMessage } from '../../utils';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type ErrorState = {
  message: string | null;
}

export const initialState: ErrorState = {
  message: null,
};

export const ERROR_SLICE_NAME = 'error';

const errorSlice = createSliceWithThunks({
  name: ERROR_SLICE_NAME,
  initialState,
  selectors: {
    selectErrorMessage: (state) => state.message,
  },
  reducers: {
    setErrorMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    resetErrorMessage(state) {
      state.message = null;
    }
  },
});

export default errorSlice;

export const { selectErrorMessage } = errorSlice.selectors;

export const {
  setErrorMessage,
  resetErrorMessage
} = errorSlice.actions;

export const showErrorMessage = (err: unknown, dispatch: (action: unknown) => void) => {
  dispatch(setErrorMessage(getMessage(err)));
};
