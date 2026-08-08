import { ProfileForm } from '@/components/profile/ProfileForm';

export default function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="container mx-auto py-10">
      <ProfileForm locale={locale} />
    </div>
  );
}