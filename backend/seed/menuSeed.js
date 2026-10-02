const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Coupon = require("../models/Coupon");

const RESTAURANT_DATA = {
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
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027",
  aboutText:
    "Zion Food Corner is a local fast-food restaurant serving affordable Indian favourites including biryani, fried rice, noodles, chicken dishes and vegetarian dishes.",
  subtitle: "Delicious Food at Affordable Prices",
  heroDescription:
    "Enjoy delicious biryani, fried rice, noodles, chicken dishes, and popular Indian favourites at affordable prices."
};

const CATEGORIES_DATA = [
  { name: "Rice & Biryani", slug: "rice-biryani", icon: "fas fa-bowl-rice", isActive: true, sortOrder: 1 },
  { name: "Fried Rice", slug: "fried-rice", icon: "fas fa-fire-burner", isActive: true, sortOrder: 2 },
  { name: "Noodles", slug: "noodles", icon: "fas fa-bowl-food", isActive: true, sortOrder: 3 },
  { name: "Chicken Items", slug: "chicken-items", icon: "fas fa-drumstick-bite", isActive: true, sortOrder: 4 },
  { name: "Veg Items", slug: "veg-items", icon: "fas fa-leaf", isActive: true, sortOrder: 5 },
  { name: "Indian Favourites", slug: "indian-favourites", icon: "fas fa-heart", isActive: true, sortOrder: 6 }
];

