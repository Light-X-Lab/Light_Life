import Reveal from '@/components/Reveal';
import { createClient } from '@/lib/supabase/server';
import { bookConsultation } from './actions/book';

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: slots }, { data: bookings }] = await Promise.all([
    supabase.from('consultation_slots').select('id,start_time,end_time,is_available').eq('is_available', true).order('start_time', { ascending: true }),
    supabase.from('consultation_bookings').select('slot_id,status').neq('status', 'cancelled'),
  ]);

  const booked = new Set((bookings || []).map((b: any) => b.slot_id));

  return (
    <section className="space-y-4">
      <Reveal><h1 className="section-title">聯絡預約｜身心靈諮詢</h1></Reveal>
      {(slots || []).map((slot: any, idx: number) => {
        const isBooked = booked.has(slot.id);
        return (
          <Reveal key={slot.id} delay={idx * 0.05}>
            <div className="card space-y-3">
              <p>{new Date(slot.start_time).toLocaleString()} ~ {new Date(slot.end_time).toLocaleString()}</p>
              <p className="text-sm">狀態：{isBooked ? '已預約' : '可預約'}</p>
              {!isBooked && user && (
                <form action={bookConsultation} className="grid gap-2 md:grid-cols-2">
                  <input type="hidden" name="slot_id" value={slot.id} />
                  <input name="student_name" required placeholder="姓名" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
                  <input name="student_email" type="email" required defaultValue={user.email ?? ''} placeholder="Email" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
                  <input name="student_phone" placeholder="電話" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
                  <input name="topic" placeholder="想諮詢的主題" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
                  <button className="rounded-full bg-gold/80 hover:bg-gold text-white px-6 py-3 md:col-span-2">預約此時段</button>
                </form>
              )}
              {!user && !isBooked && <p className="text-sm text-gold">請先登入後才能預約。</p>}
            </div>
          </Reveal>
        );
      })}
      {(slots || []).length === 0 && <div className="card">目前尚無可預約時段。</div>}
    </section>
  );
}
