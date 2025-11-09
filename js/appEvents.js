import { navigateTo, handleInitialNavigation } from "./utils/navigation.js";
import { S } from "./state.js";
import { saveUserData, loadUserData, clearCurrentUser, getCurrentUser } from "./utils/storage.js";
import { html } from "./utils/helpers.js";
import { updateCartBadge } from "./pages/CartPage.js";
import { addSearchToHistory, setupSearchEventListeners, showSearchHistory } from "./pages/SearchPage.js";

export function setupAppListeners() {
    document.body.addEventListener("click", (e) => {
        const pageLink = e.target.closest("[data-page]");
        if (pageLink) {
            e.preventDefault();
            const pageKey = pageLink.dataset.page;
            if (S.protectedViews.includes(pageKey) && !S.currentUser) {
                navigateTo("#login-view");
                return;
            }
            let hash = `#${pageKey}`;
            const pageParams = pageLink.dataset.pageParams;
            if (pageParams) hash += `?${pageParams}`;
            navigateTo(hash);
        }

        const productCard = e.target.closest("product-card");
        if (productCard) {
            const productId = productCard.dataset.productId;
            navigateTo(`#product-detail-view?id=${encodeURIComponent(productId)}`);
        }
    });

    document.getElementById("prompt-login-btn").addEventListener("click", () => {
        const modalEl = document.getElementById("promptLoginModal");
        // eslint-disable-next-line no-undef
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        navigateTo("#login-view");
    });
    document.getElementById("prompt-signup-btn").addEventListener("click", () => {
        const modalEl = document.getElementById("promptLoginModal");
        // eslint-disable-next-line no-undef
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        navigateTo("#signup-view");
    });
    document.getElementById("view-orders-btn").addEventListener("click", () => navigateTo("#orders-view"));

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

    searchInput.removeEventListener("focus", searchInput._focusEventListener);
    let hasHandledBlur = true;

    const showDropdownWithTransition = () => {
        showSearchHistory(searchDropdown); // populate dropdown
        setTimeout(() => searchDropdown.classList.add("show"), 200); // Delay adding "show" to trigger the transition smoothly
    };

    searchInput.addEventListener("focus", () => {
        if (!hasHandledBlur) return;
        hasHandledBlur = false;

        const unshown = searchDropdown.classList.contains("unshow");
        searchDropdown.classList.remove("show", "unshow");

        if (unshown) {
            showDropdownWithTransition();
        } else {
            searchContainer.addEventListener("transitionend", showDropdownWithTransition(), { once: true });
        }
    });

    const handleSearchInputBlur = () => {
        if (!document.hasFocus()) return;

        const alreadyHidden = searchDropdown.classList.contains("unshow");
        searchDropdown.classList.add("unshow"); // hide dropdown first
        hasHandledBlur = true;

        if (!searchInput.value) {
            setTimeout(
                () => {
                    searchContainer.classList.remove("active"); // trigger container collapse

                    setTimeout(() => {
                        searchToggle.style.display = "block"; // show toggle again
                    }, 200);
                },
                alreadyHidden ? 0 : 400
            );
        }
    };

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container") && !e.target.closest("#nav-search-toggle")) handleSearchInputBlur();

        const historyItem = e.target.closest(".history-item");
        const autocompleteItem = e.target.closest(".autocomplete-item");

        if (historyItem) {
            e.preventDefault();
            const term = historyItem.dataset.term;
            const productId = historyItem.dataset.productId;

            if (productId) {
                navigateTo(`#product-detail-view?id=${encodeURIComponent(productId)}`);
                searchInput.value = "";
                handleSearchInputBlur();
            } else {
                navigateTo(`#search-results-view?q=${encodeURIComponent(term)}`);
                searchInput.value = term;
                handleSearchInputBlur();
            }

            addSearchToHistory({ term, productId }); // refresh position in history
            searchDropdown.classList.remove("show");
        }

        if (autocompleteItem) {
            e.preventDefault();
            const term = autocompleteItem.querySelector("span").textContent;
            const productId = autocompleteItem.dataset.productId;

            searchInput.value = "";
            handleSearchInputBlur();
            addSearchToHistory({ term, productId });
            navigateTo(`#product-detail-view?id=${encodeURIComponent(productId)}`);
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
        navigateTo("#search-view");
    });
}

export function closeMenu() {
    document.getElementById("mobileMenu").classList.remove("show");
    document.body.classList.remove("menu-open");
}

export function updateNavUI() {
    const container = document.getElementById("nav-user-auth-links");
    const loggedInNavLinksHTML = html`
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
            <ul class="dropdown-menu dropdown-menu-end profile-dropdown mt-2" aria-labelledby="profile-dropdown">
                <li class="dropdown-item" href="#" data-page="home-view"><i class="fas fa-home me-2"></i> Home</li>
                <li class="dropdown-item" href="#" data-page="profile-view"><i class="fas fa-user me-2"></i> Profile</li>
                <li class="dropdown-item" href="#" data-page="orders-view"><i class="fas fa-box me-2"></i> My Orders</li>
                <li class="dropdown-item" href="#" data-page="address-management-view">
                    <i class="fas fa-map-marker-alt me-2"></i> My Addresses
                </li>
                <li class="dropdown-item" href="#" data-page="settings-view"><i class="fas fa-cog me-2"></i> Settings</li>
                <li><hr class="dropdown-divider" /></li>
                <li class="dropdown-item" id="logout-button"><i class="fas fa-sign-out-alt me-2"></i> Logout</li>
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
    document.getElementById("nav-cart-link").style.display = S.currentUser ? "block" : "none";
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
                <li class="${commonItemClasses}" data-page="settings-view"><i class="fas fa-cog me-2"></i> Settings</li>
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
    S.appData = { profile: {}, cart: [], orders: [], searchHistory: [] };
    updateNavUI();
    navigateTo("#login-view", { skipReturnTo: true });
}
