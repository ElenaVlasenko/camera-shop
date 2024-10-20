import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { selectSimilar } from '../../store/cameras-slice/cameras-slice';
import { Camera } from '../../types';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import ReviewsList from '../../components/reviews-list/reviews-list';
import Navigation from '../../components/navigation/navigation';
import ShowMoreButton from '../../components/show-more-button/show-more-button';
import { resetDisplayedReviewsNumber, selectDisplayedReviewsNumber, selectDisplayedReviews, selectReviewsNumber } from '../../store/reviews-slice.ts/reviews-slice';
import { MouseEventHandler, useEffect, useState } from 'react';
import cn from 'classnames';
import { AppRoute } from '../../const';
import Rating from '../../components/rating/rating';
import CamerasSimilarList from '../../components/cameras-similar/cameras-similar-list';
import { hasId, scrollToTop } from '../../utils';
import ModalCall from '../../components/modal-call/modal-call';
import { BACK_TO_TOP_BUTTON_ID, DESCRIPTION_SECTION_ID, DESCRIPTION_BUTTON_ID, PROPERTIES_SECTION_ID, PROPERTIES_BUTTON_ID } from './utils';

type Props = Camera;

enum Tabs {
  DESCRIPTION = 'description',
  PROPERTIES = 'properties'
}

function CameraPage({
  previewImg,
  previewImg2x,
  previewImgWebp,
  previewImgWebp2x,
  name,
  rating,
  reviewCount,
  price,
  vendorCode,
  category,
  level,
  type,
  description
}: Props): JSX.Element {

  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState(Tabs.DESCRIPTION);
  const reviews = useAppSelector(selectDisplayedReviews);
  const similarCameras = useAppSelector(selectSimilar);
  const reviewsNumber = useAppSelector(selectReviewsNumber);
  const displayedReviewsNumber = useAppSelector(selectDisplayedReviewsNumber);
  const isAllReviewsDisplayed = reviewsNumber <= displayedReviewsNumber;
  const [selectedCameraId, setSelectedCameraId] = useState<Camera['id'] | null>(null);
  const selectedCamera = selectedCameraId ? similarCameras.find(hasId(selectedCameraId)) ?? null : null;

  useEffect(() => {
    scrollToTop();
    return () => {
      dispatch(resetDisplayedReviewsNumber());
    };
  }, [dispatch]);

  const handleBackToTopButton: MouseEventHandler<HTMLAnchorElement> = () => {
    scrollToTop('smooth');
  };

  const openCallModal = (cameraId: Camera['id']) => {
    setSelectedCameraId(cameraId);
    document.body.style.overflow = 'hidden';
  };

  const closeCallModal = () => {
    setSelectedCameraId(null);
    document.body.style.overflow = '';
  };

  const makeSimilarList = () => similarCameras.length > 0 ? <CamerasSimilarList similar={similarCameras} onBuyButtonClick={openCallModal} /> : null;
  const makeReviewList = () => reviews.length > 0 ? <ReviewsList reviews={reviews} /> : null;
  const makeShowMoreButton = () => !isAllReviewsDisplayed ? <ShowMoreButton /> : null;

  return (
    <div className="wrapper">
      <Header />
      <main>
        <div className="page-content">
          <Navigation menuPath={[{ name: 'Главная', to: '/' }, { name: 'Каталог', to: AppRoute.Main }]} currentItem={name} />
          <div className="page-content__section">
            <section className="product">
              <div className="container">
                <div className="product__img">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`../../../public/${previewImgWebp}, ../../../public/${previewImgWebp2x} 2x`}
                    />
                    <img
                      src={`../../../public/${previewImg}`}
                      srcSet={`../../../public/${previewImg2x} 2x`}
                      width={560}
                      height={480}
                      alt={name}
                    />
                  </picture>
                </div>
                <div className="product__content">
                  <h1 className="title title--h3">{name}</h1>
                  <div className="rate product__rate">
                    <Rating rating={rating} />
                    <p className="visually-hidden">Рейтинг: {rating}</p>
                    <p className="rate__count">
                      <span className="visually-hidden">Всего оценок:</span>{reviewCount}
                    </p>
                  </div>
                  <p className="product__price">
                    <span className="visually-hidden">Цена:</span>{price.toLocaleString('ru')} ₽
                  </p>
                  <button className="btn btn--purple visually-hidden" type="button">
                    <svg width={24} height={16} aria-hidden="true">
                      <use xlinkHref="#icon-add-basket" />
                    </svg>
                    Добавить в корзину
                  </button>
                  <div className="tabs product__tabs">
                    <div className="tabs__controls product__tabs-controls">
                      <button data-testid={PROPERTIES_BUTTON_ID} onClick={() => setSelectedTab(Tabs.PROPERTIES)} className={cn('tabs__control', { 'is-active': selectedTab === Tabs.PROPERTIES })} type="button">
                        Характеристики
                      </button>
                      <button data-testid={DESCRIPTION_BUTTON_ID} onClick={() => setSelectedTab(Tabs.DESCRIPTION)} className={cn('tabs__control', { 'is-active': selectedTab === Tabs.DESCRIPTION })} type="button">
                        Описание
                      </button>
                    </div>
                    <div className="tabs__content">
                      <div data-testid={PROPERTIES_SECTION_ID} className={cn('tabs__element', { 'is-active': selectedTab === Tabs.PROPERTIES })}>
                        <ul className="product__tabs-list">
                          <li className="item-list">
                            <span className="item-list__title">Артикул:</span>
                            <p className="item-list__text"> {vendorCode}</p>
                          </li>
                          <li className="item-list">
                            <span className="item-list__title">Категория:</span>
                            <p className="item-list__text">{category}</p>
                          </li>
                          <li className="item-list">
                            <span className="item-list__title">Тип камеры:</span>
                            <p className="item-list__text">{type}</p>
                          </li>
                          <li className="item-list">
                            <span className="item-list__title">Уровень:</span>
                            <p className="item-list__text">{level}</p>
                          </li>
                        </ul>
                      </div>
                      <div data-testid={DESCRIPTION_SECTION_ID} className={cn('tabs__element', { 'is-active': selectedTab === Tabs.DESCRIPTION })}>
                        <div className="product__tabs-text">
                          <p>
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {makeSimilarList()}
          <ModalCall camera={selectedCamera} onCloseButtonClick={closeCallModal} />
          <div className="page-content__section">
            <section className="review-block">
              <div className="container">
                <div className="page-content__headed">
                  <h2 className="title title--h3">Отзывы</h2>
                </div>
                {makeReviewList()}
                <div className="review-block__buttons">
                  {makeShowMoreButton()}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Link
        data-testid={BACK_TO_TOP_BUTTON_ID}
        onClick={handleBackToTopButton}
        className="up-btn" to="#header"
      >
        <svg width={12} height={18} aria-hidden="true">
          <use xlinkHref="#icon-arrow2" />
        </svg>
      </Link>
      <Footer />
    </div>
  );
}

export default CameraPage;
