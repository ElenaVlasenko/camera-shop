import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

function NotFoundPage(): JSX.Element {
  return (
    <>
      <h1>
        404.
        <br />
        <small>Page not found</small>
      </h1>
      <Link to={AppRoute.Main}>Go to main page</Link>
    </>
  );
}

export default NotFoundPage;
