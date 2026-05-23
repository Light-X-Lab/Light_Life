import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  let courses: any[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('courses').select('title,slug,status,price,created_at').order('created_at', { ascending: false });
    courses = data || [];
  } catch {
    courses = [];
  }

  return (
    <section className="space-y-4">
      <h1 className="section-title">後台｜課程管理</h1>
      {(courses.length === 0) ? <div className="card">目前無課程資料。</div> : courses.map((c, i) => (
        <div key={i} className="card text-sm">
          <p className="font-medium text-lg">{c.title}</p>
          <p>slug: {c.slug}</p>
          <p>狀態: {c.status}｜價格: {c.price ?? '未設定'}</p>
        </div>
      ))}
    </section>
  );
}
