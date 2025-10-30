import { navigateTo, handleInitialNavigation } from "./utils/navigation.js";
import { S } from "./state.js";
import { saveUserData, loadUserData, clearCurrentUser, getCurrentUser } from "./utils/storage.js";
import { html } from "./utils/helpers.js";
import { updateCartBadge } from "./pages/CartPage.js";

export function setupAppListeners() {
    document.body.addEventListener("click", (e) => {
        const pageLink = e.target.closest("[data-page]");
        if (pageLink) {
            e.preventDefault();
            const pageKey = pageLink.dataset.page;
            if (S.protectedViews.includes(pageKey) && !S.currentUser) {
                navigateTo("login-view");
                return;
            }
            if (pageKey !== "checkout-view" || !e.target.closest("#place-order-btn")) S.buyNowItem = null;
            navigateTo(pageKey);
        }

        const productCard = e.target.closest("product-card");
        if (productCard) {
            const productId = productCard.dataset.productId;
            localStorage.removeItem(`product_detail_${productId}`);
            S.buyNowItem = null;
            navigateTo("product-detail-view", productId);
        }

        if (e.target.classList.contains("password-toggle")) togglePasswordVisibility(e);
    });

    document.getElementById("app-content").addEventListener("input", (e) => {
        if (e.target.classList.contains("form-control") && e.target.closest("quantity-picker") === null) handleInputChange(e);
    });

    document.getElementById("prompt-login-btn").addEventListener("click", () => {
        // eslint-disable-next-line no-undef
        new bootstrap.Modal(document.getElementById("promptLoginModal")).hide();
        navigateTo("login-view");
    });
    document.getElementById("prompt-signup-btn").addEventListener("click", () => {
        // eslint-disable-next-line no-undef
        new bootstrap.Modal(document.getElementById("promptLoginModal")).hide();
        navigateTo("signup-view");
    });
    document.getElementById("view-orders-btn").addEventListener("click", () => navigateTo("orders-view"));

    const searchContainer = document.getElementById("main-search-container");
    const searchInput = document.getElementById("search-input");
    const searchToggle = document.getElementById("nav-search-toggle");

    document.getElementById("nav-search-toggle").addEventListener("click", (e) => {
        e.preventDefault();
        searchToggle.style.display = searchToggle.style.display === "none" ? "block" : "none";
        searchContainer.classList.toggle("active");
        if (searchContainer.classList.contains("active")) {
            searchInput.focus();
        }
    });

    const searchDropdown = document.getElementById("search-results-dropdown");
    searchInput.addEventListener("focus", showSearchHistory);
    searchInput.addEventListener("input", () => showAutocomplete(searchInput.value));
    searchInput.addEventListener("blur", () => {
        if (!searchInput.value) {
            searchContainer.classList.remove("active");
            // listen once for the transition to finish before showing the toggle again
            searchContainer.addEventListener("transitionend", () => (searchToggle.style.display = "block"), { once: true });
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) searchDropdown.classList.remove("show");
        const historyItem = e.target.closest(".history-item");
        if (historyItem) {
            e.preventDefault();
            const term = historyItem.dataset.term;
            searchInput.value = term;
            addSearchToHistory(term);
            S.buyNowItem = null;
            navigateTo("search-results-view", term);
            searchDropdown.classList.remove("show");
        }
        const autocompleteItem = e.target.closest(".autocomplete-item");
        if (autocompleteItem) {
            e.preventDefault();
            addSearchToHistory(autocompleteItem.querySelector("span").textContent);
            S.buyNowItem = null;
            navigateTo("product-detail-view", autocompleteItem.dataset.productId);
            searchDropdown.classList.remove("show");
        }
    });
    document.getElementById("search-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            addSearchToHistory(query);
            S.buyNowItem = null;
            navigateTo("search-results-view", query);
            searchDropdown.classList.remove("show");
            searchInput.blur();
        }
    });
}

export function updateNavUI() {
    const container = document.getElementById("nav-user-auth-links");
    const loggedInNavLinksHTML = html`
        <a href="#" class="nav-link position-relative ms-3" id="nav-cart-link" data-page="cart-view" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span
                id="cart-badge"
                class="position-absolute start-0 translate-middle badge rounded-pill bg-primary"
                style="font-size: 0.6em; display: none; "
            >
                0
            </span>
        </a>

        <div class="vr mx-2"></div>
        <div class="dropdown">
            <a
                href="#"
                class="nav-link dropdown-toggle"
                id="profile-dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Profile"
            >
                <i class="fas fa-user fa-lg" id="nav-profile-icon"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profile-dropdown">
                <li><a class="dropdown-item" href="#" data-page="profile-view">Profile</a></li>
                <li><a class="dropdown-item" href="#" data-page="orders-view">My Orders</a></li>
                <li><a class="dropdown-item" href="#" data-page="address-management-view">My Addresses</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" id="logout-button">Logout</a></li>
            </ul>
        </div>
    `;
    const loggedOutNavLinksHTML = html`
        <div class="vr mx-2"></div>
        <a href="#" class="btn btn-outline-primary me-2 btn-sm" data-page="login-view">Login</a
        ><a href="#" class="btn btn-primary btn-sm" data-page="signup-view">Sign Up</a>
    `;
    if (S.currentUser) {
        container.innerHTML = loggedInNavLinksHTML;
        const navIcon = document.getElementById("nav-profile-icon");
        if (navIcon) navIcon.className = `fas ${S.appData.profile.pfpIcon || "fa-user"} fa-lg`;
        updateCartBadge();
        const logoutBtn = document.getElementById("logout-button");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }
    } else {
        container.innerHTML = loggedOutNavLinksHTML;
    }
}

export function initApp(user) {
    S.currentUser = user;
    S.appData = loadUserData(S.currentUser) || { profile: {}, cart: [], orders: [], searchHistory: [] };
    if (!S.appData.profile.pfpIcon) S.appData.profile.pfpIcon = "fa-user";
    saveUserData(S.currentUser, S.appData);
    updateNavUI();
}

export function checkLoginStatus() {
    const loggedInUser = getCurrentUser();

    if (loggedInUser) {
        initApp(loggedInUser);
    } else {
        S.currentUser = null;
        S.appData = { profile: {}, cart: [], orders: [], searchHistory: [] };
        updateNavUI();
    }
    handleInitialNavigation();
}

function logout() {
    clearCurrentUser();
    S.currentUser = null;
    S.buyNowItem = null;
    S.appData = { profile: {}, cart: [], orders: [], searchHistory: [] };
    updateNavUI();
    navigateTo("login-view", null, { skipReturnTo: true });
}

function showSearchHistory() {
    const searchDropdown = document.getElementById("search-results-dropdown");
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
function showAutocomplete(query) {
    const { products } = S;
    const searchDropdown = document.getElementById("search-results-dropdown");
    if (!query) {
        showSearchHistory();
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
function addSearchToHistory(term) {
    if (!term || !S.currentUser) return;
    S.appData.searchHistory = (S.appData.searchHistory || []).filter((t) => t.toLowerCase() !== term.toLowerCase());
    S.appData.searchHistory.unshift(term);
    S.appData.searchHistory = S.appData.searchHistory.slice(0, 5);
    saveUserData(S.currentUser, S.appData);
}

function togglePasswordVisibility(e) {
    const icon = e.target;
    const input = icon.previousElementSibling;
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
}
function handleInputChange(e) {
    if (e.target.classList.contains("is-invalid")) e.target.classList.remove("is-invalid");
}
