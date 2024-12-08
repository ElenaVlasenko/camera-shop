import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import Navigation from '../../components/navigation/navigation';
import { AppRoute } from '../../const';

function CartPage(): JSX.Element {
  return (
    <>
      <Header />
      <Navigation menuPath={[{ name: 'Главная', to: '/' }, { name: 'Каталог', to: AppRoute.Main }]} currentItem={'Корзина'} />
      <section className="basket">
        <div className="container">
          <h1 className="title title--h2">Корзина</h1>
          <ul className="basket__list">
            <li className="basket-item">
              <div className="basket-item__img">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="img/content/orlenok.webp, img/content/orlenok@2x.webp 2x"
                  />
                  <img
                    src="img/content/orlenok.jpg"
                    srcSet="img/content/orlenok@2x.jpg 2x"
                    width={140}
                    height={120}
                    alt="Фотоаппарат «Орлёнок»"
                  />
                </picture>
              </div>
              <div className="basket-item__description">
                <p className="basket-item__title">Фотоаппарат «Орлёнок»</p>
                <ul className="basket-item__list">
                  <li className="basket-item__list-item">
                    <span className="basket-item__article">Артикул:</span>{' '}
                    <span className="basket-item__number">O78DFGSD832</span>
                  </li>
                  <li className="basket-item__list-item">Плёночная фотокамера</li>
                  <li className="basket-item__list-item">Любительский уровень</li>
                </ul>
              </div>
              <p className="basket-item__price">
                <span className="visually-hidden">Цена:</span>18 970 ₽
              </p>
              <div className="quantity">
                <button
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
                  defaultValue={2}
                  min={1}
                  max={99}
                  aria-label="количество товара"
                />
                <button
                  className="btn-icon btn-icon--next"
                  aria-label="увеличить количество товара"
                >
                  <svg width={7} height={12} aria-hidden="true">
                    <use xlinkHref="#icon-arrow" />
                  </svg>
                </button>
              </div>
              <div className="basket-item__total-price">
                <span className="visually-hidden">Общая цена:</span>37 940 ₽
              </div>
              <button className="cross-btn" type="button" aria-label="Удалить товар">
                <svg width={10} height={10} aria-hidden="true">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            </li>
            <li className="basket-item">
              <div className="basket-item__img">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="img/content/das-auge.webp, img/content/das-auge@2x.webp 2x"
                  />
                  <img
                    src="img/content/das-auge.jpg"
                    srcSet="img/content/das-auge@2x.jpg 2x"
                    width={140}
                    height={120}
                    alt="Ретрокамера «Das Auge IV»"
                  />
                </picture>
              </div>
              <div className="basket-item__description">
                <p className="basket-item__title">Ретрокамера «Das Auge IV»</p>
                <ul className="basket-item__list">
                  <li className="basket-item__list-item">
                    <span className="basket-item__article">Артикул:</span>{' '}
                    <span className="basket-item__number">DA4IU67AD5</span>
                  </li>
                  <li className="basket-item__list-item">
                    Коллекционная видеокамера
                  </li>
                  <li className="basket-item__list-item">Любительский уровень</li>
                </ul>
              </div>
              <p className="basket-item__price">
                <span className="visually-hidden">Цена:</span>73 450 ₽
              </p>
              <div className="quantity">
                <button
                  className="btn-icon btn-icon--prev"
                  disabled
                  aria-label="уменьшить количество товара"
                >
                  <svg width={7} height={12} aria-hidden="true">
                    <use xlinkHref="#icon-arrow" />
                  </svg>
                </button>
                <label className="visually-hidden" htmlFor="counter2" />
                <input
                  type="number"
                  id="counter2"
                  defaultValue={1}
                  min={1}
                  max={99}
                  aria-label="количество товара"
                />
                <button
                  className="btn-icon btn-icon--next"
                  aria-label="увеличить количество товара"
                >
                  <svg width={7} height={12} aria-hidden="true">
                    <use xlinkHref="#icon-arrow" />
                  </svg>
                </button>
              </div>
              <div className="basket-item__total-price">
                <span className="visually-hidden">Общая цена:</span>73 450 ₽
              </div>
              <button className="cross-btn" type="button" aria-label="Удалить товар">
                <svg width={10} height={10} aria-hidden="true">
                  <use xlinkHref="#icon-close" />
                </svg>
              </button>
            </li>
          </ul>
          <div className="basket__summary">
            <div className="basket__promo">
              {/*<p class="title title&#45;&#45;h4">Если у вас есть промокод на скидку, примените его в этом поле</p>
            <div class="basket-form">
              <form action="#">
                <div class="custom-input">
                  <label><span class="custom-input__label">Промокод</span>
                    <input type="text" name="promo" placeholder="Введите промокод">
                  </label>
                  <p class="custom-input__error">Промокод неверный</p>
                  <p class="custom-input__success">Промокод принят!</p>
                </div>
                <button class="btn" type="submit">Применить
                </button>
              </form>
            </div>*/}
            </div>
            <div className="basket__summary-order">
              <p className="basket__summary-item">
                <span className="basket__summary-text">Всего:</span>
                <span className="basket__summary-value">111 390 ₽</span>
              </p>
              <p className="basket__summary-item">
                <span className="basket__summary-text">Скидка:</span>
                <span className="basket__summary-value basket__summary-value--bonus">
                  0 ₽
                </span>
              </p>
              <p className="basket__summary-item">
                <span className="basket__summary-text basket__summary-text--total">
                  К оплате:
                </span>
                <span className="basket__summary-value basket__summary-value--total">
                  111 390 ₽
                </span>
              </p>
              <button className="btn btn--purple" type="submit">
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CartPage;
