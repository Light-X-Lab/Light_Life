'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function enrollCourse(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const sessionId = String(formData.get('session_id') || '');
  const studentName = String(formData.get('student_name') || '').trim();
  const studentEmail = String(formData.get('student_email') || '').trim();
  const studentPhone = String(formData.get('student_phone') || '').trim();

  if (!sessionId || !studentName || !studentEmail) return;

  const { data: session } = await supabase
    .from('course_sessions')
    .select('id,seats_total,seats_reserved,status')
    .eq('id', sessionId)
    .single();

  if (!session || session.status === 'closed' || (session.seats_reserved ?? 0) >= (session.seats_total ?? 0)) return;

  const { error } = await supabase.from('course_enrollments').insert({
    session_id: sessionId,
    student_user_id: user.id,
    student_name: studentName,
    student_email: studentEmail,
    student_phone: studentPhone || null,
    status: 'pending',
  });

  if (!error) {
    await supabase.rpc('increment_seats_reserved', { p_session_id: sessionId });
  }

  revalidatePath('/courses');
  revalidatePath('/admin/course-sessions');
  revalidatePath('/admin/enrollments');
}
