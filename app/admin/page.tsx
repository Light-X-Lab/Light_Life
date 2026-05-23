import Link from 'next/link';

const links = [
  ['後台登入', '/admin/login'],
  ['課程管理', '/admin/courses'],
  ['開課時段管理', '/admin/course-sessions'],
  ['報名名單', '/admin/enrollments'],
  ['諮詢預約管理', '/admin/consultations'],
];

export default function AdminPage() {
  return (
    <section className="space-y-4">
      <h1 className="section-title">後台首頁</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="card hover:bg-white transition">{label}</Link>
        ))}
      </div>
    </section>
  );
}
