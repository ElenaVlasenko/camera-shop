import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useRef, useState } from 'react';
import { Camera } from '../../types';
import CameraSimilarListItem from './camera-similar-list-item';

type Props = {
  similar: Camera[];
  onBuyButtonClick: (id: Camera['id']) => void;
}

const MIN_SLIDER_INDEX = 0;
const SLIDER_STEP = 3;

function SimilarCamerasSlider({ similar, onBuyButtonClick }: Props): JSX.Element {
  const swiper = useRef<SwiperClass | null>(null);
  const [activeSliderIndex, setActiveSliderIndex] = useState(MIN_SLIDER_INDEX);

  const onSwiper = (swiperInstance: SwiperClass) => {
    swiper.current = swiperInstance;
  };

  return (
    <div className="product-similar__slider" style={{ marginBottom: '74px' }}>
      <div className="product-similar__slider-list">
        <Swiper
          max-width={904}
          spaceBetween={32}
          slidesPerView={SLIDER_STEP}
          slidesPerGroup={SLIDER_STEP}
          onSwiper={onSwiper}
          onSlideChange={() => {
            const activeIndex = swiper.current?.activeIndex ?? MIN_SLIDER_INDEX;
            setActiveSliderIndex(activeIndex);
          }}
        >
          {similar.map((camera) => <SwiperSlide key={camera.id} ><CameraSimilarListItem key={camera.id} camera={camera} onBuyButtonClick={onBuyButtonClick} /></ SwiperSlide >)}
        </Swiper>
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          swiper.current?.slidePrev();
        }}
        className="my-slider-controls slider-controls--prev"
        type="button"
        aria-label="Предыдущий слайд"
        disabled={activeSliderIndex === 0}
      >
        <svg width={7} height={12} aria-hidden="true">
          <use xlinkHref="#icon-arrow" />
        </svg>
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          swiper.current?.slideNext();
        }}
        className="my-slider-controls slider-controls--next"
        type="button"
        aria-label="Следующий слайд"
        disabled={activeSliderIndex >= similar.length - SLIDER_STEP}
      >
        <svg width={7} height={12} aria-hidden="true">
          <use xlinkHref="#icon-arrow" />
        </svg>
      </button>
    </div>
  );
}

export default SimilarCamerasSlider;
