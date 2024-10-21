import { useAppSelector } from '../../hooks/hooks';
import { selectErrorMessage } from '../../store/error-slice/error-slice';
import ErrorPage from '../error-page/error-page';
import CatalogPage from './catalog-page';

function CatalogPagePicker(): JSX.Element | null {
  const error = useAppSelector(selectErrorMessage);

  if (error) {
    return <ErrorPage />;
  }

  return <CatalogPage />;
}

export default CatalogPagePicker;
