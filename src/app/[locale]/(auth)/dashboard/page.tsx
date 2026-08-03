import { currentUser } from '@clerk/nextjs/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { redirect } from 'next/navigation';

export default async function UserProfilePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const user = await currentUser();
  if (!user) redirect(`/${locale}/sign-in`);

  const t = await getTranslations({ locale, namespace: 'UserProfilePage' });

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <ProfileForm
        user={{
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          imageUrl: user.imageUrl,
          bio: (user.unsafeMetadata?.bio as string) || '',
          jobTitle: (user.unsafeMetadata?.jobTitle as string) || '',
        }}
        locale={locale}
      />
    </>
  );
}