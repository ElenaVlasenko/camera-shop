import { render, screen, act } from '@testing-library/react';
import { clickTo, typeTo } from '../../test/utils';
import { CUSTOM_INPUT_WRAPPER_TEST_ID, MODAL_FORM_SUBMIT_BUTTON_ID, TEL_INPUT_ID } from './utils';
import ModalForm from './modal-form';

const typeToTelInput = typeTo(TEL_INPUT_ID);
const clickSubmitButton = clickTo(MODAL_FORM_SUBMIT_BUTTON_ID);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const renderSut = (onSubmit: (tel: string) => void = () => { }) => {
  render(<ModalForm closeButtonRef={{ current: null }} onSubmit={onSubmit} />);
};

describe('modal form tests', () => {
  it('custom input have been marked as invalid when submit button was clicked and tel input contains invalid value', async () => {
    const illegalValue = '123qwe';

    renderSut();

    await act(() => typeToTelInput(illegalValue));
    await clickSubmitButton();

    const el = screen.queryByTestId(CUSTOM_INPUT_WRAPPER_TEST_ID);
    expect(el?.className.includes('is-invalid')).toBe(true);
  });

  it('custom input not marked as invalid when tel input contains invalid value and submit button was not clicked', async () => {
    const illegalValue = '123qwe';

    renderSut();

    await act(() => typeToTelInput(illegalValue));

    const el = screen.queryByTestId(CUSTOM_INPUT_WRAPPER_TEST_ID);
    expect(el?.className.includes('is-invalid')).toBe(false);
  });

  it('tel value have been forwarded to "onSubmit" handler on submit button click', async () => {
    const correctTelValue = '+79999999999';
    let submittedTel = '';

    renderSut((tel) => {
      submittedTel = tel;
    });

    await act(() => typeToTelInput(correctTelValue));
    await clickSubmitButton();

    expect(submittedTel).toEqual(correctTelValue);
  });
});
