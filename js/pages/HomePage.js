import { products } from "../config/products.js";
import { html } from "../utils/helpers.js";
import {
    setupCarouselListeners,
    setupCarouselArrowVisibility,
    createProductCarouselHTML,
} from "../components/ProductCarousel.js";
import { navbar } from "../main.js";
import { navigateTo } from "../utils/navigation.js";
import { createProductCard } from "../components/ProductCard.js";
import { mobileMaxWidthPlus1 } from "../config/general.js";

export function renderHomePage(container) {
    const bannerProducts = products.filter((p) => p.banner);
    const bannerHTML =
        bannerProducts.length > 0
            ? html`
                  <style>
                      .home-banner-carousel {
                          height: 100vh;
                          width: 100%;
                          background-color: #000;
                          user-select: none;
                      }
                      .home-banner-carousel .carousel-inner,
                      .home-banner-carousel .carousel-item {
                          height: 100%;
                      }
                      .banner-slide {
                          height: 100%;
                          width: 100%;
                          background-size: cover;
                          background-position: center;
                          position: relative;
                      }
                      .banner-slide::before {
                          content: "";
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          background-color: rgba(0, 0, 0, 0.4);
                      }
                      .banner-content {
                          position: absolute;
                          bottom: 25%;
                          left: 5%;
                          color: white;
                          max-width: 50%;
                      }
                      .banner-content h1 {
                          font-size: 3.5rem;
                          font-weight: 700;
                          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                      }
                      .banner-content p {
                          font-size: 1.25rem;
                          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                      }

                      .banner-carousel-controls {
                          position: absolute;
                          bottom: 30px;
                          right: 30px;
                          z-index: 15;
                          display: flex;
                          align-items: center;
                          gap: 1rem;
                          color: white;
                          background-color: rgba(0, 0, 0, 0.3);
                          padding: 0.5rem 1rem;
                          border-radius: var(--bs-border-radius);
                      }
                      .slide-number {
                          font-weight: 600;
                          font-size: 1rem;
                          flex-shrink: 0;
                      }
                      .slide-progress-wrapper {
                          width: 100px;
                          height: 4px;
                          background-color: rgba(255, 255, 255, 0.3);
                          border-radius: 2px;
                          overflow: hidden;
                      }
                      .slide-progress {
                          height: 100%;
                          width: 0%;
                          background-color: white;
                      }
                      @keyframes bounce-arrow {
                          0%,
                          20%,
                          50%,
                          80%,
                          100% {
                              transform: translateX(-50%) translateY(0);
                          }
                          40% {
                              transform: translateX(-50%) translateY(-10px);
                          }
                          60% {
                              transform: translateX(-50%) translateY(-5px);
                          }
                      }
                      .banner-scroll-down {
                          position: absolute;
                          bottom: 30px;
                          left: 50%;
                          transform: translateX(-50%);
                          color: white;
                          font-size: 2rem;
                          z-index: 15;
                          opacity: 1;
                          transition: opacity 0.3s ease-in-out;
                          text-decoration: none;
                          animation: bounce-arrow 2s infinite;
                      }
                      .banner-scroll-down.hidden {
                          opacity: 0;
                          pointer-events: none;
                      }
                      @media (max-width: ${mobileMaxWidthPlus1}px) {
                          .banner-content {
                              margin-left: 1rem;
                          }
                          .banner-content h1 {
                              font-size: 2.5rem;
                          }
                          .banner-content p {
                              font-size: 1rem;
                          }
                          .banner-carousel-controls {
                              display: flex;
                              flex-direction: column-reverse;
                              padding-top: 1rem;
                              bottom: 15px;
                              right: 15px;
                          }
                          .slide-number {
                              font-size: 14px;
                          }
                          .slide-progress-wrapper {
                              width: 40px;
                          }
                          .banner-scroll-down {
                              bottom: 10px;
                              font-size: 1.5rem;
                          }
                      }
                      .product-section-title {
                          font-weight: 700;
                          margin-bottom: 1.5rem;
                      }

                      .navbar-transparent-at-top {
                          background-color: transparent !important;
                          border-bottom: none !important;
                          transition: background-color 0.3s ease-in-out;
                          color: white;
                      }
                      .navbar-transparent-at-top .btn {
                          transition: background-color 0.3s ease-in-out;
                          color: white;
                          border-color: white;
                      }

                      .navbar-transparent-at-top #cart-badge {
                          border: 1px solid #ffffff2d;
                      }

                      /* Move carousel controls closer to the edge */
                      .home-banner-carousel .carousel-control-prev,
                      .home-banner-carousel .carousel-control-next {
                          width: 6%; /* default is 15% — smaller = closer to edge */
                      }
                  </style>
                  <div id="homeBanner" class="carousel slide home-banner-carousel" data-bs-ride="carousel">
                      <div class="carousel-inner">
                          ${bannerProducts
                              .map(
                                  (product, index) =>
                                      html`<div class="carousel-item ${index === 0 ? "active" : ""}">${product.banner}</div>`
                              )
                              .join("")}
                      </div>

                      ${bannerProducts.length > 1
                          ? html`
                                <button
                                    class="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#homeBanner"
                                    data-bs-slide="prev"
                                >
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button
                                    class="carousel-control-next"
                                    type="button"
                                    data-bs-target="#homeBanner"
                                    data-bs-slide="next"
                                >
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                                <div class="banner-carousel-controls">
                                    <span class="slide-number">01 / ${String(bannerProducts.length).padStart(2, "0")}</span>
                                    <div class="slide-progress-wrapper">
                                        <div class="slide-progress" id="banner-progress-bar"></div>
                                    </div>
                                </div>
                            `
                          : ""}

                      <a href="#product-grid-container" class="banner-scroll-down"><i class="fas fa-chevron-down"></i></a>
                  </div>
              `
            : "";

    const topRatedProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);
    const mostPopularProducts = [...products].sort((a, b) => b.soldAmount - a.soldAmount).slice(0, 10);

    container.innerHTML = html`
        ${bannerHTML}
        <div class="container py-5 w-100" id="product-grid-container">
            <h2 class="product-section-title">Top Rated Items</h2>
            ${createProductCarouselHTML(topRatedProducts, "top-rated")}
            <h2 class="product-section-title mt-5">Most Popular Items</h2>
            ${createProductCarouselHTML(mostPopularProducts, "most-popular")}
            <h2 class="product-section-title mt-5">All Products</h2>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                ${products.map((product) => createProductCard(product).outerHTML).join("")}
            </div>
        </div>
    `;

    const cleanUp = [];

    container.style.marginTop = `-${navbar.offsetHeight - 1}px`;
    cleanUp.push(() => (container.style.marginTop = "0"));

    function updateScrollOffset() {
        document.querySelector("#product-grid-container").style.scrollMarginTop = `${navbar.offsetHeight - 2}px`;
        // scroll-margin-top tells the browser: “when scrolling to this element via an anchor link, stop this much earlier.”
    }

    window.addEventListener("resize", updateScrollOffset);
    cleanUp.push(() => window.removeEventListener("resize", updateScrollOffset));
    updateScrollOffset();

    if (bannerProducts.length > 1) {
        const bannerCarouselEl = document.getElementById("homeBanner");
        // eslint-disable-next-line no-undef
        const bannerCarousel = new bootstrap.Carousel(bannerCarouselEl, {
            interval: 5000,
            ride: "carousel",
            pause: false,
        });

        const slideNumberEl = bannerCarouselEl.querySelector(".slide-number");
        const progressEl = bannerCarouselEl.querySelector("#banner-progress-bar");

        let timer = null;
        let startTime = Date.now();
        let pausedProgress = 0;
        const duration = 5000;

        const startProgress = (resume = false) => {
            clearInterval(timer);
            if (!resume) pausedProgress = 0;
            startTime = Date.now();

            timer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const percent = Math.min(((elapsed + pausedProgress) / duration) * 100, 100);
                progressEl.style.width = percent + "%";
                if (percent >= 100) clearInterval(timer);
            }, 50);
        };

        bannerCarouselEl.addEventListener("slide.bs.carousel", (event) => {
            slideNumberEl.textContent = `${String(event.to + 1).padStart(2, "0")} / ${String(bannerProducts.length).padStart(
                2,
                "0"
            )}`;
            startProgress(false);
        });

        ["mousedown", "touchstart"].forEach((t) =>
            bannerCarouselEl.addEventListener(t, () => {
                bannerCarousel.pause();
                clearInterval(timer);
                const currentWidth = parseFloat(progressEl.style.width) || 0;
                pausedProgress = (currentWidth / 100) * duration;
                bannerCarouselEl.style.cursor = "grabbing";
            })
        );
        ["mouseup", "touchend", "mouseleave"].forEach((t) =>
            bannerCarouselEl.addEventListener(t, () => {
                bannerCarousel.cycle();
                startProgress(true); // resume instead of restart
                bannerCarouselEl.style.cursor = "default";
            })
        );
        slideNumberEl.textContent = `01 / ${String(bannerProducts.length).padStart(2, "0")}`;
        startProgress(false);
        cleanUp.push(() => clearInterval(timer));
    }

    setupCarouselListeners();
    document.querySelectorAll(".product-carousel-wrapper").forEach((wrapper) => setupCarouselArrowVisibility(wrapper));

    const scrollDownArrow = document.querySelector(".banner-scroll-down");
    function onScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.remove("navbar-transparent-at-top");
        } else {
            navbar.classList.add("navbar-transparent-at-top");
        }
        if (scrollDownArrow) {
            if (scrollY > 20) scrollDownArrow.classList.add("hidden");
            else scrollDownArrow.classList.remove("hidden");
        }
    }
    cleanUp.push(() => navbar.classList.remove("navbar-transparent-at-top"));
    window.addEventListener("scroll", onScroll);
    cleanUp.push(() => window.removeEventListener("scroll", onScroll));
    onScroll();

    document.getElementById("homeBanner").addEventListener("click", (e) => {
        const btn = e.target.closest(".banner-buy-now-btn");
        if (!btn) return;

        const productId = btn.dataset.productId;
        if (productId) {
            navigateTo("product-detail-view", productId);
        }
    });

    return () => cleanUp.forEach((fn) => fn());
}
