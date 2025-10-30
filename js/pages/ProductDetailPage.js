import { getStarRatingHTML, html, getPriceRange, formatCurrency, getProductById } from "../utils/helpers.js";
import { setupImageViewer } from "../components/ImageViewer.js";
import { showToast } from "../components/Toast.js";
import { navigateTo } from "../utils/navigation.js";
import { S } from "../state.js";
import { findCartItem, findCartItemByKey, updateCartBadge } from "./CartPage.js";

function getSelectedPrice(product, selectedColor, selectedSize) {
    const colors = product.variations?.color || {};
    if (selectedColor === "Default" && selectedSize === "Standard" && colors.Default?.sizes?.Standard) {
        return colors.Default.sizes.Standard;
    }
    if (!selectedColor && colors[Object.keys(colors)[0]]?.sizes?.[selectedSize]) {
        const firstColor = Object.keys(colors)[0];
        if (Object.keys(colors).length === 1) return colors[firstColor].sizes[selectedSize];
    }
    if (!selectedSize && colors[selectedColor]?.sizes?.[Object.keys(colors[selectedColor].sizes)[0]]) {
        const firstSize = Object.keys(colors[selectedColor].sizes)[0];
        if (Object.keys(colors[selectedColor].sizes).length === 1) return colors[selectedColor].sizes[firstSize];
    }
    if (selectedColor && selectedSize) return colors[selectedColor]?.sizes?.[selectedSize] ?? null;
    return null;
}

function getSelectedPriceDisplay(product, selectedColor, selectedSize, quantity) {
    const colors = product.variations?.color || {};
    if (selectedColor && selectedSize) {
        const price = colors[selectedColor]?.sizes?.[selectedSize];
        return price ? formatCurrency(price * quantity) : "Not Available";
    } else if (selectedColor) {
        const sizesForColor = colors[selectedColor]?.sizes || {};
        const prices = Object.values(sizesForColor);
        if (prices.length === 0) return "N/A";
        const min = Math.min(...prices) * quantity;
        const max = Math.max(...prices) * quantity;
        return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
    } else if (selectedSize) {
        const prices = [];
        Object.values(colors).forEach((colorData) => {
            if (colorData.sizes?.[selectedSize]) prices.push(colorData.sizes[selectedSize]);
        });
        if (prices.length === 0) return "Not Available";
        const min = Math.min(...prices) * quantity;
        const max = Math.max(...prices) * quantity;
        return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
    } else {
        return getPriceRange(product, quantity);
    }
}

function updatePriceDisplay(product) {
    const selectedColor = S.currentProductDetailState.selectedColor;
    const selectedSize = S.currentProductDetailState.selectedSize;
    const quantity = S.currentProductDetailState.currentQuantity || 1;
    const priceDisplay = document.querySelector("#product-price");
    if (priceDisplay) priceDisplay.textContent = getSelectedPriceDisplay(product, selectedColor, selectedSize, quantity);
}

function saveProductDetailState() {
    if (!S.currentProductDetailState.productId) return;
    const stateToSave = {
        selectedColor: S.currentProductDetailState.selectedColor,
        selectedSize: S.currentProductDetailState.selectedSize,
        currentQuantity: S.currentProductDetailState.currentQuantity,
    };
    localStorage.setItem(`product_detail_${S.currentProductDetailState.productId}`, JSON.stringify(stateToSave));
}

