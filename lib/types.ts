export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "buyer" | "seller" | "admin";
  stripe_account_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Automation {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  category_id: string;
  creator_id: string;
  price_monthly: number;
  setup_fee: number;
  thumbnail_url: string;
  is_approved: boolean;
  install_count: number;
  avg_rating: number;
  platform: string;
  tags: string[];
  created_at: string;
  category?: Category;
  creator?: Profile;
}

export interface Subscription {
  id: string;
  automation_id: string;
  buyer_id: string;
  status: "active" | "canceled" | "past_due";
  stripe_subscription_id: string;
  monthly_price: number;
  created_at: string;
  automation?: Automation;
}

export interface Review {
  id: string;
  automation_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: Profile;
}
