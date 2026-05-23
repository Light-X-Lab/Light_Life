import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return { supabase, user };
}

async function createSlot(formData: FormData) {
  'use server';
  const { supabase, user } = await requireUser();
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

async function deleteSlot(formData: FormData) {
  'use server';
  const { supabase } = await requireUser();
  const slotId = String(formData.get('slot_id') || '');
  if (!slotId) return;
  await supabase.from('consultation_slots').delete().eq('id', slotId);
  revalidatePath('/admin/consultations');
  revalidatePath('/contact');
}

export default async function AdminConsultationsPage() {
  const { supabase } = await requireUser();
  const [{ data: slots }, { data: bookings }] = await Promise.all([
    supabase.from('consultation_slots').select('id,start_time,end_time,is_available').order('start_time', { ascending: true }),
    supabase.from('consultation_bookings').select('id,slot_id,student_name,student_email,student_phone,topic,status,consultation_slots(start_time,end_time)').order('created_at', { ascending: false }),
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

      <section className="space-y-3">
        <h2 className="text-2xl font-medium">時段列表</h2>
        {(slots || []).map((slot: any) => {
          const booked = (bookings || []).some((b: any) => b.slot_id === slot.id && b.status !== 'cancelled');
          return (
            <div key={slot.id} className="card flex justify-between items-center gap-3">
              <p className="text-sm">{new Date(slot.start_time).toLocaleString()} ~ {new Date(slot.end_time).toLocaleString()} · {booked ? '已預約' : '可預約'}</p>
              <form action={deleteSlot}>
                <input type="hidden" name="slot_id" value={slot.id} />
                <button className="rounded-full border border-rose-300 text-rose-600 px-4 py-2 hover:bg-rose-50">刪除</button>
              </form>
            </div>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-medium">預約名單</h2>
        {(bookings || []).map((row: any) => (
          <div key={row.id} className="card">
            <p className="font-medium">{row.student_name} ({row.student_email})</p>
            <p className="text-sm">電話：{row.student_phone || '-'}｜主題：{row.topic || '-'}</p>
            <p className="text-sm">時段：{new Date(row.consultation_slots?.start_time).toLocaleString()} ~ {new Date(row.consultation_slots?.end_time).toLocaleString()}｜狀態：{row.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
