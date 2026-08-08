'use client';

import { useState, useEffect } from 'react';

export function ProfileForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    jobTitle: '',
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // جلب البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email || '');
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          jobTitle: data.jobTitle || '',
        });
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage('✅ تم الحفظ بنجاح!');
    } else {
      setMessage('❌ حدث خطأ، حاول مرة أخرى.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border">
      <h2 className="text-2xl font-bold mb-2">👤 الملف الشخصي</h2>
      <p className="text-sm text-gray-500 mb-4">{email}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">الاسم الأول</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm mb-1">الاسم الأخير</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-900" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">المسمى الوظيفي</label>
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-slate-900" />
        </div>

        <div>
          <label className="block text-sm mb-1">نبذة عنك</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full p-2 border rounded-lg dark:bg-slate-900" />
        </div>

        {message && <p className="text-center font-medium">{message}</p>}

        <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
          {loading ? 'جاري الحفظ...' : '💾 حفظ التغييرات'}
        </button>
      </form>
    </div>
  );
}