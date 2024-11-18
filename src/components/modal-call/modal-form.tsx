import cn from 'classnames';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { CUSTOM_INPUT_WRAPPER_TEST_ID, MODAL_FORM_ERROR_MESSAGE, MODAL_FORM_SUBMIT_BUTTON_ID, TEL_INPUT_ID } from './utils';
import { KEYCODE_TAB } from '../../const';

const phoneRe = /^(?:\+7|8)(?:\(9\d{2}\)|9\d{2})[- ]?\d{3}[- ]?\d{2}[- ]?\d{2}$/;

type Props = {
  onSubmit: (tel: string) => void;
  closeButtonRef: { current: HTMLElement | null };
}

function ModalForm({ onSubmit, closeButtonRef }: Props): JSX.Element {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [focusedRefIndex, setFocusedElementIndex] = useState(0);

  useEffect(() => {
    const focusRefs: { current: HTMLElement | null }[] = [inputRef, submitButtonRef, closeButtonRef];

    const getNextFocusedElement = () =>
      focusedRefIndex === focusRefs.length - 1 ? 0 : focusedRefIndex + 1;

    function handleEscapeKey(event: KeyboardEvent) {
      const isTabPressed = (event.key === KEYCODE_TAB || event.code === KEYCODE_TAB);

      if (isTabPressed) {
        event.preventDefault();
        const newFocusedElementIndex = getNextFocusedElement();
        const elementRef = focusRefs.at(newFocusedElementIndex);
        elementRef?.current?.focus();
        setFocusedElementIndex(newFocusedElementIndex);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [setFocusedElementIndex, focusedRefIndex, closeButtonRef]);

  const handleButtonClick = (evt: MouseEvent) => {
    evt.preventDefault();
    const isTelValid = phoneRe.test(phone);
    setIsValid(isTelValid);

    if (isTelValid) {
      const standardPhone = phone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');
      const phoneDigits = standardPhone.slice(standardPhone.length - PHONE_DIGITS_LENGTH, standardPhone.length);
      onSubmit(`+79${phoneDigits}`);
    }
  };

  return (
    <>
      <div data-testid={CUSTOM_INPUT_WRAPPER_TEST_ID} className={cn('custom-input', 'form-review__item', { 'is-invalid': !isValid })}>
        <label>
          <span className="custom-input__label">
            Телефон
            <svg width={9} height={9} aria-hidden="true">
              <use xlinkHref="#icon-snowflake" />
            </svg>
          </span>
          <input
            data-testid={TEL_INPUT_ID}
            ref={inputRef}
            autoFocus
            onChange={(evt) => setPhone(evt.currentTarget.value)}
            type="tel"
            name="user-tel"
            placeholder="Введите ваш номер"
            required
          />
        </label>
        <p className="custom-input__error">{MODAL_FORM_ERROR_MESSAGE}</p>
      </div>
      <div className="modal__buttons">
        <button
          data-testid={MODAL_FORM_SUBMIT_BUTTON_ID}
          ref={submitButtonRef}
          onClick={handleButtonClick}
          className="btn btn--purple modal__btn modal__btn--fit-width"
          type="button"
        >
          <svg width={24} height={16} aria-hidden="true">
            <use xlinkHref="#icon-add-basket" />
          </svg>
          Заказать
        </button>
      </div>
    </>
  );
}

export default ModalForm;
