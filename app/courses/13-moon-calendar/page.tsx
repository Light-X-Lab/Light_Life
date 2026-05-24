import Link from 'next/link';
import Reveal from '@/components/Reveal';

const stages = [
  {
    title: '初階入門班',
    subtitle: '認識星系印記與五大神諭',
    description:
      '從Hunab Ku與13月亮曆基礎開始，認識自然時間、13:20頻率、星系印記、五大神諭與20個圖騰，建立理解自己生命藍圖的基礎。',
    highlights: ['Hunab Ku 與宇宙源頭能量', '13月亮曆與自然時間法則', '13:20 星系印記基礎', '主印記與五大神諭', '20個圖騰特質與潛能', '生命波符入門'],
    cta: '我要報名初階',
  },
  {
    title: '中階實踐班',
    subtitle: '深入調性、內在女神與馬雅生日',
    description:
      '進一步學習13種調性、內在女神能量盤、13:28月亮曆結構、馬雅生日與PSI行星資料庫，協助你看見更深層的內在頻率與靈魂資源。',
    highlights: ['13種調性詳解', '點點與橫線家族', '內在女神能量盤', '生命波符深入解析', '13:28 與馬雅生日', 'PSI累世天狼星能量與行星資料庫'],
    cta: '我要報名中階',
  },
  {
    title: '高階師資班',
    subtitle: '整合身體全息圖、流年與合盤應用',
    description:
      '進入高階整合與帶領階段，學習身體全息圖、52波符城堡、內在小孩、合盤解析與彩虹橋靜心，將13月亮曆應用於個案、關係、家庭、團體與師資帶領。',
    highlights: ['身體全息圖與13調性身體對應', '20圖騰與身體能量位置', '52波符城堡與流年解析', '內在小孩與原生家庭合盤', '關係、團隊、家庭合盤解析', '彩虹橋靜心與地球共振頻率'],
    cta: '我要報名高階',
  },
];

export default function MoonCalendarPage() {
  return (
    <section className="relative space-y-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden>
        <div className="absolute -top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full border border-gold/20" />
        <div className="absolute top-24 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full border border-lavender/20" />
        <div className="absolute top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full border border-blush/15" />
      </div>

      <Reveal>
        <div className="card border border-gold/30 bg-gradient-to-br from-white via-lavender/35 to-blush/35 space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">GALACTIC MAYA · 13 MOON CALENDAR</p>
          <h1 className="section-title !mb-0">星際馬雅13月亮曆</h1>
          <p className="text-lg font-medium text-ink/85">Time is Art｜時間就是藝術</p>
          <p className="text-base leading-relaxed text-ink/80">星際馬雅13月亮曆是一套協助我們回到自然時間與宇宙頻率的智慧系統。</p>
          <p className="text-base leading-relaxed text-ink/80">透過13個調性、20個圖騰、260個KIN碼、五大神諭與生命波符，我們能重新理解自己的天賦、挑戰、支持力量與生命方向。</p>
          <p className="text-base leading-relaxed text-ink/80">這不只是曆法，而是一套陪伴你校準頻率、認識靈魂藍圖，並在日常生活中活出「時間就是藝術」的覺察之路。</p>
        </div>
      </Reveal>

      <div className="space-y-4">
        <Reveal>
          <h2 className="section-title">三階段學習地圖</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {stages.map((stage, idx) => (
            <Reveal key={stage.title} delay={idx * 0.08}>
              <article className="card h-full border border-gold/20 bg-white/75 backdrop-blur-sm space-y-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(168,145,211,0.24)]">
                <h3 className="text-xl font-medium">{stage.title}</h3>
                <p className="text-sm font-medium text-gold">{stage.subtitle}</p>
                <p className="text-sm text-ink/80">{stage.description}</p>
                <ul className="space-y-1 text-sm text-ink/85">
                  {stage.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <Link href="/contact" className="inline-flex w-fit items-center rounded-full bg-gold px-4 py-2 text-sm font-medium text-white transition hover:bg-gold/90">
                  {stage.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
