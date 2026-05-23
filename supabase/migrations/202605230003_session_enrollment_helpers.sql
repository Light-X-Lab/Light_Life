create or replace function public.increment_seats_reserved(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.course_sessions
  set seats_reserved = seats_reserved + 1,
      status = case when seats_reserved + 1 >= seats_total then 'full' else status end,
      updated_at = now()
  where id = p_session_id;
end;
$$;

grant execute on function public.increment_seats_reserved(uuid) to authenticated, service_role;
