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

export const jewellerySpotlight: Array<{
  name: string;
  detail: string;
  image: any;
}> = [
  {
    name: "Mogra Polki Choker",
    detail: "22K gold · 8ct uncut diamonds · detachable passa",
    image: require("../assets/jawellery-images/jawelery-image-2.jpg"),
  },
  {
    name: "Verdant Tide Earrings",
    detail: "Colombian emeralds · rose-cut halos",
    image: require("../assets/jawellery-images/jawellery-image-3.jpg"),
  },
  {
    name: "Noor Statement Ring",
    detail: "18K white gold · 3.1ct diamond solitaire",
    image: require("../assets/jawellery-images/ring-2.jpeg"),
  },
  {
    name: "Kaia Stacked Bangles",
    detail: "Matte-finish gold · enamel inlays",
    image: require("../assets/jawellery-images/gold-bangle.jpg"),
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
  Array<{ name: string; description: string; price: string; image: any }>
> = {
  Necklaces: [
    {
      name: "Serene Polki Cascade",
      description: "Layered 22K gold with rose-cut diamonds and meenakari backs.",
      price: "₹4.8L",
      image: require("../assets/jawellery-images/necklase-4.jpeg"),
    },
    {
      name: "Midnight Raani Haar",
      description: "Deep green tourmalines framed with kundan motifs.",
      price: "₹7.2L",
      image: require("../assets/jawellery-images/necklase-6.jpeg"),
    },
    {
      name: "Emerald Raani Set",
      description: "Graduated necklace with centre emerald pendant.",
      price: "₹5.6L",
      image: require("../assets/jawellery-images/Gold-neckles.jpg"),
    },
    {
      name: "Temple Heritage Haar",
      description: "Antique temple motifs with ruby highlights.",
      price: "₹8.3L",
      image: require("../assets/jawellery-images/necklase-7.jpeg"),
    },
  ],
  Rings: [
    {
      name: "Noor Solitaire",
      description: "3ct EF VVS2 diamond set in floating 18K white gold.",
      price: "₹12.6L",
      image: require("../assets/jawellery-images/ring-1.jpeg"),
    },
    {
      name: "Verde Crown",
      description: "Emerald cabochon cradled by baguette diamonds.",
      price: "₹6.4L",
      image: require("../assets/jawellery-images/ring-4.jpeg"),
    },
    {
      name: "Eternity Pavé Band",
      description: "Full diamond band in 18K white gold.",
      price: "₹3.2L",
      image: require("../assets/jawellery-images/ring-2.jpeg"),
    },
    {
      name: "Royal Cocktail Ring",
      description: "Oversized coloured stone with double halo.",
      price: "₹4.1L",
      image: require("../assets/jawellery-images/ring-6.jpeg"),
    },
  ],
  Bangles: [
    {
      name: "Heritage Kada Duo",
      description: "Pair of 22K kadas with floral filigree and pave diamonds.",
      price: "₹3.9L",
      image: require("../assets/jawellery-images/gold-bangle.jpg"),
    },
    {
      name: "Kaia Minimal Stack",
      description: "Matte gold bangles with enamel stripes and karat screws.",
      price: "₹2.1L",
      image: require("../assets/jawellery-images/jawellery-12.jpg"),
    },
    {
      name: "Meenakari Kada",
      description: "Vibrant enamel work with heritage motifs.",
      price: "₹2.9L",
      image: require("../assets/jawellery-images/jawellery-9.jpg"),
    },
    {
      name: "Diamond Half Kada",
      description: "Single row diamond bangle with openable clasp.",
      price: "₹3.4L",
      image: require("../assets/jawellery-images/jawellery-11.jpg"),
    },
  ],
  Earrings: [
    {
      name: "Jashn Chandbalis",
      description: "Kundan chandbalis with pearl tassels and polki studs.",
      price: "₹2.8L",
      image: require("../assets/jawellery-images/jawellery-13.jpg"),
    },
    {
      name: "Aurora Climbers",
      description: "Diamond ear climbers with detachable drops.",
      price: "₹3.1L",
      image: require("../assets/jawellery-images/jawellery-113.jpg"),
    },
    {
      name: "Lotus Studs",
      description: "Polki and pearl lotus motif studs.",
      price: "₹1.6L",
      image: require("../assets/jawellery-images/jawellery-8.jpg"),
    },
    {
      name: "Drop Chandeliers",
      description: "Layered diamond drops for evening wear.",
      price: "₹3.9L",
      image: require("../assets/jawellery-images/jawellery-image-3.jpg"),
    },
  ],
  "Bridal Sets": [
    {
      name: "Rajkumari Suite",
      description: "Complimentary neck, earring and matha patti set.",
      price: "₹16.4L",
      image: require("../assets/jawellery-images/necklash-8.jpeg"),
    },
    {
      name: "Noor Bridal Suite",
      description: "Complete polki bridal suite with passa and nath.",
      price: "₹22.0L",
      image: require("../assets/jawellery-images/jawelery-image-2.jpg"),
    },
    {
      name: "Heritage Maharani Set",
      description: "Multi-layered haar with matching danglers.",
      price: "₹19.5L",
      image: require("../assets/jawellery-images/necklase-1.jpeg"),
    },
  ],
  "Men's Edit": [
    {
      name: "Maharaja Cufflinks",
      description: "Hand-carved tiger eye set in 18K gold.",
      price: "₹1.2L",
      image: require("../assets/jawellery-images/ring-5.jpeg"),
    },
    {
      name: "Heritage Sarpech",
      description: "Bridal brooch featuring pearls and polki diamonds.",
      price: "₹5.5L",
      image: require("../assets/jawellery-images/ring-7.jpg"),
    },
    {
      name: "Signet Statement Ring",
      description: "Bold signet with brushed gold finish.",
      price: "₹2.4L",
      image: require("../assets/jawellery-images/ring-3.jpeg"),
    },
    {
      name: "Minimal Cuff Bracelet",
      description: "Sleek 18K cuff with subtle detailing.",
      price: "₹2.1L",
      image: require("../assets/jawellery-images/jawellery-12.jpg"),
    },
  ],
};

