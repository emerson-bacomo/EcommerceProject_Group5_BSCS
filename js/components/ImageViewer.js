import { mobileMaxWidthPlus1 } from "../config/general.js";
import { clamp, html } from "../utils/helpers.js";

export class ImageViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.images = [];
        this.currentIndex = 0;
        this.overlayOpen = false;

        this.carouselInstance = null;

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.openFullscreen = this.openFullscreen.bind(this);
        this.handleSlide = this.handleSlide.bind(this);
    }

    connectedCallback() {
        this.images = JSON.parse(decodeURIComponent(this.getAttribute("images") || "[]"));
        if (this.hasAttribute("initial-index")) {
            this.currentIndex = parseInt(this.getAttribute("initial-index"), 10) || 0;
        }
        this.render();
        this.setupMainSlider();
    }

    render() {
        this.commonStyles = html`
            <style>
                .carousel-control-prev,
                .carousel-control-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.3);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    z-index: 10;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .carousel-control-prev-icon,
                .carousel-control-next-icon {
                    width: 20px;
                    height: 20px;
                }
                .carousel-control-prev:hover,
                .carousel-control-next:hover {
                    opacity: 1;
                }
                .carousel-control-prev {
                    left: 10px;
                }
                .carousel-control-next {
                    right: 10px;
                }

                .carousel-indicators {
                    position: absolute;
                    bottom: 15px;
                    width: fit-content;
                    margin: 0 auto;
                    display: flex;
                    gap: 8px;
                    z-index: 10;
                    background-color: rgba(0, 0, 0, 0.3);
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                }

                .carousel-indicators button {
                    width: 20px;
                    height: 5px;
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 2px;
                    transition: background-color 0.3s, width 0.3s;
                    cursor: pointer;
                    border: none;
                }
                .carousel-indicators button.active {
                    background-color: white;
                    width: 30px;
                }
                @media (max-width: ${mobileMaxWidthPlus1}px) {
                    .carousel-control-prev,
                    .carousel-control-next {
                        display: none;
                    }
                }
            </style>
        `;

        this.shadowRoot.innerHTML = html`
            <style>
                @import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
                :host {
                    display: block;
                    position: relative;
                    border-radius: var(--bs-border-radius-lg);
                    border: 1px solid #dee2e6;
                    background-color: #fff;
                    overflow: hidden;
                }
                .carousel-item {
                    aspect-ratio: 1 / 1;
                }
                .carousel-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: pointer;
                }
            </style>
            ${this.commonStyles}

            <div id="image-viewer-carousel" class="carousel slide" data-bs-interval="false">
                ${this.images.length > 1
                    ? html`
                          <div class="carousel-indicators">
                              ${this.images
                                  .map(
                                      (_, i) => html`
                                          <button
                                              type="button"
                                              data-bs-slide-to="${i}"
                                              class="${i === this.currentIndex ? "active" : ""}"
                                              aria-current="${i === this.currentIndex}"
                                              aria-label="Slide ${i + 1}"
                                          ></button>
                                      `
                                  )
                                  .join("")}
                          </div>
                      `
                    : ""}

                <div class="carousel-inner">
                    ${this.images
                        .map(
                            (img, i) => html`
                                <div class="carousel-item ${i === this.currentIndex ? "active" : ""}">
                                    <img src="${img}" class="d-block w-100" alt="Slide ${i + 1}" />
                                </div>
                            `
                        )
                        .join("")}
                </div>

                ${this.images.length > 1
                    ? html`
                          <button class="carousel-control-prev" type="button">
                              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next" type="button">
                              <span class="carousel-control-next-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                          </button>
                      `
                    : ""}
            </div>
        `;
    }

    setupMainSlider() {
        this.carouselEl = this.shadowRoot.querySelector("#image-viewer-carousel");

        // eslint-disable-next-line no-undef
        this.carouselInstance = new bootstrap.Carousel(this.carouselEl, {
            interval: false,
            wrap: true,
            touch: true,
        });

        this.carouselEl.addEventListener("slid.bs.carousel", this.handleSlide);

        this.setupCarouselListeners(this.shadowRoot);

        this.shadowRoot.querySelectorAll(".carousel-item img").forEach((img) => {
            img.addEventListener("click", this.openFullscreen);
        });
    }

    setupCarouselListeners(container) {
        // Manually add click listeners since it seems like data-bs isn't accessed if in shadow dom

        const prevBtn = container.querySelector(".carousel-control-prev");
        const nextBtn = container.querySelector(".carousel-control-next");
        const indicators = container.querySelectorAll(".carousel-indicators button");

        if (prevBtn) {
            prevBtn.addEventListener("click", this.handlePrev);
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", this.handleNext);
        }
        indicators.forEach((ind) => {
            ind.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-bs-slide-to");
                this.jumpToSlide(parseInt(index, 10));
            });
        });
    }

    handleSlide(event) {
        this.currentIndex = event.to;
    }

    handlePrev() {
        if (this.carouselInstance) {
            this.carouselInstance.prev();
        }
    }

    handleNext() {
        if (this.carouselInstance) {
            this.carouselInstance.next();
        }
    }

    jumpToSlide(index) {
        const newIndex = clamp(index, 0, this.images.length - 1);
        if (this.carouselInstance) {
            this.carouselInstance.to(newIndex);
        }
    }

    openFullscreen() {
        if (this.overlayOpen || typeof bootstrap === "undefined") return;
        this.overlayOpen = true;

        const overlay = document.createElement("div");
        overlay.className = "fullscreen-overlay";
        const overlayId = `fullscreen-carousel-${Date.now()}`;

        overlay.innerHTML = html`
            ${this.commonStyles}
            <style>
                .fullscreen-overlay {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 10000;
                }
                .fullscreen-overlay .carousel {
                    width: 100%;
                    height: 100%;
                }
                .fullscreen-overlay .carousel-inner,
                .fullscreen-overlay .carousel-item {
                    height: 100%;
                }
                .fullscreen-overlay .carousel-item {
                    position: relative;
                    height: 100%;
                }

                .fullscreen-overlay .carousel-item img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    max-width: 98%;
                    max-height: 85vh;
                    object-fit: contain;
                }
                .f-button.close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    font-size: 2rem;
                    line-height: 1;
                    background: transparent;
                    color: white;
                    border: none;
                    opacity: 0.7;
                    z-index: 10001;
                    transition: opacity 0.2s;
                }
                .f-button.close:hover {
                    opacity: 1;
                }
            </style>

            <div id="${overlayId}" class="carousel slide" data-bs-interval="false">
                <div class="carousel-indicators">
                    ${this.images
                        .map(
                            (_, i) => html`
                                <button
                                    type="button"
                                    data-bs-slide-to="${i}"
                                    class="${i === this.currentIndex ? "active" : ""}"
                                    aria-current="${i === this.currentIndex}"
                                ></button>
                            `
                        )
                        .join("")}
                </div>

                <div class="carousel-inner">
                    ${this.images
                        .map(
                            (img, i) => html`
                                <div class="carousel-item ${i === this.currentIndex ? "active" : ""}">
                                    <img src="${img}" alt="Fullscreen image" />
                                </div>
                            `
                        )
                        .join("")}
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#${overlayId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${overlayId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>

            <button class="f-button close">&times;</button>
        `;

        document.body.appendChild(overlay);

        const fsCarouselEl = overlay.querySelector(`#${overlayId}`);
        // eslint-disable-next-line no-undef
        const fsCarouselInstance = new bootstrap.Carousel(fsCarouselEl, {
            interval: false,
            wrap: true,
            touch: true,
        });

        fsCarouselInstance.to(this.currentIndex);

        this.setupCarouselListeners(overlay); // Add manual listener so that the main carousel also slides

        const indicators = overlay.querySelectorAll(".carousel-indicators button"); // Manually do this since data-bs-target is difficult to style
        indicators.forEach((ind) => {
            ind.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-bs-slide-to");
                fsCarouselInstance.to(index);
            });
        });

        const closeBtn = overlay.querySelector(".f-button.close");

        const closeOverlay = () => {
            if (!this.overlayOpen) return;
            this.overlayOpen = false;
            fsCarouselInstance.dispose();
            overlay.remove();
            document.removeEventListener("keydown", handleKeyDown);
            this.focus();
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") closeOverlay();
        };

        closeBtn.addEventListener("click", closeOverlay);
        document.addEventListener("keydown", handleKeyDown);
    }
}

customElements.define("image-viewer", ImageViewer);
