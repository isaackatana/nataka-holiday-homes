-- =========================================================
-- 0001_initial_schema.sql
-- Core enums, tables, and indexes for Nataka Holiday Homes.
-- Run this first. Safe to run once against a fresh Supabase project.
-- =========================================================

-- gen_random_uuid() comes from pgcrypto, which Supabase enables by default.
-- Uncomment if you're running against a non-Supabase Postgres:
-- create extension if not exists pgcrypto;

-- =========================================================
-- ENUM TYPES
-- =========================================================
create type user_role as enum ('customer', 'admin');
create type property_type as enum ('villa', 'apartment', 'cottage', 'beach_house', 'other');
create type booking_status as enum ('pending', 'contacted', 'confirmed', 'cancelled', 'completed');
create type review_status as enum ('pending', 'approved', 'rejected');

-- =========================================================
-- PROFILES (extends auth.users — one row per Supabase Auth user)
-- =========================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- PROPERTIES
-- =========================================================
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  location text not null,
  latitude double precision,
  longitude double precision,
  property_type property_type not null default 'villa',
  price_per_night numeric(10,2) not null,
  cleaning_fee numeric(10,2) not null default 0,
  max_guests int not null default 2,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  house_rules text,
  check_in_time time not null default '14:00',
  check_out_time time not null default '10:00',
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint price_positive check (price_per_night >= 0),
  constraint cleaning_fee_positive check (cleaning_fee >= 0),
  constraint guests_positive check (max_guests > 0)
);
create index idx_properties_published on properties (is_published);
create index idx_properties_featured on properties (is_featured) where is_featured = true;
create index idx_properties_location on properties (location);
create index idx_properties_price on properties (price_per_night);
create index idx_properties_type on properties (property_type);

-- =========================================================
-- PROPERTY IMAGES
-- =========================================================
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_property_images_property on property_images (property_id, sort_order);
create unique index uniq_primary_image_per_property
  on property_images (property_id) where is_primary = true;

-- =========================================================
-- AMENITIES (master list) + JOIN TABLE
-- =========================================================
create table amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text,
  created_at timestamptz not null default now()
);

create table property_amenities (
  property_id uuid not null references properties(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (property_id, amenity_id)
);

-- =========================================================
-- AVAILABILITY BLOCKS (blackout / already-booked ranges)
-- =========================================================
create table booking_blocks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint valid_block_range check (end_date > start_date)
);
create index idx_booking_blocks_property_dates on booking_blocks (property_id, start_date, end_date);

-- =========================================================
-- BOOKINGS (enquiries — no payment yet)
-- =========================================================
create table bookings (
  id uuid primary key default gen_random_uuid(),
  -- Nullable + SET NULL (not the NO ACTION default) so an admin can delete
  -- a delisted property without being blocked by its enquiry history —
  -- the booking row survives with property_id = null. The customer- and
  -- admin-facing UIs both already handle a null joined property as
  -- "Deleted property" rather than assuming it's always present.
  property_id uuid references properties(id) on delete set null,
  customer_id uuid references profiles(id),
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  check_in date not null,
  check_out date not null,
  guests int not null default 1,
  message text,
  nights int generated always as (check_out - check_in) stored,
  estimated_total numeric(10,2),
  status booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_booking_dates check (check_out > check_in)
);
create index idx_bookings_property on bookings (property_id);
create index idx_bookings_customer on bookings (customer_id);
create index idx_bookings_status on bookings (status);

-- =========================================================
-- FAVORITES
-- =========================================================
create table favorites (
  customer_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, property_id)
);

-- =========================================================
-- REVIEWS
-- =========================================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  customer_id uuid not null references profiles(id) on delete cascade,
  booking_id uuid references bookings(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  status review_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index idx_reviews_property on reviews (property_id, status);
create unique index uniq_review_per_booking on reviews (booking_id) where booking_id is not null;

-- =========================================================
-- EXPERIENCES
-- =========================================================
create table experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  location text,
  price numeric(10,2),
  duration text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table experience_images (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references experiences(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- CONTACT MESSAGES
-- =========================================================
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
