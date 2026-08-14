-- =========================================================
-- 0004_storage.sql
-- Storage buckets for property and experience photos.
-- Public read (so <img> tags work without signed URLs), admin-only write.
-- =========================================================

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('experience-images', 'experience-images', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- property-images bucket
-- ---------------------------------------------------------
create policy "property_images_bucket_select_public"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "property_images_bucket_insert_admin"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and is_admin());

create policy "property_images_bucket_update_admin"
  on storage.objects for update
  using (bucket_id = 'property-images' and is_admin());

create policy "property_images_bucket_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'property-images' and is_admin());

-- ---------------------------------------------------------
-- experience-images bucket
-- ---------------------------------------------------------
create policy "experience_images_bucket_select_public"
  on storage.objects for select
  using (bucket_id = 'experience-images');

create policy "experience_images_bucket_insert_admin"
  on storage.objects for insert
  with check (bucket_id = 'experience-images' and is_admin());

create policy "experience_images_bucket_update_admin"
  on storage.objects for update
  using (bucket_id = 'experience-images' and is_admin());

create policy "experience_images_bucket_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'experience-images' and is_admin());
