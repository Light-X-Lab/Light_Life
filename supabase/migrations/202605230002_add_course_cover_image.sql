alter table if exists public.courses
add column if not exists cover_image_url text;
