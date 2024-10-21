import { useNavigate } from 'react-router-dom';
import CatalogPage from '../catalog-page/catalog-page';
import { useEffect } from 'react';
import { AppRoute } from '../../const';
import { selectErrorMessage } from '../../store/error-slice/error-slice';
import { useAppSelector } from '../../hooks/hooks';
import ErrorPage from '../error-page/error-page';

function MainPagePicker(): JSX.Element | null {
  const navigate = useNavigate();
  useEffect(
    () => navigate(AppRoute.Cameras)
  );
  const error = useAppSelector(selectErrorMessage);

  if (error) {
    return <ErrorPage />;
  }

  return <CatalogPage />;
}

export default MainPagePicker;
