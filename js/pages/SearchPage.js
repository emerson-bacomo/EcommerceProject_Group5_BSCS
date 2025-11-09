import { navbar } from "../main.js";
import { back, getProductById, html } from "../utils/helpers.js";
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

    document.getElementById("back-btn").addEventListener("click", back);

    setupSearchEventListeners(container);
    showSearchHistory(container.querySelector("#search-results-dropdown"));

    return () => (navbar.style.display = "block");
}

export function setupSearchEventListeners(container) {
    const searchInput = container.querySelector("#search-input");
    searchInput.focus();
    const searchForm = container.querySelector("#search-form");
    const searchDropdown = container.querySelector("#search-results-dropdown");

    searchInput.addEventListener("input", () => {
        showAutocomplete(searchInput.value, searchDropdown);
    });

    searchInput._focusEventListener = searchInput.addEventListener("focus", () => {
        showSearchHistory(searchDropdown);
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            addSearchToHistory(query);
            searchInput.value = query;
            navigateTo(`#search-results-view?q=${encodeURIComponent(query)}`);
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
    if (results.length === 0) {
        searchDropdown.innerHTML = html`<div class="p-3 text-muted text-center">No products found.</div>`;
    } else
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

export function showSearchHistory(searchDropdown) {
    let history = [];

    if (S.currentUser) {
        history = S.appData.searchHistory || [];
    } else {
        history = JSON.parse(localStorage.getItem("guestSearchHistory") || "[]");
    }

    if (history.length === 0) {
        searchDropdown.innerHTML = html`<div class="p-3 text-muted text-center">No recent searches.</div>`;
    } else {
        searchDropdown.innerHTML = history
            .map((entry) => {
                let imgHTML = "";
                if (entry.productId) {
                    const product = getProductById(entry.productId);
                    if (product && product.images && product.images.length) {
                        imgHTML = html`
                            <img
                                src="${product.images[0]}"
                                alt="${product.name}"
                                class="history-item-img me-2 img-thumbnail img-thumbnail-sm"
                            />
                        `;
                    }
                }
                return html`
                    <a href="#" class="history-item" data-term="${entry.term}" data-product-id="${entry.productId || ""}">
                        <i class="fas fa-history me-2 text-muted"></i> ${imgHTML} ${entry.term}
                    </a>
                `;
            })
            .join("");
    }
}

export function addSearchToHistory(entry) {
    if (!entry) return;

    // Normalize entry (can be string or object)
    const newEntry =
        typeof entry === "string" ? { term: entry, productId: null } : { term: entry.term, productId: entry.productId || null };

    let history;

    if (S.currentUser) {
        history = S.appData.searchHistory || []; // Per-user history
    } else {
        history = JSON.parse(localStorage.getItem("guestSearchHistory") || "[]"); // Global guest history
    }

    history = history.filter((t) => t.term.toLowerCase() !== newEntry.term.toLowerCase()); // Remove duplicate (by term or productId)
    history.unshift(newEntry); // Add to top
    history = history.slice(0, 5);

    if (S.currentUser) {
        S.appData.searchHistory = history;
        saveUserData(S.currentUser, S.appData);
    } else {
        localStorage.setItem("guestSearchHistory", JSON.stringify(history));
    }
}

export function mergeGuestSearchHistory() {
    const guestHistory = JSON.parse(localStorage.getItem("guestSearchHistory") || "[]");

    if (guestHistory.length > 0) {
        const userHistory = S.appData.searchHistory || [];
        const merged = [
            ...guestHistory,
            ...userHistory.filter((uh) => !guestHistory.some((gh) => gh.term.toLowerCase() === uh.term.toLowerCase())),
        ].slice(0, 5);

        S.appData.searchHistory = merged;
        saveUserData(S.currentUser, S.appData);

        localStorage.removeItem("guestSearchHistory");
    }
}
