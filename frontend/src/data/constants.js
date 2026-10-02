// Zion Food Corner - Constants & Master Data

export const RESTAURANT_INFO = {
  name: "Zion Food Corner",
  category: "Fast Food",
  rating: 5.0,
  reviewCount: 3,
  phone: "098867 64280",
  rawPhone: "09886764280",
  status: "Open Now",
  statusHours: "11:00 AM - 11:00 PM",
  statusNote: "Open daily for dine-in, takeaway, and fast home delivery!",
  address: {
    line1: "45, 4th Main Rd, Corporation",
    line2: "Ashwath Nagar, Sampangi Rama Nagara",
    area: "S R Nagar, Bengaluru",
    stateAndZip: "Karnataka 560027",
    full: "45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru, Karnataka 560027"
  },
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027",
  aboutText: "Zion Food Corner is a local fast-food restaurant serving affordable Indian favourites including biryani, fried rice, noodles, chicken dishes and vegetarian dishes.",
  subtitle: "Delicious Food at Affordable Prices",
  heroDescription: "Enjoy delicious biryani, fried rice, noodles, chicken dishes, and popular Indian favourites at affordable prices."
};

export const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Items", icon: "fas fa-utensils" },
  { id: "rice-biryani", name: "Rice & Biryani", icon: "fas fa-bowl-rice" },
  { id: "fried-rice", name: "Fried Rice", icon: "fas fa-fire-burner" },
  { id: "noodles", name: "Noodles", icon: "fas fa-bowl-food" },
  { id: "chicken-items", name: "Chicken Items", icon: "fas fa-drumstick-bite" },
  { id: "veg-items", name: "Veg Items", icon: "fas fa-leaf" },
  { id: "indian-favourites", name: "Indian Favourites", icon: "fas fa-heart" }
];

export const DEFAULT_COUPONS = [
  {
    code: "ZION50",
    discountType: "percentage",
    value: 50,
    maxDiscount: 100,
    minOrder: 199,
    description: "50% OFF up to ₹100 on orders above ₹199"
  },
  {
    code: "WELCOME10",
    discountType: "percentage",
    value: 10,
    maxDiscount: 50,
    minOrder: 99,
    description: "10% OFF on all orders above ₹99"
  },
  {
    code: "BIRYANI20",
    discountType: "fixed",
    value: 20,
    minOrder: 70,
    description: "₹20 OFF on Biryani orders above ₹70"
  }
];

