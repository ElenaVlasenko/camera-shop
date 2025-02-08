import CatalogList from '../../components/cameras-list/cameras-list';
import Navigation from '../../components/navigation/navigation';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import { Camera, Promo } from '../../types';
import BannerSlider from '../../components/banner/banner-slider';
import ModalCartAdding from '../../components/modal-cart-adding/modal-cart-adding';
import ModalAddItemSuccess from '../../components/modal-add-item-success/modal-add-item-success';
import { getIdsOf } from '../../test/utils';

type Props = {
  promo: Promo[];
  selectedCamera: Camera | null;
  camerasInCart: Camera[];
  isModalAddItemSuccessOpen: boolean;
  onByButtonClick: (cameraId: Camera['id']) => void;
  onModalCartAddingCloseButtonClick: () => void;
  onAddToCartButtonClick: () => void;
  onModalAddItemSuccessCloseButtonClick: () => void;
  onModalAddItemSuccessContinueShoppingButtonClick: () => void;
  onModalAddItemSuccessGoToCartButtonClick: () => void;
}

function CatalogPage({
  promo,
  selectedCamera,
  camerasInCart,
  isModalAddItemSuccessOpen,
  onByButtonClick,
  onModalCartAddingCloseButtonClick,
  onAddToCartButtonClick,
  onModalAddItemSuccessCloseButtonClick,
  onModalAddItemSuccessContinueShoppingButtonClick,
  onModalAddItemSuccessGoToCartButtonClick
}: Props): JSX.Element {
  return (
    <div className="wrapper">
      <Header />
      <main>
        <BannerSlider promo={promo} />
        <div className="page-content">
          <Navigation menuPath={[{ name: 'Главная', to: '#' }]} currentItem='Каталог' />
          <CatalogList onBuyButtonClick={onByButtonClick} cartCameraIds={getIdsOf(camerasInCart)} />
        </div>
        {selectedCamera === null ? null :
          <ModalCartAdding camera={selectedCamera} onCloseButtonClick={onModalCartAddingCloseButtonClick} onAddButtonClick={onAddToCartButtonClick} />}
        {isModalAddItemSuccessOpen
          ?
          <ModalAddItemSuccess
            onContinueShoppingButtonClick={onModalAddItemSuccessContinueShoppingButtonClick}
            onGoToCartButtonClick={onModalAddItemSuccessGoToCartButtonClick}
            onCloseButtonClick={onModalAddItemSuccessCloseButtonClick}
          />
          : null}
      </main>
      <Footer />
    </div>
  );
}

export default CatalogPage;
