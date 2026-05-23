import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return { supabase, user };
}

async function createSession(formData: FormData) {
  'use server';
  const { supabase } = await requireUser();
  const courseId = String(formData.get('course_id') || '');
  const startTime = String(formData.get('start_time') || '');
  const endTime = String(formData.get('end_time') || '');
  const seatsTotal = Number(String(formData.get('seats_total') || '0'));
  if (!courseId || !startTime || !endTime || seatsTotal <= 0) return;

  await supabase.from('course_sessions').insert({
    course_id: courseId,
    start_time: new Date(startTime).toISOString(),
    end_time: new Date(endTime).toISOString(),
    seats_total: seatsTotal,
    status: 'open',
  });

  revalidatePath('/admin/course-sessions');
  revalidatePath('/courses');
}

async function deleteSession(formData: FormData) {
  'use server';
  const { supabase } = await requireUser();
  const sessionId = String(formData.get('session_id') || '');
  if (!sessionId) return;

  await supabase.from('course_sessions').delete().eq('id', sessionId);
  revalidatePath('/admin/course-sessions');
  revalidatePath('/courses');
}

export default async function AdminCourseSessionsPage() {
  const { supabase } = await requireUser();

  const [{ data: courses }, { data: sessions }] = await Promise.all([
    supabase.from('courses').select('id,title').order('created_at', { ascending: false }),
    supabase
      .from('course_sessions')
      .select('id,course_id,start_time,end_time,seats_total,seats_reserved,status,courses(title)')
      .order('start_time', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="section-title mb-4">開課時段管理</h1>
        <form action={createSession} className="grid md:grid-cols-2 gap-3">
          <select name="course_id" required className="rounded-xl border border-sage px-4 py-3 bg-white/80">
            <option value="">選擇課程</option>
            {(courses || []).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input name="seats_total" type="number" min="1" required placeholder="名額" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <input name="start_time" type="datetime-local" required className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <input name="end_time" type="datetime-local" required className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <button className="rounded-full bg-gold/80 hover:bg-gold text-white px-6 py-3 md:col-span-2">新增開課時段</button>
        </form>
      </section>

      <section className="space-y-3">
        {(sessions || []).map((s: any) => {
          const isFull = (s.seats_reserved ?? 0) >= (s.seats_total ?? 0);
          return (
            <div key={s.id} className="card flex flex-wrap justify-between gap-3 items-center">
              <div>
                <p className="font-medium">{s.courses?.title}</p>
                <p className="text-sm">{new Date(s.start_time).toLocaleString()} ~ {new Date(s.end_time).toLocaleString()}</p>
                <p className="text-sm">名額：{s.seats_reserved ?? 0}/{s.seats_total} · 狀態：{isFull ? 'full' : s.status}</p>
              </div>
              <form action={deleteSession}>
                <input type="hidden" name="session_id" value={s.id} />
                <button className="rounded-full border border-rose-300 text-rose-600 px-4 py-2 hover:bg-rose-50">刪除</button>
              </form>
            </div>
          );
        })}
      </section>
    </div>
  );
}
