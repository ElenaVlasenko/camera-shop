import { useEffect, useRef, useState } from 'react';
import { Camera } from '../../types';
import { KEYCODE_TAB } from '../../const';
import { Link } from 'react-router-dom';

type Props = {
  camera: Camera;
  onCloseButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onContinueShoppingButtonClick: () => void;
};

function ModalCartDelete({ camera, onDeleteButtonClick, onCloseButtonClick, onContinueShoppingButtonClick }: Props): JSX.Element | null {

  const closeButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
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

  useEffect(() => {
    const focusRefs: { current: HTMLElement | null }[] = [continueShoppingButtonRef, closeButtonRef, deleteButtonRef];

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

  if (camera === null) {
    return null;
  }

  const { name, previewImg, vendorCode, level, type, previewImg2x, previewImgWebp, previewImgWebp2x } = camera;

  return (
    <div className="modal is-active">
      <div className="modal__wrapper">
        <div className="modal__overlay" onClick={onCloseButtonClick} />
        <div className="modal__content">
          <p className="title title--h4">Удалить этот товар?</p>
          <div className="basket-item basket-item--short">
            <div className="basket-item__img">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`../../../public/${previewImgWebp}, ../../../public/${previewImgWebp2x} 2x`}
                />
                <img
                  src={`../../../public/${previewImg}`}
                  srcSet={`../../../public/${previewImg2x} 2x`}
                  width={140}
                  height={120}
                  alt={name}
                />
              </picture>
            </div>
            <div className="basket-item__description">
              <p className="basket-item__title">{name}</p>
              <ul className="basket-item__list">
                <li className="basket-item__list-item">
                  <span className="basket-item__article">Артикул:</span>{' '}
                  <span className="basket-item__number">{vendorCode}</span>
                </li>
                <li className="basket-item__list-item">{type}</li>
                <li className="basket-item__list-item">{level}</li>
              </ul>
            </div>
          </div>
          <div className="modal__buttons">
            <button
              ref={deleteButtonRef}
              onClick={onDeleteButtonClick}
              className="btn btn--purple modal__btn modal__btn--half-width"
              type="button"
            >
              Удалить
            </button>
            <Link
              onClick={onContinueShoppingButtonClick}
              ref={continueShoppingButtonRef}
              className="btn btn--transparent modal__btn modal__btn--half-width"
              to=''
            >
              Продолжить покупки
            </Link>
          </div>
          <button onClick={onCloseButtonClick} ref={closeButtonRef} className="cross-btn" type="button" aria-label="Закрыть попап">
            <svg width={10} height={10} aria-hidden="true">
              <use xlinkHref="#icon-close" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCartDelete;
