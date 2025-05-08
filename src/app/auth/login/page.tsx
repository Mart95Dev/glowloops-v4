import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';
import SocialLoginOptions from '@/components/auth/SocialLoginOptions';

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
      <LoginForm />
    </AuthLayout>
  );
} 