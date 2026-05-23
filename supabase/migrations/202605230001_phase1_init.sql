-- Light Life Phase 1 schema + RLS
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('admin','student')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10,2),
  capacity int,
  status text not null default 'draft' check (status in ('draft','published','closed')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text,
  seats_total int,
  seats_reserved int not null default 0,
  status text not null default 'open' check (status in ('open','full','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_course_session_time check (end_time > start_time)
);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.course_sessions(id) on delete cascade,
  student_user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  student_phone text,
  note text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(session_id, student_user_id)
);

create table if not exists public.consultation_slots (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_available boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_consultation_slot_time check (end_time > start_time)
);

create table if not exists public.consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null unique references public.consultation_slots(id) on delete cascade,
  student_user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  student_phone text,
  topic text,
  status text not null default 'booked' check (status in ('booked','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_course_sessions_course_id on public.course_sessions(course_id);
create index if not exists idx_course_enrollments_student on public.course_enrollments(student_user_id);
create index if not exists idx_consultation_slots_start_time on public.consultation_slots(start_time);
create index if not exists idx_consultation_bookings_student on public.consultation_bookings(student_user_id);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (select 1 from public.admin_users a where a.user_id = uid);
$$;

create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger trg_courses_updated_at before update on public.courses
for each row execute function public.set_updated_at();
create trigger trg_course_sessions_updated_at before update on public.course_sessions
for each row execute function public.set_updated_at();
create trigger trg_course_enrollments_updated_at before update on public.course_enrollments
for each row execute function public.set_updated_at();
create trigger trg_consultation_slots_updated_at before update on public.consultation_slots
for each row execute function public.set_updated_at();
create trigger trg_consultation_bookings_updated_at before update on public.consultation_bookings
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.courses enable row level security;
alter table public.course_sessions enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.consultation_slots enable row level security;
alter table public.consultation_bookings enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on public.profiles for select
using (auth.uid() = id or public.is_admin(auth.uid()));
create policy "profiles_insert_own" on public.profiles for insert
with check (auth.uid() = id);
create policy "profiles_update_own_or_admin" on public.profiles for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

-- admin_users
create policy "admin_users_admin_only" on public.admin_users for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- courses and sessions readable publicly when published/open; admin full
create policy "courses_public_read" on public.courses for select
using (status = 'published' or public.is_admin(auth.uid()));
create policy "courses_admin_write" on public.courses for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "course_sessions_public_read" on public.course_sessions for select
using (
  public.is_admin(auth.uid())
  or exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
);
create policy "course_sessions_admin_write" on public.course_sessions for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- enrollments
create policy "enrollments_select_own_or_admin" on public.course_enrollments for select
using (student_user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "enrollments_insert_own_or_admin" on public.course_enrollments for insert
with check (student_user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "enrollments_update_own_or_admin" on public.course_enrollments for update
using (student_user_id = auth.uid() or public.is_admin(auth.uid()))
with check (student_user_id = auth.uid() or public.is_admin(auth.uid()));

-- consultation
create policy "consultation_slots_public_read" on public.consultation_slots for select
using (is_available = true or public.is_admin(auth.uid()));
create policy "consultation_slots_admin_write" on public.consultation_slots for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "consultation_bookings_select_own_or_admin" on public.consultation_bookings for select
using (student_user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "consultation_bookings_insert_own_or_admin" on public.consultation_bookings for insert
with check (student_user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "consultation_bookings_update_own_or_admin" on public.consultation_bookings for update
using (student_user_id = auth.uid() or public.is_admin(auth.uid()))
with check (student_user_id = auth.uid() or public.is_admin(auth.uid()));
