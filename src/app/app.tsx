import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPagePicker from '../pages/main-page/main-page-picker';
import { PageRoute } from '../const';
import CameraPagePicker from '../pages/camera-page/camera-page-picker';
import CatalogPagePicker from '../pages/catalog-page/catalog-page-picker';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import CartPage from '../pages/cart-page/cart-page';

function App(): JSX.Element {
  function getInitializedAppRoutes() {
    return (
      <>
        <Route path={PageRoute.Main} element={<MainPagePicker />} />
        <Route path={PageRoute.Cameras} element={<CatalogPagePicker />} />
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
