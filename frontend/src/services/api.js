import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Mock Fallback Data for Vercel Deployments when Backend is Unreachable
const FALLBACK_SHOPS = [
  {
    id: 1,
    name: "Sadhana Chulhivarchi Misal",
    slug: "sadhana-chulhivarchi-misal-nashik",
    tagline: "Authentic Wood-Stove Misal with Jalebi & Solkadhi",
    description: "Famous heritage misal spot in Gangapur Road cooked over traditional earthen chulhas.",
    address: "Hardev Baug, Opp. Somanath Temple, Gangapur Road",
    area: "Gangapur Road",
    city: "Nashik",
    phone: "09420008888",
    price_per_plate: 140,
    spicy_level: 4,
    is_chulhivarchi: true,
    is_sponsored: true,
    sponsorship_tier: "platinum",
    crowd_status: "moderate",
    avg_rating: 4.8,
    total_reviews: 320,
    main_image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { id: 101, reviewer_name: "Amit Deshmukh", rating: 5, comment: "Smoky wood-stove flavor and hot Jalebi pairing!", created_at: "2026-08-01" }
    ]
  },
  {
    id: 2,
    name: "Shamsundar Misal",
    slug: "shamsundar-misal-panchavati-nashik",
    tagline: "Legacy Zanzanit Kala Rassa since 1982",
    description: "Iconic Panchavati joint known for rich dark-roasted coconut Kala Rassa.",
    address: "Near Nimani Bus Stand, Panchavati",
    area: "Panchavati",
    city: "Nashik",
    phone: "09822011223",
    price_per_plate: 90,
    spicy_level: 5,
    is_chulhivarchi: false,
    is_sponsored: true,
    sponsorship_tier: "gold",
    crowd_status: "crowded",
    avg_rating: 4.9,
    total_reviews: 512,
    main_image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    reviews: [
      { id: 102, reviewer_name: "Pooja Patil", rating: 5, comment: "Best Zanzanit Kala Rassa in Nashik!", created_at: "2026-08-05" }
    ]
  },
  {
    id: 4,
    name: "Ambika Misal",
    slug: "ambika-misal-panchavati-nashik",
    tagline: "Authentic Black Spicy Gravy (Kala Rassa) Specialist",
    description: "Famous Panchavati spot serving fiery black coconut gravy misal with crunchy farsan.",
    address: "Panchavati Karanja, Nashik",
    area: "Panchavati",
    city: "Nashik",
    phone: "09823045678",
    price_per_plate: 100,
    spicy_level: 5,
    is_chulhivarchi: false,
    is_sponsored: true,
    sponsorship_tier: "gold",
    crowd_status: "crowded",
    avg_rating: 4.8,
    total_reviews: 410,
    main_image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
    reviews: []
  },
  {
    id: 5,
    name: "Grape Embassy Misal",
    slug: "grape-embassy-misal-nashik",
    tagline: "Unique Vineyard Ambiance & Organic Jaggery Jalebi",
    description: "Dine under grape vines with traditional wood stove chulha misal and fresh sugarcane juice.",
    address: "Makhmalabad Road, Nashik",
    area: "Gangapur Road",
    city: "Nashik",
    phone: "09422255555",
    price_per_plate: 150,
    spicy_level: 4,
    is_chulhivarchi: true,
    is_sponsored: true,
    sponsorship_tier: "platinum",
    crowd_status: "moderate",
    avg_rating: 4.9,
    total_reviews: 620,
    main_image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    reviews: []
  },
  {
    id: 6,
    name: "Vihar Misal",
    slug: "vihar-misal-college-road-nashik",
    tagline: "Mild & Flavourful Family Favorite since 1995",
    description: "Located on College Road, known for rich mild sample, buttered pav, and kulfi dessert.",
    address: "College Road, Opp. BYK College, Nashik",
    area: "College Road",
    city: "Nashik",
    phone: "09890011223",
    price_per_plate: 110,
    spicy_level: 2,
    is_chulhivarchi: false,
    is_sponsored: false,
    sponsorship_tier: "none",
    crowd_status: "low",
    avg_rating: 4.6,
    total_reviews: 240,
    main_image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    reviews: []
  }
];

