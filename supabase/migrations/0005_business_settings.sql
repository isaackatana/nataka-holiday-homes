-- =========================================================
-- 0005_business_settings.sql
-- A single-row table of business-wide settings an admin can edit from
-- /admin/settings, rather than baking them into env vars or hardcoding
-- them in components. The WhatsApp *number* stays a build-time env var
-- (VITE_WHATSAPP_NUMBER) since it's compiled into the client bundle and
-- genuinely can't be changed at runtime without a rebuild — but the
-- business phone line, contact email, address, and about text are all
-- pure content and belong in the database so an admin can change them
-- without a developer touching code.
-- =========================================================

create table business_settings (
  -- Enforces exactly one row via a fixed-value primary key rather than a
  -- separate "is this the active settings row" flag — simpler to query
  -- (`.single()` always just works) and impossible to accidentally end
  -- up with two "active" rows.
  id boolean primary key default true,
  business_name text not null default 'Nataka Holidays',
  contact_phone text,
  contact_email text,
  address text,
  about_blurb text,
  instagram_url text,
  facebook_url text,
  updated_at timestamptz not null default now(),
  constraint business_settings_singleton check (id)
);

create trigger trg_business_settings_updated_at
  before update on business_settings
  for each row execute function set_updated_at();

-- NOTE: on conflict do nothing means this seed only sets the name on a
-- fresh apply of this migration. If you've already run this against a
-- live project, updating this file won't retroactively rename anything
-- already deployed — use Admin → Settings in the app instead (that's
-- exactly what it's for).
insert into business_settings (id, business_name)
values (true, 'Nataka Holidays')
on conflict (id) do nothing;

alter table business_settings enable row level security;

create policy "business_settings_select_all"
  on business_settings for select
  using (true);

create policy "business_settings_update_admin"
  on business_settings for update
  using (is_admin());

-- No insert/delete policy: the single row is seeded above by this
-- migration; nothing in the app should ever create or remove it.
