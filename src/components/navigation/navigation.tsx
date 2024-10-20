import { Link } from 'react-router-dom';
import { makeNavigationItemTestId } from './utils';

type MenuPathItem = {
  name: string;
  to: string;
}

type Props = {
  menuPath: MenuPathItem[];
  currentItem: string;
}

function MenuPathItem({ name, to }: MenuPathItem) {
  return (
    <li className="breadcrumbs__item">
      <Link
        data-testid={makeNavigationItemTestId(name)}
        className="breadcrumbs__link" to={to}
      >
        {name}
        <svg width={5} height={8} aria-hidden="true">
          <use xlinkHref="#icon-arrow-mini" />
        </svg>
      </Link>
    </li>
  );
}

function Navigation({ menuPath, currentItem }: Props): JSX.Element {
  return (
    <div className="breadcrumbs">
      <div className="container">
        <ul className="breadcrumbs__list">
          {menuPath.map((item) => <MenuPathItem key={item.name} {...item} />)}
          <li className="breadcrumbs__item">
            <span className="breadcrumbs__link breadcrumbs__link--active">
              {currentItem}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;

export {
  type Props as NavigationProps
};
