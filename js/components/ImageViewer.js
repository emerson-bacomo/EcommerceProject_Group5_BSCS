import { clamp, html } from "../utils/helpers.js";

export class ImageViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.images = [];
        this.currentIndex = 0;
        this.overlayOpen = false;

        // Bind handlers so that they can still have access to "this" even when they add added to event listeners
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.openFullscreen = this.openFullscreen.bind(this);
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
        this.shadowRoot.innerHTML = html`
            <style>
                :host {
                    display: block;
                    position: relative;
                    overflow: hidden;
                    border-radius: var(--bs-border-radius-lg);
                    border: 1px solid #dee2e6;
                    background-color: #fff;
                }
                .image-slider {
                    display: flex;
                    transition: transform 0.3s ease-in-out;
                }
                .image-slide {
                    flex: 0 0 100%;
                    aspect-ratio: 1 / 1;
                }
                .image-slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    cursor: pointer;
                }
                .arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.3);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    z-index: 10;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .arrow:hover {
                    opacity: 1;
                }
                .arrow.prev {
                    left: 10px;
                }
                .arrow.next {
                    right: 10px;
                }
                .indicators {
                    position: absolute;
                    bottom: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                    z-index: 10;
                    background-color: rgba(0, 0, 0, 0.3);
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                }

                .indicator {
                    width: 20px;
                    height: 5px;
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 2px;
                    transition: background-color 0.3s, width 0.3s;
                    cursor: pointer;
                }
                .indicator.active {
                    background-color: white;
                    width: 30px;
                }
            </style>
            <div class="image-viewer-container">
                <div class="image-slider">
                    ${this.images.map((img) => html` <div class="image-slide"><img src="${img}" /></div> `).join("")}
                </div>
                ${this.images.length > 1
                    ? html`
                          <button class="arrow prev">&#10094;</button>
                          <button class="arrow next">&#10095;</button>
                          <div class="indicators">
                              ${this.images
                                  .map((_, i) => `<div class="indicator ${i === 0 ? "active" : ""}" data-index="${i}"></div>`)
                                  .join("")}
                          </div>
                      `
                    : ""}
            </div>
        `;
    }

    setupMainSlider() {
        this.slider = this.shadowRoot.querySelector(".image-slider");
        this.prevBtn = this.shadowRoot.querySelector(".arrow.prev");
        this.nextBtn = this.shadowRoot.querySelector(".arrow.next");
        this.indicators = this.shadowRoot.querySelectorAll(".indicator");

        this.updateVisuals(this.currentIndex);

        if (this.prevBtn) this.prevBtn.addEventListener("click", this.handlePrev);
        if (this.nextBtn) this.nextBtn.addEventListener("click", this.handleNext);
        this.indicators.forEach((ind) => {
            ind.addEventListener("click", () => {
                this.currentIndex = parseInt(ind.dataset.index, 10);
                this.updateVisuals(this.currentIndex);
            });
        });

        this.slider.querySelectorAll("img").forEach((img) => {
            img.addEventListener("click", this.openFullscreen);
        });

        // Touch drag support
        let startX = 0;
        let isDragging = false;
        let currentTranslate = -this.currentIndex * 100;

        this.slider.addEventListener(
            "touchstart",
            (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.slider.style.transition = "none";
            },
            { passive: true }
        );

        this.slider.addEventListener(
            "touchmove",
            (e) => {
                if (!isDragging) return;
                const diffX = e.touches[0].clientX - startX;
                this.slider.style.transform = `translateX(${currentTranslate + (diffX / this.slider.offsetWidth) * 100}%)`;
            },
            { passive: true }
        );

        this.slider.addEventListener("touchend", (e) => {
            if (!isDragging) return;
            isDragging = false;
            this.slider.style.transition = "transform 0.3s ease-in-out";
            const diffX = e.changedTouches[0].clientX - startX;
            const threshold = this.slider.offsetWidth / 4;
            if (diffX > threshold) this.handlePrev();
            else if (diffX < -threshold) this.handleNext();
            else this.updateVisuals(this.currentIndex);
        });
    }

    handlePrev() {
        this.currentIndex = this.currentIndex - 1 < 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.updateVisuals(this.currentIndex);
    }

    handleNext() {
        this.currentIndex = this.currentIndex + 1 >= this.images.length ? 0 : this.currentIndex + 1;
        this.updateVisuals(this.currentIndex);
    }

    jumpToSlide(index) {
        this.currentIndex = clamp(index, 0, this.images.length - 1);
        this.updateVisuals(this.currentIndex);
    }

    updateVisuals(index) {
        const translate = -index * 100;
        this.slider.style.transform = `translateX(${translate}%)`;
        this.indicators.forEach((ind, i) => ind.classList.toggle("active", i === index));
    }

    openFullscreen() {
        if (this.overlayOpen) return;
        this.overlayOpen = true;

        const overlay = document.createElement("div");
        overlay.className = "fullscreen-overlay";

        overlay.innerHTML = html`
            <style>
                .fullscreen-overlay {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 10000;
                    overflow: hidden;
                }
                .fullscreen-overlay .f-wrapper {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.3s ease-in-out;
                    will-change: transform;
                }
                .fullscreen-overlay .f-slide {
                    flex: 0 0 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .fullscreen-overlay .f-slide img {
                    max-width: 95vw;
                    max-height: 90vh;
                    object-fit: contain;
                }

                .f-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: rgba(0, 0, 0, 0.3);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    z-index: 10;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .f-button:hover {
                    opacity: 1;
                }
                .f-button.prev {
                    left: 15px;
                }
                .f-button.next {
                    right: 15px;
                }

                .f-button.close {
                    top: 20px;
                    right: 20px;
                    font-size: 2rem;
                    line-height: 1;
                    background: transparent;
                    transform: none;
                }
                .f-indicators {
                    position: absolute;
                    bottom: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 8px;
                    z-index: 10;
                    background-color: rgba(0, 0, 0, 0.3);
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                }

                .f-indicator {
                    width: 20px;
                    height: 5px;
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 2px;
                    transition: background-color 0.3s, width 0.3s;
                    cursor: pointer;
                }
                .f-indicator.active {
                    background-color: white;
                    width: 30px;
                }
            </style>

            <div class="f-wrapper">
                ${this.images
                    .map(
                        (src) => html`
                            <div class="f-slide">
                                <img src="${src}" alt="Fullscreen image" />
                            </div>
                        `
                    )
                    .join("")}
            </div>

            <button class="f-button prev">&#10094;</button>
            <button class="f-button next">&#10095;</button>
            <button class="f-button close">&times;</button>

            ${this.images.length > 1
                ? html`
                      <div class="f-indicators">
                          ${this.images.map((_, i) => html`<div class="f-indicator" data-index="${i}"></div>`).join("")}
                      </div>
                  `
                : ""}
        `;

        document.body.appendChild(overlay);

        const wrapper = overlay.querySelector(".f-wrapper");
        const prevBtn = overlay.querySelector(".f-button.prev");
        const nextBtn = overlay.querySelector(".f-button.next");
        const closeBtn = overlay.querySelector(".f-button.close");
        const indicators = overlay.querySelectorAll(".f-indicator");

        let currentTranslate = -this.currentIndex * 100;
        let startX = 0;
        let isDragging = false;

        const updateOverlayVisuals = (index) => {
            currentTranslate = -index * 100;
            wrapper.style.transform = `translateX(${currentTranslate}%)`;
            indicators.forEach((ind, i) => ind.classList.toggle("active", i === index));

            this.currentIndex = index;
            this.updateVisuals(index);
        };

        const prev = () => updateOverlayVisuals(this.currentIndex - 1 < 0 ? this.images.length - 1 : this.currentIndex - 1);
        const next = () => updateOverlayVisuals(this.currentIndex + 1 >= this.images.length ? 0 : this.currentIndex + 1);

        updateOverlayVisuals(this.currentIndex);

        if (prevBtn) prevBtn.addEventListener("click", prev);
        if (nextBtn) nextBtn.addEventListener("click", next);

        const closeOverlay = () => {
            if (!this.overlayOpen) return;
            this.overlayOpen = false;
            overlay.remove();
            document.removeEventListener("keydown", handleKeyDown);
        };

        const handleKeyDown = (e) => {
            if (!this.overlayOpen) return;
            if (e.key === "Escape") closeOverlay();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };

        closeBtn.addEventListener("click", closeOverlay);
        document.addEventListener("keydown", handleKeyDown);

        indicators.forEach((ind) => {
            ind.addEventListener("click", () => {
                updateOverlayVisuals(parseInt(ind.dataset.index, 10));
            });
        });

        overlay.addEventListener(
            "touchstart",
            (e) => {
                // Only start drag if touching the wrapper/image, not buttons
                if (e.target.closest(".f-button, .f-indicators")) return;
                startX = e.touches[0].clientX;
                isDragging = true;
                wrapper.style.transition = "none";
            },
            { passive: true }
        );

        overlay.addEventListener(
            "touchmove",
            (e) => {
                if (!isDragging) return;
                const diffX = e.touches[0].clientX - startX;
                wrapper.style.transform = `translateX(${currentTranslate + (diffX / wrapper.offsetWidth) * 100}%)`;
            },
            { passive: true }
        );

        overlay.addEventListener("touchend", (e) => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.style.transition = "transform 0.3s ease-in-out";

            const diffX = e.changedTouches[0].clientX - startX;
            const threshold = wrapper.offsetWidth / 4;

            if (diffX > threshold) prev();
            else if (diffX < -threshold) next();
            else updateOverlayVisuals(this.currentIndex); // Snap back
        });
    }
}

customElements.define("image-viewer", ImageViewer);
