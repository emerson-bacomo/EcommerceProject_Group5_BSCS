import { html } from "../utils/helpers.js";

export const products = [
    {
        id: 1,
        name: "Stylish Running Shoes",
        description: "Lightweight and breathable running shoes with excellent cushioning. Perfect for daily runs.",
        rating: 4.7,
        soldAmount: 152,
        images: [
            "https://placehold.co/600x600/E2E8F0/4A5568?text=Shoes+Angle+1",
            "https://placehold.co/600x600/E2E8F0/4A5568?text=Shoes+Angle+2",
        ],
        banner: html`
            <div
                class="banner-slide"
                style="background-image: url('https://placehold.co/1920x1080/4299E1/FFFFFF?text=New+Arrivals');"
            >
                <div class="banner-content">
                    <h1>New Stylish Running Shoes</h1>
                    <p>Experience unmatched comfort and style. Perfect for your daily runs.</p>
                    <button class="btn btn-primary btn-lg banner-buy-now-btn" data-product-id="1">Shop Now</button>
                </div>
            </div>
        `,
        variations: {
            color: {
                Black: {
                    image: "https://placehold.co/600x600/2D3748/E2E8F0?text=Black+Shoes",
                    sizes: { "EU 39 / US 6": 2800.0, "EU 40 / US 7": 2800.0, "EU 41 / US 8": 2850.0, "EU 42 / US 9": 2850.0 },
                },
                Blue: {
                    image: "https://placehold.co/600x600/4299E1/FFFFFF?text=Blue+Shoes",
                    sizes: { "EU 40 / US 7": 2900.0, "EU 41 / US 8": 2900.0, "EU 42 / US 9": 2950.0 },
                },
                White: { image: null, sizes: { "EU 38 / US 5": 2750.0, "EU 39 / US 6": 2750.0, "EU 40 / US 7": 2750.0 } },
            },
        },
    },
    {
        id: 2,
        name: "Smart Fitness Tracker",
        description: "Monitor your heart rate, steps, and sleep patterns. Waterproof with a 7-day battery life.",
        rating: 4.7,
        soldAmount: 230,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Tracker"],
        banner: html`
            <div
                class="banner-slide"
                style="background-image: url('https://placehold.co/1920x1080/1A202C/FFFFFF?text=Tech+Sale');"
            >
                <div class="banner-content">
                    <h1>Track Your Progress</h1>
                    <p>Get the Smart Fitness Tracker. 7-day battery life, waterproof, and more.</p>
                    <button class="btn btn-primary btn-lg banner-buy-now-btn" data-product-id="2">Buy Now</button>
                </div>
            </div>
        `,
        variations: { color: { Default: { image: null, sizes: { Standard: 2475.0 } } } },
    },
    {
        id: 3,
        name: "Graphic T-Shirt",
        description: "Comfortable cotton t-shirt with a unique graphic print.",
        rating: 4.5,
        soldAmount: 88,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=T-Shirt+Base"],
        variations: {
            color: {
                Charcoal: {
                    image: "https://placehold.co/600x600/4A5568/FFFFFF?text=Charcoal+Tee",
                    sizes: { S: 850.0, M: 850.0, L: 850.0, XL: 900.0 },
                },
                Navy: { image: "https://placehold.co/600x600/2C5282/FFFFFF?text=Navy+Tee", sizes: { M: 875.0, L: 875.0 } },
            },
        },
    },
    {
        id: 4,
        name: "Portable Espresso Maker",
        description: "Enjoy delicious espresso...",
        rating: 4.6,
        soldAmount: 112,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Espresso"],
        variations: { color: { Default: { image: null, sizes: { Standard: 3247.5 } } } },
    },
    {
        id: 5,
        name: "Insulated Steel Water Bottle",
        description: "Keeps drinks cold...",
        rating: 4.9,
        soldAmount: 301,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Bottle"],
        variations: {
            color: {
                Silver: { image: null, sizes: { "32 oz": 1399.5 } },
                MatteBlack: { image: "https://placehold.co/600x600/1A202C/FFFFFF?text=Black+Bottle", sizes: { "32 oz": 1450.0 } },
            },
        },
    },
    {
        id: 6,
        name: "Yoga & Exercise Mat",
        description: "High-density foam...",
        rating: 4.4,
        soldAmount: 75,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Yoga+Mat"],
        variations: {
            color: { Purple: { image: null, sizes: { "6mm": 1749.5 } }, Teal: { image: null, sizes: { "6mm": 1799.0 } } },
        },
    },
    {
        id: 7,
        name: "Modern Digital Alarm Clock",
        description: "Minimalist design...",
        rating: 4.3,
        soldAmount: 45,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Clock"],
        variations: { color: { Default: { image: null, sizes: { Standard: 1125.0 } } } },
    },
    {
        id: 8,
        name: "Aromatherapy Oil Diffuser",
        description: "Ultrasonic cool mist...",
        rating: 4.7,
        soldAmount: 98,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Diffuser"],
        variations: {
            color: {
                Woodgrain: { image: null, sizes: { Standard: 1999.5 } },
                White: { image: null, sizes: { Standard: 1950.0 } },
            },
        },
    },
    {
        id: 9,
        name: "Wireless Charging Pad",
        description: "Fast wireless charging for compatible devices.",
        rating: 4.6,
        soldAmount: 180,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Charger"],
        variations: { color: { Default: { image: null, sizes: { Standard: 1500.0 } } } },
    },
    {
        id: 10,
        name: "Leather Wallet",
        description: "Genuine leather wallet with RFID blocking.",
        rating: 4.8,
        soldAmount: 210,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Wallet"],
        variations: { color: { Brown: { image: null, sizes: { Standard: 1800.0 } } } },
    },
    {
        id: 11,
        name: "Bluetooth Headphones",
        description: "Over-ear noise-cancelling headphones.",
        rating: 4.7,
        soldAmount: 165,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Headphones"],
        variations: { color: { Black: { image: null, sizes: { Standard: 4500.0 } } } },
    },
    {
        id: 12,
        name: "Coffee Grinder",
        description: "Burr grinder for a consistent coffee grind.",
        rating: 4.9,
        soldAmount: 95,
        images: ["https://placehold.co/600x600/E2E8F0/4A5568?text=Grinder"],
        variations: { color: { Default: { image: null, sizes: { Standard: 2200.0 } } } },
    },
];
