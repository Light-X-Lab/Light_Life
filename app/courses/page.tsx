import Reveal from '@/components/Reveal';
import { createClient } from '@/lib/supabase/server';
import { enrollCourse } from './actions/enroll';

const introPoints = ['金錢恐懼', '匱乏意識', '財務創傷', '金錢負能量', '原生家庭金錢模式', '能量阻塞'];

type PublishedCourse = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  price: number | null;
};

type Session = {
  id: string;
  course_id: string;
  start_time: string;
  end_time: string;
  seats_total: number;
  seats_reserved: number;
  status: 'open' | 'full' | 'closed';
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: courseData }, { data: sessionData }] = await Promise.all([
    supabase
      .from('courses')
      .select('id,title,description,cover_image_url,price')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('course_sessions')
      .select('id,course_id,start_time,end_time,seats_total,seats_reserved,status')
      .order('start_time', { ascending: true }),
  ]);

  const publishedCourses = (courseData || []) as PublishedCourse[];
  const sessions = (sessionData || []) as Session[];

  return (
    <div className="relative overflow-hidden space-y-8 md:space-y-12">
      <Reveal>
        <section className="relative sacred-bg card border-gold/30">
          <h1 className="section-title mb-4 text-center">課程介紹</h1>
          <p className="text-center md:text-lg leading-relaxed">透過溫柔而深層的療癒課程，重新建立與自己、金錢、豐盛的連結。</p>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm md:text-base">
            {introPoints.map((point) => (
              <li key={point} className="rounded-2xl bg-white/70 border border-gold/20 px-4 py-3 text-center">{point}</li>
            ))}
          </ul>
        </section>
      </Reveal>

      <section className="space-y-4">
        <Reveal><h2 className="section-title text-center">已發布課程與可報名時段</h2></Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {publishedCourses.map((course, index) => {
            const courseSessions = sessions.filter((s) => s.course_id === course.id);
            return (
              <Reveal key={course.id} delay={index * 0.07}>
                <article className="card h-full border border-gold/20 space-y-4">
                  {course.cover_image_url ? (
                    <div className="overflow-hidden rounded-2xl border border-white/70">
                      <img src={course.cover_image_url} alt={course.title} className="h-44 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-44 rounded-2xl bg-gradient-to-br from-blush/70 to-lavender/70 border border-white/70" />
                  )}
                  <h3 className="text-xl font-medium">{course.title}</h3>
                  <p className="text-sm">{course.description || '敬請期待課程詳細介紹。'}</p>
                  <p className="text-gold font-semibold">{course.price ? `NT$ ${course.price.toLocaleString()}` : '價格洽詢'}</p>

                  <div className="space-y-3">
                    {courseSessions.length === 0 && <p className="text-sm">目前尚未開放時段。</p>}
                    {courseSessions.map((session) => {
                      const isFull = session.status === 'full' || session.seats_reserved >= session.seats_total;
                      return (
                        <div key={session.id} className="rounded-2xl border border-white/70 bg-white/70 p-3 space-y-2">
                          <p className="text-sm">{new Date(session.start_time).toLocaleString()} ~ {new Date(session.end_time).toLocaleString()}</p>
                          <p className="text-sm">名額：{session.seats_reserved}/{session.seats_total} · 狀態：{isFull ? 'full' : session.status}</p>
                          {!isFull && user && (
                            <form action={enrollCourse} className="grid gap-2">
                              <input type="hidden" name="session_id" value={session.id} />
                              <input name="student_name" required placeholder="姓名" className="rounded-xl border border-sage px-3 py-2 bg-white/80 text-sm" />
                              <input name="student_email" type="email" required defaultValue={user.email ?? ''} placeholder="Email" className="rounded-xl border border-sage px-3 py-2 bg-white/80 text-sm" />
                              <input name="student_phone" placeholder="電話（選填）" className="rounded-xl border border-sage px-3 py-2 bg-white/80 text-sm" />
                              <button className="rounded-full bg-sage px-4 py-2 text-sm hover:bg-sage/80 transition">立即報名</button>
                            </form>
                          )}
                          {!user && !isFull && <p className="text-xs text-gold">請先登入後才能報名。</p>}
                        </div>
                      );
                    })}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        {publishedCourses.length === 0 && <div className="card text-center">目前尚無已發布課程。</div>}
      </section>
    </div>
  );
}
