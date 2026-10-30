import {
  HeroSlide,
  LookbookEnsemble,
  PressQuote,
  JournalArticle,
  InstagramPost,
} from "../types/homepage";

export const MOCK_HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    badge: "Runway Capsule • SS 2026",
    title: "The Heritage & Horizon Edit",
    subtitle: "Where Centuries of Banarasi Weaving Meet Modern Architectural Silhouettes",
    description: "Handcrafted pure Katan silks and ethereal sheer organza drapes, hand-spun by master artisans in Varanasi.",
    primaryCtaText: "Explore Collection",
    primaryCtaLink: "/collections",
    secondaryCtaText: "View Lookbook",
    secondaryCtaLink: "/products?sort=newest",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&auto=format&fit=crop&q=85",
    mobileImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80",
    alignment: "left",
    seasonTag: "Vol. 08 / Varanasi Atelier",
  },
  {
    id: "hero-2",
    badge: "Haute Couture Eveningwear",
    title: "Sculpted in French Silk Tulle",
    subtitle: "Bespoke Victorian Corsetry & Flowing Fishtail Gowns",
    description: "Floor-sweeping gala attire, structured boning, and delicate hand-embroidered Swarovski crystals.",
    primaryCtaText: "Discover Evening Gowns",
    primaryCtaLink: "/collections",
    secondaryCtaText: "Bespoke Styling",
    secondaryCtaLink: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1920&auto=format&fit=crop&q=85",
    mobileImageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=80",
    alignment: "center",
    seasonTag: "Salon Privé • Limited Release",
  },
  {
    id: "hero-3",
    badge: "Royal Bridal Suite",
    title: "Velvet Heirlooms & Zardozi Flares",
    subtitle: "Artisanal Dabka Embroidery for the Discerning Bride",
    description: "Plush micro-velvet lehengas paired with scalloped organza dupattas, crafted across 300 hours of slow hand-embroidery.",
    primaryCtaText: "Shop Bridal Heirlooms",
    primaryCtaLink: "/collections",
    secondaryCtaText: "Book Atelier Visit",
    secondaryCtaLink: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1583391733975-045332f9e421?w=1920&auto=format&fit=crop&q=85",
    mobileImageUrl: "https://images.unsplash.com/photo-1583391733975-045332f9e421?w=900&auto=format&fit=crop&q=80",
    alignment: "right",
    seasonTag: "Bridal Couture • Handcrafted in India",
  },
];

export const MOCK_LOOKBOOK_ENSEMBLE: LookbookEnsemble = {
  id: "ensemble-bridal-salon",
  title: "The Regal Varanasi Drape",
  subtitle: "Curated Ensemble • Winter Solstice Edit",
  description: "A complete imperial aesthetic pairing our signature Katan Banarasi Jangla Saree with hand-embroidered antique velvet and heirloom jewelry.",
  mainImageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85",
  hotspots: [],
};

export const MOCK_PRESS_QUOTES: PressQuote[] = [
  {
    id: "press-1",
    quote: "Saayal Stories accomplishes what few contemporary labels dare: harmonizing sacred Vedic handlooms with the architectural restraint of European couture.",
    publication: "VOGUE INDIA",
    city: "Mumbai",
  },
  {
    id: "press-2",
    quote: "A masterclass in tactile luxury. The weight of their Banarasi Katan silk and the precision of their Victorian corset boning is simply unrivaled.",
    publication: "ELLE ATELIER",
    city: "New Delhi",
  },
  {
    id: "press-3",
    quote: "For women who seek heirloom bridal wear free of garish commercialism, Saayal is the definitive destination for quiet royal elegance.",
    publication: "HARPER'S BAZAAR",
    city: "London",
  },
];

export const MOCK_JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "article-1",
    slug: "preserving-pure-gold-zari-sarees",
    title: "The Architecture of Heirloom Zari: Caring for Pure Silver & Gold Weaves",
    excerpt: "Ancient storage rituals and modern climate precautions to ensure your heirloom sarees endure for three generations.",
    category: "Textile Preservation",
    readTime: "6 min read",
    publishedDate: "October 14, 2026",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "article-2",
    slug: "evolution-of-the-bridal-veil",
    title: "From Dupatta to Red-Carpet Cape: The Evolution of Royal Bridal Drapes",
    excerpt: "How contemporary brides are pairing traditional zardozi lehengas with architectural floor-length sheer tulle capes.",
    category: "Bridal Styling",
    readTime: "5 min read",
    publishedDate: "October 02, 2026",
    imageUrl: "https://images.unsplash.com/photo-1583391733975-045332f9e421?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "article-3",
    slug: "inside-our-varanasi-loomhouse",
    title: "Slow Luxury in Motion: 14 Days at Our Heritage Loomhouse in Ramnagar",
    excerpt: "Meet master weaver Shambu Nath and the generational artisans who spend 340 hours weaving a single Jangla bridal saree.",
    category: "Artisan Chronicles",
    readTime: "8 min read",
    publishedDate: "September 18, 2026",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
  },
];

export const MOCK_INSTAGRAM_FEED: InstagramPost[] = [
  {
    id: "ig-1",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    altText: "Banarasi Emerald Silk Saree",
    permalink: "https://instagram.com",
    caption: "The radiant @ananya.roy draped in our limited-edition Kanjivaram Emerald Silk Saree for the Diwali Gala at Taj Lake Palace.",
    likes: 1420,
  },
  {
    id: "ig-2",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80",
    altText: "Seraphina Gown Swarovski pearls",
    permalink: "https://instagram.com",
    caption: "Backstage couture moments. Hand-sewing real Swarovski pearls onto the corseted bodice of the Seraphina Gown.",
    likes: 2180,
  },
  {
    id: "ig-3",
    imageUrl: "https://images.unsplash.com/photo-1583391733975-045332f9e421?w=600&auto=format&fit=crop&q=80",
    altText: "Noor Bridal Lehenga",
    permalink: "https://instagram.com",
    caption: "The Noor Bridal Lehenga: A celebration of slow zardozi, antique dabka, and generational heritage in royal crimson velvet.",
    likes: 3410,
  },
  {
    id: "ig-4",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80",
    altText: "Celestia Draped Silk Kaftan",
    permalink: "https://instagram.com",
    caption: "Sun-drenched holiday mornings in Amalfi. The Celestia Draped Silk Kaftan is effortless, packable, and pure poetry in motion.",
    likes: 980,
  },
];
