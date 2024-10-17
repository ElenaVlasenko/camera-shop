type Props = {
  rating: number;
}

const MAX_RATING = 5;

function Rating({ rating }: Props): JSX.Element {
  return (
    <>{Array.from(
      { length: MAX_RATING },
      (_, i) => i < rating
        ? <svg key={i} width={17} height={16} aria-hidden="true"><use xlinkHref="#icon-full-star" /></svg>
        : <svg key={i} width={17} height={16} aria-hidden="true"><use xlinkHref="#icon-star" /></svg>
    )}
    </>
  );
}

export default Rating;
