import { Link } from 'react-router-dom';
import { Camera } from '../../types';
import { AppRoute } from '../../const';
import { MouseEventHandler } from 'react';
import Rating from '../rating/rating';
import { makeBuyButtonTestId, makeInfoButtonTestId } from './utils';

type Props = {
  camera: Camera;
  onBuyButtonClick: (id: Camera['id']) => void;
}

function CameraListItem({ camera, onBuyButtonClick }: Props): JSX.Element {
  const { id, name, previewImg, previewImg2x, previewImgWebp, previewImgWebp2x, price, rating, reviewCount } = camera;

  const handleBuyButtonClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    onBuyButtonClick(id);
  };

  return (
    <div className="product-card">
      <div className="product-card__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`../../../public/${previewImgWebp}, ../../../public/${previewImgWebp2x} 2x`}
          />
          <img
            src={`../../../public/${previewImg}`}
            srcSet={`../../../public/${previewImg2x} 2x`}
            width={280}
            height={240}
            alt={name}
          />
        </picture>
      </div>
      <div className="product-card__info">
        <div className="rate product-card__rate">
          <Rating rating={rating} />
          <p className="visually-hidden">Рейтинг: {rating}</p>
          <p className="rate__count">
            <span className="visually-hidden">Всего оценок:</span>{reviewCount}
          </p>
        </div>
        <p className="product-card__title">
          {name}
        </p>
        <p className="product-card__price">
          <span className="visually-hidden">Цена:</span>{price.toLocaleString('ru')} ₽
        </p>
      </div>
      <div className="product-card__buttons">
        <button
          data-testid={makeBuyButtonTestId(id)}
          onClick={handleBuyButtonClick}
          className="btn btn--purple product-card__btn"
          type="button"
        >
          Купить
        </button>
        <Link data-testid={makeInfoButtonTestId(id)} to={`${AppRoute.Cameras}/${id}`} className="btn btn--transparent">
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default CameraListItem;
