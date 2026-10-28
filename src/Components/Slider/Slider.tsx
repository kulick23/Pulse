import React from 'react';
import { useTranslation } from 'react-i18next';
import './Slider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Slide from './Slide/Slide';
import { Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import servicesStore from '../../Store/ServicesStore/ServicesStore';
import arrow from '../../Assets/Icons/Arrow.svg';
import { useNavigate } from 'react-router-dom';

interface SliderProps {
  excludeCaseId?: number;
  titleKey: string;
}

export const Slider: React.FC<SliderProps> = ({ excludeCaseId, titleKey }) => {
  const { t, i18n } = useTranslation();
  const services = servicesStore
    .getServicesByLanguage(i18n.language as 'ru' | 'en')
    .filter((service) => service.id !== excludeCaseId);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/services');
  };

  const handleSlideClick = (id: number) => {
    navigate(`/services/${id}`);
  };

  return (
    <section className="slider">
      <h2>{t(titleKey)}</h2>
      <Swiper
        modules={[Autoplay]}
        observer={true}
        observeParents={true}
        loop={true}
        speed={1600}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        slidesPerView={3}
        spaceBetween={20}
        breakpoints={{
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          820: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          563: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
      >
        {services.map((service) => (
          <SwiperSlide key={service.id}>
            <Slide
              image={service.image}
              title={service.title}
              type={service.type || t('directions.title')}
              onClick={() => handleSlideClick(service.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button onClick={handleButtonClick}>
        {t('slider.button')} <img src={arrow} alt="arrow" />
      </button>
    </section>
  );
};

export default Slider;
