import { html } from "../utils/helpers.js";

export const products = [
    {
        id: 1,
        name: "Nike Vomero Plus",
        description: "Lightweight and breathable running shoes with excellent cushioning. Perfect for daily runs.",
        rating: 4.8,
        soldAmount: 152,
        images: [
            "https://static.nike.com/a/images/t_prod/w_1536,c_auto,ar_4:5,f_auto,q_auto/92157896-f9c6-4896-8b36-0b28300e08a6/image.jpg",
            "https://static.nike.com/a/images/t_prod/w_1536,c_auto,ar_4:5,f_auto,q_auto/f5814d75-8b67-4309-bf32-0d3cc8d3ffb4/image.jpg",
        ],
        banner: html`
            <div
                class="banner-slide"
                style="background-image: url('https://cdn.runrepeat.com/storage/gallery/buying_guide_primary/53/53-best-running-shoes-15275001-main.jpg');"
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
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85de931f-e2cd-4b0b-83c8-9d2467c9fe7e/NIKE+VOMERO+PLUS.png",
                    sizes: { "EU 39 / US 6": 2800.0, "EU 40 / US 7": 2800.0, "EU 41 / US 8": 2850.0, "EU 42 / US 9": 2850.0 },
                },
                WhiteBlue: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/18471e76-40a7-4f03-9701-47e641fe99b0/NIKE+VOMERO+PLUS.png",
                    sizes: { "EU 40 / US 7": 2900.0, "EU 41 / US 8": 2900.0, "EU 42 / US 9": 2950.0 },
                },
                White: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/b21dd621-0eeb-4825-a483-b1342dbacee0/NIKE+VOMERO+PLUS.png",
                    sizes: { "EU 38 / US 5": 2750.0, "EU 39 / US 6": 2750.0, "EU 40 / US 7": 2750.0 },
                },
                Orange: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/c174f890-8fbb-4ee4-bb61-dec2f02f301d/NIKE+VOMERO+PLUS.png",
                    sizes: { "EU 38 / US 5": 2750.0, "EU 39 / US 6": 2750.0, "EU 40 / US 7": 2750.0 },
                },
            },
        },
    },
    {
        id: 2,
        name: "Nike SB Zoom Janoski OG",
        description: "Skate Shoes.",
        rating: 4.9,
        soldAmount: 124,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/e4b230aa-97ce-4a3c-8f58-9f82dab07943/NIKE+SB+ZOOM+JANOSKI+OG%2B.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/fc4f7027-ad52-4566-8da9-87c87224ad8b/NIKE+SB+ZOOM+JANOSKI+OG%2B.png",
        ],
        banner: html`
            <div
                class="banner-slide"
                style="background-image: url('https://whattowearmen.com/wp-content/uploads/2021/09/Nike-2.png');"
            >
                <div class="banner-content">
                    <h1>Go Out With Style</h1>
                    <p>Browse stylish shoes just for you!</p>
                    <button class="btn btn-primary btn-lg banner-buy-now-btn" data-product-id="2">Shop Now</button>
                </div>
            </div>
        `,
        variations: {
            color: {
                Black: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1de56bb8-71e8-4831-8a80-849ea3b3781a/NIKE+SB+ZOOM+JANOSKI+OG%2B.png    ",
                    sizes: { "EU 39 / US 6": 4850.0, "EU 40 / US 7": 4850.0, "EU 41 / US 8": 4900.0, "EU 42 / US 9": 5199.0 },
                },
                Blue: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/026fbb06-5b67-491d-b9d7-18084cc73ffe/NIKE+SB+ZOOM+JANOSKI+OG%2B.png",
                    sizes: { "EU 40 / US 7": 4850.0, "EU 41 / US 8": 4850.0, "EU 42 / US 9": 4950.0 },
                },
                White: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1a063d4a-c5e8-4cfd-b93a-61d59dd4201b/NIKE+SB+ZOOM+JANOSKI+OG%2B.png",
                    sizes: { "EU 38 / US 5": 4599.0, "EU 39 / US 6": 4599.0, "EU 40 / US 7": 4599.0 },
                },
            },
        },
    },
    {
        id: 3,
        name: "Air Jordan 1 Retro High OG 'Black and Gold'",
        description: "Stylish Shoes.",
        rating: 5.0,
        soldAmount: 125,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a9703036-b051-4091-b173-dcf89b1bac65/AIR+JORDAN+1+RETRO+HIGH+OG.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e65dd64d-6a0a-4f4d-9227-840a89d9145a/AIR+JORDAN+1+RETRO+HIGH+OG.png",
        ],
        variations: {
            color: {
                Gold: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/849566c0-f04e-4742-96f1-8f6ca677f246/AIR+JORDAN+1+RETRO+HIGH+OG.png",
                    sizes: { "EU 39 / US 6": 7199.0, "EU 40 / US 7": 7199.0, "EU 41 / US 8": 7299.0, "EU 42 / US 9": 7599.0 },
                },
                Orange: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5c46baf6-cbcf-48cf-a2a8-f8f2e7f84e38/AIR+JORDAN+1+RETRO+HIGH+OG.png",
                    sizes: { "EU 40 / US 7": 7199.0, "EU 41 / US 8": 7299.0, "EU 42 / US 9": 7599.0 },
                },
            },
        },
    },
    {
        id: 4,
        name: "Nike Winflo 10",
        description: "Stylish Shoes.",
        rating: 4.0,
        soldAmount: 411,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/83964243-fd27-47eb-a5a6-d13fa8924358/AIR+WINFLO+10.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/8cced1f6-f6d8-4f55-afa7-36a2948f2ba4/AIR+WINFLO+10.png",
        ],
        variations: {
            color: {
                Black: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/77049a0c-3c99-4ca7-8264-4ea238435140/AIR+WINFLO+10.png ",
                    sizes: { "EU 39 / US 6": 3199.0, "EU 40 / US 7": 3199.0, "EU 41 / US 8": 3199.0, "EU 42 / US 9": 3199.0 },
                },
                White: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/51833e97-f4d6-4063-a0cc-0ab6d6a03ad6/AIR+WINFLO+10.png",
                    sizes: { "EU 40 / US 7": 3199.0, "EU 41 / US 8": 3199.0, "EU 42 / US 9": 3199.0 },
                },
                WhiteOrange: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4fc878d1-17fd-4db2-b336-dd57a2923a76/AIR+WINFLO+10.png",
                    sizes: { "EU 40 / US 7": 3199.0, "EU 41 / US 8": 3199.0, "EU 42 / US 9": 3199.0 },
                },
            },
        },
    },
    {
        id: 5,
        name: "Velvet Brown and Safety Orange",
        description: "Women's LD-1000",
        rating: 5.0,
        soldAmount: 132,
        images: [
            "https://static.nike.com/a/images/w_1280,q_auto,f_auto/ae95334b-19d9-47e1-9acc-dd13ab32cba0/women-s-ld-1000-velvet-brown-and-safety-orange-im9008-201-release-date.jpg",
            "https://static.nike.com/a/images/w_1280,q_auto,f_auto/2de47a77-85b7-419d-a1af-e1c95b2b4f38/women-s-ld-1000-velvet-brown-and-safety-orange-im9008-201-release-date.jpg",
        ],
        variations: {
            color: {
                Brown: {
                    image: "https://static.nike.com/a/images/w_1280,q_auto,f_auto/285de7db-ab4e-445e-8691-9a791d019681/women-s-ld-1000-velvet-brown-and-safety-orange-im9008-201-release-date.jpg ",
                    sizes: { "EU 39 / US 6": 8199.0, "EU 40 / US 7": 8199.0, "EU 41 / US 8": 8199.0, "EU 42 / US 9": 8199.0 },
                },
            },
        },
    },
    {
        id: 6,
        name: "Nike React SFB Carbon",
        description: "Men's Elite Outdoor Shoes",
        rating: 3.9,
        soldAmount: 231,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/b6c70eb0-e81a-49ff-ab8f-69dbf5da8f16/NIKE+REACT+SFB+CARBON.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/73fbdc5c-2eaa-4960-a122-e901e74347c5/NIKE+REACT+SFB+CARBON.png",
        ],
        variations: {
            color: {
                Brown: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/8f2bd7e0-31fe-4a08-a4fe-ba0e448ae333/NIKE+REACT+SFB+CARBON.png ",
                    sizes: {
                        "EU 39 / US 6": 8995.0,
                        "EU 40 / US 7": 8995.0,
                        "EU 41 / US 8": 8995.0,
                        "EU 42 / US 9": 8995.0,
                        "EU 43/ US 10": 8995.0,
                    },
                },
                Black: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/212bbb31-44ed-42be-9a29-e6d046e30e0d/NIKE+REACT+SFB+CARBON.png ",
                    sizes: { "EU 39 / US 6": 8995.0, "EU 40 / US 7": 8995.0, "EU 41 / US 8": 8995.0, "EU 42 / US 9": 8995.0 },
                },
            },
        },
    },
    {
        id: 7,
        name: "LeBron TR 1",
        description: "Men's Workout Shoes",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ee114b63-75e2-4a22-818f-ad479e6af8e2/LEBRON+TR+1.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ff8538a0-c1db-4a3b-ba15-1cc454ca5372/LEBRON+TR+1.png",
        ],
        variations: {
            color: {
                GoldWhite: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ef37d2c2-a9e3-458e-936d-a38e7704337f/LEBRON+TR+1.png ",
                    sizes: {
                        "EU 39 / US 6": 7350.0,
                        "EU 40 / US 7": 7350.0,
                        "EU 41 / US 8": 7350.0,
                        "EU 42 / US 9": 7350.0,
                        "EU 44/ US 11": 7350.0,
                        "EU 45/ US 12": 7450.0,
                    },
                },
                Green: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/233e7b1c-9caa-4fa0-bd92-5510b2df6715/LEBRON+TR+1.png",
                    sizes: {
                        "EU 39 / US 6": 7350.0,
                        "EU 40 / US 7": 7350.0,
                        "EU 41 / US 8": 7350.0,
                        "EU 42 / US 9": 7350.0,
                        "EU 43/ US 10": 7350.0,
                        "EU 44/ US 11": 7350.0,
                    },
                },
            },
        },
    },
    {
        id: 8,
        name: "VL Court 3.0 Shoes",
        description: "Men's Sportswear",
        rating: 4.5,
        soldAmount: 245,
        images: [
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/35251a3e35e3422981a61093dcbaaeca_9366/VL_Court_3.0_Shoes_Black_JR8609_04_standard.jpg",
            "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/d54e88ff98b4445ea80a741d11e670f6_9366/VL_COURT_3.0_SHOES_White_JS1850_02_standard_hover.jpg",
        ],
        variations: {
            color: {
                Black: {
                    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/35251a3e35e3422981a61093dcbaaeca_9366/VL_Court_3.0_Shoes_Black_JR8609_04_standard.jpg",
                    sizes: {
                        "EU 39 / US 6": 4299.0,
                        "EU 40 / US 7": 4299.0,
                        "EU 41 / US 8": 4299.0,
                        "EU 42 / US 9": 4299.0,
                        "EU 44/ US 11": 4499.0,
                        "EU 45/ US 12": 4550.0,
                    },
                },
                OffWhite: {
                    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/74cc58a765af40888d710786fc2c6385_9366/VL_COURT_3.0_SHOES_White_JS1850_01_00_standard.jpg",
                    sizes: {
                        "EU 39 / US 6": 4299.0,
                        "EU 40 / US 7": 4299.0,
                        "EU 41 / US 8": 4299.0,
                        "EU 42 / US 9": 4299.0,
                        "EU 43/ US 10": 4299.0,
                        "EU 44/ US 11": 4499.0,
                    },
                },
            },
        },
    },
    {
        id: 9,
        name: "Run Star Hike Canvas Platform Shoes - Black",
        description: "A fashion-forward reimagination of classic Chucks",
        rating: 3.9,
        soldAmount: 153,
        images: [
            "https://www.converse.ph/media/catalog/product/cache/81be3f71803e8b19243c0cf4508ce3b1/0/8/0802-CON166800C000003-3.jpg",
            "https://www.converse.ph/media/catalog/product/cache/81be3f71803e8b19243c0cf4508ce3b1/0/8/0802-CON166800C000003-5.jpg",
        ],
        variations: {
            color: {
                Black: {
                    image: "https://www.converse.ph/media/catalog/product/cache/ae7cee22ac1ff58c2794c87414f27b45/0/8/0802-CON166800C000003-2.jpg",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 44/ US 11": 5499.0,
                        "EU 45/ US 12": 5499.0,
                    },
                },
            },
        },
    },
    {
        id: 10,
        name: "Nike SB PS8",
        description: "Men's Shoes",
        rating: 4.4,
        soldAmount: 245,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/96658684-bdaf-4b58-a2fd-59c42fda9f01/NIKE+SB+PS8.png.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/28c8eb9f-208a-46bc-827b-af47eae003d4/NIKE+SB+PS8.png.png",
        ],
        variations: {
            color: {
                Black: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/735593be-d93f-4159-ba15-516a69d3f53f/NIKE+SB+PS8.png.png ",
                    sizes: {
                        "EU 39 / US 6": 3499.0,
                        "EU 40 / US 7": 3499.0,
                        "EU 41 / US 8": 3499.0,
                        "EU 42 / US 9": 3699.0,
                        "EU 44/ US 11": 3799.0,
                        "EU 45/ US 12": 3799.0,
                    },
                },
                Blue: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1c87112f-39d1-41a2-9fb6-1d1f57daea24/NIKE+SB+PS8.png.png",
                    sizes: {
                        "EU 39 / US 6": 3499.0,
                        "EU 40 / US 7": 3499.0,
                        "EU 41 / US 8": 3499.0,
                        "EU 42 / US 9": 3699.0,
                        "EU 43/ US 10": 3799.0,
                        "EU 44/ US 11": 3799.0,
                    },
                },
            },
        },
    },
    {
        id: 11,
        name: "Nike Run Defy",
        description: "Women's Road Running Shoes",
        rating: 4.9,
        soldAmount: 245,
        images: [
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/00daec37-330c-4fda-9efb-2628f15f7a6f/W+NIKE+RUN+DEFY.png.png",
            "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/1eae7698-22bc-448d-8990-7ad16d272b3a/W+NIKE+RUN+DEFY.png.png",
        ],
        variations: {
            color: {
                White: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/71c044e6-b2e4-4989-b11a-0f850b1951be/W+NIKE+RUN+DEFY.png.png ",
                    sizes: {
                        "EU 39 / US 6": 2459.0,
                        "EU 40 / US 7": 2459.0,
                        "EU 41 / US 8": 2459.0,
                        "EU 42 / US 9": 2599.0,
                        "EU 44/ US 11": 2599.0,
                        "EU 45/ US 12": 2599.0,
                    },
                },
                Black: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/5192a79c-da4a-4032-8e5e-f1b9356336d0/W+NIKE+RUN+DEFY.png.png",
                    sizes: {
                        "EU 39 / US 6": 2459.0,
                        "EU 40 / US 7": 2459.0,
                        "EU 41 / US 8": 2459.0,
                        "EU 42 / US 9": 2599.0,
                        "EU 43/ US 10": 2599.0,
                        "EU 44/ US 11": 2599.0,
                    },
                },
                CyberPink: {
                    image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/c7e20774-8cd0-461b-9929-c38122f0fdf4/W+NIKE+RUN+DEFY.png.png",
                    sizes: {
                        "EU 39 / US 6": 2459.0,
                        "EU 40 / US 7": 2459.0,
                        "EU 41 / US 8": 2459.0,
                        "EU 42 / US 9": 2599.0,
                        "EU 43/ US 10": 2599.0,
                        "EU 44/ US 11": 2599.0,
                    },
                },
            },
        },
    },
    {
        id: 12,
        name: "Softride Enzo 5 Metallic Running Shoes Women",
        description: "Unleash your bold side with the new Softride Enzo 5, made specifically for women",
        rating: 4.5,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310473/01/sv04/fnd/PHL/fmt/png/Softride-Enzo-5-Metallic-Running-Shoes-Women.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310473/02/sv02/fnd/PHL/fmt/png/Softride-Enzo-5-Metallic-Running-Shoes-Women.png",
        ],
        variations: {
            color: {
                WhiteGold: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310473/02/sv01/fnd/PHL/fmt/png/Softride-Enzo-5-Metallic-Running-Shoes-Women.png ",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 44/ US 11": 5699.0,
                        "EU 45/ US 12": 5750.0,
                    },
                },
                BlackGold: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310473/01/sv01/fnd/PHL/fmt/png/Softride-Enzo-5-Metallic-Running-Shoes-Women.png",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 43/ US 10": 5499.0,
                        "EU 44/ US 11": 5699.0,
                    },
                },
                WhitePink: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310473/05/sv01/fnd/PHL/fmt/png/Softride-Enzo-5-Metallic-Running-Shoes-Women.png",
                    sizes: {
                        "EU 39 / US 6": 5499.0,
                        "EU 40 / US 7": 5499.0,
                        "EU 41 / US 8": 5499.0,
                        "EU 42 / US 9": 5499.0,
                        "EU 43/ US 10": 5499.0,
                        "EU 44/ US 11": 5699.0,
                    },
                },
            },
        },
    },
    {
        id: 13,
        name: "Roma 24 Sneakers Unisex",
        description: "Unleash your bold side with the new Softride Enzo 5, made specifically for women",
        rating: 4.8,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396868/03/sv04/fnd/PHL/fmt/png/Roma-24-Sneakers-Unisex.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396868/01/sv04/fnd/PHL/fmt/png/Roma-24-Sneakers-Unisex.png",
        ],
        variations: {
            color: {
                White: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396868/03/sv01/fnd/PHL/fmt/png/Roma-24-Sneakers-Unisex.png ",
                    sizes: {
                        "EU 39 / US 6": 6199.0,
                        "EU 40 / US 7": 6199.0,
                        "EU 41 / US 8": 6199.0,
                        "EU 42 / US 9": 6199.0,
                        "EU 44/ US 11": 6399.0,
                        "EU 45/ US 12": 6499.0,
                    },
                },
                BlackWhite: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396868/01/sv01/fnd/PHL/fmt/png/Roma-24-Sneakers-Unisex.png",
                    sizes: {
                        "EU 39 / US 6": 6199.0,
                        "EU 40 / US 7": 6199.0,
                        "EU 41 / US 8": 6199.0,
                        "EU 42 / US 9": 6199.0,
                        "EU 43/ US 10": 6199.0,
                        "EU 44/ US 11": 6399.0,
                    },
                },
            },
        },
    },
    {
        id: 14,
        name: "Pulsar Wedge Monogram Women",
        description: "Feel the power. Inspired by hip hop legends from the early 2000's",
        rating: 4.9,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396633/02/sv04/fnd/PHL/fmt/png/Pulsar-Wedge-Monogram-Women.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396633/02/sv02/fnd/PHL/fmt/png/Pulsar-Wedge-Monogram-Women.png",
        ],
        variations: {
            color: {
                PristinePrairie: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/396633/02/sv01/fnd/PHL/fmt/png/Pulsar-Wedge-Monogram-Women.png ",
                    sizes: {
                        "EU 39 / US 6": 3499.0,
                        "EU 40 / US 7": 3499.0,
                        "EU 41 / US 8": 3499.0,
                        "EU 42 / US 9": 3499.0,
                        "EU 44/ US 11": 3599.0,
                        "EU 45/ US 12": 3499.0,
                    },
                },
            },
        },
    },
    {
        id: 15,
        name: "Porsche Legacy Palermo Pinstripe Sneakers",
        description:
            "Step into the past with a modern twist. Featuring a nylon base, premium suede overlays, and a leather Formstrip",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308647/01/sv04/fnd/PHL/fmt/png/Porsche-Legacy-Palermo-Pinstripe-Sneakers.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308647/02/bv/fnd/PHL/fmt/png/Porsche-Legacy-Palermo-Pinstripe-Sneakers.png",
        ],
        variations: {
            color: {
                BlackGreen: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308647/01/sv01/fnd/PHL/fmt/png/Porsche-Legacy-Palermo-Pinstripe-Sneakers.png ",
                    sizes: {
                        "EU 39 / US 6": 9450.0,
                        "EU 40 / US 7": 9450.0,
                        "EU 41 / US 8": 9450.0,
                        "EU 42 / US 9": 9450.0,
                        "EU 44/ US 11": 9450.0,
                        "EU 45/ US 12": 9650.0,
                    },
                },
                WhiteAlpine: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308647/02/sv01/fnd/PHL/fmt/png/Porsche-Legacy-Palermo-Pinstripe-Sneakers.png",
                    sizes: {
                        "EU 39 / US 6": 9450.0,
                        "EU 40 / US 7": 9450.0,
                        "EU 41 / US 8": 9450.0,
                        "EU 42 / US 9": 9450.0,
                        "EU 43/ US 10": 9450.0,
                        "EU 44/ US 11": 9450.0,
                    },
                },
            },
        },
    },
    {
        id: 16,
        name: "Mayze Sneakers Women",
        description:
            "Elevate your street style with the Mayze platform sneakers. These trendy platform sneakers offer a bold and stylish look",
        rating: 3.9,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/381983/02/fnd/PHL/fmt/png/Mayze-Sneakers-Women.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/381983/01/bv/fnd/PHL/fmt/png/Mayze-Sneakers-Women.png",
        ],
        variations: {
            color: {
                BlackWhite: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/381983/01/sv01/fnd/PHL/fmt/png/Mayze-Sneakers-Women.png ",
                    sizes: {
                        "EU 39 / US 6": 4899.0,
                        "EU 40 / US 7": 4899.0,
                        "EU 41 / US 8": 4899.0,
                        "EU 42 / US 9": 4999.0,
                        "EU 44/ US 11": 4999.0,
                        "EU 45/ US 12": 4999.0,
                    },
                },
                WhitePeyote: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/381983/02/sv01/fnd/PHL/fmt/png/Mayze-Sneakers-Women.png",
                    sizes: {
                        "EU 39 / US 6": 4899.0,
                        "EU 40 / US 7": 4899.0,
                        "EU 41 / US 8": 4899.0,
                        "EU 42 / US 9": 4899.0,
                        "EU 43/ US 10": 4899.0,
                        "EU 44/ US 11": 4999.0,
                    },
                },
                WhitePink: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/381983/46/sv01/fnd/PHL/fmt/png/Mayze-Sneakers-Women.png",
                    sizes: {
                        "EU 39 / US 6": 4899.0,
                        "EU 40 / US 7": 4899.0,
                        "EU 41 / US 8": 4899.0,
                        "EU 42 / US 9": 4899.0,
                        "EU 43/ US 10": 4899.0,
                        "EU 44/ US 11": 4999.0,
                    },
                },
            },
        },
    },
    {
        id: 17,
        name: "Omega Trainer",
        description: "Converse Omega Trainer Unisex Sneakers - Yeti Blue/Slacker",
        rating: 4.8,
        soldAmount: 245,
        images: [
            "https://www.converse.ph/media/catalog/product/cache/81be3f71803e8b19243c0cf4508ce3b1/0/8/0802-CONA13320C12W09H-4.jpg",
            "https://www.converse.ph/media/catalog/product/cache/81be3f71803e8b19243c0cf4508ce3b1/0/8/0802-CONA13323C00W09H-3.jpg",
        ],
        variations: {
            color: {
                Blue: {
                    image: "https://www.converse.ph/media/catalog/product/cache/ae7cee22ac1ff58c2794c87414f27b45/0/8/0802-CONA13320C12W09H-1.jpg",
                    sizes: {
                        "EU 39 / US 6": 3899.0,
                        "EU 40 / US 7": 3899.0,
                        "EU 41 / US 8": 3899.0,
                        "EU 42 / US 9": 3899.0,
                        "EU 44/ US 11": 3899.0,
                        "EU 45/ US 12": 3899.0,
                    },
                },
                DirtyWhite: {
                    image: "https://www.converse.ph/media/catalog/product/cache/ae7cee22ac1ff58c2794c87414f27b45/0/8/0802-CONA13323C00W09H-1.jpg",
                    sizes: {
                        "EU 39 / US 6": 3899.0,
                        "EU 40 / US 7": 3899.0,
                        "EU 41 / US 8": 3899.0,
                        "EU 42 / US 9": 3899.0,
                        "EU 43/ US 10": 3899.0,
                        "EU 44/ US 11": 3899.0,
                    },
                },
            },
        },
    },
    {
        id: 18,
        name: "SOFTRIDE Harli Slip-On Running Shoes Women",
        description:
            "Effortless style meets comfort with these slip-on shoes. Featuring SOFTRIDE cushioning, our SOFTFOAM+ sockliner, and zoned traction",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/311471/05/sv04/fnd/PHL/fmt/png/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/311471/01/bv/fnd/PHL/fmt/png/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women.png",
        ],
        variations: {
            color: {
                WhiteAlmond: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/311471/05/sv01/fnd/PHL/fmt/png/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women.png ",
                    sizes: {
                        "EU 39 / US 6": 8350.0,
                        "EU 40 / US 7": 8350.0,
                        "EU 41 / US 8": 8350.0,
                        "EU 42 / US 9": 8350.0,
                        "EU 44/ US 11": 8350.0,
                        "EU 45/ US 12": 8450.0,
                    },
                },
                Black: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/311471/01/sv01/fnd/PHL/fmt/png/SOFTRIDE-Harli-Slip-On-Running-Shoes-Women.png",
                    sizes: {
                        "EU 39 / US 6": 8350.0,
                        "EU 40 / US 7": 8350.0,
                        "EU 41 / US 8": 8350.0,
                        "EU 42 / US 9": 8350.0,
                        "EU 43/ US 10": 8350.0,
                        "EU 44/ US 11": 8350.0,
                    },
                },
            },
        },
    },
    {
        id: 19,
        name: "Scuderia Ferrari Palermo Sneakers Unisex",
        description:
            "The PUMA and Scuderia Ferrari collection is a tribute to motorsport excellence and Ferrari's legendary racing heritage.",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308899/01/sv04/fnd/PHL/fmt/png/Scuderia-Ferrari-Palermo-Sneakers-Unisex.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308899/01/bv/fnd/PHL/fmt/png/Scuderia-Ferrari-Palermo-Sneakers-Unisex.png",
        ],
        variations: {
            color: {
                BlackRed: {
                    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/308899/01/sv01/fnd/PHL/fmt/png/Scuderia-Ferrari-Palermo-Sneakers-Unisex.png ",
                    sizes: {
                        "EU 40 / US 7": 10000.0,
                        "EU 41 / US 8": 10000.0,
                        "EU 42 / US 9": 10000.0,
                        "EU 44/ US 11": 10000.0,
                        "EU 45/ US 12": 10000.0,
                    },
                },
            },
        },
    },
    {
        id: 20,
        name: "ForeverRun NITRO™ Women's Running Shoes",
        description:
            "The ForeverRun NITRO™ dawns a new era of support and guidance for all runners, providing the softness of a full NITRO™ midsole without compromising stability.",
        rating: 5.0,
        soldAmount: 245,
        images: [
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/377758/19/sv04/fnd/PHL/fmt/png/ForeverRun-NITRO%E2%84%A2-Women's-Running-Shoes.png",
            "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/377758/19/bv/fnd/PHL/fmt/png/ForeverRun-NITRO%E2%84%A2-Women's-Running-Shoes.png",
        ],
        variations: {
            color: {
                WhiteAlmond: {
                    BlackRed:
                        "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/377758/19/sv01/fnd/PHL/fmt/png/ForeverRun-NITRO%E2%84%A2-Women's-Running-Shoes.png ",
                    sizes: {
                        "EU 39 / US 6": 8700.0,
                        "EU 40 / US 7": 8700.0,
                        "EU 41 / US 8": 8700.0,
                        "EU 42 / US 9": 8700.0,
                        "EU 44/ US 11": 8700.0,
                        "EU 45/ US 12": 8700.0,
                    },
                },
            },
        },
    },
];
