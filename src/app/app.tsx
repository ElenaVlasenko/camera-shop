import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPagePicker from '../pages/main-page/main-page-picker';
import { PageRoute } from '../const';
import CameraPagePicker from '../pages/camera-page/camera-page-picker';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import CartPage from '../pages/cart-page/cart-page';
import CatalogPagePresenter from '../pages/catalog-page/catalog-page-presenter';
function App(): JSX.Element {
  function getInitializedAppRoutes() {
    return (
      <>
        <Route path={PageRoute.Main} element={<MainPagePicker />} />
        <Route path={PageRoute.Cameras} element={<CatalogPagePresenter />} />
        <Route path={PageRoute.Camera} element={<CameraPagePicker />} />
        <Route path={PageRoute.Cart} element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {getInitializedAppRoutes()}
      </Routes>
    </BrowserRouter >
  );
}

export default App;
