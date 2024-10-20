import { Review } from '../../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Rating from '../rating/rating';

type Props = {
  review: Review;
};

function ReviewItemOfAList({ review }: Props): JSX.Element {
  const { userName, advantage, createAt, rating, disadvantage, review: comment } = review;

  return (
    <li className="review-card">
      <div className="review-card__head">
        <p className="title title--h4">{userName}</p>
        <time className="review-card__data" dateTime="2022-04-13">
          {format(createAt, 'dd MMMM', { locale: ru })}
        </time>
      </div>
      <div className="rate review-card__rate">
        <Rating rating={rating} />
        <p className="visually-hidden">Оценка: {rating}</p>
      </div>
      <ul className="review-card__list">
        <li className="item-list">
          <span className="item-list__title">Достоинства:</span>
          <p className="item-list__text">
            {advantage}
          </p>
        </li>
        <li className="item-list">
          <span className="item-list__title">Недостатки:</span>
          <p className="item-list__text">
            {disadvantage}
          </p>
        </li>
        <li className="item-list">
          <span className="item-list__title">Комментарий:</span>
          <p className="item-list__text">
            {comment}
          </p>
        </li>
      </ul>
    </li>
  );
}

export default ReviewItemOfAList;
