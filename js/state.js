import { products } from "./config/products.js";

export const S = {
    currentUser: null,
    appData: { profile: {}, cart: [], orders: [], searchHistory: [] },
    products,
    promptLoginModal: null,
    confirmModal: null,
    confirmModalResolver: null,
    buyNowItem: null,
    currentProductDetailState: {
        productId: null,
        selectedColor: null,
        selectedSize: null,
        currentImageIndex: 0,
        totalImages: 0,
        colorImageMap: {},
        currentQuantity: 1,
    },

    protectedViews: [
        "cart-view",
        "checkout-view",
        "profile-view",
        "orders-view",
        "order-detail-view",
        "address-management-view",
        "cancellation-success-view",
        "settings-view",
    ],
    views: {},
};
