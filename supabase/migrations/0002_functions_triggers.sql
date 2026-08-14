-- =========================================================
-- 0002_functions_triggers.sql
-- Helper functions and triggers used by RLS policies and app logic.
-- =========================================================

-- ---------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_properties_updated_at
  before update on properties
  for each row execute function set_updated_at();

create trigger trg_bookings_updated_at
  before update on bookings
  for each row execute function set_updated_at();

create trigger trg_experiences_updated_at
  before update on experiences
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Auto-create a profiles row when a new Supabase Auth user signs up.
-- New users always land as 'customer' — there is no public path to
-- become 'admin' (see is_admin() usage in RLS policies below; admins
-- are promoted manually via the Supabase dashboard or a service-role
-- script, never through client-facing code).
-- ---------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'customer'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------
-- is_admin(): reused across every RLS policy below instead of
-- repeating a correlated subquery per policy (cleaner + avoids
-- Postgres re-evaluating the subquery per row in some plans).
-- security definer + fixed search_path so it can read `profiles`
-- regardless of the calling role's own RLS visibility into itself.
-- ---------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------
-- has_completed_booking(property_id): used by the reviews RLS
-- policy so a customer can only review a property they actually
-- stayed at (status = 'completed').
-- ---------------------------------------------------------
create or replace function has_completed_booking(p_property_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from bookings
    where property_id = p_property_id
      and customer_id = auth.uid()
      and status = 'completed'
  );
$$;