export const FALLBACK_MENU_ITEMS = [
  {
    id: 1,
    name: "Chicken Biryani",
    price: 70.00,
    category: "rice-biryani",
    categoryLabel: "Rice & Biryani",
    isVeg: false,
    isPopular: true,
    description: "Delicious aromatic chicken biryani prepared with seasoned basmati rice, tender chicken pieces, and traditional whole spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-food-cooking-in-a-pot-43409-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    tags: ["Chef Special", "Bestseller", "Aromatic"],
    cookingTime: "35 mins",
    technique: "Dum Pukht Slow Steam",
    spiceLevel: "Medium Spicy 🔥🔥",
    ingredients: [
      { name: "Basmati Rice", icon: "🍚" },
      { name: "Tender Chicken", icon: "🍗" },
      { name: "Desi Ghee", icon: "🧈" },
      { name: "Whole Spices", icon: "🌿" },
      { name: "Fried Onions", icon: "🧅" },
      { name: "Saffron & Mint", icon: "🌱" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Marination & Spice Infusion",
        desc: "Fresh chicken pieces are marinated in thick curd, ginger-garlic paste, red chili, and ground aromatic garam masala.",
        actionText: "Marinating in rich yogurt & whole spices..."
      },
      {
        step: 2,
        title: "Layering with Fragrant Saffron Rice",
        desc: "Par-boiled long-grain basmati is layered over the spiced chicken with saffron milk, pure ghee, and crispy fried birista onions.",
        actionText: "Layering fluffy saffron rice & ghee..."
      },
      {
        step: 3,
        title: "Dum Steam Cooking to Perfection",
        desc: "The handi pot is tightly sealed to trap the steam, allowing every grain to absorb the deep chicken juices and herbal aromas.",
        actionText: "Dum steaming on glowing embers..."
      }
    ]
  },
  {
    id: 2,
    name: "Egg Biryani",
    price: 50.00,
    category: "rice-biryani",
    categoryLabel: "Rice & Biryani",
    isVeg: false,
    isPopular: false,
    description: "Fragrant spiced biryani rice served with golden pan-roasted boiled eggs and aromatic Indian herbs.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-sizzling-in-a-hot-pan-43406-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    tags: ["Protein Rich", "Spiced"],
    cookingTime: "20 mins",
    technique: "Tawa Pan Roast & Dum Mix",
    spiceLevel: "Mild-Medium 🔥",
    ingredients: [
      { name: "Farm Fresh Eggs", icon: "🥚" },
      { name: "Spiced Biryani Rice", icon: "🍚" },
      { name: "Turmeric & Chili", icon: "🌶️" },
      { name: "Golden Onions", icon: "🧅" },
      { name: "Fresh Mint", icon: "🌿" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Golden Tawa Pan Roasting",
        desc: "Hard-boiled farm eggs are lightly scored and flash-roasted on a hot tawa with turmeric, red chili powder, and salt until crispy golden.",
        actionText: "Pan-roasting eggs with turmeric & chili..."
      },
      {
        step: 2,
        title: "Biryani Rice Blending",
        desc: "Aromatic slow-cooked spiced biryani rice (kuska) is infused with hot masala oils and tossed with the roasted eggs.",
        actionText: "Folding fragrant spiced rice..."
      },
      {
        step: 3,
        title: "Herbal Garnish & Plating",
        desc: "Topped with fresh chopped coriander, crispy onions, and a fresh squeeze of lemon before serving piping hot.",
        actionText: "Garnishing with mint & lemon..."
      }
    ]
  },
  {
    id: 3,
    name: "Biryani Rice",
    price: 40.00,
    category: "rice-biryani",
    categoryLabel: "Rice & Biryani",
    isVeg: true,
    isPopular: false,
    description: "Flavor-infused spiced biryani rice (kuska) slow-cooked in rich masala broth with saffron and mint essence.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-steam-rising-from-a-hot-dish-43405-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
    tags: ["Flavourful", "Budget Favourite"],
    cookingTime: "25 mins",
    technique: "Masala Stock Infusion",
    spiceLevel: "Medium Spicy 🔥🔥",
    ingredients: [
      { name: "Long-Grain Rice", icon: "🍚" },
      { name: "Cardamom & Cloves", icon: "🌿" },
      { name: "Onion-Tomato Masala", icon: "🍅" },
      { name: "Ghee", icon: "🧈" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Whole Spice Tempering",
        desc: "Bay leaves, star anise, shahi jeera, and cinnamon are sizzled in hot ghee until fragrant.",
        actionText: "Blooming whole spices in pure ghee..."
      },
      {
        step: 2,
        title: "Slow Pot Simmering",
        desc: "Basmati rice is simmered in spiced chicken-onion broth with mint and coriander paste.",
        actionText: "Simmering rice in herb stock..."
      },
      {
        step: 3,
        title: "Steam Fluffing",
        desc: "Fluffed gently with a flat ladle to keep each rice grain long, separate, and aromatic.",
        actionText: "Fluffing aromatic grains..."
      }
    ]
  },
  {
    id: 4,
    name: "Chicken Fried Rice",
    price: 60.00,
    category: "fried-rice",
    categoryLabel: "Fried Rice",
    isVeg: false,
    isPopular: true,
    description: "Classic Indo-Chinese wok-tossed fried rice with tender diced chicken, crunchy veggies, egg ribbons, and savory sauces.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stirring-food-in-a-wok-pan-43407-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    tags: ["Wok Tossed", "Bestseller", "Crunchy Veg"],
    cookingTime: "12 mins",
    technique: "High-Heat Wok Hei Toss",
    spiceLevel: "Mild-Medium 🔥",
    ingredients: [
      { name: "Seasoned Rice", icon: "🍚" },
      { name: "Chicken Chunks", icon: "🍗" },
      { name: "Scrambled Eggs", icon: "🥚" },
      { name: "Cabbage & Carrots", icon: "🥕" },
      { name: "Dark Soy & Garlic", icon: "🧄" },
      { name: "Spring Onions", icon: "🌱" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Searing Chicken in Smoking Wok",
        desc: "Boneless chicken strips and aromatics are tossed over roaring flames with crushed garlic and green chilies.",
        actionText: "Flash-frying chicken over raging flame..."
      },
      {
        step: 2,
        title: "Rice & Veggie Flash Toss",
        desc: "Chilled aged rice, crunchy shredded carrots, cabbage, and egg are added with dark soy and toasted pepper.",
        actionText: "Wok-tossing rice with soy & vegetables..."
      },
      {
        step: 3,
        title: "Final Wok Hei Glaze",
        desc: "Finished with a high-toss flip for that authentic smoky wok flavour and fresh spring onion garnish.",
        actionText: "High-heat smoky tossing..."
      }
    ]
  },
  {
    id: 5,
    name: "Egg Fried Rice",
    price: 50.00,
    category: "fried-rice",
    categoryLabel: "Fried Rice",
    isVeg: false,
    isPopular: false,
    description: "Fluffy basmati rice stir-fried in a roaring wok with seasoned scrambled eggs, spring onions, and black pepper.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-sizzling-in-a-hot-pan-43406-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    tags: ["High Protein", "Wok Tossed"],
    cookingTime: "10 mins",
    technique: "Fast Wok Scramble & Toss",
    spiceLevel: "Mild 🔥",
    ingredients: [
      { name: "Eggs", icon: "🥚" },
      { name: "Basmati Rice", icon: "🍚" },
      { name: "Black Pepper", icon: "🧂" },
      { name: "Garlic Butter", icon: "🧈" },
      { name: "Spring Onions", icon: "🌱" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Wok Scrambling Eggs",
        desc: "Fresh eggs are cracked into screaming hot oil and quickly scrambled into fluffy, seasoned ribbons.",
        actionText: "Wok-scrambling fluffy eggs..."
      },
      {
        step: 2,
        title: "Stir-Frying with Rice",
        desc: "Rice is added and tossed with black pepper, soy sauce, and diced scallions over high heat.",
        actionText: "Tossing rice & fresh pepper..."
      },
      {
        step: 3,
        title: "Spring Onion Finish",
        desc: "Garnished with crisp scallions and served piping hot straight from the wok.",
        actionText: "Plating steaming egg fried rice..."
      }
    ]
  },
  {
    id: 6,
    name: "Veg Fried Rice",
    price: 40.00,
    category: "fried-rice",
    categoryLabel: "Fried Rice",
    isVeg: true,
    isPopular: false,
    description: "Colorful garden fresh vegetables stir-fried with fragrant rice, mild oriental seasonings, and toasted sesame oil.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stirring-food-in-a-wok-pan-43407-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags: ["Pure Veg", "Crisp Veggies", "Light"],
    cookingTime: "10 mins",
    technique: "Wok Sauté & Toss",
    spiceLevel: "Mild 🔥",
    ingredients: [
      { name: "Capsicum & Beans", icon: "🫑" },
      { name: "Carrots", icon: "🥕" },
      { name: "Steamed Rice", icon: "🍚" },
      { name: "White Pepper", icon: "🧂" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Crisp Veggie Flash Sauté",
        desc: "Finely diced bell peppers, carrots, and sweet beans are flash-sautéed to preserve their crunchy snap.",
        actionText: "Flash-sautéing crisp vegetables..."
      },
      {
        step: 2,
        title: "Rice & Sauce Incorporation",
        desc: "Steamed rice is folded in with light soy sauce, white pepper, and a touch of roasted garlic.",
        actionText: "Blending rice with mild sauces..."
      },
      {
        step: 3,
        title: "Hot Plating",
        desc: "Tossed lightly to coat each grain evenly and served immediately.",
        actionText: "Serving colorful veg fried rice..."
      }
    ]
  },
  {
    id: 7,
    name: "Chicken Noodles",
    price: 60.00,
    category: "noodles",
    categoryLabel: "Noodles",
    isVeg: false,
    isPopular: true,
    description: "Street-style hakka noodles tossed in a high-flame wok with tender spiced chicken, crunchy cabbage, and savory chili sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-noodles-in-a-wok-43408-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    tags: ["Street Style", "Bestseller", "Spicy Delight"],
    cookingTime: "12 mins",
    technique: "Fast Hakka Wok Toss",
    spiceLevel: "Medium Spicy 🔥🔥",
    ingredients: [
      { name: "Hakka Noodles", icon: "🍜" },
      { name: "Chicken Shreds", icon: "🍗" },
      { name: "Chili Garlic Paste", icon: "🌶️" },
      { name: "Crispy Cabbage", icon: "🥬" },
      { name: "Spring Onions", icon: "🌱" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Chili-Garlic Searing",
        desc: "Aromatic red chili paste, minced garlic, and sliced chicken are tossed in smoking oil.",
        actionText: "Searing chili, garlic & chicken..."
      },
      {
        step: 2,
        title: "Noodle Wok Flip",
        desc: "Boiled hakka noodles and julienned vegetables are tossed high over the flames with seasoning sauces.",
        actionText: "High-flying wok toss with noodles..."
      },
      {
        step: 3,
        title: "Garnish & Steam Plating",
        desc: "Drizzled with toasted sesame and green scallions for mouthwatering texture.",
        actionText: "Garnishing hakka chicken noodles..."
      }
    ]
  },
  {
    id: 8,
    name: "Egg Noodles",
    price: 50.00,
    category: "noodles",
    categoryLabel: "Noodles",
    isVeg: false,
    isPopular: false,
    description: "Stir-fried noodles with scrambled egg shreds, julienned vegetables, crushed black pepper, and classic soy glaze.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-noodles-in-a-wok-43408-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    tags: ["Protein Rich", "Quick Bite"],
    cookingTime: "10 mins",
    technique: "Wok Scramble & Noodle Toss",
    spiceLevel: "Mild-Medium 🔥",
    ingredients: [
      { name: "Noodles", icon: "🍜" },
      { name: "Scrambled Eggs", icon: "🥚" },
      { name: "Onions & Peppers", icon: "🧅" },
      { name: "Szechuan Pepper", icon: "🌶️" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Egg Ribbon Scramble",
        desc: "Eggs are flash-scrambled in hot oil and seasoned with cracked pepper.",
        actionText: "Scrambling eggs in wok..."
      },
      {
        step: 2,
        title: "Noodle Blending",
        desc: "Al dente noodles and crunchy onions are folded into the egg with dark soy and vinegar.",
        actionText: "Tossing noodles with egg ribbons..."
      },
      {
        step: 3,
        title: "Service",
        desc: "Served steaming hot with complimentary spicy red chili dip.",
        actionText: "Plating delicious egg noodles..."
      }
    ]
  },
  {
    id: 9,
    name: "Veg Noodles",
    price: 40.00,
    category: "noodles",
    categoryLabel: "Noodles",
    isVeg: true,
    isPopular: false,
    description: "Tasty stir-fried wheat noodles tossed with colorful cabbage, carrots, bell peppers, ginger, and garlic.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-noodles-in-a-wok-43408-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    tags: ["Pure Veg", "Crisp Texture"],
    cookingTime: "10 mins",
    technique: "Fast Veggie Wok Stir",
    spiceLevel: "Mild 🔥",
    ingredients: [
      { name: "Wheat Noodles", icon: "🍜" },
      { name: "Julienned Carrots", icon: "🥕" },
      { name: "Capsicum", icon: "🫑" },
      { name: "Garlic & Scallions", icon: "🧄" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Aromatics & Veg Toss",
        desc: "Minced garlic and fresh vegetables are stir-fried on high heat until aromatic.",
        actionText: "Sautéing crunchy vegetables..."
      },
      {
        step: 2,
        title: "Sauce & Noodle Toss",
        desc: "Noodles are tossed with light soy and vinegar for balanced tangy flavor.",
        actionText: "Tossing noodles with savory sauces..."
      },
      {
        step: 3,
        title: "Hot Plating",
        desc: "Finished with a sprinkle of white pepper and served piping hot.",
        actionText: "Plating fresh veg noodles..."
      }
    ]
  },
  {
    id: 10,
    name: "Chicken Masala",
    price: 70.00,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: true,
    description: "Tender chicken pieces simmered in a thick, rich, spiced onion-tomato gravy infused with roasted garam masalas.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-food-cooking-in-a-pot-43409-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    tags: ["Rich Gravy", "Bestseller", "Authentic Curry"],
    cookingTime: "30 mins",
    technique: "Slow Bhuna Gravy Simmer",
    spiceLevel: "Spicy 🔥🔥🔥",
    ingredients: [
      { name: "Chicken", icon: "🍗" },
      { name: "Roasted Masala Gravy", icon: "🍲" },
      { name: "Ginger-Garlic Paste", icon: "🧄" },
      { name: "Tomatoes & Kasuri Methi", icon: "🍅" },
      { name: "Coriander", icon: "🌿" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Bhuna Masala Sauté",
        desc: "Finely chopped onions are browned golden and simmered with ginger, garlic, turmeric, and Kashmiri red chili.",
        actionText: "Bhuna frying rich masala gravy..."
      },
      {
        step: 2,
        title: "Chicken Slow Braise",
        desc: "Chicken is braised in the thick tomato reduction until tender and infused with roasted spices.",
        actionText: "Simmering chicken in spiced sauce..."
      },
      {
        step: 3,
        title: "Kasuri Methi Infusion",
        desc: "Crushed kasuri methi (fenugreek leaves) and fresh cream are stirred in for silky aromatic texture.",
        actionText: "Finishing with kasuri methi & ghee..."
      }
    ]
  },
  {
    id: 11,
    name: "Chicken 65",
    price: 70.00,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: true,
    description: "Crispy South-Indian style boneless chicken bites marinated in spicy red batter, deep-fried with curry leaves and green chilies.",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-food-in-a-pan-with-oil-43404-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    tags: ["Crispy", "Bestseller", "South Indian Spice"],
    cookingTime: "15 mins",
    technique: "Double Crisp Deep Fry & Tadka",
    spiceLevel: "Extra Spicy 🔥🔥🔥🔥",
    ingredients: [
      { name: "Boneless Chicken", icon: "🍗" },
      { name: "Red Chili & Yogurt Batter", icon: "🌶️" },
      { name: "Curry Leaves", icon: "🍃" },
      { name: "Green Chilies", icon: "🌶️" },
      { name: "Garlic Tadka", icon: "🧄" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Spicy Cornflour & Curd Marinade",
        desc: "Bite-sized chicken is coated in thick yogurt, Kashmiri chili, ginger paste, egg white, and cornstarch.",
        actionText: "Coating chicken in fiery red marinade..."
      },
      {
        step: 2,
        title: "Golden Flash Frying",
        desc: "Deep-fried in smoking hot oil until crunchy on the outside and exceptionally juicy inside.",
        actionText: "Deep frying until golden crisp..."
      },
      {
        step: 3,
        title: "Curry Leaf & Garlic Tempering",
        desc: "Tossed in a sizzling tadka of mustard seeds, curry leaves, crushed garlic, and sliced green chilies.",
        actionText: "Tossing in curry leaf tadka..."
      }
    ]
  },
  {
    id: 12,
    name: "Chili Chicken",
    price: 70.00,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: false,
    description: "Crisp fried chicken chunks tossed in a sizzling wok with capsicum, onions, dark soy sauce, and spicy green chili paste.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stirring-food-in-a-wok-pan-43407-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    tags: ["Indo-Chinese", "Tangy & Spicy"],
    cookingTime: "15 mins",
    technique: "Crisp Fry & Szechuan Sauce Toss",
    spiceLevel: "Spicy 🔥🔥🔥",
    ingredients: [
      { name: "Chicken Bites", icon: "🍗" },
      { name: "Green Bell Peppers", icon: "🫑" },
      { name: "Onion Petals", icon: "🧅" },
      { name: "Dark Soy & Chili Sauce", icon: "🌶️" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Crispy Chicken Frying",
        desc: "Chicken chunks are battered and fried until crispy golden brown.",
        actionText: "Frying crispy chicken nuggets..."
      },
      {
        step: 2,
        title: "Wok Glazing with Peppers",
        desc: "Sautéed onion petals and green bell peppers are tossed with soy sauce and chili glaze.",
        actionText: "Glazing with dark soy & capsicum..."
      },
      {
        step: 3,
        title: "Thick Sauce Coating",
        desc: "Chicken is tossed into the bubbling sauce until every piece is gloriously coated.",
        actionText: "Coating in glossy chili glaze..."
      }
    ]
  },
  {
    id: 13,
    name: "Chicken Pepper Dry",
    price: 70.00,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: false,
    description: "Spicy dry-roasted chicken preparation loaded with freshly crushed black peppercorns, curry leaves, and caramelized shallots.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-sizzling-in-a-hot-pan-43406-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    tags: ["Black Pepper Heat", "Dry Roast"],
    cookingTime: "20 mins",
    technique: "Tawa Dry Roast",
    spiceLevel: "Extra Spicy 🔥🔥🔥🔥",
    ingredients: [
      { name: "Chicken", icon: "🍗" },
      { name: "Coarse Black Pepper", icon: "🧂" },
      { name: "Curry Leaves", icon: "🍃" },
      { name: "Shallots", icon: "🧅" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Shallot Caramelization",
        desc: "Shallots are slowly roasted in coconut oil and curry leaves until golden brown.",
        actionText: "Caramelizing shallots & curry leaves..."
      },
      {
        step: 2,
        title: "Chicken & Peppercorn Roast",
        desc: "Freshly roasted black pepper and coriander powders are roasted with chicken pieces until dry.",
        actionText: "Dry-roasting with crushed black pepper..."
      },
      {
        step: 3,
        title: "Final Herbal Toss",
        desc: "Finished with a squeeze of lime and fresh curry leaves.",
        actionText: "Serving fragrant pepper dry chicken..."
      }
    ]
  },
  {
    id: 14,
    name: "Parota (1 Piece)",
    price: 10.00,
    category: "indian-favourites",
    categoryLabel: "Indian Favourites",
    isVeg: true,
    isPopular: true,
    description: "Flaky, layered, golden-crispy South Indian Malabar-style parota, hand-tossed and cooked on a hot tawa with pure ghee.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-food-in-a-pan-with-oil-43404-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    tags: ["Flaky Layers", "Bestseller", "Tawa Hot"],
    cookingTime: "8 mins",
    technique: "Hand Stretched & Tawa Roasted",
    spiceLevel: "Mild",
    ingredients: [
      { name: "Fine Wheat Dough", icon: "🌾" },
      { name: "Desi Ghee / Butter", icon: "🧈" },
      { name: "Sea Salt", icon: "🧂" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Hand-Stretching & Layering",
        desc: "The soft kneaded dough is hand-flipped paper thin, brushed with ghee, and pleated into layered spirals.",
        actionText: "Hand-flipping & pleating spiral layers..."
      },
      {
        step: 2,
        title: "Tawa Roasting with Ghee",
        desc: "Cooked on a smoking iron tawa with generous splashes of ghee until both sides are golden speckled and crispy.",
        actionText: "Tawa roasting until golden crispy..."
      },
      {
        step: 3,
        title: "Fluffing the Flaky Layers",
        desc: "Crushed gently between the chef's hands while steaming hot to separate the buttery layers.",
        actionText: "Crushing & fluffing flaky layers..."
      }
    ]
  }
];
