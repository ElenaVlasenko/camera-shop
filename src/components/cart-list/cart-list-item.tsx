import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { Camera } from '../../types';
import { AppDispatch, useAppDispatch } from '../../hooks/hooks';
import { setCamerasCount } from '../../store/order-slice.ts/order-slice';
import { debounce } from '../../utils';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

type Props = {
  camera: Camera;
  count: number;
  onItemDeleteClick: (camera: Camera) => void;
}

type NewCountHandlerParams = {
  cameraId: number;
  newValue: number;
  dispatch: AppDispatch;
  setCamerasCountInput: (n: number) => void;
}

const NEW_COUNT_SETTING_TIMEOUT = 500;

const handleNewCount = ({ cameraId, newValue, dispatch, setCamerasCountInput }: NewCountHandlerParams) => {
  if (isFinite(newValue)) {
    const newCount = newValue > 9 ? 9 : Math.max(newValue, 1);
    setCamerasCountInput(newCount);
    dispatch(setCamerasCount({ id: cameraId, count: newCount }));
  }
};

const handleNewCountWithTimeout = debounce(handleNewCount, NEW_COUNT_SETTING_TIMEOUT);

function CartListItem({ camera, count, onItemDeleteClick }: Props): JSX.Element {
  const { category, previewImg, previewImg2x, previewImgWebp, previewImgWebp2x, name, vendorCode, type, level, price, id } = camera;

  const dispatch = useAppDispatch();
  const [camerasCountInput, setCamerasCountInput] = useState<number | string>(1);

  useEffect(
    () => {
      setCamerasCountInput(count);
    },
    [setCamerasCountInput, count]
  );

  const handleIncrementCountButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(setCamerasCount({ id: camera.id, count: count + 1 }));
  };

  const handleDecrementCountButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    dispatch(setCamerasCount({ id: camera.id, count: count - 1 }));
  };

  const handleCountInput: ChangeEventHandler<HTMLInputElement> = (evt) => {
    evt.preventDefault();
    const newValue = parseInt(evt.target.value, 10) ?? 0;
    setCamerasCountInput(evt.target.value);

    handleNewCountWithTimeout({
      newValue,
      cameraId: camera.id,
      setCamerasCountInput,
      dispatch
    });
  };

  return (
    <li className="basket-item">
      <Link to={`${AppRoute.Cameras}/${id}`}>
        <div className="basket-item__img">
          <picture>
            <source
              type="image/webp"
              srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
            />
            <img
              src={`/${previewImg}`}
              srcSet={`/${previewImg2x} 2x`}
              width={140}
              height={120}
              alt={name}
            />
          </picture>
        </div>
      </Link>
      <div className="basket-item__description">
        <p className="basket-item__title">{name}</p>
        <ul className="basket-item__list">
          <li className="basket-item__list-item">
            <span className="basket-item__article">Артикул:</span>{' '}
            <span className="basket-item__number">{vendorCode}</span>
          </li>
          <li className="basket-item__list-item">{type} {category}</li>
          <li className="basket-item__list-item">{level} уровень</li>
        </ul>
      </div>
      <p className="basket-item__price">
        <span className="visually-hidden">Цена:</span>{price.toLocaleString('ru')} ₽
      </p>
      <div className="quantity">
        <button
          onClick={handleDecrementCountButtonClick}
          className="btn-icon btn-icon--prev"
          aria-label="уменьшить количество товара"
        >
          <svg width={7} height={12} aria-hidden="true">
            <use xlinkHref="#icon-arrow" />
          </svg>
        </button>
        <label className="visually-hidden" htmlFor="counter1" />
        <input
          type="number"
          id="counter1"
          onChange={handleCountInput}
          value={camerasCountInput}
          aria-label="количество товара"
        />
        <button
          onClick={handleIncrementCountButtonClick}
          className="btn-icon btn-icon--next"
          aria-label="увеличить количество товара"
        >
          <svg width={7} height={12} aria-hidden="true">
            <use xlinkHref="#icon-arrow" />
          </svg>
        </button>
      </div>
      <div className="basket-item__total-price">
        <span className="visually-hidden">Общая цена:</span>{(count * price).toLocaleString('ru')} ₽
      </div>
      <button onClick={() => onItemDeleteClick(camera)} className="cross-btn" type="button" aria-label="Удалить товар">
        <svg width={10} height={10} aria-hidden="true">
          <use xlinkHref="#icon-close" />
        </svg>
      </button>
    </li>
  );
}

export default CartListItem;
