import { closeMenu } from "../appEvents.js";
import { navbar } from "../main.js";
import { S } from "../state.js";
import { isMobile } from "./helpers.js";

let currentCleanup = null;
let lastHash = window.location.hash;
const scrollPositions = {};

export function navigateTo(pageKey, params = null, options = {}) {
    const currentScrollY = window.scrollY; // Store first before innerHtml is cleared

    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    }

    closeMenu();

    const appShell = document.getElementById("app-shell");
    const contentArea = appShell.querySelector("#app-content");
    contentArea.innerHTML = "";

    switch (pageKey) {
        case "home-view":
        case "login-view":
        case "signup-view":
            contentArea.className = "p-0";
            if (pageKey !== "home-view") {
                contentArea.classList.add("container");
            }
            break;
        default:
            contentArea.className = `container py-${!isMobile() ? 5 : 3}`;
    }

    if (pageKey === "login-view" || pageKey === "signup-view") {
        navbar.style.display = "none";
    } else {
        navbar.style.display = "block";
    }

    let hash = `#${pageKey}`;
    if ((pageKey === "login-view" || pageKey === "signup-view") && !options.skipReturnTo) {
        const currentHash = window.location.hash;
        const currentUrlParams = new URLSearchParams(currentHash.split("?")[1]);
        const existingReturnTo = currentUrlParams.get("returnTo");
        if (existingReturnTo) hash += `?returnTo=${encodeURIComponent(existingReturnTo)}`;
        else if (
            currentHash &&
            !currentHash.includes("login-view") &&
            !currentHash.includes("signup-view") &&
            currentHash !== "#home-view" &&
            currentHash !== "#"
        ) {
            hash += `?returnTo=${encodeURIComponent(currentHash)}`;
        }
    } else if (pageKey === "address-management-view") {
        const fromCheckout = window.location.hash.startsWith("#checkout-view");
        params = { fromCheckout };
        hash += `?fromCheckout=${fromCheckout}`;
    } else if (pageKey === "checkout-view" && params && params.buyNow) {
        hash += `?buyNow=${encodeURIComponent(JSON.stringify(params.item))}`;
    } else if (pageKey === "product-detail-view" && params && typeof params === "object") {
        hash += `?id=${encodeURIComponent(params.productId)}`;
        if (params.cartKey) {
            hash += `&cartKey=${encodeURIComponent(params.cartKey)}`;
        }
    } else if (pageKey === "product-detail-view" && params) {
        hash += `?id=${encodeURIComponent(params)}`;
    } else if ((pageKey === "order-detail-view" || pageKey === "cancellation-success-view") && params) {
        hash += `?id=${encodeURIComponent(params)}`;
    } else if (params && typeof params !== "object") {
        hash += `?q=${encodeURIComponent(JSON.stringify(params))}`;
    }

    const currentPageHash = window.location.hash;

    if (currentPageHash !== hash) {
        history.pushState({ page: pageKey, params }, "", hash);
        scrollPositions[currentPageHash] = currentScrollY;
        lastHash = hash;
    }

    if (S.views[pageKey]) {
        if (pageKey === "checkout-view" && params && params.buyNow) {
            currentCleanup = S.views[pageKey](contentArea, params.item);
        } else {
            currentCleanup = S.views[pageKey](contentArea, params);
        }

        if (options.preserveScroll) {
            // Only preserve when needed like for back navigation, no need to preserve for normal navigation
            window.scrollTo({ top: scrollPositions[hash] ?? 0, behavior: "instant" });
        }
    }
}

export function handleInitialNavigation() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const pageKey = window.location.hash.split("?")[0].substring(1) || "home-view";
    const productId = urlParams.get("id");
    const cartKey = urlParams.get("cartKey");
    const orderId = urlParams.get("id");
    const queryParam = urlParams.get("q");
    const buyNowParam = urlParams.get("buyNow");
    const returnToParam = urlParams.get("returnTo");
    const fromCheckoutParam = urlParams.get("fromCheckout");

    if (S.views[pageKey]) {
        if (pageKey === "login-view" || pageKey === "signup-view") {
            if (S.currentUser) {
                // if logged in but went to login page through history or nav buttons
                if (returnToParam) {
                    window.location.hash = decodeURIComponent(returnToParam);
                } else {
                    navigateTo("home-view");
                }
            } else {
                navigateTo(pageKey, null, { skipReturnTo: Boolean(returnToParam) });
            }
        } else if (S.protectedViews.includes(pageKey) && !S.currentUser) {
            navigateTo("login-view");
        } else if (pageKey === "product-detail-view" && productId) {
            navigateTo(pageKey, { productId, cartKey }, { preserveScroll: true });
        } else if (pageKey === "order-detail-view" && orderId) {
            navigateTo(pageKey, orderId, { preserveScroll: true });
        } else if (pageKey === "address-management-view") {
            navigateTo(pageKey, { fromCheckout: fromCheckoutParam === "true" }, { preserveScroll: true });
        } else if (pageKey === "checkout-view" && buyNowParam) {
            try {
                const item = JSON.parse(decodeURIComponent(buyNowParam));
                S.buyNowItem = item;
                navigateTo(pageKey, { buyNow: true, item }, { preserveScroll: true });
            } catch (e) {
                console.error("Error parsing buyNow param on load:", e);
                S.buyNowItem = null;
                navigateTo("home-view");
            }
        } else {
            const params = queryParam ? JSON.parse(decodeURIComponent(queryParam)) : null;
            S.buyNowItem = null;
            navigateTo(pageKey, params, { preserveScroll: true });
        }
    } else {
        S.buyNowItem = null;
        navigateTo("home-view");
    }
}

export function setupNavigation() {
    window.addEventListener("hashchange", () => {
        // Save scroll of page being left
        if (lastHash) {
            scrollPositions[lastHash] = window.scrollY;
        }

        // Update last known hash before navigating
        lastHash = window.location.hash;

        handleInitialNavigation();
    });
}
