import { html } from "../utils/helpers.js";
import { createProductCard } from "./ProductCard.js";

export const createProductCarouselHTML = (productsList, idPrefix) => {
    if (productsList.length === 0) return "<p>No products found.</p>";
    const cardsHTML = productsList.map((product) => createProductCard(product).outerHTML).join("");
    return html`
        <style>
            .product-carousel-container {
                position: relative;
            }
            .product-carousel-wrapper {
                overflow-x: auto;
                scroll-behavior: smooth;
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .product-carousel-wrapper::-webkit-scrollbar {
                display: none;
            }
            .product-carousel-inner {
                display: flex;
                gap: 1rem;
                padding-bottom: 1.5rem;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
            }
            .product-carousel-inner product-card {
                flex: 0 0 270px;
                width: 270px;
            }

            .product-carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.9);
                border: 1px solid #dee2e6;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                cursor: pointer;
                z-index: 10;

                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }
            .product-carousel-arrow.show {
                opacity: 1;
                pointer-events: auto;
            }

            .product-carousel-arrow:hover {
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            }

            .product-carousel-arrow.prev {
                left: -22px;
            }
            .product-carousel-arrow.next {
                right: -22px;
            }
        </style>

        <div class="product-carousel-container">
            <div class="product-carousel-wrapper" id="${idPrefix}-wrapper">
                <div class="product-carousel-inner">${cardsHTML}</div>
            </div>
            <div class="product-carousel-arrow prev" data-target="#${idPrefix}-wrapper">
                <i class="fas fa-chevron-left"></i>
            </div>
            <div class="product-carousel-arrow next" data-target="#${idPrefix}-wrapper">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `;
};

export function setupCarouselListeners() {
    document.querySelectorAll(".product-carousel-arrow").forEach((arrow) => {
        arrow.addEventListener("click", () => {
            const targetWrapper = document.querySelector(arrow.dataset.target);
            if (targetWrapper) {
                const scrollAmount = targetWrapper.offsetWidth * 0.8;
                targetWrapper.scrollLeft += arrow.classList.contains("next") ? scrollAmount : -scrollAmount;
            }
        });
    });
}

export function setupCarouselArrowVisibility(wrapper) {
    const prevArrow = wrapper.closest(".product-carousel-container").querySelector(".product-carousel-arrow.prev");
    const nextArrow = wrapper.closest(".product-carousel-container").querySelector(".product-carousel-arrow.next");
    if (!prevArrow || !nextArrow) return;
    const updateArrows = () => {
        const scrollLeft = wrapper.scrollLeft;
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;
        prevArrow.classList.toggle("show", scrollLeft > 10);
        nextArrow.classList.toggle("show", scrollLeft < scrollWidth - clientWidth - 10);
    };
    wrapper.addEventListener("scroll", updateArrows, { passive: true });
    new ResizeObserver(updateArrows).observe(wrapper);
    updateArrows();
}
