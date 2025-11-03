import { navbar } from "../main.js";
import { html } from "../utils/helpers.js";
import { navigateTo } from "../utils/navigation.js";
import { S } from "../state.js";
import { saveUserData } from "../utils/storage.js";

export function renderSearchPage(container) {
    navbar.style.display = "none";

    container.innerHTML = html`
        <div class="mobile-search-page d-flex flex-column h-100">
            <div class="d-flex align-items-center gap-3 px-2 mb-2">
                <button class="btn text-dark p-0 border-0 bg-transparent" id="back-btn">
                    <i class="fas fa-arrow-left fs-5"></i>
                </button>

                <form id="search-form" class="flex-grow-1">
                    <div class="input-group">
                        <input
                            type="search"
                            class="form-control"
                            id="search-input"
                            placeholder="Search for products..."
                            aria-label="Search"
                            autocomplete="off"
                        />
                        <button class="btn btn-outline-secondary" type="submit">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </form>
            </div>

            <div id="search-results-dropdown"></div>
        </div>
    `;

    document.getElementById("back-btn").addEventListener("click", () => navigateTo("home-view"));
    setupSearchEventListeners(container);
    showSearchHistory(container.querySelector("#search-results-dropdown"));

    return () => (navbar.style.display = "block");
}

export function setupSearchEventListeners(container) {
    const searchInput = container.querySelector("#search-input");
    const searchForm = container.querySelector("#search-form");
    const searchDropdown = container.querySelector("#search-results-dropdown");

    searchInput.addEventListener("input", () => {
        showAutocomplete(searchInput.value, searchDropdown);
    });

    searchInput.addEventListener("focus", () => {
        showSearchHistory(searchDropdown);
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            addSearchToHistory(query);
            S.buyNowItem = null;
            navigateTo("search-results-view", query);
            searchDropdown?.classList.remove("show");
        }
    });
}

function showAutocomplete(query, searchDropdown) {
    const { products } = S;
    if (!query) {
        showSearchHistory(searchDropdown);
        return;
    }
    const results = (products || []).filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    if (results.length === 0) searchDropdown.innerHTML = `<div class="p-3 text-muted text-center">No products found.</div>`;
    else
        searchDropdown.innerHTML = results
            .map(
                (p) =>
                    html`
                        <a href="#" class="autocomplete-item" data-product-id="${p.id}"
                            ><img src="${p.images[0]}" alt="${p.name}" /> <span>${p.name}</span></a
                        >
                    `
            )
            .join("");
    searchDropdown.classList.add("show");
}

export function addSearchToHistory(term) {
    if (!term || !S.currentUser) return;
    S.appData.searchHistory = (S.appData.searchHistory || []).filter((t) => t.toLowerCase() !== term.toLowerCase());
    S.appData.searchHistory.unshift(term);
    S.appData.searchHistory = S.appData.searchHistory.slice(0, 5);
    saveUserData(S.currentUser, S.appData);
}

function showSearchHistory(searchDropdown) {
    if (!S.currentUser || (S.appData.searchHistory || []).length === 0)
        searchDropdown.innerHTML = `<div class="p-3 text-muted text-center">No recent searches.</div>`;
    else
        searchDropdown.innerHTML = (S.appData.searchHistory || [])
            .map(
                (term) =>
                    `<a href="#" class="history-item" data-term="${term}"><i class="fas fa-history me-3 text-muted"></i> ${term}</a>`
            )
            .join("");
    searchDropdown.classList.add("show");
}
