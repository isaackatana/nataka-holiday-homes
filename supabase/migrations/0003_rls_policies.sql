-- =========================================================
-- 0003_rls_policies.sql
-- Row Level Security. Every table gets RLS enabled — nothing is left
-- open by default. Policy logic follows the access table from the
-- architecture doc:
--
--   Table               | anon         | customer                     | admin
--   --------------------|--------------|------------------------------|-------
--   profiles            | none         | own row only                 | all
--   properties          | published    | published                   | all
--   property_images     | via property | via property                 | all
--   amenities           | select       | select                       | all
--   property_amenities  | select       | select                       | all
--   booking_blocks      | select       | select                       | all
--   bookings            | insert only  | insert own + select own      | all
--   favorites           | none         | own rows only                | select all
--   reviews             | approved     | own + approved; insert own   | all
--   experiences         | published    | published                   | all
--   contact_messages    | insert only  | insert only                  | select/update
-- =========================================================

alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table amenities enable row level security;
alter table property_amenities enable row level security;
alter table booking_blocks enable row level security;
alter table bookings enable row level security;
alter table favorites enable row level security;
alter table reviews enable row level security;
alter table experiences enable row level security;
alter table experience_images enable row level security;
alter table contact_messages enable row level security;

-- ---------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------
create policy "profiles_select_own_or_admin"
  on profiles for select
  using (id = auth.uid() or is_admin());

create policy "profiles_update_own_or_admin"
  on profiles for update
  using (id = auth.uid() or is_admin());

-- No insert policy: rows are created only by the handle_new_user()
-- trigger (security definer), never directly by a client.
-- No delete policy: profiles are cascade-deleted with auth.users.

-- ---------------------------------------------------------
-- PROPERTIES
-- ---------------------------------------------------------
create policy "properties_select_published_or_admin"
  on properties for select
  using (is_published = true or is_admin());

create policy "properties_insert_admin"
  on properties for insert
  with check (is_admin());

create policy "properties_update_admin"
  on properties for update
  using (is_admin());

create policy "properties_delete_admin"
  on properties for delete
  using (is_admin());

-- ---------------------------------------------------------
-- PROPERTY IMAGES (visibility follows the parent property)
-- ---------------------------------------------------------
create policy "property_images_select"
  on property_images for select
  using (
    is_admin()
    or exists (
      select 1 from properties p
      where p.id = property_images.property_id and p.is_published = true
    )
  );

create policy "property_images_write_admin"
  on property_images for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------
-- AMENITIES / PROPERTY_AMENITIES (public reference data)
-- ---------------------------------------------------------
create policy "amenities_select_all"
  on amenities for select
  using (true);

create policy "amenities_write_admin"
  on amenities for all
  using (is_admin())
  with check (is_admin());

create policy "property_amenities_select_all"
  on property_amenities for select
  using (true);

create policy "property_amenities_write_admin"
  on property_amenities for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------
-- BOOKING_BLOCKS (readable by anyone, so the UI can grey out dates)
-- ---------------------------------------------------------
create policy "booking_blocks_select_all"
  on booking_blocks for select
  using (true);

create policy "booking_blocks_write_admin"
  on booking_blocks for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------
-- BOOKINGS (enquiries)
-- anon + customer can INSERT (guest checkout is allowed per the
-- architecture decision — customer_id is nullable). Only the owning
-- customer or an admin can SELECT/UPDATE/DELETE.
-- ---------------------------------------------------------
create policy "bookings_insert_anyone"
  on bookings for insert
  with check (
    -- if customer_id is set, it must match the caller (no impersonation);
    -- anonymous/guest enquiries with a null customer_id are also allowed.
    customer_id is null or customer_id = auth.uid()
  );

create policy "bookings_select_own_or_admin"
  on bookings for select
  using (customer_id = auth.uid() or is_admin());

create policy "bookings_update_admin"
  on bookings for update
  using (is_admin());

create policy "bookings_delete_admin"
  on bookings for delete
  using (is_admin());

-- ---------------------------------------------------------
-- FAVORITES
-- ---------------------------------------------------------
create policy "favorites_select_own_or_admin"
  on favorites for select
  using (customer_id = auth.uid() or is_admin());

create policy "favorites_insert_own"
  on favorites for insert
  with check (customer_id = auth.uid());

create policy "favorites_delete_own"
  on favorites for delete
  using (customer_id = auth.uid());

-- ---------------------------------------------------------
-- REVIEWS
-- Public sees only approved reviews. A customer can see their own
-- (any status) plus all approved ones, and may only insert a review
-- for a property they have a completed booking for.
-- ---------------------------------------------------------
create policy "reviews_select_approved_or_own_or_admin"
  on reviews for select
  using (status = 'approved' or customer_id = auth.uid() or is_admin());

create policy "reviews_insert_own_completed_stay"
  on reviews for insert
  with check (
    customer_id = auth.uid()
    and has_completed_booking(property_id)
  );

create policy "reviews_update_own_or_admin"
  on reviews for update
  using (customer_id = auth.uid() or is_admin());

create policy "reviews_delete_admin"
  on reviews for delete
  using (is_admin());

-- ---------------------------------------------------------
-- EXPERIENCES / EXPERIENCE_IMAGES
-- ---------------------------------------------------------
create policy "experiences_select_published_or_admin"
  on experiences for select
  using (is_published = true or is_admin());

create policy "experiences_write_admin"
  on experiences for all
  using (is_admin())
  with check (is_admin());

create policy "experience_images_select"
  on experience_images for select
  using (
    is_admin()
    or exists (
      select 1 from experiences e
      where e.id = experience_images.experience_id and e.is_published = true
    )
  );

create policy "experience_images_write_admin"
  on experience_images for all
  using (is_admin())
  with check (is_admin());

-- ---------------------------------------------------------
-- CONTACT MESSAGES (write-only for the public, staff-only to read)
-- ---------------------------------------------------------
create policy "contact_messages_insert_anyone"
  on contact_messages for insert
  with check (true);

create policy "contact_messages_select_admin"
  on contact_messages for select
  using (is_admin());

create policy "contact_messages_update_admin"
  on contact_messages for update
  using (is_admin());
