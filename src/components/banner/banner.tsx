import { Link } from 'react-router-dom';
import { Promo } from '../../types';
import { AppRoute } from '../../const';

type Props = {
  promo: Promo;
}

function Banner({ promo }: Props): JSX.Element {
  const { name, previewImg, previewImg2x, id, previewImgWebp, previewImgWebp2x } = promo;

  return (
    <div className="banner">
      <picture>
        <source
          type="image/webp"
          srcSet={`${import.meta.env.BASE_URL}${previewImgWebp}, ${import.meta.env.BASE_URL}${previewImgWebp2x} 2x`}
        />
        <img
          src={`${import.meta.env.BASE_URL}${previewImg}`}
          srcSet={`${import.meta.env.BASE_URL}${previewImg2x} 2x`}
          width={1280}
          height={280}
          alt="баннер"
        />
      </picture>
      <p className="banner__info">
        <span className="banner__message">Новинка!</span>
        <span className="title title--h1">
          {name}
        </span>
        <span className="banner__text">
          Профессиональная камера от&nbsp;известного производителя
        </span>
        <Link to={`${AppRoute.Cameras}/${id}`} className="btn">
          Подробнее
        </Link>
      </p>
    </div>
  );
}

export default Banner;
