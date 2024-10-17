import { useState } from 'react';
import Banner from '../../components/banner/banner';
import CatalogList from '../../components/cameras-list/cameras-list';
import CatalogNavigation from '../../components/catalog-navigation/catalog-navigation';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import ModalCall from '../../components/modal-call/modal-call';
import { useAppSelector } from '../../hooks/hooks';
import { selectCameras, selectPromo } from '../../store/cameras-slice/cameras-slice';
import { Camera } from '../../types';
import { hasId } from '../../utils';

function CatalogPage(): JSX.Element {
  const cameras = useAppSelector(selectCameras);
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
        {promo.length > 1 ? <Banner promo={promo[0]} /> : null}
        <div className="page-content">
          <CatalogNavigation menuPath={[{ name: 'Главная', to: '#' }]} currentItem='Каталог' />
          <CatalogList cameras={cameras} onBuyButtonClick={openCallModal} />
        </div>
        <ModalCall camera={selectedCamera} onCloseButtonClick={closeCallModal} />
      </main>
      <Footer />
    </div>
  );
}

export default CatalogPage;
