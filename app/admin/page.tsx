import Link from 'next/link';

export default function AdminPage() {
  return (
    <section className="card space-y-4">
      <h1 className="section-title">後台首頁</h1>
      <Link href="/admin/consultations" className="text-gold underline underline-offset-2">前往諮詢預約管理</Link>
    </section>
  );
}
