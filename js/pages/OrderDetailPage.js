import { showConfirmationModal, showToast } from "../components/Toast.js";
import { S } from "../state.js";
import { formatCurrency, getProductById, html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { saveUserData } from "../utils/storage.js";

export function renderOrderDetailPage(container, orderId) {
    const order = (S.appData.orders || []).find((o) => o.id === orderId);
    if (!order) {
        container.innerHTML = html`
            <p class="text-center">Order not found.</p>
            <a href="#" data-page="orders-view">&larr; Back to My Orders</a>
        `;
        return;
    }

    const itemsHTML = order.items
        .map((item) => {
            const product = getProductById(item.id);
            const productName = product ? product.name : "Product Removed";
            const variationImage = product?.variations?.color?.[item.color]?.image;
            const baseImage = product?.images?.[0];
            const displayImage = variationImage || baseImage || "https://placehold.co/80x80/E2E8F0/4A5568?text=N/A";
            const variationText = `${item.color && item.color !== "Default" ? item.color : ""}${
                item.color && item.color !== "Default" && item.size && item.size !== "Standard" ? " / " : ""
            }${item.size && item.size !== "Standard" ? item.size : ""}`;

            return html`
                <li class="list-group-item d-flex gap-3 justify-content-between align-items-start py-3">
                    <img
                        src="${displayImage}"
                        class="order-item-img"
                        width="80"
                        height="80"
                        onerror="this.onerror=null;this.src='https://placehold.co/80x80/E2E8F0/4A5568?text=N/A';"
                    />
                    <div class="d-flex flex-column gap-1 align-items-start">
                        <strong class="text-ellipsis-2">${productName}</strong>
                        ${variationText ? `<small class="text-muted">${variationText}</small>` : ""}
                        <small class="text-muted">${formatCurrency(item.price)} x ${item.quantity}</small>
                    </div>
                    <strong>${formatCurrency(item.price * item.quantity)}</strong>
                </li>
            `;
        })
        .join("");

    const itemTotal = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    container.innerHTML = html`
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Order Details</h1>
            <a href="#" data-page="orders-view" class="btn btn-outline-secondary">&larr; Back to My Orders</a>
        </div>
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between">
                        <span><strong>Order ID:</strong> ${order.id}</span
                        ><span><strong>Placed on:</strong> ${new Date(order.date).toLocaleString()}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">
                            Order Status: <span class="text-primary text-capitalize">${order.status}</span>
                        </h5>
                    </div>
                </div>
                <div class="card mb-4">
                    <div class="card-header"><h5>Items Ordered</h5></div>
                    <ul class="list-group list-group-flush">
                        ${itemsHTML}
                    </ul>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card mb-4">
                    <div class="card-header"><h5>Shipping Address</h5></div>
                    <div class="card-body">
                        <strong>${order.shippingAddress.name}</strong><br />${order.shippingAddress.address}<br />Phone:
                        ${order.shippingAddress.phone}
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><h5>Order Summary</h5></div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Item(s) Total:</span><strong>${formatCurrency(itemTotal)}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Shipping Fee:</span><strong>${formatCurrency(order.shippingFee)}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Payment Method:</span><strong>${order.paymentMethod}</strong>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between h5">
                            <span>Total:</span><strong>${formatCurrency(order.total)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row"><div class="col-12 mt-4" id="order-actions-container"></div></div>
    `;
    if (order.status === "Processing") {
        const actionsContainer = container.querySelector("#order-actions-container");
        actionsContainer.innerHTML = html`
            <div class="card">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <span>Want to change something?</span
                    ><button class="btn btn-outline-danger" id="cancel-order-btn">Cancel Order</button>
                </div>
            </div>
        `;

        actionsContainer.querySelector("#cancel-order-btn").addEventListener("click", async () => {
            const confirmed = await showConfirmationModal(
                "Are you sure you want to cancel this order?",
                "Cancel Order",
                "Yes, Cancel",
                "btn-danger"
            );
            if (confirmed) {
                if (order.status === "Processing") {
                    order.status = "Cancelled";
                    saveUserData(S.currentUser, S.appData);
                    navigateTo("cancellation-success-view", orderId);
                } else showToast("This order can no longer be cancelled.", "danger");
            }
        });
    }
}
