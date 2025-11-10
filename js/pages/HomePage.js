import { products } from "../config/products.js";
import { getScrollSource, getScrollY, html } from "../utils/helpers.js";
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
    const storedIndex = parseInt(sessionStorage.getItem("homeBannerIndex")) || 0;

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
                          max-width: 36rem;
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

                      .navbar {
                          background-color: transparent !important;
                      }

                      .navbar-white {
                          background-color: white !important;
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
                                      html`<div class="carousel-item ${index === storedIndex ? "active" : ""}">
                                          ${product.banner}
                                      </div>`
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
                                    <span class="slide-number">1 / ${bannerProducts.length}</span>
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
        const slideNumberEl = bannerCarouselEl.querySelector(".slide-number");
        const progressEl = bannerCarouselEl.querySelector("#banner-progress-bar");
        const totalSlides = bannerProducts.length;
        const duration = 5000;

        let slideTimer;
        let slideStartTime;

        // eslint-disable-next-line no-undef
        const bannerCarousel = new bootstrap.Carousel(bannerCarouselEl, {
            interval: false,
            ride: false,
            pause: false,
        });

        const startProgress = () => {
            slideStartTime = Date.now();
            progressEl.style.transition = "none";
            progressEl.style.width = "0%";

            requestAnimationFrame(() => {
                progressEl.style.transition = `width ${duration}ms linear`;
                progressEl.style.width = "100%";
            });

            clearTimeout(slideTimer);
            slideTimer = setTimeout(() => {
                bannerCarousel.next();
            }, duration);
        };

        const pauseProgress = () => {
            clearTimeout(slideTimer);
            const timeElapsed = Date.now() - slideStartTime;
            const percentElapsed = (timeElapsed / duration) * 100;
            const timeRemaining = duration - timeElapsed;

            bannerCarouselEl.dataset.timeRemaining = Math.max(0, timeRemaining);

            progressEl.style.transition = "none";
            progressEl.style.width = `${percentElapsed}%`;
        };

        const resumeProgress = () => {
            let timeRemaining = parseFloat(bannerCarouselEl.dataset.timeRemaining);

            if (isNaN(timeRemaining) || timeRemaining <= 0) {
                startProgress();
                return;
            }

            slideStartTime = Date.now() - (duration - timeRemaining);

            requestAnimationFrame(() => {
                progressEl.style.transition = `width ${timeRemaining}ms linear`;
                progressEl.style.width = "100%";
            });

            clearTimeout(slideTimer);
            slideTimer = setTimeout(() => {
                bannerCarousel.next();
            }, timeRemaining);
        };

        let isSliding = false; // Prevent slide event startProgress() and touchend event resumeProgress() (happens after) from colliding
        startProgress(); // Initial start
        slideNumberEl.textContent = `${storedIndex + 1} / ${totalSlides}`;

        bannerCarouselEl.addEventListener("slide.bs.carousel", (event) => {
            slideNumberEl.textContent = `${event.to + 1} / ${totalSlides}`;
            sessionStorage.setItem("homeBannerIndex", event.to);
            startProgress();
            isSliding = true;
        });

        ["mousedown", "touchstart"].forEach((evt) =>
            bannerCarouselEl.addEventListener(evt, () => {
                pauseProgress();
                bannerCarouselEl.style.cursor = "grabbing";
            })
        );

        ["mouseup", "touchend", "mouseleave"].forEach((evt) =>
            bannerCarouselEl.addEventListener(evt, () => {
                if (!isSliding && document.hidden === false && document.hasFocus()) {
                    resumeProgress();
                }
                bannerCarouselEl.style.cursor = "default";
                isSliding = false;
            })
        );

        const handlePagePause = () => pauseProgress();
        const handlePageResume = () => document.hidden === false && document.hasFocus() && resumeProgress();
        const visibilityHandler = () => (document.hidden ? handlePagePause() : handlePageResume());

        document.addEventListener("visibilitychange", visibilityHandler);
        window.addEventListener("blur", handlePagePause);
        window.addEventListener("focus", handlePageResume);

        cleanUp.push(() => {
            clearTimeout(slideTimer);

            document.removeEventListener("visibilitychange", visibilityHandler);
            window.removeEventListener("blur", handlePagePause);
            window.removeEventListener("focus", handlePageResume);

            bannerCarousel.dispose();
        });
    }

    setupCarouselListeners();
    document.querySelectorAll(".product-carousel-wrapper").forEach((wrapper) => setupCarouselArrowVisibility(wrapper));

    const scrollDownArrow = document.querySelector(".banner-scroll-down");
    function onScroll() {
        const scrollY = getScrollY();
        if (scrollY > 50) {
            navbar.classList.remove("navbar-transparent-at-top");
            navbar.classList.add("navbar-white");
        } else {
            navbar.classList.add("navbar-transparent-at-top");
        }
        if (scrollDownArrow) {
            if (scrollY > 30) scrollDownArrow.classList.add("hidden");
            else scrollDownArrow.classList.remove("hidden");
        }
    }
    cleanUp.push(() => navbar.classList.remove("navbar-transparent-at-top"));
    getScrollSource().addEventListener("scroll", onScroll);
    cleanUp.push(() => getScrollSource().removeEventListener("scroll", onScroll));
    onScroll();

    document.getElementById("homeBanner").addEventListener("click", (e) => {
        const btn = e.target.closest(".banner-buy-now-btn");
        if (!btn) return;

        const productId = btn.dataset.productId;
        if (productId) {
            navigateTo(`#product-detail-view?id=${encodeURIComponent(productId)}`);
        }
    });

    return () => cleanUp.forEach((fn) => fn());
}
