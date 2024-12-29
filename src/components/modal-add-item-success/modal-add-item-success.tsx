import { Link } from 'react-router-dom';
import { KEYCODE_TAB, PageRoute } from '../../const';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onContinueShoppingButtonClick: () => void;
  onGoToCartButtonClick: () => void;
  onCloseButtonClick: () => void;
}

function ModalAddItemSuccess({ onContinueShoppingButtonClick, onGoToCartButtonClick, onCloseButtonClick }: Props): JSX.Element {

  const closeButtonRef = useRef(null);
  const continueShoppingButtonRef = useRef(null);
  const goToCartButtonRef = useRef(null);
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

  useEffect(() => {
    const focusRefs: { current: HTMLElement | null }[] = [continueShoppingButtonRef, goToCartButtonRef, closeButtonRef];

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
        <div className="modal__overlay" onClick={onCloseButtonClick} />
        <div className="modal__content">
          <p className="title title--h4">Товар успешно добавлен в корзину</p>
          <svg className="modal__icon" width={86} height={80} aria-hidden="true">
            <use xlinkHref="#icon-success" />
          </svg>
          <div className="modal__buttons">
            <Link onClick={onContinueShoppingButtonClick} className="btn btn--transparent modal__btn" to={PageRoute.Cameras} ref={continueShoppingButtonRef}>
              Продолжить покупки
            </Link>
            <button onClick={onGoToCartButtonClick} className="btn btn--purple modal__btn modal__btn--fit-width" ref={goToCartButtonRef}>
              Перейти в корзину
            </button>
          </div>
          <button className="cross-btn" type="button" aria-label="Закрыть попап" onClick={onCloseButtonClick} ref={closeButtonRef}>
            <svg width={10} height={10} aria-hidden="true">
              <use xlinkHref="#icon-close" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAddItemSuccess;
