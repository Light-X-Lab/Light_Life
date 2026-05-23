import Reveal from '@/components/Reveal';

const courses = [
  { name: '內在平衡療癒課', desc: '建立穩定的情緒與能量狀態。' },
  { name: '女性能量覺醒工作坊', desc: '重啟自信、柔軟與創造力。' },
  { name: '一對一靈性陪伴', desc: '依個人需求設計專屬療癒旅程。' },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <Reveal><h1 className="section-title">課程介紹</h1></Reveal>
      <div className="grid md:grid-cols-3 gap-4">
        {courses.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.1}><div className="card"><h2 className="text-xl font-medium mb-2">{c.name}</h2><p>{c.desc}</p></div></Reveal>
        ))}
      </div>
    </div>
  );
}
