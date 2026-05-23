'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function bookConsultation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const slotId = String(formData.get('slot_id') || '');
  const name = String(formData.get('student_name') || '').trim();
  const email = String(formData.get('student_email') || '').trim();
  const phone = String(formData.get('student_phone') || '').trim();
  const topic = String(formData.get('topic') || '').trim();
  if (!slotId || !name || !email) return;

  const { data: existing } = await supabase
    .from('consultation_bookings')
    .select('id,status')
    .eq('slot_id', slotId)
    .neq('status', 'cancelled')
    .maybeSingle();

  if (existing) return;

  await supabase.from('consultation_bookings').insert({
    slot_id: slotId,
    student_user_id: user.id,
    student_name: name,
    student_email: email,
    student_phone: phone || null,
    topic: topic || null,
    status: 'booked',
  });

  revalidatePath('/contact');
  revalidatePath('/admin/consultations');
}
