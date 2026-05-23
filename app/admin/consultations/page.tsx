import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function createSlot(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const start = String(formData.get('start_time') || '');
  const end = String(formData.get('end_time') || '');
  if (!start || !end) return;

  await supabase.from('consultation_slots').insert({
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    is_available: true,
    created_by: user.id,
  });

  revalidatePath('/admin/consultations');
  revalidatePath('/contact');
}

export default async function AdminConsultationsPage() {
  const supabase = await createClient();

  const [{ data: slots }, { data: bookings }] = await Promise.all([
    supabase.from('consultation_slots').select('id,start_time,end_time').order('start_time', { ascending: true }),
    supabase.from('consultation_bookings').select('id,slot_id,student_name,student_email,student_phone,topic,status').order('created_at', { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="section-title mb-4">諮詢預約管理</h1>
        <form action={createSlot} className="grid md:grid-cols-2 gap-3">
          <input name="start_time" type="datetime-local" required className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <input name="end_time" type="datetime-local" required className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <button className="rounded-full bg-gold/80 hover:bg-gold text-white px-6 py-3 md:col-span-2">新增可預約時段</button>
        </form>
      </section>

      <section className="card">
        <h2 className="text-xl font-medium mb-3">可預約時段</h2>
        <div className="space-y-2 text-sm">
          {(slots || []).map((slot: any) => (
            <div key={slot.id} className="rounded-xl bg-white/70 border border-white/70 px-3 py-2">
              {new Date(slot.start_time).toLocaleString()} ~ {new Date(slot.end_time).toLocaleString()}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-medium mb-3">預約名單</h2>
        <div className="space-y-2 text-sm">
          {(bookings || []).map((b: any) => (
            <div key={b.id} className="rounded-xl bg-white/70 border border-white/70 px-3 py-2">
              <p>{b.student_name}（{b.student_email}）</p>
              <p>電話：{b.student_phone || '-'}｜主題：{b.topic || '-'}</p>
              <p>狀態：{b.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
