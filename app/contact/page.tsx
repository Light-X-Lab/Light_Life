import Reveal from '@/components/Reveal';

export default function ContactPage() {
  return (
    <section className="card max-w-2xl mx-auto">
      <Reveal>
        <h1 className="section-title mb-6">聯絡預約</h1>
        <form className="space-y-4">
          <input className="w-full rounded-xl border border-sage px-4 py-3 bg-white/70" placeholder="姓名" />
          <input className="w-full rounded-xl border border-sage px-4 py-3 bg-white/70" placeholder="Email" type="email" />
          <textarea className="w-full rounded-xl border border-sage px-4 py-3 bg-white/70 min-h-36" placeholder="想預約的服務與時段" />
          <button className="px-6 py-3 rounded-full bg-gold/80 hover:bg-gold text-white transition">送出預約</button>
        </form>
      </Reveal>
    </section>
  );
}
