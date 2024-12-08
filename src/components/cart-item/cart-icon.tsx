import { Link } from 'react-router-dom';
import { PageRoute } from '../../const';

function CartIcon(): JSX.Element {
  return (
    <Link className="header__basket-link" to={PageRoute.Cart}>
      <svg width={16} height={16} aria-hidden="true">
        <use xlinkHref="#icon-basket" />
      </svg>
      <span className="header__basket-count">3</span>
    </Link>
  );
}

export default CartIcon;
