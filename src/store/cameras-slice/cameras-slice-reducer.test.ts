import slice, { CamerasState, defaultState, setSelectedCameraId } from './cameras-slice';

describe('Cameras slice reducer tests', () => {
  it('setSelectedCameraId reducer sets state.selectedCameraId value', () => {
    const selectedCameraId = 1;

    const state: CamerasState = {
      ...defaultState,
    };

    const action = setSelectedCameraId(selectedCameraId);
    const newState = slice.reducer(state, action);

    expect(newState.selectedCameraId).toBe(selectedCameraId);
  });
});
