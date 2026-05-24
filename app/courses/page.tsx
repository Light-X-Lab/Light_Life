import Reveal from '@/components/Reveal';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Course = { id: string; title: string; description: string | null; price: number | null; cover_image_url: string | null };
type Session = { id: string; course_id: string; start_time: string; end_time: string; seats_total: number; seats_reserved: number; status: string };

const stages = [
  {
    title: '初階入門班',
    subtitle: '建立靈數基礎與自我覺察',
    description:
      '從生日數、生命靈數與核心能量切入，帶你理解彩虹生命靈數的基礎架構，學會看懂自己的特質與人生課題。',
    highlights: ['生命靈數基礎概念', '個人能量解讀入門', '日常練習與自我覺察'],
  },
  {
    title: '中階實踐班',
    subtitle: '深化解讀技巧，落地應用',
    description:
      '進一步學習關係互動、職涯方向與流年節奏的分析方法，透過案例演練將靈數洞察應用到生活與工作。',
    highlights: ['關係與溝通密碼', '職涯與天賦定位', '流年節奏與實作案例'],
  },
  {
    title: '高階師資班',
    subtitle: '整合系統思維，培育帶領能力',
    description:
      '強化進階解讀與教學引導能力，建立完整授課架構與諮詢流程，培養成為彩虹生命靈數師資的專業實力。',
    highlights: ['進階盤面整合技巧', '諮詢與授課流程設計', '師資評核與專業督導'],
  },
];

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
    <section className="space-y-10">
      <Reveal>
        <div className="card border border-gold/30 bg-gradient-to-br from-blush/70 via-lavender/60 to-sky/50 space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">Rainbow Numerology</p>
          <h1 className="section-title !mb-0">彩虹生命靈數</h1>
          <p className="text-base leading-relaxed text-ink/80">
            從數字看見天賦、課題與生命方向，以溫柔且系統化的方式陪伴你理解自己、經營關係，並走向更清晰的成長道路。
          </p>
        </div>
      </Reveal>

      <div className="space-y-4">
        <Reveal>
          <h2 className="section-title">三階段學習地圖</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {stages.map((stage, idx) => (
            <Reveal key={stage.title} delay={idx * 0.08}>
              <article className="card h-full border border-gold/20 space-y-3">
                <h3 className="text-xl font-medium">{stage.title}</h3>
                <p className="text-sm font-medium text-gold">{stage.subtitle}</p>
                <p className="text-sm text-ink/80">{stage.description}</p>
                <ul className="space-y-1 text-sm text-ink/85">
                  {stage.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Reveal>
          <h2 className="section-title">課程介紹</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((course, idx) => {
            const courseSessions = sessions.filter((x) => x.course_id === course.id);
            return (
              <Reveal key={course.id} delay={idx * 0.08}>
                <article className="card h-full border border-gold/20 space-y-3">
                  {course.cover_image_url ? <img src={course.cover_image_url} alt={course.title} className="h-40 w-full object-cover rounded-2xl" /> : <div className="h-40 rounded-2xl bg-gradient-to-br from-blush/70 to-lavender/70" />}
                  <h3 className="text-xl font-medium">{course.title}</h3>
                  <p className="text-sm">{course.description || '敬請期待課程介紹。'}</p>
                  <p className="text-gold font-semibold">{course.price ? `NT$ ${course.price.toLocaleString()}` : '價格洽詢'}</p>
                  <div className="space-y-2 text-sm">
                    {courseSessions.length === 0 && <p>目前尚未開放時段。</p>}
                    {courseSessions.map((s) => {
                      const full = s.status === 'full' || (s.seats_reserved ?? 0) >= (s.seats_total ?? 0);
                      return (
                        <div key={s.id} className="rounded-xl bg-white/70 border border-white/70 px-3 py-2">
                          {new Date(s.start_time).toLocaleString()} ~ {new Date(s.end_time).toLocaleString()}｜名額 {s.seats_reserved}/{s.seats_total}｜{full ? 'full' : s.status}
                        </div>
                      );
                    })}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        {courses.length === 0 && <div className="card">目前尚無已發布課程。</div>}
      </div>
    </section>
  );
}
