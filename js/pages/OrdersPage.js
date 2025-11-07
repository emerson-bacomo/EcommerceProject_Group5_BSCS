import { formatCurrency, html, getProductById } from "../utils/helpers.js";
import { S } from "../state.js";
import { navigateTo } from "../utils/navigation.js";

export function renderOrdersPage(container) {
    container.innerHTML = html`
        <h1 class="mb-4">My Orders</h1>
        <ul class="nav nav-pills mb-3" id="orders-tabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#processing" type="button">
                    Processing
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#to-ship" type="button">To Ship</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#shipping" type="button">Shipping</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#received" type="button">Received</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#cancelled" type="button">Cancelled</button>
            </li>
        </ul>
        <div class="tab-content" id="orders-tabs-content">
            <div class="tab-pane fade show active" id="processing" role="tabpanel"></div>
            <div class="tab-pane fade" id="to-ship" role="tabpanel"></div>
            <div class="tab-pane fade" id="shipping" role="tabpanel"></div>
            <div class="tab-pane fade" id="received" role="tabpanel"></div>
            <div class="tab-pane fade" id="cancelled" role="tabpanel"></div>
        </div>
    `;
    ["processing", "to ship", "shipping", "received", "cancelled"].forEach((status) => renderOrdersByStatus(status, container));

    document.querySelectorAll(".order-list-card").forEach((card) => {
        card.addEventListener("click", () => navigateTo("order-detail-view", card.dataset.orderId));
    });
}

function renderOrdersByStatus(status, container) {
    const targetId = `#${status.replace(" ", "-")}`;
    const filteredOrders = S.appData.orders.filter((o) => o.status.toLowerCase() === status);
    const targetEl = container.querySelector(targetId);
    if (!targetEl) return;
    if (filteredOrders.length === 0) {
        targetEl.innerHTML = `<div class="card card-body text-center text-muted">No orders in this category.</div>`;
        return;
    }

    const statusColors = {
        processing: "text-primary",
        "to ship": "text-info",
        shipping: "text-warning",
        received: "text-success",
        cancelled: "text-danger",
    };
    const statusColorClass = statusColors[status] || "text-muted";

    targetEl.innerHTML = filteredOrders
        .map((order) => {
            const firstItem = order.items[0];
            const product = getProductById(firstItem.id);
            const productName = product ? product.name : "Product Removed";
            const variationImage = product?.variations?.color?.[firstItem.color]?.image;
            const baseImage = product?.images?.[0];
            const displayImage = variationImage || baseImage || "https://placehold.co/80x80/E2E8F0/4A5568?text=N/A";

            return html`
                <div class="card mb-3 order-list-card" data-order-id="${order.id}" style="cursor: pointer;">
                    <div class="card-header d-flex justify-content-between">
                        <span><strong>Order ID:</strong> ${order.id}</span>
                        <span class="text-capitalize fw-bold ${statusColorClass}">${order.status}</span>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <img
                                src="${displayImage}"
                                class="img-thumbnail me-3"
                                onerror="this.onerror=null;this.src='https://placehold.co/80x80/E2E8F0/4A5568?text=N/A';"
                            />
                            <div>
                                <span class="text-ellipsis"> ${productName} </span>
                                ${order.items.length > 1
                                    ? `<br><small class="text-muted">+ ${order.items.length - 1} other item(s)</small>`
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <span>${new Date(order.date).toLocaleDateString()}</span>
                        <strong>Total: ${formatCurrency(order.total)}</strong>
                    </div>
                </div>
            `;
        })
        .join("");
}
