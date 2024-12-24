import { useState } from 'react';
import CatalogList from '../../components/cameras-list/cameras-list';
import Navigation from '../../components/navigation/navigation';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { selectDisplayedCameras, selectPromo } from '../../store/cameras-slice/cameras-slice';
import { Camera } from '../../types';
import { hasId } from '../../utils';
import BannerSlider from '../../components/banner/banner-slider';
import ModalCartAdding from '../../components/modal-cart-adding/modal-cart-adding';
import ModalAddItemSuccess from '../../components/modal-add-item-success/modal-add-item-success';
import { useNavigate } from 'react-router-dom';
import { PageRoute } from '../../const';
import { addCameraToCart, selectCameras } from '../../store/order-slice.ts/order-slice';
import { getIdsOf } from '../../test/utils';

function CatalogPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cameras = useAppSelector(selectDisplayedCameras);
  const promo = useAppSelector(selectPromo);
  const [selectedCameraId, setSelectedCameraId] = useState<Camera['id'] | null>(null);
  const [isModalAddItemSuccessOpen, setIsModalAddItemSuccessOpen] = useState(false);
  const selectedCamera = selectedCameraId ? cameras.find(hasId(selectedCameraId)) ?? null : null;
  const camerasInCart = useAppSelector(selectCameras);


  const openModalCartAdding = (cameraId: Camera['id']) => {
    setSelectedCameraId(cameraId);
    document.body.style.overflow = 'hidden';
  };

  const closeModalCartAdding = () => {
    setSelectedCameraId(null);
  };

  const closeModalAddItemSuccess = () => {
    document.body.style.overflow = '';
    setIsModalAddItemSuccessOpen(false);
  };

  const addToCartButton = () => {
    if (selectedCamera) {
      dispatch(addCameraToCart(selectedCamera));
    }
    setSelectedCameraId(null);
    setIsModalAddItemSuccessOpen(true);
  };

  const handleContinueShoppingButtonClick = () => {
    setIsModalAddItemSuccessOpen(false);
    document.body.style.overflow = '';
  };

  const handleGoToCartButtonClick = () => {
    setIsModalAddItemSuccessOpen(false);
    document.body.style.overflow = '';
    navigate(PageRoute.Cart);
  };

  return (
    <div className="wrapper">
      <Header />
      <main>
        <BannerSlider promo={promo} />
        <div className="page-content">
          <Navigation menuPath={[{ name: 'Главная', to: '#' }]} currentItem='Каталог' />
          <CatalogList onBuyButtonClick={openModalCartAdding} cartCameraIds={getIdsOf(camerasInCart)} />
        </div>
        {selectedCamera === null ? null :
          <ModalCartAdding camera={selectedCamera} onCloseButtonClick={closeModalCartAdding} onAddButtonClick={addToCartButton} />}
        {isModalAddItemSuccessOpen
          ?
          <ModalAddItemSuccess
            onContinueShoppingButtonClick={handleContinueShoppingButtonClick}
            onGoToCartButtonClick={handleGoToCartButtonClick}
            onCloseButtonClick={closeModalAddItemSuccess}
          />
          : null}
      </main>
      <Footer />
    </div>
  );
}

export default CatalogPage;
