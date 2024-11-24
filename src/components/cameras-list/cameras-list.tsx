import { useCallback, useEffect, useState } from 'react';
import { Camera } from '../../types';
import Filters from '../filters/filters';
import Pagination from '../pagination/pagination';
import Sort from '../sort/sort';
import CameraListItem from './cameras-list-item';
import { useAppSelector } from '../../hooks/hooks';
import { selectDisplayedCameras } from '../../store/cameras-slice/cameras-slice';
import { MAX_DISPLAYED_CAMERAS_COUNT, PAGINATION_PAGE_NUMBER } from '../../const';
import { useLocation, useNavigate } from 'react-router-dom';
import { getChunks } from '../../utils';

type Props = {
  onBuyButtonClick: (id: Camera['id']) => void;
}

const URL_PARAMS = {
  PAGE: 'page'
} as const;

const makeSequence = (length: number, startFrom = 1) => Array.from({ length }, (_, i) => i + startFrom);
const makePagesStr = (totalPages: number, startFrom = 1) => makeSequence(totalPages, startFrom).join(',');

function CatalogList({ onBuyButtonClick }: Props): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const displayedCameras = useAppSelector(selectDisplayedCameras);
  const totalPages = Math.ceil(displayedCameras.length / MAX_DISPLAYED_CAMERAS_COUNT) || 1;
  const initialPages = makePagesStr(Math.min(totalPages, PAGINATION_PAGE_NUMBER));
  const [displayedPagesStr, setDisplayedPagesStr] = useState(initialPages);
  const displayedPageList = displayedPagesStr.split(',').map((pageNum) => parseInt(pageNum, 10));
  const firstPageCameraIndex = (currentPage - 1) * MAX_DISPLAYED_CAMERAS_COUNT;
  const pageCameras = displayedCameras.slice(firstPageCameraIndex, firstPageCameraIndex + MAX_DISPLAYED_CAMERAS_COUNT);
  const navigate = useNavigate();
  const location = useLocation();

  const setUrlPage = useCallback((page: number) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set(URL_PARAMS.PAGE, page.toString());
    navigate(`${location.pathname}?${urlParams.toString()}`);
  }, [navigate, location.pathname, location.search]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setDisplayedPagesStr(initialPages);
    setUrlPage(1);
  }, [setCurrentPage, setDisplayedPagesStr, setUrlPage, initialPages]);

  useEffect(() => {
    if (displayedCameras.length > 0) {
      const urlParams = new URLSearchParams(location.search);
      const urlPage = urlParams.get(URL_PARAMS.PAGE) ?? '1';
      const parsedUrlPage = parseInt(urlPage, 10);
      const page = urlPage && !isNaN(parsedUrlPage) ? parsedUrlPage : currentPage;

      if (urlPage === '') {
        setUrlPage(currentPage);
      } else if (page !== currentPage) {
        const pageChunkNumbers = makeSequence(Math.ceil(displayedCameras.length / MAX_DISPLAYED_CAMERAS_COUNT));
        const pageChunks = getChunks(pageChunkNumbers, PAGINATION_PAGE_NUMBER);
        const newChunkIndex = pageChunks.findIndex((chunk) => chunk.includes(page));

        if (newChunkIndex === -1) {
          resetPagination();
        } else {
          let pageChunk = pageChunks[newChunkIndex] ?? [1];
          if (pageChunk.length < PAGINATION_PAGE_NUMBER && Array.isArray(pageChunks[newChunkIndex - 1])) {
            pageChunk = [...pageChunks[newChunkIndex - 1], ...pageChunk].slice(-PAGINATION_PAGE_NUMBER);
          }

          setDisplayedPagesStr(pageChunk.join(','));
          setCurrentPage(page);
        }
      } else if (page === 1) {
        resetPagination();
      }
    }
  }, [initialPages, location.search, currentPage, displayedCameras.length, resetPagination, setUrlPage]);

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
    setUrlPage(pageNum);
  };

  const handleNextButtonClick = () => {
    const lastDisplayedPage = displayedPageList.at(-1) ?? 0;
    const newCurrentPage = lastDisplayedPage + 1;
    const newFirstPage = totalPages - newCurrentPage >= PAGINATION_PAGE_NUMBER ? newCurrentPage : totalPages - PAGINATION_PAGE_NUMBER + 1;
    const newDisplayedPagesStr = makePagesStr(PAGINATION_PAGE_NUMBER, newFirstPage);
    setDisplayedPagesStr(newDisplayedPagesStr);
    setCurrentPage(lastDisplayedPage + 1);
    setUrlPage(newCurrentPage);
  };

  const handlePrevButtonClick = () => {
    const firstDisplayedPage = displayedPageList.at(0) ?? 0;
    const newCurrentPage = firstDisplayedPage - 1;
    const newDisplayedPagesStr = makePagesStr(PAGINATION_PAGE_NUMBER, Math.max(firstDisplayedPage - PAGINATION_PAGE_NUMBER, 1));
    setDisplayedPagesStr(newDisplayedPagesStr);
    setCurrentPage(newCurrentPage);
    setUrlPage(newCurrentPage);
  };

  return (
    <section className="catalog">
      <div className="container">
        <h1 className="title title--h2">Каталог фото- и видеотехники</h1>
        <div className="page-content__columns">
          <div className="catalog__aside">
            <img style={{ display: 'none' }} src="img/banner.png" />
            <Filters onFilterChange={resetPagination} />
          </div>
          <div className="catalog__content">
            <Sort />
            <div className="cards catalog__cards">
              {pageCameras.map((camera) => <CameraListItem key={camera.id} camera={camera} onBuyButtonClick={onBuyButtonClick} />)}
            </div>{totalPages === 1 ?
              null :
              <Pagination
                currentPage={currentPage}
                displayedPages={displayedPagesStr}
                totalPages={totalPages}
                onPageClick={handlePageClick}
                onNextButtonClick={handleNextButtonClick}
                onPrevButtonClick={handlePrevButtonClick}
              />}

          </div>
        </div>
      </div>
    </section >
  );
}

export default CatalogList;