function addVariationListeners(container, product) {
    const colorSelector = container.querySelector("#color-selector");
    const sizeSelector = container.querySelector("#size-selector");
    const errorDiv = container.querySelector("#variation-error");
    const variationThumbs = container.querySelector("#variation-thumbs");
    const imageViewer = container.querySelector("#image-viewer");

    function updateUI() {
        const selectedColor = S.currentProductDetailState.selectedColor;
        const selectedSize = S.currentProductDetailState.selectedSize;
        const colors = product.variations?.color || {};
        updatePriceDisplay(product);
        variationThumbs?.querySelectorAll(".thumb-item").forEach((thumb) => {
            thumb.classList.toggle("active", thumb.dataset.color === selectedColor);
        });
        if (selectedColor && imageViewer && typeof imageViewer.jumpToSlide === "function") {
            const imageIndex = S.currentProductDetailState.colorImageMap[selectedColor] ?? 0;
            imageViewer.jumpToSlide(imageIndex);
        }
        if (colorSelector) {
            colorSelector.querySelectorAll('input[name="productColor"]').forEach((input) => {
                const color = input.value;
                let isAvailable = true;
                if (selectedSize) isAvailable = !!colors[color]?.sizes?.[selectedSize];
                input.disabled = !isAvailable;
                input.nextElementSibling.classList.toggle("disabled", !isAvailable);
            });
        }
        if (sizeSelector) {
            sizeSelector.querySelectorAll('input[name="productSize"]').forEach((input) => {
                const size = input.value;
                let isAvailable = true;
                if (selectedColor) isAvailable = !!colors[selectedColor]?.sizes?.[size];
                input.disabled = !isAvailable;
                input.nextElementSibling.classList.toggle("disabled", !isAvailable);
            });
        }
        errorDiv.style.display = "none";
    }

    function handleSelectionChange(selectorContainer, changedInput, isColorGroup) {
        if (!selectorContainer) return;
        selectorContainer.querySelectorAll(`input[type="checkbox"]`).forEach((input) => {
            if (input !== changedInput) input.checked = false;
        });
        const newValue = changedInput.checked ? changedInput.value : null;
        if (isColorGroup) {
            S.currentProductDetailState.selectedColor = newValue;
            if (
                newValue &&
                S.currentProductDetailState.selectedSize &&
                !product.variations?.color?.[newValue]?.sizes?.[S.currentProductDetailState.selectedSize]
            ) {
                S.currentProductDetailState.selectedSize = null;
                const sizeInput = sizeSelector?.querySelector(`input[type="checkbox"]:checked`);
                if (sizeInput) sizeInput.checked = false;
            }
        } else {
            S.currentProductDetailState.selectedSize = newValue;
            if (
                newValue &&
                S.currentProductDetailState.selectedColor &&
                !product.variations?.color?.[S.currentProductDetailState.selectedColor]?.sizes?.[newValue]
            ) {
                S.currentProductDetailState.selectedColor = null;
                const colorInput = colorSelector?.querySelector(`input[type="checkbox"]:checked`);
                if (colorInput) colorInput.checked = false;
            }
        }
        updateUI();
        saveProductDetailState();
    }

    colorSelector?.addEventListener("change", (e) => handleSelectionChange(colorSelector, e.target, true));
    sizeSelector?.addEventListener("change", (e) => handleSelectionChange(sizeSelector, e.target, false));
    variationThumbs?.addEventListener("click", (e) => {
        const thumb = e.target.closest(".thumb-item");
        if (thumb) {
            const color = thumb.dataset.color;
            const checkbox = colorSelector?.querySelector(`input[value="${color}"]`);
            if (checkbox) {
                if (checkbox.disabled) {
                    const sizeCheckbox = sizeSelector?.querySelector(`input[type="checkbox"]:checked`);
                    if (sizeCheckbox) {
                        sizeCheckbox.checked = false;
                        S.currentProductDetailState.selectedSize = null;
                    }
                }
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    });

    const colors = Object.keys(product.variations?.color || {});
    const sizes = new Set();
    Object.values(product.variations?.color || {}).forEach((c) => Object.keys(c.sizes || {}).forEach((s) => sizes.add(s)));
    if (colors.length === 1 && colors[0] === "Default") S.currentProductDetailState.selectedColor = "Default";
    if (sizes.size === 1 && Array.from(sizes)[0] === "Standard") S.currentProductDetailState.selectedSize = "Standard";
    if (S.currentProductDetailState.selectedColor) {
        const colorInput = colorSelector?.querySelector(`input[value="${S.currentProductDetailState.selectedColor}"]`);
        if (colorInput) colorInput.checked = true;
    }
    if (S.currentProductDetailState.selectedSize) {
        const sizeInput = sizeSelector?.querySelector(`input[value="${S.currentProductDetailState.selectedSize}"]`);
        if (sizeInput) sizeInput.checked = true;
    }
    updateUI();
}

export function renderProductDetailPage(container, params) {
    let productId;
    let cartKey = null;
    if (typeof params === "object" && params !== null) {
        productId = params.productId;
        cartKey = params.cartKey;
    } else {
        productId = params;
    }
    const product = getProductById(productId);
    if (!product) {
        container.innerHTML = `<p class="text-center">Product not found.</p>`;
        return;
    }
    S.currentProductDetailState = {
        productId,
        selectedColor: null,
        selectedSize: null,
        currentImageIndex: 0,
        totalImages: 0,
        colorImageMap: {},
        currentQuantity: 1,
    };

    let loadedFromCart = false;
    if (cartKey) {
        const item = findCartItemByKey(cartKey);
        if (item) {
            S.currentProductDetailState.selectedColor = item.color;
            S.currentProductDetailState.selectedSize = item.size;
            S.currentProductDetailState.currentQuantity = item.quantity;
            loadedFromCart = true;
        }
    }
    if (!loadedFromCart) {
        const savedState = localStorage.getItem(`product_detail_${productId}`);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            S.currentProductDetailState.selectedColor = parsedState.selectedColor || null;
            S.currentProductDetailState.selectedSize = parsedState.selectedSize || null;
            S.currentProductDetailState.currentQuantity = parsedState.currentQuantity || 1;
        }
    }

    const allImages = [...product.images];
    if (product.variations && product.variations.color) {
        Object.entries(product.variations.color).forEach(([colorName, colorData]) => {
            if (colorData.image) {
                S.currentProductDetailState.colorImageMap[colorName] = allImages.length;
                allImages.push(colorData.image);
            } else {
                const fallbackImage = product.images[0] || "https://placehold.co/600x600/E2E8F0/4A5568?text=Image";
                S.currentProductDetailState.colorImageMap[colorName] = allImages.length;
                allImages.push(fallbackImage);
            }
        });
    }
    S.currentProductDetailState.totalImages = allImages.length;

    const colors = product.variations && product.variations.color ? Object.keys(product.variations.color) : [];
    const sizes = new Set();
    if (product.variations && product.variations.color) {
        Object.values(product.variations.color).forEach((colorData) => {
            if (colorData.sizes) Object.keys(colorData.sizes).forEach((size) => sizes.add(size));
        });
    }
    const sortedSizes = Array.from(sizes).sort();
    const initialPriceDisplay = getPriceRange(product);

    container.innerHTML = html` <style>
            .image-viewer-container {
                position: relative;
                overflow: hidden;
                border-radius: var(--bs-border-radius-lg);
                border: 1px solid #dee2e6;
                background-color: #fff;
                user-select: none;
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
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .image-viewer-arrow {
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
            .image-viewer-arrow:hover {
                opacity: 1;
            }
            .image-viewer-arrow.prev {
                left: 10px;
            }
            .image-viewer-arrow.next {
                right: 10px;
            }
            .image-indicators {
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 8px;
                z-index: 10;
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
            .variation-thumbnails {
                display: flex;
                gap: 10px;
                margin-top: 15px;
                flex-wrap: wrap;
            }
            .thumb-item {
                cursor: pointer;
                border: 2px solid transparent;
                border-radius: var(--bs-border-radius);
                padding: 2px;
                transition: border-color 0.2s;
            }
            .thumb-item img {
                display: block;
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: calc(var(--bs-border-radius) - 2px);
            }
            .thumb-item.active {
                border-color: var(--bs-primary);
            }
            .variation-selector .btn-check + .btn-outline-secondary {
                border-color: #ced4da;
                color: #495057;
            }
            .variation-selector .btn-check:checked + .btn-outline-secondary {
                background-color: var(--bs-primary);
                border-color: var(--bs-primary);
                color: #fff;
            }
            .variation-selector .btn-check:not(:disabled) + .btn-outline-secondary:hover {
                background-color: #e2e6ea;
            }
            .variation-selector .btn-check:checked + .btn-outline-secondary:hover {
                background-color: #0b5ed7;
                border-color: #0a58ca;
            }
            .variation-selector .btn-check:disabled + .btn-outline-secondary {
                background-color: #e9ecef;
                border-color: #e9ecef;
                color: #adb5bd;
                cursor: not-allowed;
                opacity: 0.65;
            }
            .variation-selector label.form-label {
                font-weight: 600;
                margin-bottom: 0.5rem;
                display: block;
            }
            .variation-selector .btn-group label {
                margin-bottom: 0;
            }
            .variation-div {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .variation-div .btn {
                width: fit-content;
                min-width: 80px;
            }
            #variation-error {
                display: none;
            }
        </style>
        <div class="row">
            <div class="col-lg-6 mb-4">
                <div class="image-viewer-container" id="image-viewer">
                    <div class="image-slider" style="transform: translateX(0%);">
                        ${allImages
                            .map(
                                (imgUrl) =>
                                    `<div class="image-slide"><img src="${imgUrl}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/600x600/E2E8F0/4A5568?text=Image';"></div>`
                            )
                            .join("")}
                    </div>
                    ${allImages.length > 1
                        ? `
                        <button class="image-viewer-arrow prev"><i class="fas fa-chevron-left"></i></button>
                        <button class="image-viewer-arrow next"><i class="fas fa-chevron-right"></i></button>
                        <div class="image-indicators">${allImages
                            .map((_, i) => `<div class="indicator ${i === 0 ? "active" : ""}" data-index="${i}"></div>`)
                            .join("")}</div>
                    `
                        : ""}
                </div>
                ${colors.length > 0 && !(colors.length === 1 && colors[0] === "Default")
                    ? `
                    <div class="variation-thumbnails mt-3" id="variation-thumbs">
                        ${Object.entries(product.variations?.color || {})
                            .map(
                                ([colorName, colorData]) => `
                            <div class="thumb-item" data-color="${colorName}" title="${colorName}">
                                <img src="${
                                    colorData.image || product.images[0]
                                }" alt="${colorName}" onerror="this.onerror=null;this.src='${product.images[0]}';">
                            </div>`
                            )
                            .join("")}
                    </div>`
                    : ""}
            </div>
            <div class="col-lg-6">
                <h2>${product.name}</h2>
                <div class="star-rating mb-2">
                    ${getStarRatingHTML(product.rating)}<small class="text-muted ms-1">${product.rating}</small>
                </div>
                <h3 class="mb-3 display-6" id="product-price">${initialPriceDisplay}</h3>
                <p class="text-muted lead mb-4 fs-6">${product.description}</p>
                ${colors.length > 0 && !(colors.length === 1 && colors[0] === "Default")
                    ? html`
                          <div class="mb-3 variation-selector" id="color-selector">
                              <label class="form-label d-block">Color:</label>
                              <div class="variation-div" role="group" aria-label="Color options">
                                  ${colors
                                      .map(
                                          (color, index) => `
                                <input type="checkbox" class="btn-check" name="productColor" id="color-${index}" value="${color}" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="color-${index}">${color}</label>
                            `
                                      )
                                      .join("")}
                              </div>
                          </div>
                      `
                    : ""}
                ${sortedSizes.length > 0 && !(sortedSizes.length === 1 && sortedSizes[0] === "Standard")
                    ? `
                    <div class="mb-4 variation-selector" id="size-selector">
                        <label class="form-label d-block">Size:</label>
                        <div class="variation-div" role="group" aria-label="Size options">
                            ${sortedSizes
                                .map(
                                    (size, index) => `
                                <input type="checkbox" class="btn-check" name="productSize" id="size-${index}" value="${size}" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="size-${index}">${size}</label>
                            `
                                )
                                .join("")}
                        </div>
                    </div>`
                    : ""}
                <div class="alert alert-danger mt-3" id="variation-error" role="alert">
                    Please select available options for Color and Size.
                </div>
                <div class="mb-3">
                    <label class="form-label d-block fw-600">Quantity:</label
                    ><quantity-picker
                        id="product-quantity-picker"
                        value="${S.currentProductDetailState.currentQuantity}"
                    ></quantity-picker>
                </div>
                <div class="d-flex gap-2 mt-4">
                    <button class="btn btn-primary btn-lg flex-grow-1" id="add-to-cart-btn">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-success btn-lg flex-grow-1" id="buy-now-btn">
                        <i class="fas fa-bolt me-2"></i>Buy Now
                    </button>
                </div>
            </div>
        </div>`;

    if (allImages.length > 1)
        setupImageViewer(container.querySelector("#image-viewer"), allImages.length, S.currentProductDetailState);
    addVariationListeners(container, product);

    container.querySelector("#product-quantity-picker").addEventListener("change", (e) => {
        S.currentProductDetailState.currentQuantity = e.detail.value;
        updatePriceDisplay(product);
        saveProductDetailState();
    });

    document.querySelector("#buy-now-btn").addEventListener("click", () => {
        if (!S.currentUser) {
            // eslint-disable-next-line no-undef
            new bootstrap.Modal(document.getElementById("promptLoginModal")).show();
            return;
        }
        const quantityPicker = document.getElementById("product-quantity-picker");
        const quantity = quantityPicker ? quantityPicker.value : 1;
        const { selectedColor, selectedSize } = S.currentProductDetailState;
        const product = getProductById(productId);
        const errorDiv = document.getElementById("variation-error");
        const variationsExist =
            product.variations &&
            Object.keys(product.variations.color || {}).length > 0 &&
            !(
                Object.keys(product.variations.color).length === 1 &&
                Object.keys(product.variations.color)[0] === "Default" &&
                Object.keys(product.variations.color.Default.sizes).length === 1 &&
                Object.keys(product.variations.color.Default.sizes)[0] === "Standard"
            );
        if (variationsExist && (!selectedColor || !selectedSize)) {
            errorDiv.textContent = "Please select available options for Color and Size.";
            errorDiv.style.display = "block";
            return;
        }
        const price = getSelectedPrice(product, selectedColor, selectedSize);
        if (variationsExist && price === null) {
            errorDiv.textContent = "The selected combination is not available.";
            errorDiv.style.display = "block";
            return;
        }
        errorDiv.style.display = "none";
        S.buyNowItem = { id: productId, color: selectedColor, size: selectedSize, price, quantity };
        navigateTo("checkout-view", { buyNow: true, item: S.buyNowItem });
    });

    document.querySelector("#add-to-cart-btn").addEventListener("click", () => {
        if (!S.currentUser) {
            // eslint-disable-next-line no-undef
            new bootstrap.Modal(document.getElementById("promptLoginModal")).show();
            return;
        }
        const quantityPicker = document.getElementById("product-quantity-picker");
        const quantity = quantityPicker ? quantityPicker.value : 1;
        const { selectedColor, selectedSize } = S.currentProductDetailState;
        const product = getProductById(productId);
        const errorDiv = document.getElementById("variation-error");
        const variationsExist =
            product.variations &&
            Object.keys(product.variations.color || {}).length > 0 &&
            !(
                Object.keys(product.variations.color).length === 1 &&
                Object.keys(product.variations.color)[0] === "Default" &&
                Object.keys(product.variations.color.Default.sizes).length === 1 &&
                Object.keys(product.variations.color.Default.sizes)[0] === "Standard"
            );
        if (variationsExist && (!selectedColor || !selectedSize)) {
            errorDiv.textContent = "Please select available options for Color and Size.";
            errorDiv.style.display = "block";
            return;
        }
        const price = getSelectedPrice(product, selectedColor, selectedSize);
        if (variationsExist && price === null) {
            errorDiv.textContent = "The selected combination is not available.";
            errorDiv.style.display = "block";
            return;
        }
        errorDiv.style.display = "none";
        const existingItem = findCartItem(productId, selectedColor, selectedSize);
        let infoMessage = null;
        if (existingItem) infoMessage = "Note: An identical item is already in your cart.";
        S.appData.cart.push({ id: productId, quantity, selected: true, color: selectedColor, size: selectedSize, price });
        import("../utils/storage.js").then(({ saveUserData }) => saveUserData(S.currentUser, S.appData));
        updateCartBadge();
        showToast(`${quantity} item(s) added to cart!`, "success", infoMessage);
    });
}
