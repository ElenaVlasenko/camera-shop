import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { Camera, ReviewParams } from '../../types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { addReviewAction, selectReviewRequestStatus } from '../../store/reviews-slice.ts/reviews-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { KEYCODE_TAB, REQUEST_STATUS } from '../../const';
import BlockUI from '../block-ui/block-ui';
import cn from 'classnames';

type Props = {
  cameraId: Camera['id'];
  onCloseButtonClick: () => void;
};

type Rating = { value: number; title: string };

const ratings: Rating[] = [
  { value: 5, title: 'Отлично' },
  { value: 4, title: 'Хорошо' },
  { value: 3, title: 'Нормально' },
  { value: 2, title: 'Плохо' },
  { value: 1, title: 'Ужасно' },
];

type Inputs = Omit<ReviewParams, 'cameraId' | 'rating'> & { rating: string };

const focusInputs = ['userName', 'advantage', 'disadvantage', 'review'] as const;

function ModalReview({ onCloseButtonClick, cameraId }: Props): JSX.Element | null {

  const dispatch = useAppDispatch();
  const reviewRequestStatus = useAppSelector(selectReviewRequestStatus);

  const closeButtonRef = useRef(null);
  const sendButtonRef = useRef(null);
  const [focusedRefIndex, setFocusedElementIndex] = useState(0);
  const [rating, setRating] = useState(NaN);

  const handleRatingInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    evt.preventDefault();
    setRating(parseInt(evt.target.value, 10));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm<Inputs>();

  useEffect(
    () => {
      setFocus(focusInputs[0]);

      const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
          onCloseButtonClick();
        }
      };

      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    },
    [onCloseButtonClick, setFocus]
  );

  useEffect(() => {
    const focusItems: ({ current: HTMLElement | null } | keyof Inputs)[] = [...focusInputs, sendButtonRef, closeButtonRef];
    const getNextFocusedElement = () => focusedRefIndex === focusItems.length - 1 ? 0 : focusedRefIndex + 1;

    function handleTabKey(event: KeyboardEvent) {
      const isTabPressed = (event.key === KEYCODE_TAB || event.code === KEYCODE_TAB);

      if (isTabPressed) {
        event.preventDefault();
        const newFocusedElementIndex = getNextFocusedElement();
        const focusItem = focusItems.at(newFocusedElementIndex);

        if (typeof focusItem === 'string') {
          setFocus(focusItem);
        } else {
          focusItem?.current?.focus();
        }

        setFocusedElementIndex(newFocusedElementIndex);
      }
    }

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [setFocusedElementIndex, focusedRefIndex, closeButtonRef, setFocus]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (rating > 0) {
      dispatch(addReviewAction({ ...data, rating, cameraId }));
    }
  };

  function RatingItem({ value, title }: Rating) {
    const inputKey = `rating-item-input-${value}`;
    const labelKey = `rating-item-label-${value}`;

    return (
      <>
        <input
          key={inputKey}
          className="visually-hidden"
          id={`star-${value}`}
          type="radio"
          value={value}
          checked={value === rating}
          onChange={handleRatingInputChange}
        />
        <label
          key={labelKey}
          className="rate__label"
          htmlFor={`star-${value}`}
          title={title}
        />
      </>
    );
  }

  const makeRatingItem = (params: Rating) => <RatingItem key={params.value} {...params} />;

  return (
    <>
      {reviewRequestStatus === REQUEST_STATUS.IN_PROGRESS ? <BlockUI /> : null}
      <div className="modal is-active">
        <div className="modal__wrapper">
          <div className="modal__overlay" onClick={onCloseButtonClick} />
          <div className="modal__content">
            <p className="title title--h4">Оставить отзыв</p>
            <div className="form-review">
              <form onSubmit={(evt) => {
                if (Number.isNaN(rating)) {
                  setRating(0);
                }
                handleSubmit(onSubmit)(evt);
              }}
              >
                <div className="form-review__rate">
                  <fieldset className={cn('rate', 'form-review__item', { 'is-invalid': rating === 0 })}>
                    <legend className="rate__caption">
                      Рейтинг
                      <svg width={9} height={9} aria-hidden="true">
                        <use xlinkHref="#icon-snowflake" />
                      </svg>
                    </legend>
                    <div className="rate__bar">
                      <div className="rate__group" >
                        {ratings.map(makeRatingItem)}
                      </div>
                      <div className="rate__progress">
                        <span className="rate__stars">0</span> <span>/</span>{' '}
                        <span className="rate__all-stars">5</span>
                      </div>
                    </div>
                    <p className="rate__message">{'Нужно оценить товар'}</p>
                  </fieldset>
                  <div className={cn('custom-input', 'form-review__item', { 'is-invalid': 'userName' in errors })}>
                    <label>
                      <span className="custom-input__label">
                        Ваше имя
                        <svg width={9} height={9} aria-hidden="true">
                          <use xlinkHref="#icon-snowflake" />
                        </svg>
                      </span>
                      <input
                        placeholder="Введите ваше имя"
                        {...register(
                          'userName',
                          {
                            required: 'Укажите Ваше имя.',
                            pattern: {
                              value: /^.{2,15}$/,
                              message: 'Имя должно состоять из букв. Допустимая длина от 2 до 15 символов.'
                            }
                          })
                        }
                      />
                    </label>
                    <p className="custom-input__error">Нужно указать имя</p>
                  </div>
                  <div className={cn('custom-input', 'form-review__item', { 'is-invalid': 'advantage' in errors })}>
                    <label>
                      <span className="custom-input__label">
                        Достоинства
                        <svg width={9} height={9} aria-hidden="true">
                          <use xlinkHref="#icon-snowflake" />
                        </svg>
                      </span>
                      <input
                        placeholder="Основные преимущества товара"
                        {...register(
                          'advantage',
                          {
                            required: 'Нужно указать достоинства.',
                            pattern: {
                              value: /^.{10,160}$/,
                              message: 'Допустимая длина от 10 до 160 символов.'
                            }
                          })
                        }
                      />
                    </label>
                    <p className="custom-input__error">Нужно указать достоинства</p>
                  </div>
                  <div className={cn('custom-input', 'form-review__item', { 'is-invalid': 'disadvantage' in errors })}>
                    <label>
                      <span className="custom-input__label">
                        Недостатки
                        <svg width={9} height={9} aria-hidden="true">
                          <use xlinkHref="#icon-snowflake" />
                        </svg>
                      </span>
                      <input
                        placeholder="Главные недостатки товара"
                        {...register(
                          'disadvantage',
                          {
                            required: 'Нужно указать недостатки.',
                            pattern: {
                              value: /^.{10,160}$/,
                              message: 'Допустимая длина от 10 до 160 символов.'
                            }
                          })
                        }
                      />
                    </label>
                    <p className="custom-input__error">Нужно указать недостатки</p>
                  </div>
                  <div className={cn('custom-textarea', 'form-review__item', { 'is-invalid': 'review' in errors })}>
                    <label>
                      <span className="custom-textarea__label">
                        Комментарий
                        <svg width={9} height={9} aria-hidden="true">
                          <use xlinkHref="#icon-snowflake" />
                        </svg>
                      </span>
                      <textarea
                        placeholder="Поделитесь своим опытом покупки"
                        {...register(
                          'review',
                          {
                            required: 'Нужно добавить комментарий.',
                            pattern: {
                              value: /^.{10,160}$/,
                              message: 'Допустимая длина от 10 до 160 символов.'
                            }
                          })
                        }
                      />
                    </label>
                    <div className="custom-textarea__error">
                      Нужно добавить комментарий
                    </div>
                  </div>
                </div>
                <button className="btn btn--purple form-review__btn" type="submit" ref={sendButtonRef}>
                  Отправить отзыв
                </button>
              </form>
            </div>
            <button onClick={onCloseButtonClick} className="cross-btn" type="button" aria-label="Закрыть попап" ref={closeButtonRef}>
              <svg width={10} height={10} aria-hidden="true">
                <use xlinkHref="#icon-close" />
              </svg>
            </button>
          </div>
        </div>
      </div >
    </>
  );
}

export default ModalReview;
