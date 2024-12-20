import { useState } from 'react';
import CartList from '../../components/cart-list/cart-list';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import ModalCartDelete from '../../components/modal-delete/modal-delete';
import Navigation from '../../components/navigation/navigation';
import { AppRoute, ORDER_REQUEST_STATUS, PageRoute } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { addOrderAction, removeCameraFromCart, resetOrderStatus, selectCameras, selectCamerasCounts, selectOrderRequestStatus } from '../../store/order-slice.ts/order-slice';
import { Camera } from '../../types';
import { useNavigate } from 'react-router-dom';
import { getDiscount } from '../../utils';
import Spinner from '../../components/spinner/spinner';
import ModalCartOrder from '../../components/modal-cart-order/modal-cart-order';

function CartPage(): JSX.Element {
  const cameras = useAppSelector(selectCameras);
  const navigate = useNavigate();
  const cameraCounts = useAppSelector(selectCamerasCounts);
  const dispatch = useAppDispatch();
  const [deletingCamera, setDeletingCamera] = useState<Camera | null>(null);
  const orderStatus = useAppSelector(selectOrderRequestStatus);

  const totalPrice = cameras.reduce((total, camera) => total + camera.price * cameraCounts[camera.id], 0);

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
    dispatch(addOrderAction({ coupon: null }));
  };

  const handleModalCartOrderCloseButtonClick = () => {
    document.body.style.overflow = '';
    dispatch(resetOrderStatus());
    navigate(PageRoute.Cameras);
  };

  const handleModalCartDeleteCloseButtonClick = () => {
    document.body.style.overflow = '';
    setDeletingCamera(null);
  };

  const handleContinueShoppingClick = () => {
    document.body.style.overflow = '';
    navigate(PageRoute.Cameras);
    dispatch(resetOrderStatus());
  };

  return orderStatus === ORDER_REQUEST_STATUS.IN_PROGRESS ? <Spinner /> : (
    <>
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
                  {/*<p class="title title&#45;&#45;h4">Если у вас есть промокод на скидку, примените его в этом поле</p>
              <div class="basket-form">
                <form action="#">
                  <div class="custom-input">
                    <label><span class="custom-input__label">Промокод</span>
                      <input type="text" name="promo" placeholder="Введите промокод">
                    </label>
                    <p class="custom-input__error">Промокод неверный</p>
                    <p class="custom-input__success">Промокод принят!</p>
                  </div>
                  <button class="btn" type="submit">Применить
                  </button>
                </form>
              </div>*/}
                </div>
                <div className="basket__summary-order">
                  <p className="basket__summary-item">
                    <span className="basket__summary-text">Всего:</span>
                    <span className="basket__summary-value">{totalPrice.toLocaleString('ru')} ₽</span>
                  </p>
                  <p className="basket__summary-item">
                    <span className="basket__summary-text">Скидка:</span>
                    <span className="basket__summary-value basket__summary-value--bonus">
                      {(Math.round((totalPrice * getDiscount(totalPrice, cameraCounts) / 100))).toLocaleString('ru')} ₽
                    </span>
                  </p>
                  <p className="basket__summary-item">
                    <span className="basket__summary-text basket__summary-text--total">
                      К оплате:
                    </span>
                    <span className="basket__summary-value basket__summary-value--total">
                      {totalPrice.toLocaleString('ru')} ₽
                    </span>
                  </p>
                  <button onClick={handleSubmitOrder} className="btn btn--purple" type="submit">
                    Оформить заказ
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {deletingCamera === null ? null : <ModalCartDelete camera={deletingCamera} onDeleteButtonClick={handleConfirmDeletionClick} onCloseButtonClick={handleModalCartDeleteCloseButtonClick} />}
      {orderStatus === ORDER_REQUEST_STATUS.SUCCESS ? <ModalCartOrder onCloseButtonClick={handleModalCartOrderCloseButtonClick} onContinueShoppingButtonClick={handleContinueShoppingClick} /> : ''}
      <Footer />
    </>
  );
}

export default CartPage;
