import { useState } from 'react';
import CatalogList from '../../components/cameras-list/cameras-list';
import Navigation from '../../components/navigation/navigation';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import ModalCall from '../../components/modal-call/modal-call';
import { useAppSelector } from '../../hooks/hooks';
import { selectDisplayedCameras, selectPromo } from '../../store/cameras-slice/cameras-slice';
import { Camera } from '../../types';
import { hasId } from '../../utils';
import BannerSlider from '../../components/banner/banner-slider';

function CatalogPage(): JSX.Element {
  const cameras = useAppSelector(selectDisplayedCameras);
  const promo = useAppSelector(selectPromo);
  const [selectedCameraId, setSelectedCameraId] = useState<Camera['id'] | null>(null);
  const selectedCamera = selectedCameraId ? cameras.find(hasId(selectedCameraId)) ?? null : null;

  const openCallModal = (cameraId: Camera['id']) => {
    setSelectedCameraId(cameraId);
    document.body.style.overflow = 'hidden';
  };

  const closeCallModal = () => {
    setSelectedCameraId(null);
    document.body.style.overflow = '';
  };

  return (
    <div className="wrapper">
      <Header />
      <main>
        <BannerSlider promo={promo} />
        <div className="page-content">
          <Navigation menuPath={[{ name: 'Главная', to: '#' }]} currentItem='Каталог' />
          <CatalogList onBuyButtonClick={openCallModal} />
        </div>
        <ModalCall camera={selectedCamera} onCloseButtonClick={closeCallModal} />
      </main>
      <Footer />
    </div>
  );
}

export default CatalogPage;
