import { getStarRatingHTML, getPriceRange, html } from "../utils/helpers.js";

export function createProductCard(product) {
    const el = document.createElement("product-card");
    el.product = product;
    return el;
}

class ProductCard extends HTMLElement {
    set product(data) {
        const priceDisplay = getPriceRange(data);
        this.dataset.productId = data.id;
        this.innerHTML = html`
            <style>
                .product-card {
                    border: 1px solid #e9ecef;
                    border-radius: var(--bs-border-radius-lg);
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    background-color: #fff;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
                }
                .product-card .card-img-top {
                    aspect-ratio: 1 / 1;
                    object-fit: cover;
                }
                .product-card .card-title {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #212529;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            </style>
            <div class="col h-100">
                <div class="card product-card h-100">
                    <img
                        src="${data.images[0]}"
                        class="card-img-top"
                        alt="${data.name}"
                        onerror="this.onerror=null;this.src='https://placehold.co/600x600/E2E8F0/4A5568?text=Image';"
                    />
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${data.name}</h5>
                        <div class="star-rating mb-2">
                            ${getStarRatingHTML(data.rating)}<small class="text-muted ms-1">${data.rating}</small>
                        </div>
                        <div class="mt-auto"><p class="price mb-0 h5 fw-bold">${priceDisplay}</p></div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define("product-card", ProductCard);
