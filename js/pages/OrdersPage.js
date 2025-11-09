import { formatCurrency, html, getProductById, getHashParams } from "../utils/helpers.js";
import { S } from "../state.js";
import { navigateTo } from "../utils/navigation.js";
import { statusColors } from "../config/general.js";

export function renderOrdersPage(container) {
    const defaultTab = getHashParams().tab ?? "processing";

    container.innerHTML = html`
        <style>
            #orders-tabs-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            #orders-tabs {
                display: flex;
                gap: 0.5rem;
                height: max-content;
                flex-wrap: nowrap;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                scroll-behavior: smooth;
            }

            #orders-tabs::-webkit-scrollbar {
                display: none;
            }

            #orders-tabs .nav-item {
                flex: 0 0 auto;
            }

            /* Fade indicators */
            #orders-tabs-wrapper::before,
            #orders-tabs-wrapper::after {
                content: "";
                position: absolute;
                top: 0;
                width: 30px;
                height: 100%;
                pointer-events: none; /* so clicks go through */
                z-index: 5;
                transition: opacity 0.3s;
                border-radius: 0.3rem;
            }

            #orders-tabs-wrapper::before {
                left: 0;
                background: linear-gradient(to right, rgba(0, 102, 255, 0.1), transparent);
                opacity: 0;
            }
            #orders-tabs-wrapper::after {
                right: 0;
                background: linear-gradient(to left, rgba(0, 102, 255, 0.1), transparent);
                opacity: 0;
            }
            #orders-tabs-wrapper.has-left::before {
                opacity: 1;
            }
            #orders-tabs-wrapper.has-right::after {
                opacity: 1;
            }
        </style>

        <h1 class="mb-4">My Orders</h1>

        <div id="orders-tabs-wrapper">
            <ul class="nav nav-pills" id="orders-tabs" role="tablist">
                ${["Processing", "To Ship", "Shipping", "Received", "Cancelled"]
                    .map(
                        (status) => html`
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link ${status.replace(" ", "-").toLowerCase() === defaultTab ? "active" : ""}"
                                    data-bs-toggle="tab"
                                    data-bs-target="#${status.replace(" ", "-").toLowerCase()}"
                                    type="button"
                                >
                                    ${status}
                                </button>
                            </li>
                        `
                    )
                    .join("")}
            </ul>
        </div>

        <div class="tab-content mt-3" id="orders-tabs-content">
            ${["processing", "to-ship", "shipping", "received", "cancelled"]
                .map(
                    (id) => html`
                        <div class="tab-pane fade ${defaultTab === id ? "active show" : ""}" id="${id}" role="tabpanel"></div>
                    `
                )
                .join("")}
        </div>
    `;

    ["Processing", "To Ship", "Shipping", "Received", "Cancelled"].forEach((status) => renderOrdersByStatus(status, container));

    const tabs = container.querySelector("#orders-tabs");
    const tabsWrapper = container.querySelector("#orders-tabs-wrapper");
    function updateTabFades() {
        const scrollLeft = tabs.scrollLeft;
        const maxScroll = tabs.scrollWidth - tabs.clientWidth;

        tabsWrapper.classList.toggle("has-left", scrollLeft > 0);
        tabsWrapper.classList.toggle("has-right", scrollLeft < maxScroll - 1);
    }

    tabs.addEventListener("scroll", updateTabFades);

    const resizeObserver = new ResizeObserver(updateTabFades);
    resizeObserver.observe(tabsWrapper);

    updateTabFades();

    // Tab click behavior
    container.querySelectorAll("#orders-tabs .nav-link").forEach((tab) => {
        tab.addEventListener("click", (e) => {
            const currentTab = e.target.dataset.bsTarget.replace("#", "");
            // scroll tab to center
            const rect = e.target.getBoundingClientRect();
            const containerRect = tabs.getBoundingClientRect();
            const offset = rect.left - containerRect.left - containerRect.width / 2 + rect.width / 2;
            tabs.scrollBy({ left: offset, behavior: "smooth" });

            // update URL without re-render
            navigateTo(`#orders-view?tab=${currentTab}`, { replace: true });
            updateTabFades();
        });
    });

    // Open default tab based on hash
    if (defaultTab !== "processing") {
        const defaultTabEl = container.querySelector(`#orders-tabs .nav-link[data-bs-target="#${defaultTab}"]`);
        console.log(defaultTabEl);
        if (defaultTabEl) defaultTabEl.click();
    }

    // Click order cards
    document.querySelectorAll(".order-list-card").forEach((card) => {
        card.addEventListener("click", () => navigateTo(`#order-detail-view?id=${encodeURIComponent(card.dataset.orderId)}`));
    });

    return () => {
        console.log("cleaned");
        resizeObserver.disconnect();
    };
}

function renderOrdersByStatus(status, container) {
    const targetId = `#${status.replace(" ", "-").toLowerCase()}`;
    const filteredOrders = S.appData.orders.filter((o) => o.status === status);
    const targetEl = container.querySelector(targetId);
    if (!targetEl) return;
    if (filteredOrders.length === 0) {
        targetEl.innerHTML = html`<div class="card card-body text-center text-muted">No orders in this category.</div>`;
        return;
    }

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
