import cn from 'classnames';
import { Link } from 'react-router-dom';

type ItemProps = {
  page: number;
  isActive: boolean;
  onClick: (page: number) => void;
}

function PaginationItem({ page, isActive, onClick }: ItemProps): JSX.Element {
  return (
    <li className="pagination__item">
      <Link
        onClick={(evt) => {
          evt.preventDefault();
          onClick(page);
        }}
        className={cn('pagination__link', { 'pagination__link--active': isActive })}
        to={''}
      >
        {page}
      </Link>
    </li>
  );
}

type ButtonProps = {
  title: string;
  onClick: () => void;
}

function PaginationButton({ title, onClick }: ButtonProps): JSX.Element {
  return (
    <li className="pagination__item">
      <Link
        onClick={(evt) => {
          evt.preventDefault();
          onClick();
        }}
        className="pagination__link pagination__link--text"
        to={''}
      >
        {title}
      </Link>
    </li>
  );
}

type Props = {
  currentPage: number;
  totalPages: number;
  displayedPages: string; // example: '1,2,3'
  onPageClick: (page: number) => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
}

function Pagination({ currentPage, totalPages, displayedPages, onPageClick, onNextButtonClick, onPrevButtonClick }: Props): JSX.Element {
  const displayedPageList = displayedPages.split(',').map((pageNum) => parseInt(pageNum, 10));

  return (
    <div className="pagination">
      <ul className="pagination__list">
        {displayedPageList[0] > 1 ? <PaginationButton onClick={onPrevButtonClick} title='Назад' /> : null}
        {displayedPageList.map((num) => (
          <PaginationItem onClick={onPageClick}
            key={num}
            page={num}
            isActive={num === currentPage}
          />
        ))}
        {(displayedPageList.at(-1) ?? 0) === totalPages ? null : <PaginationButton onClick={onNextButtonClick} title='Далее' />}
      </ul>
    </div>

  );
}

export default Pagination;
