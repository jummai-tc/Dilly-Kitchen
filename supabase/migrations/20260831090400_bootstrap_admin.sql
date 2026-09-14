-- ============================================================================
-- Bootstrap the first admin.
--
-- `admin_users` has no public insert path by design, which leaves the usual
-- chicken-and-egg problem: the first row has to come from somewhere trusted.
-- A migration is that somewhere — it runs with database privileges through the
-- Supabase CLI, so no service role key is needed anywhere in this repo.
--
-- The named account must already exist in auth.users (create it in the Supabase
-- dashboard, or with `node scripts/create-admin.mjs <email>`). If it does not,
-- this is a no-op rather than an error, so the migration stays safe to re-run.
--
-- To add further admins later, use the Supabase dashboard: Authentication →
-- Users to create the account, then Table Editor → admin_users to allow-list it.
-- ============================================================================

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where lower(email) = lower('dillykitchen07@gmail.com')
on conflict (user_id) do nothing;
