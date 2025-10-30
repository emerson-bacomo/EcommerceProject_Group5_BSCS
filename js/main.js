import { setupNavigation } from "./utils/navigation.js";
import { setupAppListeners, updateNavUI, checkLoginStatus } from "./appEvents.js";
import { S } from "./state.js";

import "./components/QuantityPicker.js";
import "./components/ProductCard.js";

import { renderHomePage } from "./pages/HomePage.js";
import { renderProductDetailPage } from "./pages/ProductDetailPage.js";
import { renderCartPage } from "./pages/CartPage.js";
import { renderCheckoutPage } from "./pages/CheckoutPage.js";
import { renderProfilePage } from "./pages/ProfilePage.js";
import { renderOrdersPage } from "./pages/OrdersPage.js";
import { renderOrderDetailPage } from "./pages/OrderDetailPage.js";
import { renderAddressManagementPage } from "./pages/AddressManagementPage.js";
import { renderSearchResultsPage } from "./pages/SearchResultsPage.js";
import { renderLoginPage } from "./pages/LoginPage.js";
import { renderSignupPage } from "./pages/SignupPage.js";
import { renderCancellationSuccessPage } from "./pages/CancellationSuccessPage.js";

S.views = {
    "home-view": (container) => renderHomePage(container),
    "product-detail-view": (container, params) => renderProductDetailPage(container, params),
    "cart-view": (container) => renderCartPage(container),
    "checkout-view": (container, buyNowItem) => renderCheckoutPage(container, buyNowItem),
    "profile-view": (container) => renderProfilePage(container),
    "orders-view": (container) => renderOrdersPage(container),
    "order-detail-view": (container, id) => renderOrderDetailPage(container, id),
    "cancellation-success-view": (container, id) => renderCancellationSuccessPage(container, id),
    "search-results-view": (container, q) => renderSearchResultsPage(container, q),
    "address-management-view": (container, fromCheckout) => renderAddressManagementPage(container, fromCheckout),
    "login-view": (container) => renderLoginPage(container),
    "signup-view": (container) => renderSignupPage(container),
};

export let navbar;

window.addEventListener("DOMContentLoaded", () => {
    navbar = document.querySelector("nav.navbar");
    S.promptLoginModal = new bootstrap.Modal(document.getElementById("promptLoginModal"));
    setupNavigation();
    setupAppListeners();
    updateNavUI();
    checkLoginStatus();
});
