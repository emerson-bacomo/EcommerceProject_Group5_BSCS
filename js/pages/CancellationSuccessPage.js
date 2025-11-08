import { showToast } from "../components/Toast.js";
import { S } from "../state.js";
import { getHashParams, getProductById, html } from "../utils/helpers.js";
import { formatCurrency } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { saveUserData } from "../utils/storage.js";

export function renderCancellationSuccessPage(container) {
    const orderId = getHashParams().id;

    const order = S.appData.orders.find((o) => o.id === orderId);
    if (!order) {
        container.innerHTML = html`
            <p class="text-center">Order not found.</p>
            <a href="#" data-page="orders-view"><i class="fa-solid fa-arrow-left me-2"></i>Back to My Orders</a>
        `;
        return;
    }

    const itemsHTML = order.items
        .map((item) => {
            const product = getProductById(item.id);
            const productName = product ? product.name : "Product Removed";
            const variationText = `${item.color && item.color !== "Default" ? item.color : ""}${
                item.color && item.color !== "Default" && item.size && item.size !== "Standard" ? " / " : ""
            }${item.size && item.size !== "Standard" ? item.size : ""}`;

            return html`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${productName}</strong> (x${item.quantity})
                        ${variationText ? `<br><small class="text-muted">${variationText}</small>` : ""}
                    </div>
                    <strong>${formatCurrency(item.price * item.quantity)}</strong>
                </li>
            `;
        })
        .join("");

    container.innerHTML = html`
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <i class="fas fa-check-circle text-success fa-4x mb-4"></i>
                <h2 class="mb-3">Order Cancelled Successfully</h2>
                <p class="text-muted">
                    Your order <strong>#${order.id}</strong> has been cancelled. The items from this order are listed below.
                </p>

                <div class="card my-4 text-start">
                    <div class="card-header"><strong>Cancelled Items</strong></div>
                    <ul class="list-group list-group-flush">
                        ${itemsHTML}
                    </ul>
                </div>

                <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-secondary" id="undo-cancellation-btn" data-order-id="${order.id}">
                        Undo Cancellation
                    </button>
                    <button class="btn btn-primary" id="re-add-to-cart-btn" data-order-id="${order.id}">
                        Re-add Items to Cart
                    </button>
                </div>
                <div class="mt-4">
                    <a href="#" data-page="orders-view"><i class="fa-solid fa-arrow-left me-2"></i>Back to My Orders</a>
                </div>
            </div>
        </div>
    `;

    container.querySelector("#undo-cancellation-btn").addEventListener("click", () => {
        if (order.status === "Cancelled") {
            order.status = "Processing";
            saveUserData(S.currentUser, S.appData);
            showToast("Order cancellation has been undone.", "success");
            navigateTo(`#order-detail-view?id=${encodeURIComponent(orderId)}`);
        }
    });

    container.querySelector("#re-add-to-cart-btn").addEventListener("click", () => {
        order.items.forEach((item) => {
            S.appData.cart.push({
                cartId: Date.now(),
                id: item.id,
                quantity: item.quantity,
                selected: true,
                color: item.color,
                size: item.size,
                price: item.price,
            });
        });
        saveUserData(S.currentUser, S.appData);
        showToast(`${order.items.length} item(s) have been added back to your cart.`, "success");
        navigateTo("#cart-view");
    });
}
