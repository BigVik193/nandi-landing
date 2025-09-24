-- Create developers table with Supabase Auth integration
create table if not exists public.developers (
  id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  terms_accepted_at timestamptz,
  data_processing_consent_at timestamptz,
  account_source text default 'onboarding' check (account_source in ('onboarding', 'invite', 'api')),
  workspace_name text,
  company_size text,
  role text,
  phone_number text,
  time_zone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  primary key (id)
);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger developers_updated_at
  before update on public.developers
  for each row execute function public.handle_updated_at();

-- Add RLS policies
alter table public.developers enable row level security;

-- Developers can only access their own data
create policy "Developers can view their own profile"
on public.developers for all
to authenticated
using (auth.uid() = id);

-- Add indexes
create index idx_developers_email on public.developers(email);
create index idx_developers_created_at on public.developers(created_at);
create index idx_developers_workspace_name on public.developers(workspace_name);
create index idx_developers_account_source on public.developers(account_source);
create index idx_developers_terms_accepted_at on public.developers(terms_accepted_at);

-- Create function to handle new user signup
create or replace function public.handle_new_developer()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.developers (id, email, name, workspace_name, company_size, role, phone_number, time_zone)
  values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', 'Developer'),
    new.raw_user_meta_data ->> 'workspace_name',
    new.raw_user_meta_data ->> 'company_size', 
    new.raw_user_meta_data ->> 'role',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'time_zone'
  );
  return new;
end;
$$;

-- Trigger to automatically create developer profile when user signs up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_developer();

-- Function to get current developer from auth context
create or replace function public.get_current_developer()
returns uuid
language sql
security definer
as $$
  select auth.uid();
$$;