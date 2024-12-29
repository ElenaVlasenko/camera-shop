import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { selectIsCouponValid } from '../../store/order-slice.ts/order-slice';
import cn from 'classnames';

type Props = {
  onSubmitButtonClick: (promoCode: string) => void;
}

function PromoCode({ onSubmitButtonClick }: Props): JSX.Element {
  const [promoInput, setPromoInput] = useState('');
  const isCouponValid = useAppSelector(selectIsCouponValid);

  useEffect(() => {
    if (isCouponValid) {
      setPromoInput('');
    }
  }, [isCouponValid]);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    evt.preventDefault();
    setPromoInput(evt.target.value);
  };

  const handleSubmitButtonClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    onSubmitButtonClick(promoInput);
  };

  return (
    <form action="#">
      <div className={cn('custom-input', { 'is-valid': isCouponValid === true }, { 'is-invalid': isCouponValid === false })}>
        <label><span className="custom-input__label">Промокод</span>
          <input
            onChange={handleInputChange}
            type="text"
            name="promo"
            placeholder="Введите промокод"
            value={promoInput.replaceAll(' ', '')}
          />
        </label>
        <p className="custom-input__error">{isCouponValid === false ? 'Промокод неверный' : 'Произошла ошибка'}</p>
        <p className="custom-input__success">Промокод принят!</p>
      </div>
      <button className="btn" type='submit' onClick={handleSubmitButtonClick}>Применить</button>
    </form>
  );
}

export default PromoCode;
