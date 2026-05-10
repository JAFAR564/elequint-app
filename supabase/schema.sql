-- ============================================================
-- Elequint Platform Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  display_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when new.email = 'chariskimbeki@gmail.com' then 'admin' else 'client' end
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Commissions
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles on delete set null,
  community_name text not null,
  genre text not null,
  platform text not null,
  member_count text,
  tier text not null check (tier in ('foundation', 'presence', 'architecture')),
  goals text,
  inspiration text,
  existing_assets text,
  timeline text,
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'approved', 'active', 'delivered', 'closed', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.commissions enable row level security;
create policy "Clients can read own commissions" on public.commissions
  for select using (auth.uid() = client_id);
create policy "Clients can create commissions" on public.commissions
  for insert with check (auth.uid() = client_id);
create policy "Admins can do everything on commissions" on public.commissions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  commission_id uuid references public.commissions on delete set null,
  client_id uuid references public.profiles on delete set null,
  title text not null,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'review', 'revision', 'delivered', 'complete')),
  notes text,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Clients can read own projects" on public.projects
  for select using (auth.uid() = client_id);
create policy "Admins can do everything on projects" on public.projects
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Deliverables
create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  url text,
  type text not null check (type in ('file', 'link', 'preview', 'code')),
  description text,
  created_at timestamptz not null default now()
);
alter table public.deliverables enable row level security;
create policy "Clients can read deliverables for own projects" on public.deliverables
  for select using (
    exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
  );
create policy "Admins can do everything on deliverables" on public.deliverables
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects on delete cascade not null,
  sender_id uuid references public.profiles on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create policy "Project participants can read messages" on public.messages
  for select using (
    exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Project participants can send messages" on public.messages
  for insert with check (
    auth.uid() = sender_id and (
      exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
      or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    )
  );

-- Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger commissions_updated_at before update on public.commissions
  for each row execute procedure public.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute procedure public.set_updated_at();
