import { showToast } from "../components/Toast.js";
import { mobileMaxWidthPlus1 } from "../config/general.js";
import { S } from "../state.js";
import { getProductById, formatCurrency, html, styleString, isMobile, classNames, getHashParams } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { saveUserData } from "../utils/storage.js";

export function renderCheckoutPage(container) {
    const buyNowItemData = getHashParams().buyNow;

    let itemsToCheckout;
    let isBuyNow = false;
    if (buyNowItemData) {
        const product = getProductById(buyNowItemData.id);
        if (!product) {
            container.innerHTML = html` <div class="alert alert-danger">Error: Product not found for Buy Now.</div> `;
            return;
        }
        itemsToCheckout = [{ ...buyNowItemData, product }];
        isBuyNow = true;
    } else {
        itemsToCheckout = S.appData.cart
            .filter((item) => item.selected)
            .map((item) => ({ ...item, product: getProductById(item.id) }));
    }
    if (itemsToCheckout.length === 0) {
        container.innerHTML = html`
            <div class="alert alert-warning">
                No items to checkout.
                <a href="#" data-page="${isBuyNow ? "home-view" : "cart-view"}" class="alert-link">
                    Back to ${isBuyNow ? "Shop" : "Cart"}
                </a>
                .
            </div>
        `;
        return;
    }

    const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 0.0;
    const total = subtotal + shippingFee;
    const addressOptions = (S.appData.profile.addresses || [])
        .map(
            (addr, index) => html`
                <label class="card card-body mb-2 position-relative w-100" for="address${index}" style="cursor: pointer;">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="shippingAddress"
                            id="address${index}"
                            value="${index}"
                            ${index === 0 ? "checked" : ""}
                            style="cursor: pointer;"
                        />
                        <div class="form-check-label w-100">
                            <strong>${addr.name}</strong><br />
                            ${addr.address}<br />
                            ${addr.phone}
                        </div>
                    </div>
                </label>
            `
        )
        .join("");

    container.innerHTML = html`
        <style>
            @media (min-width: ${mobileMaxWidthPlus1}px) {
                .cart-item-list {
                    <!-- Limit height so that it would scroll in place on desktop -->
                    max-height: 40vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            }
            @media (max-width: ${mobileMaxWidthPlus1}px) {
                .card-body {
                    padding: 0.75rem;
                }
            }
            .list-group-item strong {
                position: relative;
                top: -3px;
            }
        </style>

        <h1 class="mb-4">Checkout</h1>
        <div class="row g-5">
            <div class="col-md-7">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4>Shipping Address</h4>
                    <a href="#" data-page="address-management-view" data-page-params="fromCheckout=true">Edit</a>
                </div>
                ${(S.appData.profile.addresses || []).length > 0
                    ? addressOptions
                    : html`
                          <div class="alert alert-warning">
                              You have no saved addresses. Please
                              <a
                                  href="#"
                                  data-page="address-management-view"
                                  data-page-params="fromCheckout=true"
                                  class="alert-link"
                                  >add one</a
                              >.
                          </div>
                      `}

                <h4 class="mt-4 mb-3">Payment Method</h4>
                <div class="card card-body">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="paymentMethod" id="payment-cod" value="COD" checked />
                        <label class="form-check-label w-100" for="payment-cod">
                            <strong>Cash on Delivery (COD)</strong>
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card">
                    <div class="card-body">
                        <h4 class="mb-3">Order Summary</h4>
                        <ul class="list-group list-group-flush cart-item-list">
                            ${itemsToCheckout
                                .map((item) => {
                                    const variationText = `${item.color && item.color !== "Default" ? item.color : ""}${
                                        item.color && item.color !== "Default" && item.size && item.size !== "Standard"
                                            ? " / "
                                            : ""
                                    }${item.size && item.size !== "Standard" ? item.size : ""}`;
                                    const displayImg =
                                        item.product.variations?.color?.[item.color]?.image || item.product.images[0];

                                    return html`
                                        <li
                                            class="list-group-item d-flex justify-content-between gap-2"
                                            style="${styleString("border: none", isMobile() && "padding: 0.5rem 0")}"
                                        >
                                            <div class="${classNames("d-flex w-100", isMobile() ? "gap-2" : "gap-3")}">
                                                <img
                                                    src="${displayImg}"
                                                    alt="${item.product.name}"
                                                    class="img-thumbnail"
                                                    onerror="this.onerror=null;this.src='https://placehold.co/80x80/E2E8F0/4A5568?text=N/A';"
                                                />
                                                <div>
                                                    <span class="text-ellipsis-2">${item.product.name} (x${item.quantity})</span>
                                                    ${variationText ? `<small class="text-muted">${variationText}</small>` : ""}
                                                </div>
                                            </div>
                                            <strong>${formatCurrency(item.price * item.quantity)}</strong>
                                        </li>
                                    `;
                                })
                                .join("")}
                        </ul>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <span>Subtotal</span>
                            <strong>${formatCurrency(subtotal)}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Shipping Fee</span>
                            <strong>${formatCurrency(shippingFee)}</strong>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between h5">
                            <span>Total</span>
                            <strong>${formatCurrency(total)}</strong>
                        </div>
                        <div class="d-grid mt-4">
                            <button
                                id="place-order-btn"
                                class="btn btn-primary"
                                ${(S.appData.profile.addresses || []).length === 0 || itemsToCheckout.length === 0
                                    ? "disabled"
                                    : ""}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.querySelector("#place-order-btn").addEventListener("click", () => {
        const selectedAddressInput = document.querySelector('input[name="shippingAddress"]:checked');
        const selectedPaymentInput = document.querySelector('input[name="paymentMethod"]:checked');

        if (!selectedAddressInput) return showToast("Please select a shipping address.", "danger");
        if (!selectedPaymentInput) return showToast("Please select a payment method.", "danger");
        if (itemsToCheckout.length === 0) return showToast("No items selected for order.", "danger");

        const shippingAddress = S.appData.profile.addresses[selectedAddressInput.value];
        const shippingFee = 0.0;
        const paymentMethod = selectedPaymentInput.value;
        const total = itemsToCheckout.reduce((sum, i) => sum + i.price * i.quantity, 0) + shippingFee;

        const newOrder = {
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString(),
            items: itemsToCheckout.map((it) => ({
                id: it.id,
                quantity: it.quantity,
                color: it.color,
                size: it.size,
                price: it.price,
            })),
            total,
            shippingFee,
            paymentMethod,
            shippingAddress,
            status: "Processing",
        };
        S.appData.orders = [newOrder, ...(S.appData.orders || [])];
        if (!isBuyNow) S.appData.cart = (S.appData.cart || []).filter((item) => !item.selected);

        saveUserData(S.currentUser, S.appData);

        // eslint-disable-next-line no-undef
        const successModal = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
        successModal.show();
        document.getElementById("orderSuccessModal").addEventListener(
            "hidden.bs.modal",
            () => {
                if (!window.location.hash.includes("orders-view")) navigateTo("#home-view");
            },
            { once: true }
        );
    });
}
