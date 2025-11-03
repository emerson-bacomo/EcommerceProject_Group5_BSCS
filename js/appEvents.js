import { navigateTo, handleInitialNavigation } from "./utils/navigation.js";
import { S } from "./state.js";
import { saveUserData, loadUserData, clearCurrentUser, getCurrentUser } from "./utils/storage.js";
import { html } from "./utils/helpers.js";
import { updateCartBadge } from "./pages/CartPage.js";
import { addSearchToHistory, setupSearchEventListeners } from "./pages/SearchPage.js";

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
    });

    document.getElementById("prompt-login-btn").addEventListener("click", () => {
        const modalEl = document.getElementById("promptLoginModal");
        // eslint-disable-next-line no-undef
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        navigateTo("login-view");
    });
    document.getElementById("prompt-signup-btn").addEventListener("click", () => {
        const modalEl = document.getElementById("promptLoginModal");
        // eslint-disable-next-line no-undef
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        navigateTo("signup-view");
    });
    document.getElementById("view-orders-btn").addEventListener("click", () => navigateTo("orders-view"));

    const searchContainer = document.getElementById("main-search-container");
    const searchInput = document.getElementById("search-input");
    const searchToggle = document.getElementById("nav-search-toggle");
    const searchDropdown = document.querySelector(".search-results-dropdown");

    document.getElementById("nav-search-toggle").addEventListener("click", (e) => {
        e.preventDefault();
        searchToggle.style.display = searchToggle.style.display === "none" ? "block" : "none";
        searchContainer.classList.toggle("active");
        if (searchContainer.classList.contains("active")) {
            searchInput.focus();
        }
    });

    setupSearchEventListeners(document);

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

    searchInput.addEventListener("blur", () => {
        if (!searchInput.value) {
            searchContainer.classList.remove("active");
            // listen once for the transition to finish before showing the toggle again
            searchContainer.addEventListener("transitionend", () => (searchToggle.style.display = "block"), { once: true });
        }
    });

    const menu = document.getElementById("mobileMenu");
    const openBtn = document.getElementById("mobile-menu-toggle");
    const closeBtn = document.getElementById("mobileMenuClose");

    openBtn.addEventListener("click", () => {
        menu.classList.add("show");
        document.body.classList.add("menu-open");
    });

    closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !openBtn.contains(e.target)) {
            closeMenu();
        }
    });

    document.getElementById("mobile-search-btn").addEventListener("click", () => {
        navigateTo("search-view");
    });
}

export function closeMenu() {
    document.getElementById("mobileMenu").classList.remove("show");
    document.body.classList.remove("menu-open");
}

export function updateNavUI() {
    const container = document.getElementById("nav-user-auth-links");
    const loggedInNavLinksHTML = html`
        <a href="#" class="nav-link position-relative ms-3" id="nav-cart-link" data-page="cart-view" title="Cart">
            <i class="fas fa-shopping-cart fa-lg"></i>
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
    updateMobileMenu();
}

function updateMobileMenu() {
    const menuContainer = document.getElementById("mobile-menu-links");
    if (!menuContainer) return;

    const commonItemClasses = "list-group-item list-group-item-action py-3 px-4 fs-6";

    if (S.currentUser) {
        menuContainer.innerHTML = html`
            <ul class="list-group list-group-flush">
                <li class="${commonItemClasses}" data-page="home-view"><i class="fas fa-home me-2"></i> Home</li>
                <li class="${commonItemClasses}" data-page="profile-view"><i class="fas fa-user me-2"></i> Profile</li>
                <li class="${commonItemClasses}" data-page="orders-view"><i class="fas fa-box me-2"></i> My Orders</li>
                <li class="${commonItemClasses}" data-page="address-management-view">
                    <i class="fas fa-map-marker-alt me-2"></i> My Addresses
                </li>
                <li class="${commonItemClasses} text-danger fw-semibold" id="logout-mobile">
                    <i class="fas fa-sign-out-alt me-2"></i> Logout
                </li>
            </ul>
        `;

        document.getElementById("logout-mobile").addEventListener("click", logout);
    } else {
        menuContainer.innerHTML = html`
            <ul class="list-group list-group-flush">
                <li class="${commonItemClasses}" data-page="login-view"><i class="fas fa-sign-in-alt me-2"></i> Login</li>
                <li class="${commonItemClasses}" data-page="signup-view"><i class="fas fa-user-plus me-2"></i> Sign Up</li>
            </ul>
        `;
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
