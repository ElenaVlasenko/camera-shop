import { useEffect, useRef } from 'react';
import { Camera } from '../../types';
import ModalForm from './modal-form';
import { useAppDispatch } from '../../hooks/hooks';
import { addOrderAction } from '../../store/order-slice.ts/order-slice';
import { makeCameraModalTestId, MODAL_CLOSE_BUTTON_ID } from './utils';

type Props = {
  camera: Camera | null;
  onCloseButtonClick: () => void;
};

function ModalCall({ camera, onCloseButtonClick }: Props): JSX.Element | null {
  const dispatch = useAppDispatch();

  const closeButtonRef = useRef(null);

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

  if (camera === null) {
    return null;
  }

  const { name, previewImg, vendorCode, level, type, price, previewImg2x, previewImgWebp, previewImgWebp2x, id } = camera;

  const handleFormSubmit = (tel: string) => {
    dispatch(addOrderAction({ camerasIds: [id], coupon: null, tel }));
    onCloseButtonClick();
  };

  return (
    <div data-testid={makeCameraModalTestId(id)} className="modal is-active">
      <div className="modal__wrapper">
        <div
          onClick={onCloseButtonClick}
          className="modal__overlay"
        />
        <div className="modal__content">
          <p className="title title--h4">Свяжитесь со мной</p>
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
              <p className="basket-item__price">
                <span className="visually-hidden">Цена:</span>{price.toLocaleString('ru')} ₽
              </p>
            </div>
          </div>
          <ModalForm onSubmit={handleFormSubmit} closeButtonRef={closeButtonRef} />
          <button
            data-testid={MODAL_CLOSE_BUTTON_ID}
            ref={closeButtonRef}
            onClick={onCloseButtonClick}
            className="cross-btn" type="button" aria-label="Закрыть попап"
          >
            <svg width={10} height={10} aria-hidden="true">
              <use xlinkHref="#icon-close" />
            </svg>
          </button>
        </div>
      </div>
    </div >
  );
}

export default ModalCall;
