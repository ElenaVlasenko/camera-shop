import { Swiper, SwiperSlide } from 'swiper/react';
import { Promo } from '../../types';
import Banner from './banner';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './bullets.css';

type Props = {
  promo: Promo[];
}

function BannerSlider({ promo }: Props): JSX.Element {
  const makePromoBanner = () => promo.length > 1 ? promo.map((item) => <SwiperSlide key={item.id}><Banner key={item.id} promo={item} /></SwiperSlide>) : null;

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      centeredSlides
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="mySwiper"
    >
      {makePromoBanner()}
    </Swiper >
  );
}

export default BannerSlider;
