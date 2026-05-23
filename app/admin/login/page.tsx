import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <section className="card max-w-md mx-auto space-y-4">
      <h1 className="section-title">後台登入</h1>
      <p className="text-sm">請使用已啟用的 Supabase Auth 帳號登入。此版本保留管理入口與頁面骨架。</p>
      <Link href="/admin" className="inline-block rounded-full bg-gold/80 hover:bg-gold transition text-white px-5 py-2.5">進入後台首頁</Link>
    </section>
  );
}
