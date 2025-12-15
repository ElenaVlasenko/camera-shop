import { MouseEventHandler } from 'react';
import { Camera } from '../../types';
import Rating from '../rating/rating';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { scrollToTop } from '../../utils';

type Props = {
  camera: Camera;
  onBuyButtonClick: (id: Camera['id']) => void;
}

function CameraSimilarListItem({ camera, onBuyButtonClick }: Props): JSX.Element {
  const { id, rating, previewImg, previewImg2x, previewImgWebp, previewImgWebp2x, name, price, reviewCount } = camera;

  const handleBuyButtonClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    onBuyButtonClick(id);
  };

  return (
    <div className="product-card is-active" style={{ width: '100%', margin: 0 }}>
      <div className="product-card__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`${import.meta.env.BASE_URL}${previewImgWebp}, ${import.meta.env.BASE_URL}${previewImgWebp2x} 2x`}
          />
          <img
            src={`${import.meta.env.BASE_URL}${previewImg}`}
            srcSet={`${import.meta.env.BASE_URL}${previewImg2x} 2x`}
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
        <p className="product-card__title">{name}</p>
        <p className="product-card__price">
          <span className="visually-hidden">Цена:</span>{price.toLocaleString('ru')} ₽
        </p>
      </div>
      <div className="product-card__buttons">
        <button
          onClick={handleBuyButtonClick}
          className="btn btn--purple product-card__btn" type="button"
        >
          Купить
        </button>
        <Link
          onClick={() => scrollToTop()}
          to={`${AppRoute.Cameras}/${id}`} className="btn btn--transparent"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default CameraSimilarListItem;
