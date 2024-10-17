import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPagePicker from '../pages/main-page/main-page-picker';
import { PageRoute } from '../const';
import CameraPage from '../pages/camera-page/camera-page';
import CameraPagePicker from '../pages/camera-page/camera-page-picker';
import CatalogPagePicker from '../pages/catalog-page/catalog-page-picker';

function App(): JSX.Element {
  function getInitializedAppRoutes() {
    return (
      <>
        <Route path={PageRoute.Main} element={<MainPagePicker />} />
        <Route path={PageRoute.Cameras} element={<CatalogPagePicker />} />
        <Route path={PageRoute.Camera} element={<CameraPagePicker />} />
        {/* <Route path={PageRoute.Login} element={<LoginPagePicker />} />
        <Route path={PageRoute.Reservations} element={<ReservationsPagePicker />} />
        <Route path={PageRoute.Quest} element={<QuestPagePicker />} />
        <Route path={PageRoute.Contacts} element={<ContactsPage />} />
        <Route path={PageRoute.Booking} element={<BookingPagePicker />} />
        <Route path="*" element={<NotFoundPage />} /> */}
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
