import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from './components/LoginForm';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/admin');
  }

  return (
    <section className="max-w-md mx-auto card">
      <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Admin Portal</p>
      <h1 className="section-title mb-3">後台登入</h1>
      <p className="mb-6 text-sm">請使用管理員帳號登入後台。</p>
      <LoginForm />
      <div className="mt-6 text-sm">
        <Link href="/" className="underline underline-offset-2">返回前台首頁</Link>
      </div>
    </section>
  );
}
