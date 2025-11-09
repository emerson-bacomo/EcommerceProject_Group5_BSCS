import { getStarRatingHTML, html, getPriceRange, formatCurrency, getProductById, getHashParams } from "../utils/helpers.js";
import { showToast } from "../components/Toast.js";
import { navigateTo } from "../utils/navigation.js";
import { S } from "../state.js";
import { findCartItem, findCartItemByKey } from "./CartPage.js";
import { saveUserData } from "../utils/storage.js";
import { ImageViewer } from "../components/ImageViewer.js";

export function renderProductDetailPage(container) {
    const { id: productId, cartKey } = getHashParams();

    const product = getProductById(productId);
    if (!product) {
        container.innerHTML = html`<p class="text-center">Product not found.</p>`;
        return;
    }
    S.currentProductDetailState = {
        productId,
        selectedColor: null,
        selectedSize: null,
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
        const savedState = sessionStorage.getItem(`product_detail_${productId}`);
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

    const imageIndex = S.currentProductDetailState.colorImageMap[S.currentProductDetailState.selectedColor] ?? 0;

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
            .variation-thumbnails {
                display: flex;
                gap: 10px;
                margin-top: 15px;
                flex-wrap: wrap;
            }
            .thumb-item {
                cursor: pointer;
                border-radius: var(--bs-border-radius);
                border: 1px solid #ced4da;
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
                border: 2px solid var(--bs-primary);
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
            #variation-error.hidden {
                opacity: 0;
                visibility: hidden;
            }
        </style>
        <div class="row">
            <div class="col-lg-6 mb-4">
                <image-viewer
                    id="image-viewer"
                    images="${encodeURIComponent(JSON.stringify(allImages))}"
                    initial-index="${imageIndex}"
                ></image-viewer>

                ${colors.length > 0 && !(colors.length === 1 && colors[0] === "Default")
                    ? html`
                          <div class="variation-thumbnails mt-3" id="variation-thumbs">
                              ${Object.entries(product.variations?.color || {})
                                  .map(
                                      ([colorName, colorData]) => html`
                                          <div class="thumb-item" data-color="${colorName}" title="${colorName}">
                                              <img
                                                  src="${colorData.image || product.images[0]}"
                                                  alt="${colorName}"
                                                  onerror="this.onerror=null;this.src='${product.images[0]}';"
                                              />
                                          </div>
                                      `
                                  )
                                  .join("")}
                          </div>
                      `
                    : ""}
            </div>
            <div class="col-lg-6 d-flex flex-column gap-4">
                <div>
                    <h2>${product.name}</h2>
                    <div class="star-rating">
                        ${getStarRatingHTML(product.rating)}<small class="text-muted ms-1">${product.rating}</small>
                    </div>
                </div>

                <h3 class="display-6" id="product-price">${initialPriceDisplay}</h3>
                <p class="text-muted lead fs-6">${product.description}</p>
                <div class="d-flex flex-column gap-2">
                    ${colors.length > 0 && !(colors.length === 1 && colors[0] === "Default")
                        ? html`
                              <div class="variation-selector" id="color-selector">
                                  <label class="form-label d-block">Color:</label>
                                  <div class="variation-div" role="group" aria-label="Color options">
                                      ${colors
                                          .map(
                                              (color, index) => html`
                                                  <input
                                                      type="checkbox"
                                                      class="btn-check"
                                                      name="productColor"
                                                      id="color-${index}"
                                                      value="${color}"
                                                      autocomplete="off"
                                                  />
                                                  <label class="btn btn-outline-secondary" for="color-${index}">${color}</label>
                                              `
                                          )
                                          .join("")}
                                  </div>
                              </div>
                          `
                        : ""}
                    ${sortedSizes.length > 0 && !(sortedSizes.length === 1 && sortedSizes[0] === "Standard")
                        ? html`
                              <div class="variation-selector" id="size-selector">
                                  <label class="form-label d-block">Size:</label>
                                  <div class="variation-div" role="group" aria-label="Size options">
                                      ${sortedSizes
                                          .map(
                                              (size, index) => html`
                                                  <input
                                                      type="checkbox"
                                                      class="btn-check"
                                                      name="productSize"
                                                      id="size-${index}"
                                                      value="${size}"
                                                      autocomplete="off"
                                                  />
                                                  <label class="btn btn-outline-secondary" for="size-${index}">${size}</label>
                                              `
                                          )
                                          .join("")}
                                  </div>
                              </div>
                          `
                        : ""}
                    <div>
                        <label class="form-label d-block fw-600">Quantity:</label
                        ><quantity-picker
                            id="product-quantity-picker"
                            value="${S.currentProductDetailState.currentQuantity}"
                        ></quantity-picker>
                    </div>
                </div>

                <div class="alert alert-danger mt-auto" id="variation-error" role="alert">
                    Please select available options for Color and Size.
                </div>
                <div class="d-flex gap-2 mt-auto">
                    <button class="btn btn-primary btn-lg flex-grow-1" id="add-to-cart-btn">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-success btn-lg flex-grow-1" id="buy-now-btn">
                        <i class="fas fa-bolt me-2"></i>Buy Now
                    </button>
                </div>
            </div>
        </div>`;

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
            errorDiv.classList.remove("hidden");
            return;
        }
        const price = getSelectedPrice(product, selectedColor, selectedSize);
        if (variationsExist && price === null) {
            errorDiv.textContent = "The selected combination is not available.";
            errorDiv.classList.remove("hidden");
            return;
        }
        errorDiv.classList.add("hidden");
        navigateTo(
            `#checkout-view?buyNow=${encodeURIComponent(
                JSON.stringify({ id: productId, color: selectedColor, size: selectedSize, price, quantity })
            )}`
        );
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
            errorDiv.classList.remove("hidden");
            return;
        }
        const price = getSelectedPrice(product, selectedColor, selectedSize);
        if (variationsExist && price === null) {
            errorDiv.textContent = "The selected combination is not available.";
            errorDiv.classList.remove("hidden");
            return;
        }
        errorDiv.classList.add("hidden");
        const existingItem = findCartItem(productId, selectedColor, selectedSize);
        let infoMessage = null;
        if (existingItem) infoMessage = "Added a duplicate entry since an identical item is already in your cart.";
        S.appData.cart.push({
            cartId: Date.now(),
            id: productId,
            quantity,
            selected: true,
            color: selectedColor,
            size: selectedSize,
            price,
        });

        saveUserData(S.currentUser, S.appData);
        showToast(`${quantity} item(s) added to cart!`, "success", infoMessage);
    });
}

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
    sessionStorage.setItem(`product_detail_${S.currentProductDetailState.productId}`, JSON.stringify(stateToSave));
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
        if (selectedColor) {
            const imageIndex = S.currentProductDetailState.colorImageMap[selectedColor] ?? 0;
            if (imageViewer instanceof ImageViewer) {
                imageViewer.jumpToSlide(imageIndex);
            }
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
        errorDiv.classList.add("hidden");
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
