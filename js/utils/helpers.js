import { mobileMaxWidthPlus1 } from "../config/general.js";
import { products } from "../config/products.js";
import { S } from "../state.js";

export const html = (strings, ...values) => strings.reduce((result, string, i) => result + string + (values[i] ?? ""), "");

export const formatCurrency = (amount) =>
    typeof amount === "number" ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount) : "N/A";

export const getStarRatingHTML = (rating) => {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return stars;
};

export const getPriceRange = (product, quantity = 1) => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let prices = new Set();
    if (product.variations && product.variations.color) {
        Object.values(product.variations.color).forEach((colorData) => {
            if (colorData.sizes) {
                Object.values(colorData.sizes).forEach((price) => {
                    minPrice = Math.min(minPrice, price);
                    maxPrice = Math.max(maxPrice, price);
                    prices.add(price);
                });
            }
        });
    }
    if (prices.size === 0) return "N/A";
    if (prices.size === 1) return formatCurrency(minPrice * quantity);
    return `${formatCurrency(minPrice * quantity)} - ${formatCurrency(maxPrice * quantity)}`;
};

export const getProductById = (id) => products.find((p) => p.id === parseInt(id));
export const getAddressById = (id) => (S.appData.profile.addresses || []).find((p) => p.id === parseInt(id));
export const isMobile = () => window.innerWidth < mobileMaxWidthPlus1;
