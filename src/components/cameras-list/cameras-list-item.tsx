import { Link } from 'react-router-dom';
import { Camera } from '../../types';
import { AppRoute, PageRoute } from '../../const';
import Rating from '../rating/rating';
import { makeBuyButtonTestId, makeInfoButtonTestId } from './utils';

type Props = {
  camera: Camera;
  onBuyButtonClick: (id: Camera['id']) => void;
  inCart: boolean;
}

type ButtonProps = {
  onClick: () => void;
  cameraId: Camera['id'];
}

function BuyButton({ onClick, cameraId }: ButtonProps): JSX.Element {
  return (
    <button
      data-testid={makeBuyButtonTestId(cameraId)}
      onClick={(evt) => {
        evt.preventDefault();
        onClick();
      }}
      className="btn btn--purple product-card__btn"
      type="button"
    >
      Купить
    </button>
  );
}

function InCartButton(): JSX.Element {
  return (
    <Link
      className="btn btn--purple-border product-card__btn product-card__btn--in-cart"
      to={PageRoute.Cart}
    >
      <svg width={16} height={16} aria-hidden="true">
        <use xlinkHref="#icon-basket" />
      </svg>
      В корзине
    </Link>
  );
}

function CameraListItem({ camera, onBuyButtonClick, inCart }: Props): JSX.Element {
  const { id, name, previewImg, previewImg2x, previewImgWebp, previewImgWebp2x, price, rating, reviewCount } = camera;

  return (
    <div className="product-card">
      <div className="product-card__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
          />
          <img
            src={`/${previewImg}`}
            srcSet={`/${previewImg2x} 2x`}
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
        {inCart ? <InCartButton /> : <BuyButton onClick={() => onBuyButtonClick(id)} cameraId={camera.id} />}
        <Link data-testid={makeInfoButtonTestId(id)} to={`${AppRoute.Cameras}/${id}`} className="btn btn--transparent">
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default CameraListItem;
