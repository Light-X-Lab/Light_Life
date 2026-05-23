import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const cards = [
  { title: '課程管理', desc: '新增/編輯課程內容', href: '/admin/courses' },
  { title: '開課時段管理', desc: '設定開始結束時間與名額', href: '/admin/course-sessions' },
  { title: '報名管理', desc: '查看所有學員報名資料', href: '/admin/enrollments' },
  { title: '諮詢時段管理', desc: '設定可預約諮詢時間', href: '/admin/consultations' },
  { title: '預約管理', desc: '查看完整諮詢預約資訊', href: '/admin/bookings' },
];

async function signOut() {
  'use server';

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Light Life Admin</p>
            <h1 className="section-title mb-2">後台首頁</h1>
            <p className="text-sm">目前登入者：{user.email}</p>
          </div>
          <form action={signOut}>
            <button className="rounded-full px-4 py-2 text-sm bg-white border border-gold/40 hover:bg-gold/10 transition">登出</button>
          </form>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <h2 className="text-xl font-medium mb-2">{card.title}</h2>
            <p className="mb-4">{card.desc}</p>
            <Link href={card.href} className="text-gold underline underline-offset-2">前往（下一階段建立頁面）</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
