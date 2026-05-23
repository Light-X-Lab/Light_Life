import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminCourseSessionsPage() {
  let sessions: any[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('course_sessions')
      .select('start_time,end_time,seats_total,seats_reserved,status,courses(title)')
      .order('start_time', { ascending: true });
    sessions = data || [];
  } catch {
    sessions = [];
  }

  return (
    <section className="space-y-4">
      <h1 className="section-title">後台｜開課時段</h1>
      {(sessions.length === 0) ? <div className="card">目前無開課時段。</div> : sessions.map((s, i) => (
        <div key={i} className="card text-sm">
          <p className="font-medium">{s.courses?.title || '未分類課程'}</p>
          <p>{new Date(s.start_time).toLocaleString()} ~ {new Date(s.end_time).toLocaleString()}</p>
          <p>名額: {s.seats_reserved ?? 0}/{s.seats_total ?? '-'}｜狀態: {s.status}</p>
        </div>
      ))}
    </section>
  );
}
