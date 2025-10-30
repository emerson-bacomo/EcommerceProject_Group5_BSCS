import { createProductCard } from "../components/ProductCard.js";
import { products } from "../config/products.js";
import { html } from "../utils/helpers.js";

export function renderSearchResultsPage(container, query) {
    const results = products.filter((p) => p.name.toLowerCase().includes((query || "").toLowerCase()));
    container.innerHTML = html`
        <h1 class="mb-4">Search Results for "<span class="text-primary">${query}</span>"</h1>
        <p class="text-muted">${results.length} product(s) found.</p>
        <div id="product-grid" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"></div>
    `;
    if (results.length > 0) {
        const productGrid = container.querySelector("#product-grid");
        results.forEach((product) => {
            productGrid.appendChild(createProductCard(product));
        });
    }
}
