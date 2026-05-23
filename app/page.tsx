import Link from 'next/link';
import Reveal from '@/components/Reveal';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Reveal>
        <section className="card text-center py-16 md:py-24 bg-gradient-to-br from-blush/70 to-lavender/60">
          <p className="text-gold tracking-[0.35em] uppercase text-sm mb-4">Mind · Body · Spirit</p>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6">在 Light Life，重新與自己相遇</h1>
          <p className="max-w-2xl mx-auto text-lg">透過溫柔而深層的療癒陪伴，協助你回到內在平衡，找回生命中的光與愛。</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/courses" className="px-6 py-3 rounded-full bg-sage hover:bg-sage/80 transition">探索課程</Link>
            <Link href="/contact" className="px-6 py-3 rounded-full bg-white border border-gold/40 hover:bg-gold/10 transition">立即預約</Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
