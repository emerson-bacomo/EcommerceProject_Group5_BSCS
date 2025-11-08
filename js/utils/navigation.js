import { closeMenu } from "../appEvents.js";
import { navbar } from "../main.js";
import { S } from "../state.js";
import { getHashParams, isMobile } from "./helpers.js";

let currentCleanup = null;
let lastHash = window.location.hash;
const scrollPositions = {};

export function navigateTo(hash, options = {}) {
    const currentScrollY = window.scrollY; // Store first before innerHtml is cleared

    if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
    }

    closeMenu();

    const existingReturnTo = getHashParams().returnTo;
    if (options.return) {
        if (existingReturnTo) {
            navigateTo(existingReturnTo);
        } else {
            navigateTo(hash);
        }
        return;
    }

    const appShell = document.getElementById("app-shell");
    const contentArea = appShell.querySelector("#app-content");
    contentArea.innerHTML = "";

    const currentPageHash = window.location.hash;
    const pageKey = hash.split("?")[0].substring(1);

    if (["home-view", "login-view", "signup-view"].includes(pageKey)) {
        contentArea.className = pageKey === "home-view" ? "p-0" : "container";
    } else {
        contentArea.className = `container py-${!isMobile() ? 5 : 3}`;
    }

    // Navbar visibility
    if (["login-view", "signup-view"].includes(pageKey)) navbar.style.display = "none";
    else navbar.style.display = "block";

    if ((pageKey === "login-view" || pageKey === "signup-view") && !options.skipReturnTo) {
        if (existingReturnTo) hash = `#${pageKey}?returnTo=${encodeURIComponent(existingReturnTo)}`;
        else if (
            currentPageHash &&
            !currentPageHash.includes("login-view") &&
            !currentPageHash.includes("signup-view") &&
            currentPageHash !== "#home-view" &&
            currentPageHash !== "#"
        ) {
            hash = `#${pageKey}?returnTo=${encodeURIComponent(currentPageHash)}`;
        }
    }

    if (currentPageHash !== hash) {
        history.pushState({ hash }, "", hash);
        scrollPositions[currentPageHash] = currentScrollY;
        lastHash = hash;
    }

    if (S.views[pageKey]) {
        currentCleanup = S.views[pageKey](contentArea);

        if (options.preserveScroll) {
            // Only preserve when needed like for back navigation, no need to preserve for normal navigation
            window.scrollTo({ top: scrollPositions[hash] ?? 0, behavior: "instant" });
        }
    }
}

export function handleInitialNavigation() {
    const hash = window.location.hash || "#home-view";
    const urlParams = new URLSearchParams(hash.split("?")[1]);
    const pageKey = hash.split("?")[0].substring(1) || "home-view";

    if (S.views[pageKey]) {
        if (pageKey === "login-view" || pageKey === "signup-view") {
            const returnToParam = urlParams.get("returnTo");
            if (S.currentUser) {
                // if logged in but went to login page through history or nav buttons
                if (returnToParam) {
                    window.location.hash = decodeURIComponent(returnToParam);
                } else {
                    navigateTo("#home-view");
                }
            } else {
                navigateTo(hash, { skipReturnTo: Boolean(returnToParam) });
            }
        } else if (S.protectedViews.includes(pageKey) && !S.currentUser) {
            navigateTo("#login-view");
        } else {
            navigateTo(hash, { preserveScroll: true });
        }
    } else {
        navigateTo("#home-view");
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
