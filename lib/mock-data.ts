import { Automation, Category } from "./types";

export const categories: Category[] = [
  { id: "1", name: "E-Commerce", slug: "ecommerce", icon: "ShoppingCart" },
  { id: "2", name: "Real Estate", slug: "real-estate", icon: "Building2" },
  { id: "3", name: "Marketing", slug: "marketing", icon: "Megaphone" },
  { id: "4", name: "Finance", slug: "finance", icon: "DollarSign" },
  { id: "5", name: "Customer Support", slug: "customer-support", icon: "Headphones" },
  { id: "6", name: "Data & Analytics", slug: "data-analytics", icon: "BarChart3" },
];

export const automations: Automation[] = [
  {
    id: "1",
    title: "AI Product Description Generator",
    slug: "ai-product-description-generator",
    short_description:
      "Generate SEO-optimized product descriptions for your e-commerce store using GPT-4.",
    long_description:
      "This automation connects to your Shopify or WooCommerce store, analyzes your product images and attributes, and generates compelling, SEO-optimized product descriptions in multiple languages. It includes A/B testing capabilities and adapts tone based on your brand voice.\n\nFeatures:\n- Multi-language support (EN, ES, FR, DE)\n- Brand voice customization\n- SEO keyword integration\n- Bulk processing up to 1000 products\n- A/B test variant generation",
    category_id: "1",
    creator_id: "user-1",
    price_monthly: 49,
    setup_fee: 99,
    thumbnail_url: "/thumbnails/product-desc.jpg",
    is_approved: true,
    install_count: 1243,
    avg_rating: 4.8,
    platform: "Make.com",
    tags: ["ecommerce", "copywriting", "seo", "gpt-4"],
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Real Estate Lead Qualifier",
    slug: "real-estate-lead-qualifier",
    short_description:
      "Automatically qualify and score incoming real estate leads using AI analysis.",
    long_description:
      "This automation intercepts leads from your website, Zillow, or Realtor.com, qualifies them using AI scoring based on budget, timeline, and intent signals, then routes hot leads directly to your CRM with priority tagging.\n\nFeatures:\n- Multi-source lead capture\n- AI-powered scoring (0-100)\n- CRM auto-routing (HubSpot, Salesforce)\n- Automated follow-up sequences\n- Weekly performance reports",
    category_id: "2",
    creator_id: "user-2",
    price_monthly: 79,
    setup_fee: 149,
    thumbnail_url: "/thumbnails/lead-qualifier.jpg",
    is_approved: true,
    install_count: 876,
    avg_rating: 4.6,
    platform: "n8n",
    tags: ["real-estate", "leads", "crm", "scoring"],
    created_at: "2024-02-10T00:00:00Z",
  },
  {
    id: "3",
    title: "Social Media Content Engine",
    slug: "social-media-content-engine",
    short_description:
      "AI-powered social media content creation, scheduling, and analytics across platforms.",
    long_description:
      "Fully automated social media management. This automation generates platform-specific content (Instagram carousels, Twitter threads, LinkedIn posts), schedules them optimally, and provides engagement analytics.\n\nFeatures:\n- Content generation for 5 platforms\n- Optimal time scheduling\n- Hashtag research & optimization\n- Engagement analytics dashboard\n- Competitor content monitoring",
    category_id: "3",
    creator_id: "user-1",
    price_monthly: 59,
    setup_fee: 79,
    thumbnail_url: "/thumbnails/social-engine.jpg",
    is_approved: true,
    install_count: 2105,
    avg_rating: 4.9,
    platform: "Zapier",
    tags: ["marketing", "social-media", "content", "analytics"],
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    title: "Invoice Processing Autopilot",
    slug: "invoice-processing-autopilot",
    short_description:
      "Extract data from invoices, match with POs, and auto-post to your accounting system.",
    long_description:
      "End-to-end invoice processing automation. Uses OCR and AI to extract invoice data, matches against purchase orders, flags discrepancies, and posts approved invoices to QuickBooks or Xero.\n\nFeatures:\n- OCR with 99.5% accuracy\n- PO matching & validation\n- Approval workflow routing\n- Multi-currency support\n- QuickBooks & Xero integration",
    category_id: "4",
    creator_id: "user-3",
    price_monthly: 89,
    setup_fee: 199,
    thumbnail_url: "/thumbnails/invoice-pilot.jpg",
    is_approved: true,
    install_count: 654,
    avg_rating: 4.7,
    platform: "Make.com",
    tags: ["finance", "invoicing", "ocr", "accounting"],
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "5",
    title: "AI Customer Support Chatbot",
    slug: "ai-customer-support-chatbot",
    short_description:
      "Deploy a GPT-powered support chatbot trained on your knowledge base in minutes.",
    long_description:
      "A fully customizable AI chatbot that learns from your documentation, FAQs, and ticket history. Handles L1 support queries automatically and seamlessly escalates complex issues to human agents.\n\nFeatures:\n- Custom knowledge base training\n- Multi-language support\n- Seamless human handoff\n- Ticket creation & tracking\n- Analytics & satisfaction scoring",
    category_id: "5",
    creator_id: "user-2",
    price_monthly: 69,
    setup_fee: 129,
    thumbnail_url: "/thumbnails/chatbot.jpg",
    is_approved: true,
    install_count: 1890,
    avg_rating: 4.5,
    platform: "n8n",
    tags: ["support", "chatbot", "gpt", "customer-service"],
    created_at: "2024-02-25T00:00:00Z",
  },
];

export const mockReviews = [
  {
    id: "1",
    automation_id: "1",
    user_id: "user-4",
    rating: 5,
    comment:
      "Incredible tool! Saved us 40+ hours per week on product descriptions. The quality is indistinguishable from human-written copy.",
    created_at: "2024-03-10T00:00:00Z",
    user: { id: "user-4", email: "maria@example.com", full_name: "María García", role: "buyer" as const, stripe_account_id: null, created_at: "" },
  },
  {
    id: "2",
    automation_id: "1",
    user_id: "user-5",
    rating: 5,
    comment:
      "Setup was smooth, support was responsive. Already seeing a 23% increase in conversion rates from the improved descriptions.",
    created_at: "2024-03-15T00:00:00Z",
    user: { id: "user-5", email: "james@example.com", full_name: "James Wilson", role: "buyer" as const, stripe_account_id: null, created_at: "" },
  },
  {
    id: "3",
    automation_id: "1",
    user_id: "user-6",
    rating: 4,
    comment:
      "Great automation overall. Multi-language support works well for EN and ES, but FR needs some improvement.",
    created_at: "2024-04-01T00:00:00Z",
    user: { id: "user-6", email: "lucas@example.com", full_name: "Lucas Dupont", role: "buyer" as const, stripe_account_id: null, created_at: "" },
  },
];