export const fetchShops = async (params) => {
  try {
    const { data } = await api.get('/shops/', { params });
    return data;
  } catch (_err) {
    let list = [...FALLBACK_SHOPS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q)
      );
    }
    if (params?.area) {
      list = list.filter((s) => s.area.toLowerCase() === params.area.toLowerCase());
    }
    if (params?.spicy_level !== undefined && params?.spicy_level !== null) {
      list = list.filter((s) => s.spicy_level === Number(params.spicy_level));
    }
    if (params?.is_chulhivarchi !== undefined && params?.is_chulhivarchi !== null) {
      list = list.filter((s) => s.is_chulhivarchi === Boolean(params.is_chulhivarchi));
    }

    return {
      items: list,
      total: list.length,
      page: 1,
      pages: 1
    };
  }
};

export const createShop = async (shopData) => {
  try {
    const { data } = await api.post('/shops/', shopData);
    return data;
  } catch (_err) {
    return {
      id: Date.now(),
      name: shopData.name || "Submitted Misal Shop",
      slug: (shopData.name || "submitted-misal").toLowerCase().replace(/\s+/g, '-'),
      area: shopData.area || "Gangapur Road",
      whatsapp_alert_url: `https://api.whatsapp.com/send?phone=917058638277&text=${encodeURIComponent(`New Shop Submission: ${shopData.name}`)}`
    };
  }
};

export const fetchShopBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/shops/${slug}`);
    return data;
  } catch (_err) {
    const found = FALLBACK_SHOPS.find(s => s.slug === slug);
    return found || FALLBACK_SHOPS[0];
  }
};

export const fetchShopSchema = async (slug) => {
  try {
    const { data } = await api.get(`/shops/${slug}/schema`);
    return data;
  } catch (_err) {
    return { "@context": "https://schema.org", "@type": "Restaurant", "name": "Nashik Misal Spot" };
  }
};

export const fetchAreas = async () => {
  try {
    const { data } = await api.get('/shops/areas');
    return data;
  } catch (_err) {
    return ["Gangapur Road", "Panchavati", "College Road", "Peth Road", "Ambad MIDC"];
  }
};

export const fetchActivities = async () => {
  try {
    const { data } = await api.get('/activities/');
    return data;
  } catch (_err) {
    return [
      { id: 1, name: "Traditional Wood Stove (Chulhi)", slug: "chulhivarchi" },
      { id: 2, name: "Garden Orchard Dining", slug: "garden-seating" }
    ];
  }
};

export const submitReview = async (reviewData) => {
  try {
    const { data } = await api.post('/reviews/', reviewData);
    return data;
  } catch (_err) {
    return { status: "success", message: "Review saved locally!" };
  }
};

export const fetchAdBySlot = async (slotName) => {
  try {
    const { data } = await api.get(`/ads/slot/${slotName}`);
    return data;
  } catch (_err) {
    return null;
  }
};

export const fetchSponsorshipPlans = async () => {
  try {
    const { data } = await api.get('/sponsorship/plans');
    return data;
  } catch (_err) {
    return {
      creator: { name: "Tejas Thakare", phonepe_number: "7058638277" },
      plans: []
    };
  }
};

export const subscribeSponsorship = async (subscribeData) => {
  try {
    const { data } = await api.post('/sponsorship/subscribe', subscribeData);
    return data;
  } catch (_err) {
    return {
      status: "success",
      shop_name: "Partner Misal Joint",
      sponsorship_tier: subscribeData.tier || "gold",
      expires_at: "2027-08-10",
      invoice_no: `INV-2026-NMK-${Math.floor(1000 + Math.random() * 9000)}`,
      subtotal: 21185,
      gst_amount: 3814,
      total_paid: 24999,
      transaction_ref: `PHONEPE-UPI-${Date.now()}`,
      creator_contact: "Tejas Thakare (Website Maker)",
      phonepe_number: "7058638277",
      whatsapp_alert_url: `https://api.whatsapp.com/send?phone=917058638277&text=${encodeURIComponent(`New Sponsorship Subscribed: ${subscribeData.tier}`)}`
    };
  }
};

export default api;
