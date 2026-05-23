import Link from 'next/link';

const links = [
  ['首頁', '/'],
  ['關於老師', '/about'],
  ['課程介紹', '/courses'],
  ['學員見證', '/testimonials'],
  ['靈性文章', '/articles'],
  ['聯絡預約', '/contact'],
  ['管理登入', '/admin/login'],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-white/60">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xl font-semibold tracking-[0.2em] text-gold">Light Life</Link>
        <div className="flex flex-wrap gap-2 md:gap-4 text-sm md:text-base">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-1 rounded-full hover:bg-white/70 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}