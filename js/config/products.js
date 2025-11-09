import { html } from "../utils/helpers.js";

export const products = [
    {
        id: 1,
        name: "Nike Vomero Plus",
        description:
            "Experience unmatched comfort and performance with the Nike Vomero Plus. Lightweight, breathable, and cushioned for your daily runs.",
        rating: 4.8,
        soldAmount: 152,
        images: ["assets/products/Nike Vomero Plus(Angle1).jpg", "assets/products/Nike Vomero Plus(Angle2).avif"],
        variations: {
            color: {
                Black: {
                    image: "assets/products/NIKE+VOMERO+PLUS(BLACK).avif",
                    sizes: { "EU 39 / US 6": 2800.0, "EU 40 / US 7": 2800.0, "EU 41 / US 8": 2850.0, "EU 42 / US 9": 2850.0 },
                },
                WhiteBlue: {
                    image: "assets/products/NIKE+VOMERO+PLUS(BLUE).avif",
                    sizes: { "EU 40 / US 7": 2900.0, "EU 41 / US 8": 2900.0, "EU 42 / US 9": 2950.0 },
                },
                White: {
                    image: "assets/products/NIKE+VOMERO+PLUS.jpg",
                    sizes: { "EU 38 / US 5": 2750.0, "EU 39 / US 6": 2750.0, "EU 40 / US 7": 2750.0 },
                },
                Orange: {
                    image: "assets/products/Nike Vomero Plus(Angle2).avif",
                    sizes: { "EU 38 / US 5": 2750.0, "EU 39 / US 6": 2750.0, "EU 40 / US 7": 2750.0 },
                },
            },
        },
    },
    {
        id: 2,
        name: "Air Jordan 1 Retro High OG 'Black and Gold'",
        description:
            "Elevate your sneaker game with the iconic Air Jordan 1 Retro High OG, blending timeless style with premium craftsmanship.",
        rating: 5.0,
        soldAmount: 125,
        images: [
            "assets/products/AIR+JORDAN+1+RETRO+HIGH+OG(ANGLE1).jpeg",
            "assets/products/AIR+JORDAN+1+RETRO+HIGH+OG(ANGLE2).jpeg",
        ],
        banner: html`
            <div
                class="banner-slide"
                style="background-image: url('assets/banners/https___hypebeast.com_image_2017_11_air-jordan-retro-1-high-top-3-og-energy-hypebeast-2.avif');"
            >
                <div class="banner-content">
                    <h1>New Stylish Shoes</h1>
                    <p>Step up your style with the latest Air Jordans – premium design for sneaker enthusiasts.</p>
                    <button class="btn btn-primary btn-lg banner-buy-now-btn" data-product-id="2">Shop Now</button>
                </div>
            </div>
        `,
        variations: {
            color: {
                Gold: {
                    image: "assets/products/AIR+JORDAN+1+RETRO+HIGH+OG(GOLD).jpeg",
                    sizes: { "EU 39 / US 6": 7199.0, "EU 40 / US 7": 7199.0, "EU 41 / US 8": 7299.0, "EU 42 / US 9": 7599.0 },
                },
                Orange: {
                    image: "assets/products/AIR+JORDAN+1+RETRO+HIGH+OG(ORANGE).jpeg",
                    sizes: { "EU 40 / US 7": 7199.0, "EU 41 / US 8": 7299.0, "EU 42 / US 9": 7599.0 },
                },
            },
        },
    },
    {
        id: 3,
        name: "Nike SB Zoom Janoski OG",
        description:
            "Skate in style with the Nike SB Zoom Janoski OG, featuring superior grip and a sleek, classic silhouette for all-day comfort.",
        rating: 4.9,
        soldAmount: 124,
        images: [
            "assets/products/NIKE+SB+ZOOM+JANOSKI+OG+(ANGLE1).jpeg",
            "assets/products/NIKE+SB+ZOOM+JANOSKI+OG+(ANGLE2).jpeg",
        ],
        banner: html`
            <div
                class="banner-slide"
                style="background-image: url('assets/banners/nike-zoom-stefan-janoski-black-sail-333284-015-footwear _ sneaker-manufacturers-6.jpg');"
            >
                <div class="banner-content">
                    <h1>Go Out With Style</h1>
                    <p>Browse stylish shoes just for you!</p>
                    <button class="btn btn-primary btn-lg banner-buy-now-btn" data-product-id="3">Shop Now</button>
                </div>
            </div>
        `,
        variations: {
            color: {
                Black: {
                    image: "assets/products/NIKE+SB+ZOOM+JANOSKI+OG+(BLACK).jpeg",
                    sizes: { "EU 39 / US 6": 4850.0, "EU 40 / US 7": 4850.0, "EU 41 / US 8": 4900.0, "EU 42 / US 9": 5199.0 },
                },
                Blue: {
                    image: "assets/products/NIKE+SB+ZOOM+JANOSKI+OG+(BLUE).jpeg",
                    sizes: { "EU 40 / US 7": 4850.0, "EU 41 / US 8": 4850.0, "EU 42 / US 9": 4950.0 },
                },
                White: {
                    image: "assets/products/NIKE+SB+ZOOM+JANOSKI+OG+(WHITE).jpg",
                    sizes: { "EU 38 / US 5": 4599.0, "EU 39 / US 6": 4599.0, "EU 40 / US 7": 4599.0 },
                },
            },
        },
    },
    {
        id: 4,
        name: "Nike Winflo 10",
        description:
            "Boost your running experience with Nike Winflo 10. Lightweight, breathable, and designed for smooth, stable strides.",
        rating: 4.0,
        soldAmount: 411,
        images: ["assets/products/AIR+WINFLO+10(ANGLE1).jpeg", "assets/products/AIR+WINFLO+10(ANGLE2).jpeg"],
        variations: {
            color: {
                Black: {
                    image: "assets/products/AIR+WINFLO+10(BLACK).jpeg",
                    sizes: { "EU 39 / US 6": 3199.0, "EU 40 / US 7": 3199.0, "EU 41 / US 8": 3199.0, "EU 42 / US 9": 3199.0 },
                },
                White: {
                    image: "assets/products/AIR+WINFLO+10(WHITE).jpeg",
                    sizes: { "EU 40 / US 7": 3199.0, "EU 41 / US 8": 3199.0, "EU 42 / US 9": 3199.0 },
                },
                WhiteOrange: {
                    image: "assets/products/AIR+WINFLO+10(WHITEORANGE).jpeg",
                    sizes: { "EU 40 / US 7": 3199.0, "EU 41 / US 8": 3199.0, "EU 42 / US 9": 3199.0 },
                },
            },
        },
    },
    {
        id: 5,
        name: "Velvet Brown and Safety Orange",
        description:
            "Step out in elegance with the women's LD-1000, featuring a luxurious velvet brown and vibrant safety orange design.",
        rating: 5.0,
        soldAmount: 132,
        images: [
            "assets/products/women-s-ld-1000-velvet-brown-and-safety-orange-im9008-201-release-date(ANGLE1).jpeg",
            "assets/products/women-s-ld-1000-velvet-brown-and-safety-orange-im9008-201-release-date(ANGLE2).jpeg",
        ],
        variations: {
            color: {
                Brown: {
                    image: "assets/products/women-s-ld-1000-velvet-brown-and-safety-orange(BROWN).jpeg",
                    sizes: { "EU 39 / US 6": 8199.0, "EU 40 / US 7": 8199.0, "EU 41 / US 8": 8199.0, "EU 42 / US 9": 8199.0 },
                },
            },
        },
    },
    {
        id: 6,
        name: "Nike React SFB Carbon",
        description:
            "Conquer any terrain with Nike React SFB Carbon. Rugged outdoor shoes designed for stability, comfort, and long-lasting performance.",
        rating: 3.9,
        soldAmount: 231,
        images: ["assets/products/NIKE+REACT+SFB+CARBON(ANGLE1).jpeg", "assets/products/NIKE+REACT+SFB+CARBON(ANGLE2).jpeg"],
        variations: {
            color: {
                Brown: {
                    image: "assets/products/NIKE+REACT+SFB+CARBON(BROWN).jpeg",
                    sizes: {
                        "EU 39 / US 6": 8995.0,
                        "EU 40 / US 7": 8995.0,
                        "EU 41 / US 8": 8995.0,
                        "EU 42 / US 9": 8995.0,
                        "EU 43 / US 10": 8995.0,
                    },
                },
                Black: {
                    image: "assets/products/NIKE+REACT+SFB+CARBON(BLACK).jpeg",
                    sizes: { "EU 39 / US 6": 8995.0, "EU 40 / US 7": 8995.0, "EU 41 / US 8": 8995.0, "EU 42 / US 9": 8995.0 },
                },
            },
        },
    },
    {
        id: 7,
        name: "LeBron TR 1",
        description:
            "Train like a pro with LeBron TR 1. Engineered for intense workouts, offering superior support, cushioning, and style.",
        rating: 5.0,
        soldAmount: 245,
        images: ["assets/products/LEBRON+TR+1(ANGLE1).jpeg", "assets/products/LEBRON+TR+1(ANGLE2).jpeg"],
        variations: {
            color: {
                GoldWhite: {
                    image: "assets/products/LEBRON+TR+1(GOLDWHITE).jpeg",
                    sizes: {
                        "EU 39 / US 6": 7350.0,
                        "EU 40 / US 7": 7350.0,
                        "EU 41 / US 8": 7350.0,
                        "EU 42 / US 9": 7350.0,
                        "EU 44 / US 11": 7350.0,
                        "EU 45 / US 12": 7450.0,
                    },
                },
                Green: {
                    image: "assets/products/LEBRON+TR+1(GREEN).jpeg",
                    sizes: {
                        "EU 39 / US 6": 7350.0,
                        "EU 40 / US 7": 7350.0,
                        "EU 41 / US 8": 7350.0,
                        "EU 42 / US 9": 7350.0,
                        "EU 43 / US 10": 7350.0,
                        "EU 44 / US 11": 7350.0,
                    },
                },
            },
        },
    },
    {
        id: 8,
        name: "VL Court 3.0 Shoes",
        description:
            "Play hard with VL Court 3.0 Shoes. Durable, comfortable, and stylish sneakers designed for everyday sports and leisure.",
        rating: 4.5,
        soldAmount: 245,
        images: [
            "assets/products/VL_Court_3.0_Shoes_Black_JR8609_04_standard(ANGLE1).jpeg",
            "assets/products/VL_COURT_3.0_SHOES_White_JS1850_02_standard_hover(ANGLE2).jpeg",
        ],
        variations: {
            color: {
                Black: {
                    image: "assets/products/VL_Court_3.0_Shoes_Black_JR8609_01_00_standard(BLACK).jpeg",
                    sizes: {
                        "EU 39 / US 6": 4299.0,
                        "EU 40 / US 7": 4299.0,
                        "EU 41 / US 8": 4299.0,
                        "EU 42 / US 9": 4299.0,
                        "EU 44 / US 11": 4499.0,
                        "EU 45 / US 12": 4550.0,
                    },
                },
                OffWhite: {
                    image: "assets/products/VL_COURT_3.0_SHOES_White_JS1850_01_00_standard(OFFWHITE).jpeg",
                    sizes: {
                        "EU 39 / US 6": 4299.0,
                        "EU 40 / US 7": 4299.0,
                        "EU 41 / US 8": 4299.0,
                        "EU 42 / US 9": 4299.0,
                        "EU 43 / US 10": 4299.0,
                        "EU 44 / US 11": 4499.0,
                    },
                },
            },
        },
    },
    {
        id: 9,
        name: "Run Star Hike Canvas Platform Shoes - Black",
        description:
            "Step up your fashion game with Run Star Hike Canvas Platform Shoes, a bold reimagination of classic Chucks.",
        rating: 3.9,
        soldAmount: 153,
        images: [
            "assets/products/0802-CON166800C000003-3(new angle1).jpg",
            "assets/products/0802-CON166800C000003-5(new angle2).jpg",
        ],
        variations: {
            color: {
                Black: {
                    image: "assets/products/Run Star Hike Canvas Platform Shoes - Black(BLACK).jpeg",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 44 / US 11": 5499.0,
                        "EU 45 / US 12": 5499.0,
                    },
                },
            },
        },
    },
    {
        id: 10,
        name: "Nike SB PS8",
        description:
            "Nike SB PS8 delivers classic skate style and superior comfort, built for both performance and everyday wear.",
        rating: 4.4,
        soldAmount: 245,
        images: ["assets/products/NIKE+SB+PS8(ANGLE1).jpg", "assets/products/NIKE+SB+PS8(ANGLE2).jpg"],
        variations: {
            color: {
                Black: {
                    image: "assets/products/NIKE+SB+PS8(BLACK).jpg",
                    sizes: {
                        "EU 39 / US 6": 3499.0,
                        "EU 40 / US 7": 3499.0,
                        "EU 41 / US 8": 3499.0,
                        "EU 42 / US 9": 3699.0,
                        "EU 44 / US 11": 3799.0,
                        "EU 45 / US 12": 3799.0,
                    },
                },
                Blue: {
                    image: "assets/products/NIKE+SB+PS8(BLUE).jpg",
                    sizes: {
                        "EU 39 / US 6": 3499.0,
                        "EU 40 / US 7": 3499.0,
                        "EU 41 / US 8": 3499.0,
                        "EU 42 / US 9": 3699.0,
                        "EU 43 / US 10": 3799.0,
                        "EU 44 / US 11": 3799.0,
                    },
                },
            },
        },
    },
    {
        id: 11,
        name: "Nike Run Defy",
        description:
            "Women's Road Running Shoes designed for comfort and performance. Lightweight, cushioned, and perfect for daily runs.",
        rating: 4.9,
        soldAmount: 245,
        images: ["assets/products/W+NIKE+RUN+DEFY(ANGLE1).jpg", "assets/products/W+NIKE+RUN+DEFY(ANGLE2).jpg"],
        variations: {
            color: {
                White: {
                    image: "assets/products/W+NIKE+RUN+DEFY(WHITE).jpg",
                    sizes: {
                        "EU 39 / US 6": 2459.0,
                        "EU 40 / US 7": 2459.0,
                        "EU 41 / US 8": 2459.0,
                        "EU 42 / US 9": 2599.0,
                        "EU 44 / US 11": 2599.0,
                        "EU 45 / US 12": 2599.0,
                    },
                },
                Black: {
                    image: "assets/products/W+NIKE+RUN+DEFY(BLACK).jpg",
                    sizes: {
                        "EU 39 / US 6": 2459.0,
                        "EU 40 / US 7": 2459.0,
                        "EU 41 / US 8": 2459.0,
                        "EU 42 / US 9": 2599.0,
                        "EU 43 / US 10": 2599.0,
                        "EU 44 / US 11": 2599.0,
                    },
                },
                CyberPink: {
                    image: "assets/products/W+NIKE+RUN+DEFY(CYBERPINK).jpg",
                    sizes: {
                        "EU 39 / US 6": 2459.0,
                        "EU 40 / US 7": 2459.0,
                        "EU 41 / US 8": 2459.0,
                        "EU 42 / US 9": 2599.0,
                        "EU 43 / US 10": 2599.0,
                        "EU 44 / US 11": 2599.0,
                    },
                },
            },
        },
    },
    {
        id: 12,
        name: "Softride Enzo 5 Metallic Running Shoes Women",
        description:
            "Bold, stylish, and designed for women, Softride Enzo 5 ensures maximum comfort with a metallic finish for standout performance.",
        rating: 4.5,
        soldAmount: 245,
        images: [
            "assets/products/Softride-Enzo-5-Metallic-Running-Shoes-Women(ANGLE1).jpg",
            "assets/products/Softride-Enzo-5-Metallic-Running-Shoes-Women(ANGLE2).jpg",
        ],
        variations: {
            color: {
                WhiteGold: {
                    image: "assets/products/Softride-Enzo-5-Metallic-Running-Shoes-Women(WHITEGOLD).jpg",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 44 / US 11": 5699.0,
                        "EU 45 / US 12": 5750.0,
                    },
                },
                BlackGold: {
                    image: "assets/products/Softride-Enzo-5-Metallic-Running-Shoes-Women(BLACKGOLD).jpg",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 43 / US 10": 5499.0,
                        "EU 44 / US 11": 5699.0,
                    },
                },
                WhitePink: {
                    image: "assets/products/Softride-Enzo-5-Metallic-Running-Shoes-Women(WHITEPINK).jpg",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 43 / US 10": 5499.0,
                        "EU 44 / US 11": 5699.0,
                    },
                },
            },
        },
    },
    {
        id: 13,
        name: "Roma 24 Sneakers Unisex",
        description: "Unisex sneakers offering timeless style and comfort. Perfect for everyday wear or a casual outing.",
        rating: 4.8,
        soldAmount: 245,
        images: ["assets/products/Roma-24-Sneakers-Unisex(ANGLE1).jpg", "assets/products/Roma-24-Sneakers-Unisex(ANGLE2).jpg"],
        variations: {
            color: {
                White: {
                    image: "assets/products/Roma-24-Sneakers-Unisex(WHITE).jpg",
                    sizes: {
                        "EU 39 / US 6": 6199.0,
                        "EU 40 / US 7": 6199.0,
                        "EU 41 / US 8": 6199.0,
                        "EU 42 / US 9": 6199.0,
                        "EU 44 / US 11": 6399.0,
                        "EU 45 / US 12": 6499.0,
                    },
                },
                BlackWhite: {
                    image: "assets/products/Roma-24-Sneakers-Unisex(BLACKWHITE).jpg",
                    sizes: {
                        "EU 39 / US 6": 6199.0,
                        "EU 40 / US 7": 6199.0,
                        "EU 41 / US 8": 6199.0,
                        "EU 42 / US 9": 6199.0,
                        "EU 43 / US 10": 6199.0,
                        "EU 44 / US 11": 6399.0,
                    },
                },
            },
        },
    },
    {
        id: 14,
        name: "Pulsar Wedge Monogram Women",
        description: "Inspired by early 2000's hip hop style, these wedge sneakers combine iconic looks with everyday comfort.",
        rating: 4.9,
        soldAmount: 245,
        images: [
            "assets/products/Pulsar-Wedge-Monogram-Women(ANGLE1).jpg",
            "assets/products/Pulsar-Wedge-Monogram-Women(ANGLE2).jpg",
        ],
        variations: {
            color: {
                PristinePrairie: {
                    image: "assets/products/Pulsar-Wedge-Monogram-Women(PristinePrairie).jpg",
                    sizes: {
                        "EU 39 / US 6": 3499.0,
                        "EU 40 / US 7": 3499.0,
                        "EU 41 / US 8": 3499.0,
                        "EU 42 / US 9": 3499.0,
                        "EU 44 / US 11": 3599.0,
                        "EU 45 / US 12": 3499.0,
                    },
                },
            },
        },
    },
    {
        id: 15,
        name: "Porsche Legacy Palermo Pinstripe Sneakers",
        description:
            "Retro style meets modern design with premium materials. Sleek leather, suede overlays, and a nylon base for timeless sophistication.",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "assets/products/Porsche-Legacy-Palermo-Pinstripe-Sneakers(ANGLE1).jpg",
            "assets/products/Porsche-Legacy-Palermo-Pinstripe-Sneakers(ANGLE2).jpg",
        ],
        variations: {
            color: {
                BlackGreen: {
                    image: "assets/products/Porsche-Legacy-Palermo-Pinstripe-Sneakers(BLACKGREEN).jpg",
                    sizes: {
                        "EU 39 / US 6": 9450.0,
                        "EU 40 / US 7": 9450.0,
                        "EU 41 / US 8": 9450.0,
                        "EU 42 / US 9": 9450.0,
                        "EU 44 / US 11": 9450.0,
                        "EU 45 / US 12": 9650.0,
                    },
                },
                WhiteAlpine: {
                    image: "assets/products/Porsche-Legacy-Palermo-Pinstripe-Sneakers(WHITEALPINE).jpg",
                    sizes: {
                        "EU 39 / US 6": 9450.0,
                        "EU 40 / US 7": 9450.0,
                        "EU 41 / US 8": 9450.0,
                        "EU 42 / US 9": 9450.0,
                        "EU 43 / US 10": 9450.0,
                        "EU 44 / US 11": 9450.0,
                    },
                },
            },
        },
    },
    {
        id: 16,
        name: "Mayze Sneakers Women",
        description: "Platform sneakers that elevate your street style. Bold, stylish, and perfect for making a statement.",
        rating: 3.9,
        soldAmount: 245,
        images: ["assets/products/Mayze-Sneakers-Women(ANGLE1).jpg", "assets/products/Mayze-Sneakers-Women(ANGLE2).jpg"],
        variations: {
            color: {
                BlackWhite: {
                    image: "assets/products/Mayze-Sneakers-Women(BLACKWHITE).jpg",
                    sizes: {
                        "EU 39 / US 6": 4899.0,
                        "EU 40 / US 7": 4899.0,
                        "EU 41 / US 8": 4899.0,
                        "EU 42 / US 9": 4999.0,
                        "EU 44 / US 11": 4999.0,
                        "EU 45 / US 12": 4999.0,
                    },
                },
                WhitePeyote: {
                    image: "assets/products/Mayze-Sneakers-Women(WHITEPEYOTE).jpg",
                    sizes: {
                        "EU 39 / US 6": 4899.0,
                        "EU 40 / US 7": 4899.0,
                        "EU 41 / US 8": 4899.0,
                        "EU 42 / US 9": 4899.0,
                        "EU 43 / US 10": 4899.0,
                        "EU 44 / US 11": 4999.0,
                    },
                },
                WhitePink: {
                    image: "assets/products/Mayze-Sneakers-Women(WHITEPINK).jpg",
                    sizes: {
                        "EU 39 / US 6": 4899.0,
                        "EU 40 / US 7": 4899.0,
                        "EU 41 / US 8": 4899.0,
                        "EU 42 / US 9": 4899.0,
                        "EU 43 / US 10": 4899.0,
                        "EU 44 / US 11": 4999.0,
                    },
                },
            },
        },
    },
    {
        id: 17,
        name: "Omega Trainer",
        description: "Converse Omega Trainer sneakers combine classic design with modern comfort. Perfect for unisex daily wear.",
        rating: 4.8,
        soldAmount: 245,
        images: [
            "assets/products/0802-CONA13320C12W09H-4(new angle1).jpg",
            "assets/products/0802-CONA13323C00W09H-3(new angle2).jpg",
        ],
        variations: {
            color: {
                Blue: {
                    image: "assets/products/0802-CONA13320C12W09H-1(BLUE).jpg",
                    sizes: {
                        "EU 39 / US 6": 3899.0,
                        "EU 40 / US 7": 3899.0,
                        "EU 41 / US 8": 3899.0,
                        "EU 42 / US 9": 3899.0,
                        "EU 44 / US 11": 3899.0,
                        "EU 45 / US 12": 3899.0,
                    },
                },
                DirtyWhite: {
                    image: "assets/products/0802-CONA13323C00W09H-1(DIRTYWHITE).jpg",
                    sizes: {
                        "EU 39 / US 6": 3899.0,
                        "EU 40 / US 7": 3899.0,
                        "EU 41 / US 8": 3899.0,
                        "EU 42 / US 9": 3899.0,
                        "EU 43 / US 10": 3899.0,
                        "EU 44 / US 11": 3899.0,
                    },
                },
            },
        },
    },
    {
        id: 18,
        name: "SOFTRIDE Harli Slip-On Running Shoes Women",
        description:
            "Slip-on style meets premium comfort with SOFTRIDE Harli. Cushioned, lightweight, and perfect for everyday wear.",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "assets/products/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women(ANGLE1).jpg",
            "assets/products/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women(ANGLE2).jpg",
        ],
        variations: {
            color: {
                WhiteAlmond: {
                    image: "assets/products/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women(WHITEALMOND).jpg",
                    sizes: {
                        "EU 39 / US 6": 8350.0,
                        "EU 40 / US 7": 8350.0,
                        "EU 41 / US 8": 8350.0,
                        "EU 42 / US 9": 8350.0,
                        "EU 44 / US 11": 8350.0,
                        "EU 45 / US 12": 8450.0,
                    },
                },
                Black: {
                    image: "assets/products/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women(BLACK).jpg",
                    sizes: {
                        "EU 39 / US 6": 8350.0,
                        "EU 40 / US 7": 8350.0,
                        "EU 41 / US 8": 8350.0,
                        "EU 42 / US 9": 8350.0,
                        "EU 43 / US 10": 8350.0,
                        "EU 44 / US 11": 8350.0,
                    },
                },
            },
        },
    },
    {
        id: 19,
        name: "Scuderia Ferrari Palermo Sneakers Unisex",
        description:
            "Tribute to Ferrari’s racing heritage, combining motorsport-inspired design with comfort and durability for everyday wear.",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "assets/products/Scuderia-Ferrari-Palermo-Sneakers-Unisex(ANGLE1).jpg",
            "assets/products/Scuderia-Ferrari-Palermo-Sneakers-Unisex(ANGLE2).jpg",
        ],
        variations: {
            color: {
                BlackRed: {
                    image: "assets/products/Scuderia-Ferrari-Palermo-Sneakers-Unisex(BLACKRED).jpg",
                    sizes: {
                        "EU 40 / US 7": 10000.0,
                        "EU 41 / US 8": 10000.0,
                        "EU 42 / US 9": 10000.0,
                        "EU 44 / US 11": 10000.0,
                        "EU 45 / US 12": 10000.0,
                    },
                },
            },
        },
    },
    {
        id: 20,
        name: "ForeverRun NITRO™ Women's Running Shoes",
        description: "The ForeverRun NITRO™ provides cushioned support, stability, and comfort for all-day running performance.",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "assets/products/ForeverRun-NITRO™-Women_s-Running-Shoes(ANGLE1).jpg",
            "assets/products/ForeverRun-NITRO™-Women_s-Running-Shoes(ANGLE2).jpg",
        ],
        variations: {
            color: {
                BlackOrange: {
                    image: "assets/products/ForeverRun-NITRO™-Women_s-Running-Shoes(BLACKORANGE).jpg",
                    sizes: {
                        "EU 39 / US 6": 8700.0,
                        "EU 40 / US 7": 8700.0,
                        "EU 41 / US 8": 8700.0,
                        "EU 42 / US 9": 8700.0,
                        "EU 44 / US 11": 8700.0,
                        "EU 45 / US 12": 8700.0,
                    },
                },
            },
        },
    },
];

export function preloadImages() {
    const urls = [];

    products.forEach((product) => {
        // Add main images
        urls.push(...product.images);

        // Add variations images
        if (product.variations && product.variations.color) {
            Object.values(product.variations.color).forEach((variation) => {
                urls.push(variation.image);
            });
        }
    });

    urls.forEach((url) => {
        const img = new Image();
        img.src = url; // browser preloads
    });
}
