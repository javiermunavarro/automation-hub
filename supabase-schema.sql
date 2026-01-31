-- AutomationHub Supabase Schema
-- Run this in your Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text not null default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  stripe_account_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'Zap'
);

alter table public.categories enable row level security;
create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

-- Automations
create table public.automations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  long_description text not null default '',
  category_id uuid references public.categories(id),
  creator_id uuid references public.profiles(id),
  price_monthly numeric(10,2) not null default 0,
  setup_fee numeric(10,2) not null default 0,
  thumbnail_url text,
  is_approved boolean not null default false,
  install_count integer not null default 0,
  avg_rating numeric(2,1) not null default 0,
  platform text not null default 'Make.com',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.automations enable row level security;

-- Everyone can see approved automations; creators see their own; admins see all
create policy "Approved automations are viewable by everyone"
  on public.automations for select using (
    is_approved = true
    or creator_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Sellers can insert their own automations"
  on public.automations for insert with check (creator_id = auth.uid());

-- Sellers can update their own; admins can update any (for approvals)
create policy "Sellers can update their own automations"
  on public.automations for update using (
    creator_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can delete automations (reject)
create policy "Admins can delete automations"
  on public.automations for delete using (
    creator_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid references public.automations(id),
  buyer_id uuid references public.profiles(id),
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  stripe_subscription_id text,
  monthly_price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select using (buyer_id = auth.uid());

create policy "Users can insert subscriptions"
  on public.subscriptions for insert with check (buyer_id = auth.uid());

create policy "Users can update their own subscriptions"
  on public.subscriptions for update using (buyer_id = auth.uid());

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid references public.automations(id),
  user_id uuid references public.profiles(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique(automation_id, user_id)
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Users can insert their own reviews"
  on public.reviews for insert with check (user_id = auth.uid());

-- Seed Data: Categories
insert into public.categories (name, slug, icon) values
  ('E-Commerce', 'ecommerce', 'ShoppingCart'),
  ('Real Estate', 'real-estate', 'Building2'),
  ('Marketing', 'marketing', 'Megaphone');

-- Seed Data: Automations
do $$
declare
  cat_ecommerce uuid;
  cat_realestate uuid;
  cat_marketing uuid;
begin
  select id into cat_ecommerce from public.categories where slug = 'ecommerce';
  select id into cat_realestate from public.categories where slug = 'real-estate';
  select id into cat_marketing from public.categories where slug = 'marketing';

  insert into public.automations (title, slug, short_description, long_description, category_id, price_monthly, setup_fee, is_approved, install_count, avg_rating, platform, tags) values
  (
    'AI Product Description Generator',
    'ai-product-description-generator',
    'Generate SEO-optimized product descriptions for your e-commerce store using GPT-4.',
    'This automation connects to your Shopify or WooCommerce store, analyzes your product images and attributes, and generates compelling, SEO-optimized product descriptions in multiple languages.',
    cat_ecommerce, 49, 99, true, 1243, 4.8, 'Make.com',
    array['ecommerce', 'copywriting', 'seo', 'gpt-4']
  ),
  (
    'Real Estate Lead Qualifier',
    'real-estate-lead-qualifier',
    'Automatically qualify and score incoming real estate leads using AI analysis.',
    'This automation intercepts leads from your website, Zillow, or Realtor.com, qualifies them using AI scoring based on budget, timeline, and intent signals.',
    cat_realestate, 79, 149, true, 876, 4.6, 'n8n',
    array['real-estate', 'leads', 'crm', 'scoring']
  ),
  (
    'Social Media Content Engine',
    'social-media-content-engine',
    'AI-powered social media content creation, scheduling, and analytics across platforms.',
    'Fully automated social media management with content generation for 5 platforms, optimal time scheduling, and engagement analytics.',
    cat_marketing, 59, 79, true, 2105, 4.9, 'Zapier',
    array['marketing', 'social-media', 'content', 'analytics']
  ),
  (
    'Invoice Processing Autopilot',
    'invoice-processing-autopilot',
    'Extract data from invoices, match with POs, and auto-post to your accounting system.',
    'End-to-end invoice processing automation using OCR and AI to extract invoice data with 99.5% accuracy.',
    cat_ecommerce, 89, 199, true, 654, 4.7, 'Make.com',
    array['finance', 'invoicing', 'ocr', 'accounting']
  ),
  (
    'AI Customer Support Chatbot',
    'ai-customer-support-chatbot',
    'Deploy a GPT-powered support chatbot trained on your knowledge base in minutes.',
    'A fully customizable AI chatbot that learns from your documentation, FAQs, and ticket history.',
    cat_marketing, 69, 129, true, 1890, 4.5, 'n8n',
    array['support', 'chatbot', 'gpt', 'customer-service']
  );
end $$;
