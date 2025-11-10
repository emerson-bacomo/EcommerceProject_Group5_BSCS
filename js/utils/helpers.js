import { mobileMaxWidthPlus1 } from "../config/general.js";
import { products } from "../config/products.js";
import { S } from "../state.js";
import { navigateTo } from "./navigation.js";

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

export function classNames(...args) {
    return args
        .flat(Infinity) // allow nested arrays
        .filter(Boolean) // remove falsy (false, null, undefined, 0, "")
        .join(" "); // join by space
}

export function styleString(...args) {
    const styles = {};

    for (const arg of args.flat(Infinity)) {
        if (!arg) continue;

        if (typeof arg === "string") {
            // Parse simple "key: value" strings
            const [key, value] = arg.split(":").map((s) => s.trim());
            if (key && value) styles[key] = value;
        } else if (typeof arg === "object") {
            // Merge style objects
            for (const [key, value] of Object.entries(arg)) {
                if (value != null && value !== false) {
                    styles[key] = value;
                }
            }
        }
    }

    // Convert final object to CSS string
    const res = Object.entries(styles)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${value}`)
        .join("; ");

    return res;
}
export function back() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigateTo("#home-view");
    }
}
/**
 * Returns an object of all URL hash parameters, decoded and JSON-parsed if possible.
 * Example: #view?id=123&buyNow=%7B%22id%22%3A1%2C%22qty%22%3A2%7D
 * Returns: { id: "123", buyNow: { id: 1, qty: 2 } }
 */
export function getHashParams() {
    const hash = window.location.hash || "";
    const queryPart = hash.split("?")[1]; // get part after "?"
    const params = {};

    if (queryPart) {
        const searchParams = new URLSearchParams(queryPart);
        for (const [key, value] of searchParams.entries()) {
            let decoded;
            try {
                decoded = decodeURIComponent(value);
            } catch {
                decoded = value;
            }

            // Try to parse JSON
            try {
                params[key] = JSON.parse(decoded);
            } catch {
                params[key] = decoded;
            }
        }
    }

    return params;
}
export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export const getScrollSource = () => (isMobile() ? window : document.getElementById("app-content"));
export const getScrollY = () => (isMobile() ? window.scrollY : document.getElementById("app-content").scrollTop);
