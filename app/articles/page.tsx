import Reveal from '@/components/Reveal';

export default function ArticlesPage() {
  return (
    <section className="space-y-4">
      <Reveal><h1 className="section-title">靈性文章</h1></Reveal>
      <Reveal delay={0.1}><article className="card"><h2 className="text-2xl font-medium mb-2">如何在忙碌生活中找回平靜？</h2><p>從每天 10 分鐘呼吸練習開始，讓身心重新對齊，並以溫柔覺察取代自我批判。</p></article></Reveal>
      <Reveal delay={0.2}><article className="card"><h2 className="text-2xl font-medium mb-2">療癒不是變完美，而是回到真實</h2><p>當你允許自己感受，療癒就已經在發生。</p></article></Reveal>
    </section>
  );
}
