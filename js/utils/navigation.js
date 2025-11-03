import { navbar } from "../main.js";
import { S } from "../state.js";
import { isMobile } from "./helpers.js";

let currentCleanup = null;

export function navigateTo(pageKey, params = null, options = {}) {
    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    }

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

    const currentPageHash = window.location.hash.split("?")[0];
    const targetPageHash = hash.split("?")[0];
    if (currentPageHash !== targetPageHash && window.location.hash !== hash) {
        history.pushState({ page: pageKey, params }, "", hash);
    }

    if (S.views[pageKey]) {
        if (pageKey === "checkout-view" && params && params.buyNow) {
            currentCleanup = S.views[pageKey](contentArea, params.item);
        } else {
            currentCleanup = S.views[pageKey](contentArea, params);
        }
    }
}

export function handleInitialNavigation() {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const hash = window.location.hash.split("?")[0].substring(1) || "home-view";
    const productId = urlParams.get("id");
    const cartKey = urlParams.get("cartKey");
    const orderId = urlParams.get("id");
    const queryParam = urlParams.get("q");
    const buyNowParam = urlParams.get("buyNow");
    const returnToParam = urlParams.get("returnTo");
    const fromCheckoutParam = urlParams.get("fromCheckout");

    if (S.views[hash]) {
        if (hash === "login-view" || hash === "signup-view") {
            if (S.currentUser) {
                // if logged in but went to login page through history or nav buttons
                if (returnToParam) {
                    window.location.hash = decodeURIComponent(returnToParam);
                } else {
                    navigateTo("home-view");
                }
            } else {
                navigateTo(hash, null, { skipReturnTo: Boolean(returnToParam) });
            }
        } else if (S.protectedViews.includes(hash) && !S.currentUser) {
            navigateTo("login-view");
        } else if (hash === "product-detail-view" && productId) {
            console.log(hash);
            navigateTo(hash, { productId, cartKey });
        } else if (hash === "order-detail-view" && orderId) {
            navigateTo(hash, orderId);
        } else if (hash === "address-management-view") {
            navigateTo(hash, { fromCheckout: fromCheckoutParam === "true" });
        } else if (hash === "checkout-view" && buyNowParam) {
            try {
                const item = JSON.parse(decodeURIComponent(buyNowParam));
                S.buyNowItem = item;
                navigateTo(hash, { buyNow: true, item });
            } catch (e) {
                console.error("Error parsing buyNow param on load:", e);
                S.buyNowItem = null;
                navigateTo("home-view");
            }
        } else {
            const params = queryParam ? JSON.parse(decodeURIComponent(queryParam)) : null;
            S.buyNowItem = null;
            navigateTo(hash, params);
        }
    } else {
        S.buyNowItem = null;
        navigateTo("home-view");
    }
}

export function setupNavigation() {
    window.addEventListener("hashchange", () => handleInitialNavigation());
}