const MENU_ITEMS_DATA = [
  // 1. Chicken Biryani
  {
    id: 1,
    name: "Chicken Biryani",
    price: 70.0,
    category: "rice-biryani",
    categoryLabel: "Rice & Biryani",
    isVeg: false,
    isPopular: true,
    description:
      "Delicious aromatic chicken biryani prepared with seasoned basmati rice, tender chicken pieces, and traditional whole spices.",
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
    ],
    isAvailable: true
  },

  // 2. Egg Biryani
  {
    id: 2,
    name: "Egg Biryani",
    price: 50.0,
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
    ],
    isAvailable: true
  },

  // 3. Biryani Rice
  {
    id: 3,
    name: "Biryani Rice",
    price: 40.0,
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
      { name: "Mint & Coriander", icon: "🌱" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Whole Spice Tempering",
        desc: "Green cardamom, star anise, bay leaves, and cinnamon bark are tempered in hot oil to release essential aromatic oils.",
        actionText: "Tempering whole spices..."
      },
      {
        step: 2,
        title: "Aromatic Broth Simmer",
        desc: "Onions, green chilies, tomatoes, and ground spices are sautéed into a rich aromatic broth.",
        actionText: "Simmering rich masala broth..."
      },
      {
        step: 3,
        title: "Slow Absorption Cooking",
        desc: "Aged rice is simmered in the seasoned broth until every grain absorbs the rich flavors and turns golden saffron.",
        actionText: "Fluffing golden seasoned rice..."
      }
    ],
    isAvailable: true
  },

  // 4. Ghee Rice
  {
    id: 4,
    name: "Ghee Rice",
    price: 40.0,
    category: "rice-biryani",
    categoryLabel: "Rice & Biryani",
    isVeg: true,
    isPopular: false,
    description: "Traditional South Indian aromatic rice tossed in pure golden ghee, fried onions, and roasted whole spices.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-food-cooking-in-a-pot-43409-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
    tags: ["Pure Ghee", "Mild & Aromatic"],
    cookingTime: "18 mins",
    technique: "Pure Desi Ghee Roast",
    spiceLevel: "Mild & Buttery 🧈",
    ingredients: [
      { name: "Jeera / Basmati", icon: "🍚" },
      { name: "Desi Ghee", icon: "🧈" },
      { name: "Fried Cashews", icon: "🥜" },
      { name: "Sweet Onions", icon: "🧅" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Ghee & Nut Toasting",
        desc: "Generous spoonfuls of desi ghee are heated to fry whole cashews, cloves, and sliced sweet onions until fragrant.",
        actionText: "Melting pure golden ghee..."
      },
      {
        step: 2,
        title: "Grain Roasting",
        desc: "Washed rice grains are lightly roasted in the warm ghee to lock in aroma and prevent sticking.",
        actionText: "Toasting rice grains in ghee..."
      },
      {
        step: 3,
        title: "Steaming & Fluffing",
        desc: "Cooked to fluffy perfection and gently fluffed with a fork to maintain distinct, buttery grains.",
        actionText: "Gently fluffing with golden onions..."
      }
    ],
    isAvailable: true
  },

  // 5. Chicken Fried Rice
  {
    id: 5,
    name: "Chicken Fried Rice",
    price: 70.0,
    category: "fried-rice",
    categoryLabel: "Fried Rice",
    isVeg: false,
    isPopular: true,
    description: "Wok-tossed long-grain rice with succulent shredded chicken, farm eggs, crisp vegetables, and Indo-Chinese seasonings.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-43407-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    tags: ["Wok Tossed", "Bestseller"],
    cookingTime: "8 mins",
    technique: "High-Flame Wok Hei",
    spiceLevel: "Savory & Peppery 🔥🔥",
    ingredients: [
      { name: "Tossed Rice", icon: "🍚" },
      { name: "Juicy Chicken", icon: "🍗" },
      { name: "Farm Egg", icon: "🥚" },
      { name: "Spring Onions", icon: "🌱" },
      { name: "Soy & Chili Glaze", icon: "🫗" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "High Flame Egg & Chicken Sizzle",
        desc: "The cast-iron wok is brought to smoking heat. Eggs are cracked and scrambled with seasoned chicken shreds.",
        actionText: "Scrambling eggs & chicken on hot wok..."
      },
      {
        step: 2,
        title: "Crispy Vegetable Sauté",
        desc: "Finely diced carrots, cabbage, and green beans are tossed rapidly to retain crispiness and absorb wok hei smoke.",
        actionText: "Wok tossing crunchy veggies..."
      },
      {
        step: 3,
        title: "Rice Toss & Seasoning Glaze",
        desc: "Cold fluffy rice is added with dark soy sauce, crushed white pepper, and scallions, tossed high in the air.",
        actionText: "High-flame tossing with soy & pepper..."
      }
    ],
    isAvailable: true
  },

  // 6. Veg Fried Rice
  {
    id: 6,
    name: "Veg Fried Rice",
    price: 50.0,
    category: "fried-rice",
    categoryLabel: "Fried Rice",
    isVeg: true,
    isPopular: false,
    description: "Classic stir-fried rice loaded with crunchy carrots, green beans, cabbage, bell peppers, and scallions.",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-tossing-vegetables-in-a-pan-41584-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80",
    tags: ["100% Veg", "Crunchy Veggies"],
    cookingTime: "7 mins",
    technique: "Fast Wok Stir-Fry",
    spiceLevel: "Mild Savory 🔥",
    ingredients: [
      { name: "Steamed Rice", icon: "🍚" },
      { name: "Bell Peppers & Beans", icon: "🫑" },
      { name: "Crisp Carrots", icon: "🥕" },
      { name: "Garlic & Scallions", icon: "🧄" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Garlic & Chili Sizzle",
        desc: "Finely minced garlic and green chilies are flashed in smoking oil for maximum aroma.",
        actionText: "Sizzling minced garlic..."
      },
      {
        step: 2,
        title: "Colorful Veggie Stir-Fry",
        desc: "Diced carrots, beans, and cabbage are flash-fried on intense flame for maximum crunch.",
        actionText: "Stir-frying colorful vegetables..."
      },
      {
        step: 3,
        title: "Sauce & Rice Blend",
        desc: "Fluffy rice is tossed with light soy, vinegar, and spring onion greens.",
        actionText: "Tossing rice with seasoned soy..."
      }
    ],
    isAvailable: true
  },

  // 7. Chicken Noodles
  {
    id: 7,
    name: "Chicken Noodles",
    price: 70.0,
    category: "noodles",
    categoryLabel: "Noodles",
    isVeg: false,
    isPopular: true,
    description: "Street-style stir-fried hakka noodles tossed in high flame with spiced chicken pieces, eggs, and shredded veggies.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-tossing-vegetables-in-a-pan-41584-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    tags: ["Street Style", "Bestseller"],
    cookingTime: "6 mins",
    technique: "High Flame Hakka Toss",
    spiceLevel: "Spicy & Tangy 🔥🔥",
    ingredients: [
      { name: "Hakka Noodles", icon: "🍜" },
      { name: "Chicken Shreds", icon: "🍗" },
      { name: "Scrambled Egg", icon: "🥚" },
      { name: "Chili Garlic Oil", icon: "🌶️" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Noodle Boiling & Shocking",
        desc: "Fresh noodles are boiled al dente and shocked in cold water with a drop of sesame oil to stay springy.",
        actionText: "Boiling fresh springy noodles..."
      },
      {
        step: 2,
        title: "Chicken & Egg Flash Fry",
        desc: "Chicken slivers and beaten eggs are wok-seared with julienned cabbage and capsicum.",
        actionText: "Searing chicken shreds & veggies..."
      },
      {
        step: 3,
        title: "The Signature Wok Toss",
        desc: "Noodles are dropped in, seasoned with soy, red chili sauce, and black pepper, and flipped repeatedly over raw flame.",
        actionText: "High-flame tossing in spicy sauces..."
      }
    ],
    isAvailable: true
  },

  // 8. Veg Noodles
  {
    id: 8,
    name: "Veg Noodles",
    price: 50.0,
    category: "noodles",
    categoryLabel: "Noodles",
    isVeg: true,
    isPopular: false,
    description: "Delicious Indo-Chinese noodles tossed with crunchy vegetables, soy sauce, and aromatic garlic-chili oil.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-stirring-food-in-a-pan-with-a-spatula-43410-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    tags: ["100% Veg", "Savory"],
    cookingTime: "6 mins",
    technique: "Quick Hakka Stir-Fry",
    spiceLevel: "Savory & Tangy 🔥",
    ingredients: [
      { name: "Long Noodles", icon: "🍜" },
      { name: "Shredded Cabbage", icon: "🥬" },
      { name: "Crisp Capsicum", icon: "🫑" },
      { name: "Dark Soy & Vinegar", icon: "🫗" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Vegetable Shredding & Sauté",
        desc: "Thinly julienned cabbage, onions, and bell peppers are sizzled in garlic-infused oil.",
        actionText: "Sizzling julienned vegetables..."
      },
      {
        step: 2,
        title: "Sauce Glaze",
        desc: "A hot splash of soy sauce and chili vinegar coats the sides of the screaming-hot wok.",
        actionText: "Glazing with savory chili-soy..."
      },
      {
        step: 3,
        title: "Master Noodle Flip",
        desc: "Springy noodles are tossed smoothly, coating each strand in savory umami glaze.",
        actionText: "Tossing long springy noodles..."
      }
    ],
    isAvailable: true
  },

  // 9. Gobi Manchurian
  {
    id: 9,
    name: "Gobi Manchurian",
    price: 50.0,
    category: "veg-items",
    categoryLabel: "Veg Items",
    isVeg: true,
    isPopular: false,
    description: "Crispy batter-fried cauliflower florets glazed in a hot, tangy, and savory Indo-Chinese Manchurian sauce.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-food-in-hot-oil-43411-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Crispy", "Tangy & Spicy"],
    cookingTime: "12 mins",
    technique: "Crispy Batter Fry & Glaze Toss",
    spiceLevel: "Tangy Spicy 🔥🔥",
    ingredients: [
      { name: "Fresh Cauliflower", icon: "🥦" },
      { name: "Crispy Corn Batter", icon: "🥣" },
      { name: "Ginger & Garlic", icon: "🧄" },
      { name: "Manchurian Sauce", icon: "🌶️" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Crispy Batter Frying",
        desc: "Fresh cauliflower florets are coated in a spiced cornflour batter and deep-fried until golden and crunchy.",
        actionText: "Deep frying crispy batter florets..."
      },
      {
        step: 2,
        title: "Manchurian Sauce Sizzle",
        desc: "Chopped ginger, garlic, green chilies, and spring onions are simmered in tangy red chili and soy glaze.",
        actionText: "Simmering spicy ginger-garlic sauce..."
      },
      {
        step: 3,
        title: "Crunchy Glaze Toss",
        desc: "The hot crispy gobi is thrown into the sizzling wok and tossed fast so it stays crunchy yet saucy.",
        actionText: "Tossing crispy gobi into glossy sauce..."
      }
    ],
    isAvailable: true
  },

  // 10. Chicken Masala
  {
    id: 10,
    name: "Chicken Masala",
    price: 50.0,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: false,
    description: "Tender chicken cooked in a rich, slow-simmered onion-tomato gravy infused with fragrant South Indian garam masala.",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cooking-meat-in-a-frying-pan-43408-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    tags: ["Rich Gravy", "Spicy"],
    cookingTime: "25 mins",
    technique: "Slow Simmered Masala Gravy",
    spiceLevel: "Rich & Spicy 🔥🔥🔥",
    ingredients: [
      { name: "Chicken Cuts", icon: "🍗" },
      { name: "Onion-Tomato Base", icon: "🍅" },
      { name: "Curry Leaves", icon: "🌿" },
      { name: "Garam Masala", icon: "🌶️" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Curry Leaves & Onion Bhuna",
        desc: "Finely sliced onions and fresh curry leaves are browned in hot oil until rich and caramelized.",
        actionText: "Caramelizing onions & curry leaves..."
      },
      {
        step: 2,
        title: "Chicken Sear & Masala Roast",
        desc: "Chicken is added and seared on high flame to lock in moisture, then coated in roasted spices and tomato puree.",
        actionText: "Searing chicken in roasted spices..."
      },
      {
        step: 3,
        title: "Thick Gravy Simmer",
        desc: "Slow-simmered until chicken is fork-tender and rich aromatic oil floats to the top of the dark gravy.",
        actionText: "Simmering to a thick aromatic gravy..."
      }
    ],
    isAvailable: true
  },

  // 11. Egg Masala
  {
    id: 11,
    name: "Egg Masala",
    price: 30.0,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: false,
    description: "Boiled eggs coated in a deeply flavorful roasted spice and tomato curry base, perfect with parota or rice.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vegetables-sizzling-in-a-hot-pan-43406-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    tags: ["Rich Gravy", "Budget Pick"],
    cookingTime: "15 mins",
    technique: "Pan Roasted Egg in Masala Gravy",
    spiceLevel: "Medium Spicy 🔥🔥",
    ingredients: [
      { name: "Boiled Farm Eggs", icon: "🥚" },
      { name: "Tomato & Onion Puree", icon: "🍅" },
      { name: "Coriander & Cumin", icon: "🌿" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Egg Pan Searing",
        desc: "Boiled eggs are scored and shallow-fried with a dash of turmeric until a golden blistered skin forms.",
        actionText: "Pan searing eggs until golden blistered..."
      },
      {
        step: 2,
        title: "Masala Gravy Reduction",
        desc: "A rich gravy of onions, tomatoes, ginger, and ground coriander is reduced to a glossy consistency.",
        actionText: "Reducing onion-tomato spiced gravy..."
      },
      {
        step: 3,
        title: "Simmer & Infuse",
        desc: "The eggs are rolled in the hot masala so the flavors seep into every cut.",
        actionText: "Infusing eggs in rich hot curry..."
      }
    ],
    isAvailable: true
  },

  // 12. Chicken Kabab
  {
    id: 12,
    name: "Chicken Kabab",
    price: 50.0,
    category: "chicken-items",
    categoryLabel: "Chicken Items",
    isVeg: false,
    isPopular: true,
    description: "Authentic Bengaluru-style crispy red fried chicken kabab marinated with ginger-garlic, chili, and curry leaves.",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-food-in-hot-oil-43411-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    tags: ["Crispy", "Popular Starter"],
    cookingTime: "10 mins",
    technique: "Double-Fried Bengaluru Kabab",
    spiceLevel: "Spicy & Crunchy 🔥🔥🔥",
    ingredients: [
      { name: "Chicken Morsels", icon: "🍗" },
      { name: "Red Chili Paste", icon: "🌶️" },
      { name: "Ginger Garlic", icon: "🧄" },
      { name: "Crispy Curry Leaves", icon: "🌿" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Authentic Spiced Marinade",
        desc: "Chicken is marinated in fiery red chili powder, ginger-garlic, lemon juice, egg white, and gram flour.",
        actionText: "Coating in red spicy kabab marinade..."
      },
      {
        step: 2,
        title: "Hot Oil Sizzle Fry",
        desc: "Dropped with fresh green curry leaves into bubbling hot oil, sizzling with irresistible crackle.",
        actionText: "Frying with fresh curry leaves..."
      },
      {
        step: 3,
        title: "Crunchy Finish",
        desc: "Fried to a deep crimson crispness on the outside while staying succulent and juicy on the inside.",
        actionText: "Crisping to golden perfection..."
      }
    ],
    isAvailable: true
  },

  // 13. Omelette
  {
    id: 13,
    name: "Omelette",
    price: 20.0,
    category: "indian-favourites",
    categoryLabel: "Indian Favourites",
    isVeg: false,
    isPopular: false,
    description: "Freshly beaten farm eggs pan-cooked with finely chopped onions, green chilies, black pepper, and coriander.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-preparing-food-in-a-pan-with-oil-43412-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Freshly Made", "Quick Bite"],
    cookingTime: "4 mins",
    technique: "Hot Tawa Flash Flip",
    spiceLevel: "Peppery & Fresh 🔥",
    ingredients: [
      { name: "Double Farm Eggs", icon: "🥚" },
      { name: "Finely Chopped Onions", icon: "🧅" },
      { name: "Spicy Green Chilies", icon: "🌶️" },
      { name: "Crushed Black Pepper", icon: "🧂" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Vigorous Whisking",
        desc: "Eggs are beaten vigorously in a stainless bowl with chopped onions, green chilies, salt, and black pepper.",
        actionText: "Whisking fluffy egg mixture..."
      },
      {
        step: 2,
        title: "Sizzling Tawa Pour",
        desc: "Poured over a screaming hot tawa greased with oil, instantly expanding into a golden lace edge.",
        actionText: "Pouring onto smoking hot tawa..."
      },
      {
        step: 3,
        title: "The Golden Flip",
        desc: "Flipped cleanly with a metal spatula to cook the underside while keeping the center soft and juicy.",
        actionText: "Flipping to a golden fluffy fold..."
      }
    ],
    isAvailable: true
  },

  // 14. Parota
  {
    id: 14,
    name: "Parota",
    price: 30.0,
    category: "indian-favourites",
    categoryLabel: "Indian Favourites",
    isVeg: true,
    isPopular: false,
    description: "Flaky, layered golden-brown South Indian parota toasted to perfection with crispy edges and soft layers.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-in-a-pan-close-up-43413-large.mp4",
    videoPoster: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    tags: ["Flaky & Layered", "Hot & Fresh"],
    cookingTime: "8 mins",
    technique: "Layered Spiral Tawa Toast",
    spiceLevel: "Crispy & Buttery 🫓",
    ingredients: [
      { name: "Kneaded Dough", icon: "🌾" },
      { name: "Pure Oil / Ghee", icon: "🧈" },
      { name: "Layered Spiral", icon: "🫓" }
    ],
    cookingSteps: [
      {
        step: 1,
        title: "Hand-Stretching & Spiraling",
        desc: "Rested dough is thrown and stretched paper-thin on the worktop, then pleated into a layered spiral disc.",
        actionText: "Hand-stretching flaky spiral layers..."
      },
      {
        step: 2,
        title: "Tawa Roasting with Ghee",
        desc: "Cooked on a flat tawa with splashes of oil/ghee until golden brown spots appear on both sides.",
        actionText: "Roasting on tawa till golden crisp..."
      },
      {
        step: 3,
        title: "The Signature Fluff Beat",
        desc: "Clapped briskly with both hands from the sides while hot to open up the delicate, flaky concentric layers.",
        actionText: "Clapping to fluff up crispy layers..."
      }
    ],
    isAvailable: true
  }
];

