-- Create developers table
create table if not exists public.developers (
  id bigint primary key generated always as identity,
  email text unique not null,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
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

-- Add RLS policies (enable later when auth is set up)
alter table public.developers enable row level security;

-- Add indexes
create index idx_developers_email on public.developers(email);
create index idx_developers_created_at on public.developers(created_at);