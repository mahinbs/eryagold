export const categoryData = [
  { label: "Necklaces", pieces: 32 },
  { label: "Rings", pieces: 48 },
  { label: "Bangles", pieces: 18 },
  { label: "Earrings", pieces: 54 },
  { label: "Bridal Sets", pieces: 12 },
  { label: "Men's Edit", pieces: 9 },
];

export const brandData = [
  { name: "Aurum Atelier", tagline: "Heritage Polki" },
  { name: "Verde Luxe", tagline: "Emerald Line" },
  { name: "Noor by Nyra", tagline: "Fine Diamonds" },
  { name: "House of Kaia", tagline: "Sculpted Gold" },
];

export const jewellerySpotlight = [
  {
    name: "Mogra Polki Choker",
    detail: "22K gold · 8ct uncut diamonds · detachable passa",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Verdant Tide Earrings",
    detail: "Colombian emeralds · rose-cut halos",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Noor Statement Ring",
    detail: "18K white gold · 3.1ct diamond solitaire",
    image:
      "https://images.unsplash.com/photo-1522312298940-653d2b79db83?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kaia Stacked Bangles",
    detail: "Matte-finish gold · enamel inlays",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
  },
];

export const reasonsToTrust = [
  {
    title: "Authenticity Guarantee",
    copy: "BIS hallmarked solid gold with transparent karat stamps.",
  },
  {
    title: "Concierge Sizing",
    copy: "Virtual try-ons, complimentary re-sizing and doorstep preview.",
  },
  {
    title: "Lifetime Service",
    copy: "Polish, plating and repairs managed by master karigars.",
  },
  {
    title: "Global Insurance",
    copy: "Shipments insured worldwide with tamper-proof packaging.",
  },
  {
    title: "Ethical Sourcing",
    copy: "Conflict-free diamonds and audited artisan supply chains.",
  },
  {
    title: "Bespoke Atelier",
    copy: "In-house design lab to co-create couture heirlooms in 4 weeks.",
  },
];

export const footerContent = {
  maison: [
    "Heritage crafting atelier since 1972",
    "Signature concierge across 27 countries",
  ],
  contact: [
    { label: "Flagship Salon", value: "Aurum House, Bandra, Mumbai" },
    { label: "Appointments", value: "+91 22 4000 1100" },
    { label: "Concierge WhatsApp", value: "+91 98 7000 1212" },
    { label: "Email", value: "enquiries@aurumatelier.com" },
  ],
  support: [
    "Private trunk shows by invite",
    "Worldwide insured shipping in 7-10 days",
    "Lifetime care, repolish & upgrade program",
  ],
  hours: [
    "Showroom · Tue-Sun · 11 AM - 9 PM IST",
    "Virtual consults · Daily · 10 AM - 11 PM IST",
  ],
  socials: [
    { label: "Instagram", icon: "instagram" },
    { label: "YouTube", icon: "youtube" },
    { label: "WhatsApp", icon: "message-circle" },
    { label: "Email", icon: "mail" },
  ],
};

export const catalogByCategory: Record<
  string,
  Array<{ name: string; description: string; price: string; image: string }>
> = {
  Necklaces: [
    {
      name: "Serene Polki Cascade",
      description: "Layered 22K gold with rose-cut diamonds and meenakari backs.",
      price: "₹4.8L",
      image:
        "https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Midnight Raani Haar",
      description: "Deep green tourmalines framed with kundan motifs.",
      price: "₹7.2L",
      image:
        "https://images.unsplash.com/photo-1507679622673-989605832e3d?auto=format&fit=crop&w=900&q=80",
    },
  ],
  Rings: [
    {
      name: "Noor Solitaire",
      description: "3ct EF VVS2 diamond set in floating 18K white gold.",
      price: "₹12.6L",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Verde Crown",
      description: "Emerald cabochon cradled by baguette diamonds.",
      price: "₹6.4L",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    },
  ],
  Bangles: [
    {
      name: "Heritage Kada Duo",
      description: "Pair of 22K kadas with floral filigree and pave diamonds.",
      price: "₹3.9L",
      image:
        "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Kaia Minimal Stack",
      description: "Matte gold bangles with enamel stripes and karat screws.",
      price: "₹2.1L",
      image:
        "https://images.unsplash.com/photo-1507679622673-989605832e3d?auto=format&fit=crop&w=900&q=80",
    },
  ],
  Earrings: [
    {
      name: "Jashn Chandbalis",
      description: "Kundan chandbalis with pearl tassels and polki studs.",
      price: "₹2.8L",
      image:
        "https://images.unsplash.com/photo-1518544889280-37f4ca38e4b4?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Aurora Climbers",
      description: "Diamond ear climbers with detachable drops.",
      price: "₹3.1L",
      image:
        "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80",
    },
  ],
  "Bridal Sets": [
    {
      name: "Rajkumari Suite",
      description: "Complimentary neck, earring and matha patti set.",
      price: "₹16.4L",
      image:
        "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&q=80",
    },
  ],
  "Men's Edit": [
    {
      name: "Maharaja Cufflinks",
      description: "Hand-carved tiger eye set in 18K gold.",
      price: "₹1.2L",
      image:
        "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Heritage Sarpech",
      description: "Bridal brooch featuring pearls and polki diamonds.",
      price: "₹5.5L",
      image:
        "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80",
    },
  ],
};

