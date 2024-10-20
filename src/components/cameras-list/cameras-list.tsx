import { Camera } from '../../types';
import CameraListItem from './cameras-list-item';

type Props = {
  cameras: Camera[];
  onBuyButtonClick: (id: Camera['id']) => void;
}

function CatalogList({ cameras, onBuyButtonClick }: Props): JSX.Element {
  return (
    <section className="catalog">
      <div className="container">
        <h1 className="title title--h2">Каталог фото- и видеотехники</h1>
        <div className="page-content__columns">
          <div className="catalog__aside">
            <img src="img/banner.png" />
          </div>
          <div className="catalog__content">
            <div className="cards catalog__cards">
              {cameras.map((camera) => <CameraListItem key={camera.id} camera={camera} onBuyButtonClick={onBuyButtonClick} />)}
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}

export default CatalogList;
