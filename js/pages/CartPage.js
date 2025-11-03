import { showConfirmationModal, showToast } from "../components/Toast.js";
import { mobileMaxWidthPlus1 } from "../config/general.js";
import { S } from "../state.js";
import { html, getProductById, formatCurrency } from "../utils/helpers.js";
import { saveUserData } from "../utils/storage.js";

export function renderCartPage(container) {
    const cart = S.appData.cart || [];
    if (cart.length === 0) {
        container.innerHTML = html`
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h4>Your cart is empty</h4>
                <button class="btn btn-primary mt-3" data-page="home-view">Continue Shopping</button>
            </div>
        `;
        return;
    }
    let subtotal = 0;
    const itemsSelected = cart.some((item) => item.selected);
    const allItemsSelected = cart.length > 0 && cart.every((item) => item.selected);
    const cartItemsHTML = cart
        .slice()
        .reverse()
        .map((item) => {
            const product = getProductById(item.id);
            if (!product) return "";
            const itemTotal = item.price * item.quantity;
            if (item.selected) subtotal += itemTotal;

            const itemIdentifier = item.cartId;

            const allColors = product.variations.color ? Object.keys(product.variations.color) : [];
            const allSizes =
                product.variations.color && product.variations.color[item.color] && product.variations.color[item.color].sizes
                    ? Object.keys(product.variations.color[item.color].sizes)
                    : [];

            const hasColorVariations = allColors.length > 1;
            const hasSizeVariations = allSizes.length > 1;

            let colorSelectHTML = "";
            if (hasColorVariations) {
                colorSelectHTML = html`
                    <select
                        class="form-select form-select-sm cart-variation-select cart-color-select"
                        data-original-key="${itemIdentifier}"
                    >
                        ${allColors
                            .map(
                                (color) =>
                                    html`<option value="${color}" ${item.color === color ? "selected" : ""}>${color}</option>`
                            )
                            .join("")}
                    </select>
                `;
            } else if (item.color !== "Default")
                colorSelectHTML = html`<span class="badge bg-light text-dark">${item.color}</span>`;

            let sizeSelectHTML = "";
            if (hasSizeVariations) {
                sizeSelectHTML = html`<select
                    class="form-select form-select-sm cart-variation-select cart-size-select"
                    data-original-key="${itemIdentifier}"
                >
                    ${allSizes
                        .map((size) => html`<option value="${size}" ${item.size === size ? "selected" : ""}>${size}</option>`)
                        .join("")}
                </select>`;
            } else if (item.size !== "Standard")
                sizeSelectHTML = html`<span class="badge bg-light text-dark">${item.size}</span>`;

            const displayImg = product.variations?.color?.[item.color]?.image || product.images[0];
            return html`
                <div class="d-flex justify-content-between align-items-center mb-4 cart-item" data-cart-key="${itemIdentifier}">
                    <div class="d-flex align-items-center flex-grow-1">
                        <input
                            type="checkbox"
                            class="form-check-input cart-item-checkbox me-3"
                            data-cart-key="${itemIdentifier}"
                            ${item.selected ? "checked" : ""}
                        />
                        <img
                            src="${displayImg}"
                            alt="${product.name}"
                            class="me-3 cart-item-img-link"
                            data-product-id="${product.id}"
                            style="cursor: pointer;"
                            onerror="this.onerror=null;this.src='${product.images[0]}';"
                        />
                        <div>
                            <h6 class="mb-0 cart-item-name-link" data-product-id="${product.id}" style="cursor: pointer;">
                                ${product.name}
                            </h6>
                            <div class="d-flex gap-2 mt-1">${colorSelectHTML}${sizeSelectHTML}</div>
                            <small class="text-muted mt-1 d-block">${formatCurrency(item.price)}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <quantity-picker
                            class="me-3 cart-quantity-picker"
                            value="${item.quantity}"
                            data-cart-key="${itemIdentifier}"
                        ></quantity-picker>
                        <strong class="me-3" style="min-width: 120px; text-align: right;">${formatCurrency(itemTotal)}</strong>
                        <button
                            class="btn btn-sm btn-outline-danger remove-item-btn"
                            data-cart-key="${itemIdentifier}"
                            aria-label="Remove item"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            `;
        })
        .join("");

    container.innerHTML = html`
        <style>
            .cart-item img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: var(--bs-border-radius);
            }
            .cart-variation-select {
                width: 120px;
            }
            .cart-item-checkbox {
                width: 1.25rem;
                height: 1.25rem;
                margin-top: 0;
            }
            @media (max-width: ${mobileMaxWidthPlus1}px) {
                .cart-item {
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 3rem !important;
                }
            }
        </style>
        <h1 class="mb-4">Your Shopping Cart</h1>
        <div class="card">
            <div class="card-header bg-white py-3">
                <div class="form-check d-flex align-items-center">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="select-all-cart-items"
                        ${allItemsSelected ? "checked" : ""}
                    />
                    <label class="form-check-label ms-2 fw-bold" for="select-all-cart-items">
                        Select All (${cart.length} items)
                    </label>
                </div>
            </div>
            <div class="card-body">${cartItemsHTML}</div>
            <div class="card-footer bg-white p-3">
                <div class="d-flex justify-content-end align-items-center">
                    <h5 class="me-3 mb-0">Subtotal (Selected):</h5>
                    <h4 class="mb-0 text-primary fw-bold">${formatCurrency(subtotal)}</h4>
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-primary" data-page="checkout-view" ${!itemsSelected ? "disabled" : ""}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll(".cart-item-img-link, .cart-item-name-link").forEach((el) => {
        el.addEventListener("click", (e) => {
            const cartItemLink = e.target;
            const cartKey = cartItemLink.closest(".cart-item").dataset.cartKey;
            const productId = cartItemLink.dataset.productId;
            S.buyNowItem = null;
            window.location.hash = `#product-detail-view?id=${productId}&cartKey=${encodeURIComponent(cartKey)}`;
        });
    });

    document.querySelector("#select-all-cart-items").addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        (S.appData.cart || []).forEach((item) => (item.selected = isChecked));
        saveUserData(S.currentUser, S.appData);
        renderCartPage(container);
    });

    document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
            const cartKey = e.target.dataset.cartKey;
            const item = findCartItemByKey(cartKey);
            if (item) item.selected = e.target.checked;
            saveUserData(S.currentUser, S.appData);
            renderCartPage(container);
        });
    });

    document.querySelectorAll(".cart-color-select").forEach((select) => {
        select.addEventListener("change", (e) => {
            const originalKey = e.target.dataset.originalKey;
            const originalItem = findCartItemByKey(originalKey);
            if (!originalItem) return;

            const newColor = e.target.value;
            const product = getProductById(originalItem.id);
            const availableSizes = product.variations.color[newColor].sizes;
            const newSize = availableSizes[originalItem.size] ? originalItem.size : Object.keys(availableSizes)[0];

            updateCartItemVariation(originalKey, newColor, newSize);
        });
    });

    document.querySelectorAll(".cart-size-select").forEach((select) => {
        select.addEventListener("change", (e) => {
            const originalKey = e.target.dataset.originalKey;
            const originalItem = findCartItemByKey(originalKey);
            if (!originalItem) return;

            const newSize = e.target.value;
            const colorSelect = e.target.closest(".cart-item").querySelector(".cart-color-select");
            const currentColor = colorSelect ? colorSelect.value : originalItem.color;

            updateCartItemVariation(originalKey, currentColor, newSize);
        });
    });

    document.querySelectorAll(".cart-quantity-picker").forEach((picker) => {
        picker.addEventListener("change", (e) => {
            const cartKey = e.target.dataset.cartKey;
            if (e.detail && typeof e.detail.value !== "undefined") {
                updateCartItemQuantity(cartKey, e.detail.value);
            }
        });
    });

    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const confirmed = await showConfirmationModal(
                "Are you sure you want to remove this item from your cart?",
                "Remove Item",
                "Remove",
                "btn-danger"
            );
            if (confirmed) {
                const itemToRemove = findCartItemByKey(e.target.dataset.cartKey);
                if (!itemToRemove) return;
                S.appData.cart = (S.appData.cart || []).filter((item) => item !== itemToRemove);
                saveUserData(S.currentUser, S.appData);
                renderCartPage(container);
            }
        });
    });

    function updateCartItemVariation(originalKey, newColor, newSize) {
        const originalItem = findCartItemByKey(originalKey);
        if (!originalItem) return;
        const product = getProductById(originalItem.id);
        if (!product) return;
        const newPrice = product.variations.color[newColor]?.sizes?.[newSize];
        if (newPrice === undefined) {
            showToast("This combination is not available.", "danger");
            renderCartPage(container);
            return;
        }
        const targetItem = findCartItem(originalItem.id, newColor, newSize);
        if (targetItem && targetItem !== originalItem) showToast("You now have duplicate variations in your cart.", "info");
        originalItem.color = newColor;
        originalItem.size = newSize;
        originalItem.price = newPrice;
        saveUserData(S.currentUser, S.appData);
        renderCartPage(container);
    }

    function updateCartItemQuantity(cartKey, newQuantity) {
        const item = findCartItemByKey(cartKey);
        if (item && item.quantity !== newQuantity) {
            item.quantity = newQuantity;
            saveUserData(S.currentUser, S.appData);
            renderCartPage(container);
        }
    }
}

export function findCartItem(productId, color, size) {
    const effectiveColor = color === "null" ? null : color || "Default";
    const effectiveSize = size === "null" ? null : size || "Standard";
    return (S.appData.cart || []).find(
        (item) =>
            item.id == productId && (item.color || "Default") === effectiveColor && (item.size || "Standard") === effectiveSize
    );
}

export function findCartItemByKey(cartId) {
    return (S.appData.cart || []).find((item) => item.cartId == cartId);
}

export function updateCartBadge() {
    const cartBadge = document.getElementById("cart-badge");
    if (!cartBadge) return;
    const count = S.appData.cart.length;
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? "inline-block" : "none";
}
