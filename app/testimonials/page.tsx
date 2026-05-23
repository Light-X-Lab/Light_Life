import Reveal from '@/components/Reveal';

const testimonials = [
  '「我重新感受到內心的安定與力量。」— Amy',
  '「課程非常溫柔又深刻，讓我更懂得愛自己。」— Tina',
  '「老師的陪伴讓我在人生轉折期找到方向。」— Claire',
];

export default function TestimonialsPage() {
  return <div className="space-y-4"><Reveal><h1 className="section-title">學員見證</h1></Reveal>{testimonials.map((t, i)=><Reveal key={i} delay={i*0.1}><div className="card">{t}</div></Reveal>)}</div>;
}
