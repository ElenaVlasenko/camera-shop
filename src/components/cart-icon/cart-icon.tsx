import { Link } from 'react-router-dom';
import { PageRoute } from '../../const';

type Props = {
  cartCount: number;
}

function CartIcon({ cartCount }: Props): JSX.Element {

  return (
    <Link className="header__basket-link" to={PageRoute.Cart}>
      <svg width={16} height={16} aria-hidden="true">
        <use xlinkHref="#icon-basket" />
      </svg>
      <span className="header__basket-count">{cartCount}</span>
    </Link>
  );
}

export default CartIcon;
