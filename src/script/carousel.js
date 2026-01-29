import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.carousel__wrapper');
    if (!container) return;

    new Swiper(container, {
        modules: [Navigation, Pagination, A11y],

        loop: true,
        slidesPerView: 2.2,
        centeredSlides: true,

        breakpoints: {
            550: {
                slidesPerView: 3,
            },
        },

        navigation: {
            nextEl: '.carousel__nav--next',
            prevEl: '.carousel__nav--prev',
        },

        pagination: {
            el: '.carousel__pagination',
            clickable: true,
            renderBullet: (index, className) =>
                `<span class="${className}" aria-label="Ir para página ${index + 1}"></span>`,
        },

        a11y: {
            enabled: true,
        },
    });
});
