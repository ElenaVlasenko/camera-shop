import { useState } from 'react';
import CartList from '../../components/cart-list/cart-list';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import ModalCartDelete from '../../components/modal-delete/modal-delete';
import Navigation from '../../components/navigation/navigation';
import { AppRoute, REQUEST_STATUS, PageRoute } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  addOrder,
  checkCoupon,
  removeCameraFromCart,
  resetOrderStatus,
  selectCartCameras,
  selectCamerasCounts,
  selectCouponDiscount,
  selectCouponRequestStatus,
  selectOrderRequestStatus
} from '../../store/order-slice.ts/order-slice';
import { Camera } from '../../types';
import { useNavigate } from 'react-router-dom';
import { getDiscount, isEmpty } from '../../utils';
import ModalCartOrder from '../../components/modal-cart-order/modal-cart-order';
import PromoCode from '../../components/promoCode/promoCode';
import BlockUI from '../../components/block-ui/block-ui';
import { selectPromo } from '../../store/cameras-slice/cameras-slice';
import { getIdsOf } from '../../test/utils';
import cn from 'classnames';

function CartPage(): JSX.Element {
  const cameras = useAppSelector(selectCartCameras);
  const promo = useAppSelector(selectPromo);
  const promoIds = getIdsOf(promo);
  const navigate = useNavigate();
  const cameraCounts = useAppSelector(selectCamerasCounts);
  const dispatch = useAppDispatch();
  const [deletingCamera, setDeletingCamera] = useState<Camera | null>(null);
  const orderRequestStatus = useAppSelector(selectOrderRequestStatus);
  const couponRequestStatus = useAppSelector(selectCouponRequestStatus);
  const couponDiscount = useAppSelector(selectCouponDiscount);
  const notPromoCameras = cameras.filter((camera) => !promoIds.includes(camera.id));

  const handleItemDeleteClick = (camera: Camera) => {
    setDeletingCamera(camera);
    document.body.style.overflow = 'hidden';
  };

  const handleConfirmDeletionClick = () => {
    if (deletingCamera !== null) {
      dispatch(removeCameraFromCart(deletingCamera.id));
      setDeletingCamera(null);
    }

    document.body.style.overflow = '';

    if (cameras.length === 1) {
      navigate(PageRoute.Cameras);
    }
  };

  const handleSubmitOrder = () => {
    dispatch(addOrder({ coupon: null }));
  };

  const handleModalCartOrderCloseButtonClick = () => {
    document.body.style.overflow = '';
    dispatch(resetOrderStatus());

    if (isEmpty(cameras)) {
      navigate(PageRoute.Cameras);
    }
  };

  const handleModalCartDeleteCloseButtonClick = () => {
    document.body.style.overflow = '';
    setDeletingCamera(null);
  };

  const handleContinueShoppingInOrderModalClick = () => {
    document.body.style.overflow = '';
    navigate(PageRoute.Cameras);
    dispatch(resetOrderStatus());
  };

  const handleContinueShoppingInDeleteModalClick = () => {
    setDeletingCamera(null);
    document.body.style.overflow = '';
  };

  const onCouponFormSubmitButtonClick = (coupon: string): void => {
    dispatch(checkCoupon(coupon));
  };

  const totalPrice = cameras.reduce((total, camera) => total + camera.price * cameraCounts[camera.id], 0);
  const notPromoCamerasCount = notPromoCameras.reduce((totalCount, camera) => totalCount + (cameraCounts[camera.id] ?? 0), 0);
  const notPromoPrice = notPromoCameras.reduce((total, camera) => total + (cameraCounts[camera.id] ?? 0) * camera.price, 0);
  const discount = Math.round((notPromoPrice * (getDiscount(notPromoPrice, notPromoCamerasCount) + couponDiscount) / 100));
  const orderPrice = totalPrice - discount;

  return (
    <>
      {orderRequestStatus === REQUEST_STATUS.IN_PROGRESS || couponRequestStatus === REQUEST_STATUS.IN_PROGRESS ? <BlockUI /> : null}
      <Header />
      <main>
        <div className="page-content">
          <Navigation menuPath={[{ name: 'Главная', to: '/' }, { name: 'Каталог', to: AppRoute.Main }]} currentItem={'Корзина'} />
          <section className="basket">
            <div className="container">
              <h1 className="title title--h2">Корзина</h1>
              <CartList cameras={cameras} cameraCounts={cameraCounts} onItemDeleteClick={handleItemDeleteClick} />
              <div className="basket__summary">
                <div className="basket__promo">
                  <p className="title title&#45;&#45;h4">Если у вас есть промокод на скидку, примените его в этом поле</p>
                  <div className="basket-form">
                    <PromoCode onSubmitButtonClick={onCouponFormSubmitButtonClick} />
                  </div>
                </div>
                <div className="basket__summary-order">
                  <p className="basket__summary-item">
                    <span className="basket__summary-text">Всего:</span>
                    <span className="basket__summary-value">{totalPrice.toLocaleString('ru')} ₽</span>
                  </p>
                  <p className="basket__summary-item">
                    <span className="basket__summary-text">Скидка:</span>
                    <span className={cn('basket__summary-value', { 'basket__summary-value--bonus': discount > 0 })}>
                      {discount.toLocaleString('ru')} ₽
                    </span>
                  </p>
                  <p className="basket__summary-item">
                    <span className="basket__summary-text basket__summary-text--total">
                      К оплате:
                    </span>
                    <span className="basket__summary-value basket__summary-value--total">
                      {orderPrice.toLocaleString('ru')} ₽
                    </span>
                  </p>
                  <button onClick={handleSubmitOrder} className="btn btn--purple" type="submit" disabled={cameras.length === 0}>
                    Оформить заказ
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {deletingCamera === null ? null :
        <ModalCartDelete
          camera={deletingCamera}
          onDeleteButtonClick={handleConfirmDeletionClick}
          onCloseButtonClick={handleModalCartDeleteCloseButtonClick}
          onContinueShoppingButtonClick={handleContinueShoppingInDeleteModalClick}
        />}
      {orderRequestStatus === REQUEST_STATUS.SUCCESS || orderRequestStatus === REQUEST_STATUS.FAILED ?
        <ModalCartOrder
          orderStatus={orderRequestStatus}
          onCloseButtonClick={handleModalCartOrderCloseButtonClick}
          onContinueShoppingButtonClick={orderRequestStatus === REQUEST_STATUS.SUCCESS ? handleContinueShoppingInOrderModalClick : handleModalCartOrderCloseButtonClick}
        /> : ''}
      <Footer />
    </>
  );
}

export default CartPage;
