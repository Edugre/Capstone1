-- Give every class, assignment and task an owner, and lock the tables down
-- with Row Level Security.
--
-- The app's server code uses the secret key (which bypasses RLS) and filters
-- by user_id itself; see lib/data.ts and lib/actions.ts. These policies are the
-- backstop for anything that talks to the database with the publishable key.

alter table public.classes
  add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table public.assignments
  add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table public.tasks
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

-- Rows inserted with a user's own session get that user by default.
alter table public.classes alter column user_id set default auth.uid();
alter table public.assignments alter column user_id set default auth.uid();
alter table public.tasks alter column user_id set default auth.uid();

create index if not exists classes_user_id_idx on public.classes (user_id);
create index if not exists assignments_user_id_idx on public.assignments (user_id);
create index if not exists tasks_user_id_idx on public.tasks (user_id);

alter table public.classes enable row level security;
alter table public.assignments enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Owners manage their classes" on public.classes;
create policy "Owners manage their classes" on public.classes
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Owners manage their assignments" on public.assignments;
create policy "Owners manage their assignments" on public.assignments
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Owners manage their tasks" on public.tasks;
create policy "Owners manage their tasks" on public.tasks
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Existing rows have no owner yet, so nobody sees them after this migration.
-- Once you've signed up, claim them by running this with your email:
--
--   update public.classes     set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--   update public.assignments set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--   update public.tasks       set user_id = (select id from auth.users where email = 'you@example.com') where user_id is null;
--
-- Then make ownership required:
--
--   alter table public.classes     alter column user_id set not null;
--   alter table public.assignments alter column user_id set not null;
--   alter table public.tasks       alter column user_id set not null;
