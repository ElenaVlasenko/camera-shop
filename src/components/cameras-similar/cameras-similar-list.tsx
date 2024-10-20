import { Camera } from '../../types';
import 'swiper/css';
import SimilarSlider from './similar-cameras-slider';
import { SIMILAR_PRODUCTS_SECTION_ID } from './utils';

type Props = {
  similar: Camera[];
  onBuyButtonClick: (id: Camera['id']) => void;
}

function CamerasSimilarList({ similar, onBuyButtonClick }: Props): JSX.Element {

  return (
    <section data-testid={SIMILAR_PRODUCTS_SECTION_ID} className="product-similar">
      <div className="container">
        <h2 className="title title--h3">Похожие товары</h2>
        <SimilarSlider similar={similar} onBuyButtonClick={onBuyButtonClick} />
      </div>
    </section>
  );
}

export default CamerasSimilarList;
