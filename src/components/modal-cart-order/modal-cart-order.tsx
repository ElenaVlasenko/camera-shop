import { useEffect, useRef, useState } from 'react';
import { KEYCODE_TAB, REQUEST_STATUS, RequestStatus } from '../../const';
import { useHiddenOverflow } from '../../hooks/hooks';

type Props = {
  onCloseButtonClick: () => void;
  onContinueShoppingButtonClick: () => void;
  orderStatus: RequestStatus;
};

function ModalCartOrder({ onCloseButtonClick, onContinueShoppingButtonClick, orderStatus }: Props): JSX.Element {

  const closeButtonRef = useRef(null);
  const continueShoppingButtonRef = useRef(null);
  const [focusedRefIndex, setFocusedElementIndex] = useState(0);

  useEffect(
    () => {
      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
          onCloseButtonClick();
        }
      };

      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    },
    [onCloseButtonClick]
  );

  useHiddenOverflow();

  useEffect(() => {
    const focusRefs: { current: HTMLElement | null }[] = [continueShoppingButtonRef, closeButtonRef];

    const getNextFocusedElement = () =>
      focusedRefIndex === focusRefs.length - 1 ? 0 : focusedRefIndex + 1;

    function handleTabKey(event: KeyboardEvent) {
      const isTabPressed = (event.key === KEYCODE_TAB || event.code === KEYCODE_TAB);

      if (isTabPressed) {
        event.preventDefault();
        const newFocusedElementIndex = getNextFocusedElement();
        const elementRef = focusRefs.at(newFocusedElementIndex);
        elementRef?.current?.focus();
        setFocusedElementIndex(newFocusedElementIndex);
      }
    }

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [setFocusedElementIndex, focusedRefIndex, closeButtonRef]);

  return (
    <div className="modal is-active modal--narrow">
      <div className="modal__wrapper">
        <div className="modal__overlay" onClick={onCloseButtonClick}></div>
        <div className="modal__content">
          <p className="title title--h4">{orderStatus === REQUEST_STATUS.SUCCESS ? 'Спасибо за покупку' : 'При создании заказа произошла ошибка. Повторите попытку позднее.'}</p>
          {orderStatus === REQUEST_STATUS.SUCCESS ?
            <svg className="modal__icon" width="80" height="78" aria-hidden="true">
              <use xlinkHref="#icon-review-success"></use>
            </svg> : ''}
          <div className="modal__buttons">
            <button onClick={onContinueShoppingButtonClick} ref={continueShoppingButtonRef} className="btn btn--purple modal__btn modal__btn--fit-width" type="button">Вернуться к покупкам
            </button>
          </div>
          <button ref={closeButtonRef} onClick={onCloseButtonClick} className="cross-btn" type="button" aria-label="Закрыть попап">
            <svg width="10" height="10" aria-hidden="true">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCartOrder;
