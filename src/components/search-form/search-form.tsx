import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { resetSearchText, selectFilteredCamerasBySearchText, selectSearchText, setSearchText } from '../../store/cameras-slice/cameras-slice';
import cn from 'classnames';
import { AppRoute, KEYCODE_DOWN, KEYCODE_TAB, KEYCODE_UP } from '../../const';
import { useEffect, useRef, useState } from 'react';

type Props = {
  cameraName: string;
  id: number;
  index: number;
  isFocused: boolean;
}

const makeSearchListItemId = (idx: number) => `search-list-item-${idx}`;

function SearchListItem({ cameraName, id, index, isFocused }: Props): JSX.Element {
  return (
    <Link id={makeSearchListItemId(index)} to={`${AppRoute.Cameras}/${id}`}>
      <li style={{ ...(isFocused && { backgroundColor: '#f4f4fc' }) }} className="form-search__select-item" tabIndex={0}>
        {cameraName}
      </li>
    </Link>
  );
}

function SearchForm(): JSX.Element {
  const stateSearchText = useAppSelector(selectSearchText);
  const dispatch = useAppDispatch();
  const foundedCameras = useAppSelector(selectFilteredCamerasBySearchText);
  const searchItemsRef = useRef<HTMLUListElement>(null);

  const [focusedCameraIndex, setFocusedCameraIndex] = useState<number | null>(null);

  useEffect(() => {
    const getNextFocusedItemIndex = () =>
      focusedCameraIndex === null || focusedCameraIndex === foundedCameras.length - 1 ? 0 : focusedCameraIndex + 1;

    const getPreviousFocusedItemIndex = () =>
      focusedCameraIndex === null || focusedCameraIndex === 0 ? foundedCameras.length - 1 : focusedCameraIndex - 1;

    const closeSearchMenu = (event: MouseEvent) => {

      if (foundedCameras.length > 0 && !searchItemsRef.current?.contains(event.target as Node)) {
        dispatch(resetSearchText());
      }
    };

    function handleTabKey(event: KeyboardEvent) {
      const isTabOrDownPressed = (event.key === KEYCODE_TAB || event.code === KEYCODE_TAB || event.code === KEYCODE_DOWN);
      const isUpPressed = (event.code === KEYCODE_UP);
      let newIndex = focusedCameraIndex;

      if (isTabOrDownPressed) {
        event.preventDefault();
        newIndex = getNextFocusedItemIndex();
        setFocusedCameraIndex(newIndex);
      }

      if (isUpPressed) {
        event.preventDefault();
        newIndex = getPreviousFocusedItemIndex();
        setFocusedCameraIndex(newIndex);
      }

      if (newIndex === 0) {
        searchItemsRef.current?.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        });
      }
    }

    if (foundedCameras.length > 0) {
      document.addEventListener('keydown', handleTabKey);
      document.addEventListener('mousedown', closeSearchMenu);
    }

    if (focusedCameraIndex) {
      const item = document.getElementById(makeSearchListItemId(focusedCameraIndex));
      item?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('mousedown', closeSearchMenu);
    };
  }, [foundedCameras, focusedCameraIndex, dispatch]);

  const handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(evt.target.value));
  };

  const handleOnResetButton = () => {
    dispatch(resetSearchText());
  };

  return (
    <div className={cn('form-search', { 'list-opened': foundedCameras.length > 0 })}>
      <form>
        <label>
          <svg
            className="form-search__icon"
            width={16}
            height={16}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-lens" />
          </svg>
          <input
            onChange={handleOnChange}
            className="form-search__input"
            type="text"
            autoComplete="off"
            placeholder="Поиск по сайту"
            value={stateSearchText}
          />
        </label>
        <ul ref={searchItemsRef} className="form-search__select-list">
          {foundedCameras.map((camera, i) => <SearchListItem key={camera.id} index={i} cameraName={camera.name} id={camera.id} isFocused={i === focusedCameraIndex} />)}
        </ul>
      </form>
      <button onClick={handleOnResetButton} style={stateSearchText.length > 0 ? { display: 'block' } : { display: 'none' }} className="form-search__reset" type="reset">
        <svg width={10} height={10} aria-hidden="true">
          <use xlinkHref="#icon-close" />
        </svg>
        <span className="visually-hidden">Сбросить поиск</span>
      </button>
    </div >

  );
}

export default SearchForm;
