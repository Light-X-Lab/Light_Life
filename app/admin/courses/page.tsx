import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const statusOptions = ['draft', 'published', 'closed'] as const;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');
  return { supabase, user };
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function createCourse(formData: FormData) {
  'use server';
  const { supabase, user } = await requireUser();

  const title = String(formData.get('title') || '').trim();
  const slugInput = String(formData.get('slug') || '').trim();
  const slug = toSlug(slugInput || title);
  const description = String(formData.get('description') || '').trim();
  const coverImageUrl = String(formData.get('cover_image_url') || '').trim();
  const status = String(formData.get('status') || 'draft');
  const rawPrice = String(formData.get('price') || '').trim();
  const price = rawPrice ? Number(rawPrice) : null;

  if (!title || !slug || !statusOptions.includes(status as (typeof statusOptions)[number])) return;

  await supabase.from('courses').insert({
    title,
    slug,
    description,
    cover_image_url: coverImageUrl || null,
    price,
    status,
    created_by: user.id,
  });

  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

async function updateCourse(formData: FormData) {
  'use server';
  const { supabase } = await requireUser();

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const slugInput = String(formData.get('slug') || '').trim();
  const slug = toSlug(slugInput || title);
  const description = String(formData.get('description') || '').trim();
  const coverImageUrl = String(formData.get('cover_image_url') || '').trim();
  const status = String(formData.get('status') || 'draft');
  const rawPrice = String(formData.get('price') || '').trim();
  const price = rawPrice ? Number(rawPrice) : null;

  if (!id || !title || !slug || !statusOptions.includes(status as (typeof statusOptions)[number])) return;

  await supabase
    .from('courses')
    .update({ title, slug, description, cover_image_url: coverImageUrl || null, status, price })
    .eq('id', id);

  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

async function deleteCourse(formData: FormData) {
  'use server';
  const { supabase } = await requireUser();
  const id = String(formData.get('id') || '');
  if (!id) return;

  await supabase.from('courses').delete().eq('id', id);
  revalidatePath('/admin/courses');
  revalidatePath('/courses');
}

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  price: number | null;
  status: 'draft' | 'published' | 'closed';
};

export default async function AdminCoursesPage() {
  const { supabase } = await requireUser();
  const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  const courses = (data || []) as Course[];

  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="section-title mb-4">課程管理</h1>
        <p className="text-sm mb-4">可新增、編輯、刪除課程，並管理封面圖、價格與狀態。</p>
        <form action={createCourse} className="grid md:grid-cols-2 gap-3">
          <input name="title" required placeholder="課程名稱" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <input name="slug" placeholder="網址代碼（可留空自動產生）" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <input name="cover_image_url" placeholder="封面圖片 URL" className="rounded-xl border border-sage px-4 py-3 bg-white/80 md:col-span-2" />
          <input name="price" type="number" step="0.01" min="0" placeholder="價格（例如 6800）" className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
          <select name="status" defaultValue="draft" className="rounded-xl border border-sage px-4 py-3 bg-white/80">
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <textarea name="description" placeholder="課程介紹" className="rounded-xl border border-sage px-4 py-3 bg-white/80 md:col-span-2 min-h-28" />
          <button className="rounded-full bg-gold/80 hover:bg-gold transition text-white px-6 py-3 md:col-span-2">新增課程</button>
        </form>
      </section>

      <section className="space-y-4">
        {courses.map((course) => (
          <form key={course.id} action={updateCourse} className="card space-y-3">
            <input type="hidden" name="id" value={course.id} />
            <div className="grid md:grid-cols-2 gap-3">
              <input name="title" required defaultValue={course.title} className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
              <input name="slug" required defaultValue={course.slug} className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
              <input name="cover_image_url" defaultValue={course.cover_image_url ?? ''} placeholder="封面圖片 URL" className="rounded-xl border border-sage px-4 py-3 bg-white/80 md:col-span-2" />
              <input name="price" type="number" step="0.01" min="0" defaultValue={course.price ?? ''} className="rounded-xl border border-sage px-4 py-3 bg-white/80" />
              <select name="status" defaultValue={course.status} className="rounded-xl border border-sage px-4 py-3 bg-white/80">
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea name="description" defaultValue={course.description ?? ''} className="rounded-xl border border-sage px-4 py-3 bg-white/80 md:col-span-2 min-h-24" />
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-sage px-5 py-2.5 hover:bg-sage/80 transition">儲存變更</button>
              <button formAction={deleteCourse} className="rounded-full bg-white border border-rose-300 text-rose-600 px-5 py-2.5 hover:bg-rose-50 transition">刪除課程</button>
            </div>
          </form>
        ))}
        {courses.length === 0 && <div className="card">目前尚無課程。</div>}
      </section>
    </div>
  );
}
