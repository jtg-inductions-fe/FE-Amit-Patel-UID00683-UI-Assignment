import Swiper from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Initializes Swiper carousels on the page.
 * Supports multiple carousel instances.
 */
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel__wrapper');

    if (!carousels.length) return;

    const swiperInstances = [];

    carousels.forEach((carousel) => {
        const instance = new Swiper(carousel, {
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
                nextEl: carousel.querySelector('.carousel__nav--next'),
                prevEl: carousel.querySelector('.carousel__nav--prev'),
            },

            pagination: {
                el: carousel
                    .closest('.carousel__container')
                    ?.querySelector('.carousel__pagination'),
                clickable: true,
                renderBullet: (index, className) =>
                    `<button type="button" class="${className}" aria-label="Ir para página ${index + 1}"></button>`,
            },

            a11y: {
                enabled: true,
            },
        });
        swiperInstances.push(instance);
    });
});
