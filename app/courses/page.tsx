import Reveal from '@/components/Reveal';

const introPoints = [
  '金錢恐懼',
  '匱乏意識',
  '財務創傷',
  '金錢負能量',
  '原生家庭金錢模式',
  '能量阻塞',
];

const stages = [
  {
    level: '金錢靈氣一階｜療癒執行師',
    core: '學習基礎金錢靈氣能量，開始清理與金錢有關的負面頻率與限制信念。',
    contents: [
      '金錢能量基礎概念',
      '金錢與能量系統關係',
      '匱乏意識療癒',
      '金錢靈氣符號',
      '金錢磁鐵練習',
      '金錢靈氣盒',
      '財務祝福',
      '世界金錢冥想',
    ],
    suitable: ['常感到財務壓力的人', '想改善金錢關係的人', '身心靈初學者', '想提升豐盛頻率的人'],
  },
  {
    level: '金錢靈氣二階｜大師階',
    core: '進入更深層的金錢能量轉化，學習顯化、點化與人生道路調整。',
    contents: [
      '顯化符號',
      '黃金金字塔能量',
      '金錢能量強化',
      '金錢靈氣點化',
      '人生目標與金錢關係',
      '金錢業力轉化',
      '財務模式重建',
    ],
    highlight: '二階會開始進入人生方向、工作、關係與金錢的深層改變。學員會開始重新面對真正想過的人生。',
  },
  {
    level: '金錢靈氣三階｜宗師階',
    core: '深入淨化金錢相關業力與能量阻塞，建立真正穩定的豐盛頻率。',
    contents: [
      '淨化符號',
      '金錢能量淨化',
      '財務業障清理',
      '原生家庭金錢創傷',
      '自我懷疑與恐懼釋放',
      '能量保護',
      '高頻豐盛建立',
    ],
    highlight: '真正的豐盛，不是追逐金錢，而是成為能承接豐盛的人。',
  },
];

export default function CoursesPage() {
  return (
    <div className="relative overflow-hidden space-y-8 md:space-y-12">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="energy-orb absolute top-0 left-[-8%] h-72 w-72" />
        <div className="energy-orb absolute right-[-5%] top-1/3 h-80 w-80" />
      </div>

      <Reveal>
        <section className="relative sacred-bg card border-gold/30">
          <div className="golden-glow absolute inset-0 -z-10 rounded-3xl" />
          <h1 className="section-title mb-4 text-center">金錢靈氣 課程介紹</h1>
          <p className="text-center md:text-lg leading-relaxed">
            金錢靈氣是一套結合靈氣、能量療癒與金錢意識轉化的能量系統。
            它不只是單純的吸引財富，而是深入療癒內在金錢議題，透過能量療癒與金錢頻率調整，
            幫助學員重新建立與金錢、豐盛、自我價值的關係。
          </p>
          <p className="text-center mt-4 text-gold font-medium">真正的豐盛，來自內在能量的平衡與流動。</p>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm md:text-base">
            {introPoints.map((point) => (
              <li key={point} className="rounded-2xl bg-white/70 border border-gold/20 px-4 py-3 text-center">
                {point}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <div className="grid gap-5 md:gap-6">
        {stages.map((stage, i) => (
          <Reveal key={stage.level} delay={i * 0.08}>
            <section className="stage-card group relative rounded-3xl p-[1px]">
              <div className="stage-card-inner relative rounded-3xl p-6 md:p-8">
                <div className="pyramid-bg" />
                <h2 className="text-2xl md:text-3xl font-semibold text-[#6d5b3e] mb-3">{stage.level}</h2>
                <h3 className="text-lg font-medium mb-2">課程核心</h3>
                <p className="leading-relaxed mb-5">{stage.core}</p>

                <h3 className="text-lg font-medium mb-2">課程內容</h3>
                <ul className="grid md:grid-cols-2 gap-2 mb-5">
                  {stage.contents.map((item) => (
                    <li key={item} className="rounded-xl bg-white/70 border border-white/70 px-3 py-2">{item}</li>
                  ))}
                </ul>

                {stage.suitable && (
                  <>
                    <h3 className="text-lg font-medium mb-2">適合對象</h3>
                    <ul className="grid md:grid-cols-2 gap-2 mb-4">
                      {stage.suitable.map((item) => (
                        <li key={item} className="rounded-xl bg-white/70 border border-white/70 px-3 py-2">{item}</li>
                      ))}
                    </ul>
                  </>
                )}

                {stage.highlight && (
                  <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-white/80 via-[#fff8e9] to-white/80 px-4 py-4">
                    <h4 className="font-medium text-gold mb-1">階段重點</h4>
                    <p>{stage.highlight}</p>
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
