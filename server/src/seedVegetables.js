// seedVegetables.js
const mongoose = require('mongoose');
const Vegetable = require('./models/vegetable.model'); // adjust path if needed

// MongoDB connection URL
const MONGO_URI =
  'mongodb+srv://user07:gH7CkpXyInEy8wa0@cluster0.9znc3.mongodb.net/VegetableShop?retryWrites=true&w=majority&appName=Cluster0'; // change if needed

// Array of vegetables
const vegetables = [
  {
    name: 'Tomato',
    description:
      'Fresh and juicy red tomatoes, perfect for salads, sauces, and cooking. Rich in vitamins and antioxidants.',
    price: 40,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278498/tomato_bg3rtw.jpg',
        public_id: 'tomato_bg3rtw',
      }, // <-- Fill your Cloudinary URL and public_id here
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278498/tomoato1_e3c558.jpg',
        public_id: 'tomoato1_e3c558',
      }, // <-- Fill your Cloudinary URL and public_id here
    ],
  },
  {
    name: 'Potato',
    description:
      'High-quality potatoes ideal for cooking, baking, or frying. Fresh, healthy, and full of flavor.',
    price: 30,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      {
        url: 'potato2_wij7ku',
        public_id:
          'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278498/potato2_wij7ku.jpg',
      },
      {
        url: 'potato1_anawli',
        public_id:
          'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278498/potato1_anawli.jpg',
      },
      {
        url: 'potato_ogl8xx',
        public_id:
          'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278498/potato_ogl8xx.jpg',
      },
    ],
  },
  {
    name: 'Brinjal',
    description:
      'Organic brinjals with a smooth texture and rich taste, perfect for curries and roasting.',
    price: 35,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278496/brinjal1_u8fzxr.jpg',
        public_id: 'brinjal1_u8fzxr',
      },
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278496/brinjal_scnytn.jpg',
        public_id: 'brinjal_scnytn',
      },
    ],
  },
  {
    name: 'Spinach',
    description:
      'Fresh green spinach leaves, packed with nutrients and ideal for salads, soups, and cooking.',
    price: 25,
    stock: 100,
    unit: 'bunch',
    category: 'Leafy Greens',
    isAvailable: true,
    images: [
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278496/spinach1_hoo1ah.jpg',
        public_id: 'spinach1_hoo1ah',
      },
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278496/spinach_zyh0kk.jpg',
        public_id: 'spinach_zyh0kk',
      },
    ],
  },
  {
    name: 'Green Capsicum',
    description:
      'Crisp and fresh green capsicums, perfect for stir-fries, salads, and cooking. Rich in vitamin C.',
    price: 50,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278497/capsicum2green_xycdix.jpg',
        public_id: 'capsicum2green_xycdix',
      },
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278497/capsicum1green_yujoyi.jpg',
        public_id: 'capsicum1green_yujoyi',
      },
    ],
  },
  {
    name: 'Cauliflower',
    description:
      'Fresh cauliflower with firm and tender florets, great for curries, roasting, and salads.',
    price: 45,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278497/cauliflower_ujovio.jpg',
        public_id: 'cauliflower_ujovio',
      },
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278496/cauliflower1_xahvpn.jpg',
        public_id: 'cauliflower1_xahvpn',
      },
    ],
  },
  {
    name: 'Onion',
    description:
      'Fresh onions with strong flavor, perfect for cooking, salads, and garnishing your dishes.',
    price: 35,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278497/onion2_dsj10o.jpg',
        public_id: 'onion2_dsj10o',
      },
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278497/onion_gv44hw.jpg',
        public_id: 'onion_gv44hw',
      },
      {
        url: 'https://res.cloudinary.com/dvhyxrhkh/image/upload/v1757278497/onion1_fspyis.jpg',
        public_id: 'onion1_fspyis',
      },
    ],
  },
  /* {
    name: 'Cabbage',
    description:
      'Crisp and fresh cabbage, ideal for salads, stir-fries, and cooking. Full of vitamins and fiber.',
    price: 30,
    stock: 100,
    unit: 'kg',
    category: 'Vegetables',
    isAvailable: true,
    images: [
      { url: '', public_id: '' },
      { url: '', public_id: '' },
    ],
  }, */
];

// Seed function
const seedVegetables = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing vegetables
    await Vegetable.deleteMany({});
    console.log('Cleared existing vegetables');

    // Insert new vegetables
    await Vegetable.insertMany(vegetables);
    console.log('Seeded vegetables successfully');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding vegetables:', err);
    process.exit(1);
  }
};

seedVegetables();
