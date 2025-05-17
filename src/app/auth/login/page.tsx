import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import SocialLoginOptions from '@/components/auth/SocialLoginOptions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Connexion | GlowLoops',
  description: 'Connectez-vous à votre compte GlowLoops pour accéder à vos commandes, favoris et plus encore.',
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Connexion à votre compte" 
      subtitle="Heureux de vous revoir !"
      sideContent={<SocialLoginOptions />}
    >
      <Suspense fallback={<div className="py-8 text-center">Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
} 