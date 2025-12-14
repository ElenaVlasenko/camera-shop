import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import SearchForm from '../search-form/search-form';
import CartIcon from '../cart-icon/cart-icon';
import { useAppSelector } from '../../hooks/hooks';
import { selectCamerasCounts } from '../../store/order-slice.ts/order-slice';

function Header(): JSX.Element {
  const cameras = useAppSelector(selectCamerasCounts);
  const cartCount = Object.values(cameras).reduce((a, b) => a + b, 0);

  return (
    <header className="header" id="header">
      <div className="container">
        <Link
          className="header__logo"
          to={AppRoute.Cameras}
          aria-label="Переход на главную"
        >
          <svg width={100} height={36} aria-hidden="true">
            <use xlinkHref="#icon-logo" />
          </svg>
        </Link>
        {/*to do when it will be required*/}
        {/* <nav className="main-nav header__main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className="main-nav__link" to={AppRoute.Cameras}>
                Каталог
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to="">
                Гарантии
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to="">
                Доставка
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to="">
                О компании
              </Link>
            </li>
          </ul>
        </nav> */}
        <SearchForm />
        {cartCount === 0 ? '' :
          <CartIcon cartCount={cartCount} />}
      </div>
    </header>
  );
}

export default Header;
