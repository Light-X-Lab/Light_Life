import Reveal from '@/components/Reveal';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Course = { id: string; title: string; description: string | null; price: number | null; cover_image_url: string | null };
type Session = { id: string; course_id: string; start_time: string; end_time: string; seats_total: number; seats_reserved: number; status: string };

export default async function CoursesPage() {
  let courses: Course[] = [];
  let sessions: Session[] = [];

  try {
    const supabase = await createClient();
    const [c, s] = await Promise.all([
      supabase.from('courses').select('id,title,description,price,cover_image_url').eq('status', 'published').order('created_at', { ascending: false }),
      supabase.from('course_sessions').select('id,course_id,start_time,end_time,seats_total,seats_reserved,status').order('start_time', { ascending: true }),
    ]);
    courses = (c.data || []) as Course[];
    sessions = (s.data || []) as Session[];
  } catch {
    courses = [];
    sessions = [];
  }

  return (
    <section className="space-y-6">
      <Reveal><h1 className="section-title">課程介紹</h1></Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course, idx) => {
          const courseSessions = sessions.filter((x) => x.course_id === course.id);
          return (
            <Reveal key={course.id} delay={idx * 0.08}>
              <article className="card h-full border border-gold/20 space-y-3">
                {course.cover_image_url ? <img src={course.cover_image_url} alt={course.title} className="h-40 w-full object-cover rounded-2xl" /> : <div className="h-40 rounded-2xl bg-gradient-to-br from-blush/70 to-lavender/70" />}
                <h2 className="text-xl font-medium">{course.title}</h2>
                <p className="text-sm">{course.description || '敬請期待課程介紹。'}</p>
                <p className="text-gold font-semibold">{course.price ? `NT$ ${course.price.toLocaleString()}` : '價格洽詢'}</p>
                <div className="space-y-2 text-sm">
                  {courseSessions.length === 0 && <p>目前尚未開放時段。</p>}
                  {courseSessions.map((s) => {
                    const full = s.status === 'full' || (s.seats_reserved ?? 0) >= (s.seats_total ?? 0);
                    return <div key={s.id} className="rounded-xl bg-white/70 border border-white/70 px-3 py-2">{new Date(s.start_time).toLocaleString()} ~ {new Date(s.end_time).toLocaleString()}｜名額 {s.seats_reserved}/{s.seats_total}｜{full ? 'full' : s.status}</div>;
                  })}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      {courses.length === 0 && <div className="card">目前尚無已發布課程。</div>}
    </section>
  );
}
