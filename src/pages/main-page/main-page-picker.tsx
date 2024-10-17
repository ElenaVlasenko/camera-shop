import { useNavigate } from 'react-router-dom';
import CatalogPage from '../catalog-page/catalog-page';
import { useEffect } from 'react';
import { AppRoute } from '../../const';

function MainPagePicker(): JSX.Element | null {
  const navigate = useNavigate();
  useEffect(
    () => navigate(AppRoute.Cameras)
  );
  // const error = useAppSelector(selectErrorMessage);

  // if (error) {
  //   return <ErrorPage />;
  // }

  return <CatalogPage />;
}

export default MainPagePicker;
