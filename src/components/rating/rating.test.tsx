import { render, screen } from '@testing-library/react';
import Rating from './rating';
import { EMPTY_STAR_ID, FULL_STAR_ID, MAX_RATING } from './utils';

const renderSut = (rating: number) => render(<Rating rating={rating} />);

describe('Rating tests', () => {
  it('full end empty stars satisfies with rating', () => {
    const rating = 3;
    renderSut(rating);

    const fullStarts = screen.getAllByTestId(FULL_STAR_ID);
    const emptyStarts = screen.getAllByTestId(EMPTY_STAR_ID);

    expect(fullStarts.length).toBe(rating);
    expect(emptyStarts.length).toBe(MAX_RATING - rating);
  });
});
