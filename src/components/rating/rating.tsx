import { EMPTY_STAR_ID, FULL_STAR_ID, MAX_RATING } from './utils';

type Props = {
  rating: number;
}

function Rating({ rating }: Props): JSX.Element {
  return (
    <>{Array.from(
      { length: MAX_RATING },
      (_, i) => i < rating
        ? <svg data-testid={FULL_STAR_ID} key={i} width={17} height={16} aria-hidden="true"><use xlinkHref="#icon-full-star" /></svg>
        : <svg data-testid={EMPTY_STAR_ID} key={i} width={17} height={16} aria-hidden="true"><use xlinkHref="#icon-star" /></svg>
    )}
    </>
  );
}

export default Rating;
