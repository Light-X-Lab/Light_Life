import Link from 'next/link';
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Reveal>
          <article className="card border border-gold/30 bg-gradient-to-br from-blush/60 via-white to-sky/40 space-y-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(200,170,90,0.25)]">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold">Featured Course</p>
            <h2 className="text-2xl font-medium">金錢靈氣 Money Reiki</h2>
            <p className="text-sm leading-relaxed text-ink/80">以溫柔穩定的能量練習，整理你與金錢之間的關係，啟動豐盛流動與價值感的內在連結。</p>
            <Link href="/courses/money-reiki" className="inline-flex w-fit items-center rounded-full bg-gold px-5 py-2 text-sm font-medium text-white transition hover:bg-gold/90">
              查看金錢靈氣課程
            </Link>
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <article className="card border border-gold/30 bg-gradient-to-br from-mint/55 via-white to-blush/45 space-y-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(164,203,181,0.28)]">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold">Featured Course</p>
            <h2 className="text-2xl font-medium">生命之花 Flower of Life</h2>
            <p className="text-sm leading-relaxed text-ink/80">透過生命之花神聖幾何與能量牌陣，學習清理情緒、釋放限制信念、提升覺察與能量流動。</p>
            <Link href="/courses/flower-of-life" className="inline-flex w-fit items-center rounded-full bg-gold px-5 py-2 text-sm font-medium text-white transition hover:bg-gold/90">
              查看生命之花課程
            </Link>
          </article>
        </Reveal>

        <Reveal delay={0.16}>
          <article className="card border border-gold/30 bg-gradient-to-br from-lavender/45 via-cream/80 to-blush/50 space-y-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(176,155,214,0.25)]">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold">Featured Course</p>
            <h2 className="text-2xl font-medium">星際馬雅13月亮曆<br />Galactic Maya 13 Moon Calendar</h2>
            <p className="text-sm leading-relaxed text-ink/80">透過13月亮曆、星系印記、五大神諭與生命波符，校準自然時間頻率，認識自己的天賦、生命方向與靈魂節奏。</p>
            <Link href="/courses/13-moon-calendar" className="inline-flex w-fit items-center rounded-full bg-gold px-5 py-2 text-sm font-medium text-white transition hover:bg-gold/90">
              查看13月亮曆課程
            </Link>
          </article>
        </Reveal>
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
