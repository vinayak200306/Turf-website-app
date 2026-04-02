create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  phone text unique not null,
  email text,
  role text not null default 'customer',
  email_verified_at timestamp,
  created_at timestamp default now()
);

create table if not exists sports (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  icon text,
  description text,
  price_per_hour numeric not null,
  pricing_unit text not null default 'hour',
  image_url text,
  display_order integer not null default 1,
  rules_json jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamp default now()
);

create table if not exists slots (
  id uuid primary key default uuid_generate_v4(),
  sport_id uuid not null references sports(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'available',
  base_price numeric not null,
  created_at timestamp default now(),
  unique (sport_id, date, start_time, end_time)
);

create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_code text unique not null,
  user_id uuid references users(id),
  sport_id uuid references sports(id),
  slot_id uuid references slots(id),
  total_amount numeric not null,
  gst numeric not null,
  convenience_fee numeric not null,
  final_amount numeric not null,
  refund_amount numeric not null default 0,
  status text default 'confirmed',
  starts_at timestamptz,
  ends_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamp default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id),
  razorpay_payment_id text unique,
  razorpay_order_id text,
  razorpay_signature text,
  amount numeric not null default 0,
  method text,
  refunded_amount numeric not null default 0,
  webhook_event_id text,
  status text,
  created_at timestamp default now()
);

create table if not exists blocked_dates (
  id uuid primary key default uuid_generate_v4(),
  sport_id uuid references sports(id) on delete cascade,
  date date not null,
  reason text,
  created_at timestamp default now()
);
