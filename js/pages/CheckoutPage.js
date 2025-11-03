import { showToast } from "../components/Toast.js";
import { mobileMaxWidthPlus1 } from "../config/general.js";
import { S } from "../state.js";
import { getProductById, formatCurrency, html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { saveUserData } from "../utils/storage.js";

export function renderCheckoutPage(container, buyNowItemData = null) {
    let itemsToCheckout;
    let isBuyNow = false;
    if (buyNowItemData) {
        const product = getProductById(buyNowItemData.id);
        if (!product) {
            container.innerHTML = html` <div class="alert alert-danger">Error: Product not found for Buy Now.</div> `;
            S.buyNowItem = null;
            return;
        }
        itemsToCheckout = [{ ...buyNowItemData, product }];
        isBuyNow = true;
        S.buyNowItem = buyNowItemData;
    } else {
        itemsToCheckout = S.appData.cart
            .filter((item) => item.selected)
            .map((item) => ({ ...item, product: getProductById(item.id) }));
        S.buyNowItem = null;
    }
    if (itemsToCheckout.length === 0) {
        container.innerHTML = html`
            <div class="alert alert-warning">
                No items to checkout.
                <a href="#" data-page="${isBuyNow ? "home-view" : "cart-view"}" class="alert-link"
                    >Back to ${isBuyNow ? "Shop" : "Cart"}</a
                >.
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
                <div class="card card-body mb-2 position-relative">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="shippingAddress"
                            id="address${index}"
                            value="${index}"
                            ${index === 0 ? "checked" : ""}
                        />
                        <label class="form-check-label w-100" for="address${index}">
                            <strong>${addr.name}</strong><br />
                            ${addr.address}<br />
                            ${addr.phone}
                        </label>
                    </div>
                </div>
            `
        )
        .join("");

    container.innerHTML = html`
        <style>
            @media (min-width: ${mobileMaxWidthPlus1}px) {
                .cart-item-list {
                    max-height: 40vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            }
        </style>

        <h1 class="mb-4">Checkout</h1>
        <div class="row g-5">
            <div class="col-md-7">
                <div class="d-flex justify-content-between align-items-center">
                    <h4>Shipping Address</h4>
                    <a href="#" data-page="address-management-view">Edit</a>
                </div>
                <hr />
                ${(S.appData.profile.addresses || []).length > 0
                    ? addressOptions
                    : html`
                          <div class="alert alert-warning">
                              You have no saved addresses. Please
                              <a href="#" data-page="address-management-view" class="alert-link">add one</a>.
                          </div>
                      `}

                <h4 class="mt-4">Payment Method</h4>
                <hr />
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
                                        <li class="list-group-item d-flex justify-content-between">
                                            <div class="d-flex gap-3">
                                                <img
                                                    src="${displayImg}"
                                                    alt="${item.product.name}"
                                                    style="cursor: pointer; width: 80px; height: 80px;"
                                                    onerror="this.onerror=null;this.src='${item.product.images[0]}';"
                                                />
                                                <div>
                                                    ${item.product.name} (x${item.quantity})
                                                    ${variationText
                                                        ? `<br><small class="text-muted">${variationText}</small>`
                                                        : ""}
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
        let itemsToOrder;
        let isBuyNowOrder = false;
        if (S.buyNowItem && S.buyNowItem.id && S.buyNowItem.quantity) {
            itemsToOrder = [S.buyNowItem];
            isBuyNowOrder = true;
        } else {
            itemsToOrder = (S.appData.cart || []).filter((item) => item.selected);
        }
        const selectedAddressInput = document.querySelector('input[name="shippingAddress"]:checked');
        const selectedPaymentInput = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selectedAddressInput) {
            showToast("Please select a shipping address.", "danger");
            return;
        }
        if (!selectedPaymentInput) {
            showToast("Please select a payment method.", "danger");
            return;
        }
        if (itemsToOrder.length === 0) {
            showToast("No items selected for order.", "danger");
            return;
        }
        const shippingAddress = S.appData.profile.addresses[selectedAddressInput.value];
        const shippingFee = 0.0;
        const paymentMethod = selectedPaymentInput.value;
        const total = itemsToOrder.reduce((sum, i) => sum + i.price * i.quantity, 0) + shippingFee;
        const newOrder = {
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString(),
            items: itemsToOrder.map((it) => ({
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
        if (!isBuyNowOrder) S.appData.cart = (S.appData.cart || []).filter((item) => !item.selected);
        S.buyNowItem = null;
        saveUserData(S.currentUser, S.appData);

        // eslint-disable-next-line no-undef
        const successModal = new bootstrap.Modal(document.getElementById("orderSuccessModal"));
        successModal.show();
        document.getElementById("orderSuccessModal").addEventListener(
            "hidden.bs.modal",
            () => {
                if (!window.location.hash.includes("orders-view")) navigateTo("home-view");
            },
            { once: true }
        );
    });
}
