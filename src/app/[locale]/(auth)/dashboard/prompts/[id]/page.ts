const handleDelete = async () => {
  if (!confirm('هل أنت متأكد من حذف هذا البرومبت؟')) return;
  try {
    const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push(`/${locale}/dashboard/prompts`);
    } else {
      alert('فشل الحذف');
    }
  } catch {
    alert('حدث خطأ');
  }
};

const handleShare = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  alert('✅ تم نسخ رابط المشاركة!');
};