const COUPONS_DATA = [
  {
    code: "ZION50",
    discountType: "fixed",
    value: 50,
    minOrder: 150,
    description: "₹50 OFF on orders above ₹150",
    isActive: true
  },
  {
    code: "WELCOME10",
    discountType: "percent",
    value: 10,
    minOrder: 100,
    description: "10% OFF on all orders above ₹100",
    isActive: true
  },
  {
    code: "BIRYANI20",
    discountType: "fixed",
    value: 20,
    minOrder: 70,
    description: "₹20 OFF Biryani & Rice Special",
    isActive: true
  }
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zion_food_corner";
  console.log(`[Seed]: Connecting to database at ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri);
    console.log("[Seed]: Database connected successfully.");

    // 1. Seed Restaurant Info
    await Restaurant.deleteMany({});
    await Restaurant.create(RESTAURANT_DATA);
    console.log("✓ [Seed]: Restaurant information seeded.");

    // 2. Seed Categories
    await Category.deleteMany({});
    await Category.insertMany(CATEGORIES_DATA);
    console.log(`✓ [Seed]: ${CATEGORIES_DATA.length} categories seeded.`);

    // 3. Seed Menu Items
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(MENU_ITEMS_DATA);
    console.log(`✓ [Seed]: ${MENU_ITEMS_DATA.length} menu items with recipes seeded.`);

    // 4. Seed Coupons
    await Coupon.deleteMany({});
    await Coupon.insertMany(COUPONS_DATA);
    console.log(`✓ [Seed]: ${COUPONS_DATA.length} coupons seeded.`);

    console.log("\n✨ [Seed Complete]: Zion Food Corner database is ready and up to date!");
    process.exit(0);
  } catch (error) {
    console.error("❌ [Seed Error]:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  RESTAURANT_DATA,
  CATEGORIES_DATA,
  MENU_ITEMS_DATA,
  COUPONS_DATA,
  seedDatabase
};
