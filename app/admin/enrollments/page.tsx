import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminEnrollmentsPage() {
  let rows: any[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('course_enrollments')
      .select('student_name,student_email,student_phone,status,course_sessions(start_time,courses(title))')
      .order('created_at', { ascending: false });
    rows = data || [];
  } catch {
    rows = [];
  }

  return (
    <section className="space-y-4">
      <h1 className="section-title">後台｜報名名單</h1>
      {rows.length === 0 ? <div className="card">目前無報名資料。</div> : rows.map((r, i) => (
        <div key={i} className="card text-sm">
          <p className="font-medium">{r.student_name}（{r.student_email}）</p>
          <p>電話：{r.student_phone || '-'}</p>
          <p>課程：{r.course_sessions?.courses?.title || '-'}｜{r.course_sessions?.start_time ? new Date(r.course_sessions.start_time).toLocaleString() : '-'}</p>
          <p>狀態：{r.status}</p>
        </div>
      ))}
    </section>
  );
}
