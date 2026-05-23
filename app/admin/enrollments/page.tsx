import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return { supabase };
}

export default async function AdminEnrollmentsPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from('course_enrollments')
    .select('id,student_name,student_email,student_phone,status,created_at,course_sessions(start_time,courses(title))')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="section-title">報名名單</h1>
      {(data || []).map((row: any) => (
        <div key={row.id} className="card">
          <p className="font-medium">{row.student_name} ({row.student_email})</p>
          <p className="text-sm">{row.course_sessions?.courses?.title}｜{new Date(row.course_sessions?.start_time).toLocaleString()}</p>
          <p className="text-sm">電話：{row.student_phone || '-'}｜狀態：{row.status}</p>
        </div>
      ))}
    </div>
  );
}
