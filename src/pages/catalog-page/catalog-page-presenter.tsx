import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { selectErrorMessage } from '../../store/error-slice/error-slice';
import ErrorPage from '../error-page/error-page';
import CatalogPage from './catalog-page';
import { selectDisplayedCameras, selectPromo } from '../../store/cameras-slice/cameras-slice';
import { useState } from 'react';
import { Camera } from '../../types';
import { addCameraToCart, selectCartCameras } from '../../store/order-slice.ts/order-slice';
import { hasId } from '../../utils';
import { PageRoute } from '../../const';
// import { Category, Level, PageRoute, SortingKey, SortingOrder, Type } from '../../const';

function CatalogPagePresenter(): JSX.Element | null {
  const error = useAppSelector(selectErrorMessage);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cameras = useAppSelector(selectDisplayedCameras);
  const promo = useAppSelector(selectPromo);
  const camerasInCart = useAppSelector(selectCartCameras);
  const [selectedCameraId, setSelectedCameraId] = useState<Camera['id'] | null>(null);
  const [isModalAddItemSuccessOpen, setIsModalAddItemSuccessOpen] = useState(false);
  const selectedCamera = selectedCameraId ? cameras.find(hasId(selectedCameraId)) ?? null : null;
  // const [searchText, setSearchText] = useState('');
  // const [priceMin, setPriceMin] = useState(0);
  // const [priceMax, setPriceMax] = useState(Infinity);
  // const [types, setTypes] = useState<Type[]>([]);
  // const [category, setCategory] = useState<Category | null>(null);
  // const [levels, setLevels] = useState<Level[]>([]);
  // const [sortingKey, setSortingKey] = useState(SortingKey.Price);
  // const [sortingOrder, setSortingOrder] = useState(SortingOrder.ASC);

  if (error) {
    return <ErrorPage />;
  }


  const openModalCartAdding = (cameraId: Camera['id']) => {
    setSelectedCameraId(cameraId);
  };

  const closeModalCartAdding = () => {
    setSelectedCameraId(null);
  };

  const closeModalAddItemSuccess = () => {
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
  };

  const handleGoToCartButtonClick = () => {
    setIsModalAddItemSuccessOpen(false);
    navigate(PageRoute.Cart);
  };

  return (
    <CatalogPage
      promo={promo}
      selectedCamera={selectedCamera}
      camerasInCart={camerasInCart}
      isModalAddItemSuccessOpen={isModalAddItemSuccessOpen}
      onByButtonClick={openModalCartAdding}
      onModalCartAddingCloseButtonClick={closeModalCartAdding}
      onAddToCartButtonClick={addToCartButton}
      onModalAddItemSuccessCloseButtonClick={closeModalAddItemSuccess}
      onModalAddItemSuccessContinueShoppingButtonClick={handleContinueShoppingButtonClick}
      onModalAddItemSuccessGoToCartButtonClick={handleGoToCartButtonClick}
    />
  );
}

export default CatalogPagePresenter;
